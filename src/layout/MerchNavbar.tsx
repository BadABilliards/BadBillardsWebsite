import React, { useContext } from 'react';
import Link from 'next/link';
import { Banner, WalletModal } from './components';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { TextImages } from '../assets/text';
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { AuthContext } from '../context/AuthContext';
import { InsufFunds } from '../components/mint/InsufFunds';


export function MerchNavbar() {
  const { modelIsOpen, setModelIsOpen, setFundsModal, fundsModal } = useContext(AuthContext);
  const{ isConnected } = useAccount();

  function handleCloseOpen(){
    setModelIsOpen('wallet');
  }

  function handleCloseModal(){
    setModelIsOpen('false');
  }

  
  function handleCloseFunds(){
    setFundsModal(false);
  }

  
  return (
    <div className='navbar'>
      <div className='navbar-grid'>
        <Link className='w-10 my-1 mx-4' href={'/'}>
          <Image
            src={TextImages.LogoClear}
            width={60}
            height={60}
            className='mx-auto'
            alt={'Bad A Billiard Logo'} />
        </Link>
        <div className='navbar-links sm:grid block mx-auto'>
          <Link className='lg:block hidden col-span-2 lg:col-span-1' href={'/'}>
            <Image
              src={TextImages.Home}
              width={550}
              height={100}
              className='mx-auto mt-2'
              alt='home' />
          </Link>
          <Link className='md:w-auto w-40 mx-auto block col-span-2 lg:col-span-1' href={'/marketplace'}>
            <Image
              src={TextImages.Marketplace}
              width={550}
              height={100}
              className='mx-auto mt-2'
              alt='Marketplace' />
          </Link>
          <Link className='md:w-auto w-40 mx-auto block col-span-2 lg:col-span-1' href={'/mint'}>
            <Image
              src={TextImages.Mint}
              width={550}
              height={100}
              className='mx-auto mt-2'
              alt='Marketplace' />
          </Link>
        </div>
        <div className='connect-grid mx-2'>
          <div></div>
          <Link className='text-4xl mx-4 mt-3' href={'/cart'}>
            <AiOutlineShoppingCart />
          </Link>
          <button className='connect-button my-auto' onClick={handleCloseOpen}>{isConnected ? 'Disconnect' : 'Connect'}</button>
        </div>
      </div>
      <Banner />
      <WalletModal modelIsOpen={modelIsOpen} CloseModal={handleCloseModal}/>
      <InsufFunds insufModal={fundsModal} CloseFunds={handleCloseFunds} />

    </div>
  )
}