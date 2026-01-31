import React, { useContext, useRef } from 'react'
import { Navbar, Footer } from '../layout'
import { WalletModal } from "../layout/components";
import Image from 'next/image';
import { InsufFunds } from '../components/mint/InsufFunds'
import { AuthContext } from '../context/AuthContext'
import { TextImages } from '../assets/text';

function Page() {
  const { loginWithPlayFab, loading } = useContext(AuthContext);
  const { setModelIsOpen, modelIsOpen, setFundsModal, fundsModal } = useContext(AuthContext);
  const signInEmailInput = useRef<HTMLInputElement>(null);
  const SignInPasswordInput = useRef<HTMLInputElement>(null);

  function handleCloseModal(){
    setFundsModal(false);
  }

  const handleSubmit = async () => {
    if (signInEmailInput.current && signInEmailInput.current.value && SignInPasswordInput.current && SignInPasswordInput.current.value) {
      try {
        const loginResponse = await loginWithPlayFab(signInEmailInput.current.value, SignInPasswordInput.current.value);
        if (loginResponse.success) {
          // Call your backend endpoint to send an email
          const emailResponse = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify('Please delete account' + { email: signInEmailInput.current.value } ),
          });
  
          if (!emailResponse.ok) {
            throw new Error('Email sending failed');
          }
        } else {
          // Handle login failure
          console.error('Login failed:', loginResponse.message);
        }
      } catch (error) {
        console.error('Login or email sending failed:', error);
      }
    }
  };

  return (
      <main>
        <Navbar />
          <WalletModal
            modelIsOpen={modelIsOpen}
            CloseModal={() => setModelIsOpen("false")}
          />
        <div className="mint-block">
            <Image
              src={TextImages.BadABilliards}
              width={711}
              height={100}
              style={{ width: '250px', height: 'auto', margin: '10px auto 10px' }}
              alt={'Bad a Billiard banner'}
            />
            <div className='flex flex-col'>
              <h3>Give 24 hours for account to be fully deleted</h3>
              <input className="bg-dark-grey border-2 p-2 rounded-xl my-1" type="text" id="first_name" name="first_name" ref={signInEmailInput} placeholder='User Name' />
              <input className="bg-dark-grey border-2 p-2 rounded-xl my-1" type="text" id="first_name" name="first_name" ref={SignInPasswordInput} placeholder='Password' />
            </div>
            <button onClick={handleSubmit} className={`profile-button`} disabled={loading} >
              {loading ? 'Loading...' : 'Delete Account'}
            </button>
        </div>
        <Footer />
        <InsufFunds insufModal={fundsModal} CloseFunds={handleCloseModal} />
      </main>
  )
}

export default Page
