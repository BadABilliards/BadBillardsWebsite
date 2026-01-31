import Router from 'next/router';
import { useState, useEffect, useContext } from 'react';
import { Cart } from '../lib';
import { WalletModal } from "../layout/components";
import { Navbar } from '../layout';
import { LineItem } from '../components/marketplace';
import { MerchContext, AuthContext } from '../context';
import axios from 'axios';
import Image from 'next/image';
import { BadCoin } from '../assets/img';
import Link from 'next/link';
import { TextImages } from '../assets/text';
import { useAccount } from 'wagmi';
import { Product } from '../lib';
import { client } from '../utils/squareClient.js';
import { v4 as uuidv4 } from 'uuid';

const CartPage = () => {
  const [cartState, setCartState] = useState<Cart>({});
  const [badCartState, setBadCartState] = useState<Cart>({});
  const { products } = useContext(MerchContext);
  const { userInfo, setModelIsOpen, modelIsOpen } = useContext(AuthContext);
  const { isConnected } = useAccount()

  useEffect(() => {
    const cart = localStorage.getItem('cart');
    const badCart = localStorage.getItem('badCart');
    if (cart) {
      const parsedCart = JSON.parse(cart);
      if (typeof parsedCart === 'object' && !Array.isArray(parsedCart)) {
        setCartState(parsedCart);
      }
    }
    if (badCart) {
      const parsedBadCart = JSON.parse(badCart);
      if (typeof parsedBadCart === 'object' && !Array.isArray(parsedBadCart)) {
        setBadCartState(parsedBadCart);
      }
    }
  }, []);

  const total = () => {
    let newTotal = 0;
    Object.entries(cartState).forEach(([ id, quantity ]) => {
      const product = products.find((product) => product.id === +id);
      newTotal += product ? product.price * quantity : 0;
    });
    return newTotal;
  };

  const shipping = () => {
    let newTotal = 0;
    Object.entries(cartState).forEach(([ id, quantity ]) => {
      const product = products.find((product) => product.id === +id);
      newTotal += product ? product.shipping * quantity : 0;
    });
    if (newTotal > 0) newTotal+2
    return newTotal;
  };

  const badTotal = () => {
    let newTotal = 0;
    Object.entries(badCartState).forEach(([ id, quantity ]) => {
      const product = products.find((product) => product.id === +id);
      if (product) {
      newTotal += product.badCoin ? product.badCoin * quantity : product.price * quantity;
      }
    });
    return newTotal;
  };

  const badShipping = () => {
    let newTotal = 0;
    Object.entries(badCartState).forEach(([ id, quantity ]) => {
      const product = products.find((product) => product.id === +id);
      newTotal += product ? product.shipping * quantity : 0;
    });
    if (newTotal > 0) newTotal+2
    return newTotal;
  };


  const handleCheckout = async (paymentMethod: string) => {
    if(paymentMethod === 'credit') {
        let checkoutData = {
            cart: cartState,
          }

          const line_items = Object.entries(cartState).map(([productId, quantity]) => {
            if (products) {
              const newProduct = products.find((product: { [x: string]: any; } | Product) => product.id === +productId) as Product | undefined;
              if (newProduct) {
                return {
                  name: newProduct.color ? newProduct.color + newProduct.name : newProduct.name,
                  quantity: quantity ? quantity.toString() : '0',
                  basePriceMoney: {
                    amount: BigInt(20),
                    currency: 'USD'
                  },
                  note: newProduct.description,
                };
              }
            }

            return {
              name: '',
              quantity: '0',
              basePriceMoney: {
                amount: BigInt(0),
                currency: 'USD'
              },
              note: '',
            };
          });
      
          function generateUniqueId(): string {
            return uuidv4();
        }
      
          try {
            const {result} = await client.checkoutApi.createPaymentLink({
              idempotencyKey: generateUniqueId(),
              order: {
                locationId:  'LXQRM8PCJ01HN',
                lineItems: line_items,
              }
            });
          
            console.log(result)
      
        } catch (error) {
          console.log(error)
        }


        // const {data} = await axios.post('../api/checkout', {
        //   orderData: cartState,
        // });

        // console.log(data)
        // const order = data.order;
        // const link = data.response;

        const cartOrder = localStorage.getItem('cart');
        if (cartOrder != null) {
          // localStorage.setItem('order', cartOrder);
          // localStorage.removeItem('cart')
          // Router.push(link);
        }
    } else {
      if (paymentMethod === 'badCoin') {
        if (!userInfo){
          setModelIsOpen('playFab')
          return
        }
        localStorage.setItem('payment', 'badCoin');
        localStorage.setItem('checkout', JSON.stringify(badCartState));
      } else {
        localStorage.setItem('payment', 'crypto');
        localStorage.setItem('checkout', JSON.stringify(cartState));
      }
        Router.push('/checkout');
    }
  };

  return (
    <>
      <Navbar />
        <WalletModal
          modelIsOpen={modelIsOpen}
          CloseModal={() => setModelIsOpen("false")}
        />
      <div className='bg-grey md:flex mt-32 max-w-6xl rounded-3xl p-10 w-3/4 mx-auto mb-10'>
        {(Object.keys(cartState).length > 0 || Object.keys(badCartState).length > 0) ? (
          <section className="p-4 w-10/12 mx-auto">
            { Object.keys(cartState).length > 0 &&
              <div>
                <h1 className="text-6xl text-center">Cart</h1>
                {Object.entries(cartState).map(([productId, quantity]) => (
                  <LineItem key={productId} cartItem={productId} quantity={quantity} setCartState={setCartState} cartState={cartState} setBadCartState={setBadCartState} badCartState={cartState} cart={true} />
                ))}
                <div className='item-detail-grid md:grid mx-auto md:mx-14'>
                  <div></div>
                  <div>
                    { shipping() !== 0 &&
                      <h3 className='text-2xl w-48 md:text-right text-center mx-auto md:mr-1'>Shipping ${shipping()}</h3>
                    }
                    <h3 className='text-3xl md:w-44 md:text-right text-center'>Total ${total() + shipping()}</h3>
                  </div>
                </div>
                <div className='lg:flex justify-between mx-auto'>
                  {/* <button className="checkout-button lg:w-2/5 w-full text-3xl block" onClick={() => handleCheckout('credit')}>
                    Credit Card
                  </button> */}
                  {isConnected ?
                  <button className="checkout-button lg:w-2/5 w-full text-3xl block" onClick={() => handleCheckout('crypto')} disabled={!isConnected}>
                    Crypto
                  </button>
                  :
                  <button className="checkout-button lg:w-2/5 w-full text-3xl block" onClick={() => setModelIsOpen('true')}>
                    Connect Wallet
                  </button>}
                </div>
            </div>}
            { Object.keys(badCartState).length > 0 &&
              <div className={`${Object.keys(cartState).length > 0 ? 'mt-20' : ''}  my-4`}>
                <h1 className="text-6xl text-center">Bad Cart</h1>
                {Object.entries(badCartState).map(([productId, quantity]) => (
                  <LineItem key={productId} cartItem={productId} quantity={quantity} setCartState={setCartState} cartState={cartState} setBadCartState={setBadCartState} badCartState={badCartState} cart={true} />
                ))}
                <div className='item-detail-grid md:grid mx-auto md:mx-14'>
                  <div></div>
                  <div>
                    { badShipping() !== 0 &&
                      <h3 className='text-2xl w-48 md:text-right text-center mx-auto md:mr-1'>
                        Shipping 
                        <Image
                          src={BadCoin}
                          width={25}
                          height={25}
                          alt={'Bad Coin'}
                          className="inline mb-1 ml-3 mr-1"
                        />
                        {badShipping()}
                      </h3>
                    }
                    <h3 className='text-3xl md:w-48 md:text-right text-center'>
                      Bad Total 
                      <Image
                        src={BadCoin}
                        width={25}
                        height={25}
                        alt={'Bad Coin'}
                        className="inline mb-1 ml-3 mr-1"
                      />
                      {badTotal() + badShipping()}
                    </h3>
                  </div>
                </div>
                <div className='lg:flex justify-between mx-auto'>
                  <button className="checkout-button lg:w-2/5 w-full text-3xl block" onClick={() => handleCheckout('badCoin')}>
                    Pay Up
                  </button>
                </div>
            </div>}
          </section>
        ) : (
          <div className='mx-auto'>
            <h1 className='text-6xl my-20'>Cart Empty</h1>
            <Link className='market-button' href={'/marketplace'}>
              <Image
                src={TextImages.Marketplace}
                width={275}
                height={50}
                style={{width:'150px', height:'auto'}}
                alt={'Marketplace Button'}
              />
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;