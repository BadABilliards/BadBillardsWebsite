import { useState, useEffect, useContext } from 'react';
import Router from 'next/router'
import { useSwitchNetwork, useAccount, usePrepareSendTransaction, useProvider, useSigner, useNetwork, useSendTransaction, useContractWrite, usePrepareContractWrite, useFeeData } from 'wagmi';
import { ethers, BigNumber } from 'ethers';
import USDTContract from '../../utils/contracts/USDTContract.json'
import { ChainId, Token, Fetcher, Route } from '@uniswap/sdk';
import { Cart } from '../../lib';
import { MerchContext } from '../../context';

interface OrderProp {
  payment: string,
  order: Cart
}

interface FormDataProp{
  user_name: string,
  email: string,
  phone_number: string,
  street: string,
  city: string,
  state: string,
  zip_code: string,
  wallet_address: string,
  id: string,
  total: number
}

interface CryptoPyamentProp {
  setWalletError: React.Dispatch<React.SetStateAction<boolean>>,
  setAddressError: React.Dispatch<React.SetStateAction<boolean>>
  formData: FormDataProp
}

function CryptoPayment ({ formData, setWalletError, setAddressError}: CryptoPyamentProp ) {
  const { data: gas } = useFeeData()
  const { products, saveOrders } = useContext(MerchContext);
  const [cryptoPayment, setCryptoPayment] = useState('ETH')
  const { data: signer} = useSigner();
  const { chain } = useNetwork()
  const provider = useProvider()
  const { chains, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();
  const [ ethPrice, setEthPrice ] = useState(0);
  const [ orderWithCart, setOrderWithCart ] = useState<OrderProp | null>(null);
  const [ payment, setPayment ] = useState<string>('');
  const {address} = useAccount();

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
  
  const total = () => {
    let newTotal = 0;
    if (orderWithCart) {
      Object.entries(orderWithCart).forEach(([id, quantity]) => {
        const product = products.find((product) => product.id === +id);
        newTotal += product ? product.price * quantity : 0;
      });
    }
    return newTotal + shipping();
  };


  const ethAmount = total() > 0 && ethPrice > 0 ? (total()/ethPrice).toFixed(18) : 0

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
    if (chain?.id === 1) {
    async function fetchPrice() {
      const WETH = new Token(ChainId.MAINNET, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18);
      const USDT = new Token(ChainId.MAINNET, USDTContract.address, 6);
      const pair = await Fetcher.fetchPairData(WETH, USDT, provider);
      const route = new Route([pair], WETH);
      const price = route.midPrice.toSignificant(6);
      setEthPrice(+price);
    }
    fetchPrice();
  }
  }, []);

  async function handleCryptoSuccess(){
    const orderNumber = await saveOrders( formData, orderWithCart, 'crypto_order')
    if ( orderNumber ){
      localStorage.setItem('order', JSON.stringify(orderWithCart))
      localStorage.setItem('orderNumber', JSON.stringify( "C"+orderNumber))
      localStorage.removeItem('checkout')
      localStorage.removeItem('cart')
      Router.push('/reciept')
  }
}

  const { config: ethConfig } = usePrepareSendTransaction({
    request: {
      to: "0xedFFDf7eD1647c6323401f7689869e4E01F55E37",
      value: ethers.utils.parseEther(ethAmount.toString()),
    },
    signer,
    onSuccess(data) {
      console.log(data)
    },
    onError(error) {
      console.log(error)
    },
  })

  const { sendTransaction } = useSendTransaction({...ethConfig,
    request: ethConfig.request,
    onSuccess(data) {
      handleCryptoSuccess();
    },
    onError(error) {
      console.log('Error', error)
    },
  })

   const { config: usdtConfig, error } = usePrepareContractWrite({
    address: `0x${USDTContract.address}`,
    abi: USDTContract.abi,
    functionName: 'transfer',
    signer,
    args: [ "0xedFFDf7eD1647c6323401f7689869e4E01F55E37", ethers.utils.parseUnits(total().toString(), 6)],
    overrides: {
      gasLimit: (gas && gas.formatted.gasPrice) ? BigNumber.from(gas.formatted.gasPrice) : BigNumber.from(100000),
    },
    onError(error) {
      console.log('Error', error)
      },
  });

  const { write: sendUSDT } = useContractWrite({...usdtConfig,
    onSuccess(data) {
    handleCryptoSuccess();
    },})


  const handleCryptoChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCryptoPayment( event.target.value );
  };

  function handleCryptoPayment(){
    if (address && chain?.id !== 1 && switchNetwork) {
      switchNetwork(1);
    } else if (cryptoPayment === 'ETH') {
      sendTransaction?.()
    } else {
      sendUSDT?.()
    }
  }

  return (
    <div>
      <select className="bg-dark-grey w-60 mx-auto block border-2 p-2 rounded-xl my-1" id="crypto" name="crypto payment" value={cryptoPayment} onChange={handleCryptoChange} >
      <option value="ETH">ETH</option>
      <option value="USDT">USDT</option>
      </select>
      <button className="checkout-button w-full mx-auto block text-3xl" onClick={ () => handleCryptoPayment() }>
        Pay
      </button>
    </div>
    );
  };

  
export default CryptoPayment;
