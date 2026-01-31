import { useState, useEffect, useContext } from 'react';
import Router from 'next/router'
import { WalletModal } from "../layout/components";
import { Navbar } from '../layout';
import { Cart } from '../lib';
import { useAccount } from 'wagmi'
import { MerchContext } from '../context';
import { AuthContext } from '../context/AuthContext';
import CryptoPayment from '../components/marketplace/CryptoPayment';

interface OrderProp {
  payment: string,
  order: Cart
}

function CheckoutPage () {
  const { products, saveOrders } = useContext(MerchContext);
  const { spendCoins, userInfo, setModelIsOpen, modelIsOpen } = useContext(AuthContext);
  const [ orderWithCart, setOrderWithCart ] = useState<OrderProp | null>(null);
  const { isConnected } = useAccount()
  const [ payment, setPayment ] = useState<string>('');
  const [ addressError, setAddressError ] = useState<boolean>(false);
  const [ walletError, setWalletError ] = useState<boolean>(false);


  const shipping = () => {
    let newTotal = 0;
    if (orderWithCart) {
      Object.entries(orderWithCart).forEach(([id, quantity]) => {
        const product = products.find((product) => product.id === +id);
        newTotal += product ? product.shipping * quantity : 0;
      });
    }
    if (newTotal > 0) newTotal += 2;
    return newTotal;
  };

  const wallet = () => {
    let walletNeeded = false;
    if (orderWithCart) {
      Object.entries(orderWithCart).forEach(([id, quantity]) => {
        const product = products.find((product) => product.digital === true);
        walletNeeded = true;
      });
    }
    return walletNeeded;
  };
  
  const total = () => {
    let newTotal = 0;
    if (orderWithCart) {
      Object.entries(orderWithCart).forEach(([id, quantity]) => {
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

  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    phone_number: "",
    street: "",
    city: "",
    state: "State:",
    zip_code: "",
    wallet_address: "",
    id: "Guest",
    total: total() + shipping()
  });

  useEffect(() => {
    const payment = localStorage.getItem('payment');
    const checkout = localStorage.getItem('checkout');
    if (checkout) {
      const parsedCheckout = JSON.parse(checkout);
      if (typeof parsedCheckout === 'object' && !Array.isArray(parsedCheckout)) {
        setOrderWithCart(parsedCheckout)
      }
    }
    if(payment) {
        setPayment(payment)
  }
  }, []);

    const handleBadPayment = async () => {
      if(shipping() > 0 &&
        formData.street === "" &&
        formData.city === "" &&
        formData.state === "State:" &&
        formData.zip_code === ""
      ){
        setAddressError(true);
        return
      }
      if(wallet() &&
        formData.wallet_address === ""
      ){
        setWalletError(true);
        return
      }
      if (!userInfo){
        setModelIsOpen('playFab')
        return
      }
      if ( spendCoins(total()) === true ) {
        const orderNumber = await saveOrders( formData, orderWithCart, 'new_bad_order')
        if ( orderNumber ){
          console.log(orderNumber)
          localStorage.setItem('order', JSON.stringify(orderWithCart))
          localStorage.setItem('orderNumber', JSON.stringify( "B"+orderNumber))
          localStorage.removeItem('badCart')
          localStorage.removeItem('checkout')
          Router.push('/reciept')
      }
      }
    }


  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <>
      <Navbar />
        <WalletModal
          modelIsOpen={modelIsOpen}
          CloseModal={() => setModelIsOpen("false")}
        />
      <div className='bg-grey mt-32 rounded-3xl p-10 w-3/4 mx-auto'>
        <h1 className='text-center home-text md:text-7xl text-6xl'>Checkout</h1>
        <div className='px-4 text-center max-w-2xl mx-auto flex flex-col'>
          <input className="bg-dark-grey border-2 p-2 rounded-xl my-1" type="text" id="user_name" name="user_name" value={formData.user_name} onChange={handleChange} placeholder='User Name:' />
          { shipping() > 0 && 
            <>
              {addressError &&
                <div className='text-3xl text-red-500'>Please provide an address for shipping</div>
              }
              <input className="bg-dark-grey border-2 p-2 rounded-xl my-1" type="text" id="street" name="street" value={formData.street} onChange={handleChange} placeholder='Street:'/>
                <select className="bg-dark-grey border-2 p-2 rounded-xl my-1" id="state" name="state" value={formData.state} onChange={handleChange} >
                <option value="">-- Select a state --</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="DC">District Of Columbia</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island	</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
                </select>
              <input className="bg-dark-grey border-2 p-2 rounded-xl my-1" type="text" id="city" name="city" value={formData.city} onChange={handleChange} placeholder='City:'/>
              <input className="bg-dark-grey border-2 p-2 rounded-xl my-1" type="text" id="zip_code" name="zip_code" value={formData.zip_code} onChange={handleChange} placeholder='Zip code:'/>
            </>
          }
          <input className="bg-dark-grey border-2 p-2 rounded-xl my-1" type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder='Email:'/>
          {wallet() &&
            <>
            { walletError && 
              <div className='text-3xl text-red-500'>Please provide a wallet address</div>
            }
              <input className="bg-dark-grey border-2 p-2 rounded-xl my-1" type="text" id="wallet_address" name="wallet_address" value={formData.wallet_address} onChange={handleChange} placeholder='Wallet Address:'/>
            </>
          }
          <input className="bg-dark-grey border-2 p-2 rounded-xl my-1" type="text" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder='Phone:'/>
      </div>
      { orderWithCart && payment === 'crypto' && 
        (isConnected ?
        <CryptoPayment setWalletError={setWalletError} setAddressError={setAddressError} formData={formData}/>
        :
        <>
          <h1 className='text-4xl text-center block'>Connect your wallet</h1>
          <div className='mb-6'>
          <button className='connect-button my-4 mx-auto' onClick={() => setModelIsOpen('wallet')}>Connect</button>
          </div>
        </>)
      }
      { orderWithCart && payment === 'badCoin' && 
        <div>
          <button className="checkout-button w-full mx-auto block text-3xl" onClick={() => { handleBadPayment() }}>
            Pay up
          </button>
        </div>
      }
    </div>
    </>
    
    );
  };

  
export default CheckoutPage;