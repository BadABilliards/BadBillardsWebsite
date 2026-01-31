import { Dialog, Transition } from '@headlessui/react';
import React, { useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { CoinBase, MetaMask, WalletConnect } from '../../assets/img';
import Image from 'next/image';
import { TextImages } from '../../assets/text';

interface WalletConnectModalProp {
  modelIsOpen: string;
  CloseModal: () => void;
}

export function WalletModal({ modelIsOpen, CloseModal }: WalletConnectModalProp) {
  const { isConnected, connector } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect({onSuccess(data) {
    if (!userInfo.publicAddress)
      updateUserData(data.account)
  },});
  const { disconnect } = useDisconnect();
  const signInEmailInput = useRef<HTMLInputElement>(null);
  const SignInPasswordInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { loginWithPlayFab, loading, userInfo, updateUserData } = useContext(AuthContext);

  const handleSubmit = async () => {
    if (signInEmailInput.current && signInEmailInput.current.value && SignInPasswordInput.current && SignInPasswordInput.current.value) {
      loginWithPlayFab(signInEmailInput.current.value, SignInPasswordInput.current.value);
    }
  };

  const walletImage = (id: string) => {
    if (id === 'metaMask') return MetaMask;
    if (id === 'coinbaseWallet') return CoinBase;
    if (id === 'walletConnect') return WalletConnect;
  };

  const handleConnect = async (x: any) => {
    await connect({ connector: x });
    CloseModal();
  };
  return (
    <Transition appear show={modelIsOpen !== 'false'}>
      <Dialog as="div" className='wallet-modal' onClose={CloseModal}>
        {
          modelIsOpen === 'playFab' ?
          <div className="my-2">
            <Image
              src={TextImages.BadABilliards}
              width={711}
              height={100}
              style={{ width: '250px', height: 'auto', margin: '10px auto 10px' }}
              alt={'Bad a Billiard banner'}
            />
            <div className='flex flex-col'>
              <input className="bg-dark-grey border-2 p-2 rounded-xl my-1" type="text" id="first_name" name="first_name" ref={signInEmailInput} placeholder='User Name' />
              <input className="bg-dark-grey border-2 p-2 rounded-xl my-1" type="text" id="first_name" name="first_name" ref={SignInPasswordInput} placeholder='Password' />
            </div>
            <button onClick={handleSubmit} className={`profile-button`} disabled={loading} >
              {loading ? 'Loading...' : 'Sign in'}
            </button>
            <button onClick={ () => router.push("https://dev-on.itch.io/bad-a-billiards") } className={`py-0.5 w-40 `} >
              Update Credentials
            </button>
          </div>
        : isConnected ?
          <div>
            <h1 className='text-2xl mb-6'>Wallet Connected</h1>
            <button className='bg-black rounded-md p-3' onClick={() => { CloseModal(), disconnect()}}>
              Disconnect from {connector?.name}
            </button>
          </div>
        :
          <div>
            <h1 className='text-2xl mb-6'>Connect Wallet</h1>
            <div className='flex justify-between'>
              {connectors
                .filter((x) => x.ready && x.id !== connector?.id)
                .map((x) => (
                  <button className='p-3 m-2' key={x.id} onClick={() => handleConnect(x)}>
                    <Image
                      src={walletImage(x.id)}
                      width={100}
                      height={100}
                      className='mx-auto mt-2'
                      alt={x.id}
                    />
                  </button>
              ))}
            </div>
            {error && <div>{error.message}</div>}
          </div>
        }
      </Dialog>
    </Transition>
  )
}