import { Dialog, Transition } from '@headlessui/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi'

interface WalletConnectModalProp {
  insufModal: boolean;
  CloseFunds: () => void;
}

export function InsufFunds( {insufModal, CloseFunds}: WalletConnectModalProp ) {

  return (
    <Transition appear show={insufModal}>
      <Dialog as="div" className='wallet-modal' onClose={CloseFunds}>
            <h1 className='text-3xl text-red-500'>Insufficient Funds</h1>
      </Dialog>
    </Transition>
  )
}