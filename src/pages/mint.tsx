import React, { useState, useContext } from 'react'
import { Navbar, Footer } from '../layout'
import { MintButtons } from '../components/mint'
import { WalletModal } from "../layout/components";
import { useAccount } from 'wagmi'
import { InsufFunds } from '../components/mint/InsufFunds'
import { AuthContext } from '../context/AuthContext'

function Page() {
  const { isConnected } = useAccount()
  const { setModelIsOpen, modelIsOpen, setFundsModal, fundsModal } = useContext(AuthContext);

  function handleOpenModal(){
    setFundsModal(true);
  }

  function handleCloseModal(){
    setFundsModal(false);
  }


  return (
      <main>
        <Navbar />
          <WalletModal
            modelIsOpen={modelIsOpen}
            CloseModal={() => setModelIsOpen("false")}
          />
        <div className='mint-block'>
        {isConnected ? 
          <MintButtons OpenModal={handleOpenModal} />
          :
          <>
            <h1 className='text-4xl block'>Connect your wallet</h1>
            <div className='mb-6'>
            <button className='connect-button my-4 mx-auto' onClick={() => setModelIsOpen('wallet')}>Connect</button>
            </div>
          </>
        }
        </div>
        <Footer />
        <InsufFunds insufModal={fundsModal} CloseFunds={handleCloseModal} />
      </main>
  )
}

export default Page
