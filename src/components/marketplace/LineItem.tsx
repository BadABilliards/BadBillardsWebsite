import Image from "next/image";
import Link from "next/link";
import { useContext } from 'react'
import { MerchContext } from "../../context";
import { CartButton } from "./CartButton";
import { Cart } from "../../lib";
import { BadCoin } from "../../assets/img";

interface LineItemProp {
  cartItem: string
  quantity: number
  setCartState: (newCartState: Cart) => void;
  cartState: Cart;
  setBadCartState: (newCartState: Cart) => void;
  badCartState: Cart;
  cart: boolean
}

export function LineItem( {cartItem, quantity, setCartState, cartState, setBadCartState, badCartState, cart}: LineItemProp ) {
  const { products } = useContext(MerchContext);
  const product = products.find( item => item.id === +cartItem)

  if (!product)
  return <h3 className="text-2xl h-14 mt-4 text-red-500" >Loading</h3>
  
  const shipping = () => {
    let newTotal = product && product.shipping > 0 ? (product.shipping * quantity) + 2 : 0;
    return newTotal;
  };

  return (
    <div className='line-item-grid lg:grid border-b-2 block my-6 mx-auto'  >
      <Link className="w-full mx-auto my-2" href={ { pathname: '/product', query: { id: product.id } }}>
        <Image
          src={product.image}
          width={844}
          height={844}
          alt={product.name}
          className="w-3/4 mx-auto"
        />
      </Link>
      <div className="item-detail-grid md:grid mx-auto ">
        <div>
          <h3 className="text-4xl" >{product.name}</h3>
          <h3 className="text-xl" >{product.size}</h3>
          <h3 className="text-2xl w-full mb-4" >{product.description}</h3>
        </div>
        <div className="md:h-60 md:mx-2 mb-4 mx-auto text-center text-2xl">
          { cart ?
            <CartButton product={product} setCartState={setCartState} cartState={cartState} setBadCartState={setBadCartState} badCartState={badCartState} />
          : <div className="w-24"></div> }
          { product.badCoin ? 
          <h3 className="mr-6">
            <Image
              src={BadCoin}
              width={25}
              height={25}
              alt={product.name}
              className="inline mb-1 mr-1"
            />
            {product.badCoin}
          </h3>
        :
          <h3 >
            ${product.price}
          </h3>
        }
          <h3>x {quantity}</h3>
          { shipping() !== 0 && (product.badCoin ?
              <h3 className='md:mr-1'>Shipping 
              <Image
              src={BadCoin}
              width={25}
              height={25}
              alt={product.name}
              className="inline mb-1 mr-1"
            />
              {shipping()}</h3>
              :
              <h3 className='md:mr-1'>Shipping ${shipping()}</h3>)
            }
            { product.badCoin ? 
              <h3 className="border-t-2 w-1/2 md:w-11/12 mx-auto mr-6">
                <Image
                  src={BadCoin}
                  width={25}
                  height={25}
                  alt={product.name}
                  className="inline mb-1 mr-1"
                />
                {(product.badCoin * quantity) + shipping()}
              </h3>
            :
              <h3 className="border-t-2 w-1/2 md:w-full mx-auto">${(product.price * quantity) + shipping()}</h3>
            }
        </div>
      </div>
  </div>
  )
}