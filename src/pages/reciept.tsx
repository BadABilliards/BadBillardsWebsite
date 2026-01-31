import { useState, useEffect, useContext } from 'react';
import Router from 'next/router'
import { LineItem } from "../components/marketplace";
import { Cart } from '../lib';
import { Navbar } from '../layout';
import Image from 'next/image';
import { TextImages } from '../assets/text';
import { MerchContext } from '../context';
import { BadCoin } from '../assets/img';


const ReceiptPage = () => {
  const [ order, setOrder] = useState<Cart>({});
  const [ orderNumber, setOrderNumber] = useState();
  const [ payment, setPayment] = useState<string | null>();
  const { products } = useContext(MerchContext);

  useEffect(() => {
    const cartOrder = localStorage.getItem('order');
    if (cartOrder) setOrder(JSON.parse(cartOrder))
    
    const payment = localStorage.getItem('payment');
    if (payment) setPayment(payment)
    
    const orderNumber = localStorage.getItem('orderNumber');
    if (orderNumber) setOrderNumber(JSON.parse(orderNumber))
  }, []);

  const total = () => {
    let newTotal = 0;
    if (order) {
      Object.entries(order).forEach(([id, quantity]) => {
        const product = products.find((product) => product.id === +id);
        if (payment === 'badCoin' && product) {
          newTotal += product.badCoin ? product.badCoin * quantity : product.price * quantity;
        } else if (payment === 'badCoin') {
          newTotal += product ? product.price * quantity : 0;
        }
      });
    }
    return newTotal + shipping();
  };

  const shipping = () => {
    let newTotal = 0;
    Object.entries(order).forEach(([ id, quantity ]) => {
      const product = products.find((product) => product.id === +id);
      newTotal += product ? product.shipping * quantity : 0;
    });
    if (newTotal > 0) newTotal+2
    return newTotal;
  };

  return (
    <>
      <Navbar />
      <div className="bg-grey mt-32 rounded-3xl p-10 w-3/4 mx-auto">
        {Object.keys(order).length > 0 ?
          <div className="p-4 w-10/12 mx-auto">
            <h1 className="text-6xl text-center">Order {orderNumber}</h1>
            <div className='mt-6'>
              {Object.entries(order).map(([productId, quantity]) => (
                <LineItem key={productId} cartItem={productId} quantity={quantity} setCartState={() => {}} cartState={{}} setBadCartState={() => {}} badCartState={{}} cart={false} />
              ))}
              <div className='item-detail-grid md:grid mx-auto md:mx-8'>
                  <div></div>
                  <div>
                    { shipping() !== 0 &&
                      <h3 className='text-2xl w-48 md:text-right text-center mx-auto md:mr-1'>
                        Shipping 
                        <Image
                          src={BadCoin}
                          width={25}
                          height={25}
                          alt={'Bad Coin'}
                          className="inline mb-1 ml-3 mr-1"
                        />
                        {shipping()}
                      </h3>
                    }
                    {payment === 'badCoin' ? <h3 className='text-3xl md:w-48 md:text-right text-center'>
                      Bad Total 
                      <Image
                        src={BadCoin}
                        width={25}
                        height={25}
                        alt={'Bad Coin'}
                        className="inline mb-1 ml-3 mr-1"
                      />
                      {total() + shipping()}
                    </h3>
                    :
                    <h3 className='text-3xl md:w-48 md:text-right text-center'>
                     Total ${total() + shipping()}
                    </h3>
                    }
                  </div>
                </div>
            </div>
          </div>
         : 
         <h1 className='md:text-6xl text-4xl text-center my-10'>Return to Marketplace</h1>
        }
        <button className="market-button" onClick={() => { localStorage.removeItem('order'), Router.push('/marketplace')}}>
          <Image
            src={TextImages.Marketplace}
            width={275}
            height={50}
            style={{width:'150px', height:'auto'}}
            alt={'Marketplace Button'}
          />
        </button>
      </div>
    </>
  );
};

export default ReceiptPage;