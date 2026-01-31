import { useState } from "react";
import { useAccount, usePrepareContractWrite, useContractWrite, useContractReads, useNetwork, useSwitchNetwork } from "wagmi";
import Image from "next/image";
import{ TextImages } from "../../assets/text";
import BadNFTContract from '../../utils/contracts/badContract.json'
import { ethers } from "ethers";

interface Results {
  _hex?: any;
}


interface InsufficientFundsModalProp {
  OpenModal: () => void;
}

export function MintButtons({OpenModal}: InsufficientFundsModalProp ) {
  const { address } = useAccount()
  const [ copied, setCopied ] = useState(false);
  const [ mintAmount, setMintAmount ] = useState(1);
  const [contractData, setContractData] = useState<Record<string, number | string>>({});
  const { chains, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const functions = ['cost', 'totalSupply', 'maxSupply', 'maxMintAmountPerTx', 'paused']

  const dataNumbers = useContractReads({
    contracts: [
      {
        address: `0x${BadNFTContract.address}`,
        abi: BadNFTContract.abi,
        functionName: 'cost',
      },
      {
        address: `0x${BadNFTContract.address}`,
        abi: BadNFTContract.abi,
        functionName: 'totalSupply',
      },
      {
        address: `0x${BadNFTContract.address}`,
        abi: BadNFTContract.abi,
        functionName: 'maxSupply',
      },
      {
        address: `0x${BadNFTContract.address}`,
        abi: BadNFTContract.abi,
        functionName: 'maxMintAmountPerTx',
      },
      {
        address: `0x${BadNFTContract.address}`,
        abi: BadNFTContract.abi,
        functionName: 'paused',
      },
    ],
    onSuccess(dataNumbers: Results[]) {
      converNums(dataNumbers)
    },
  })
  
  function handleMintAmountChange(modifier: string) {
    if (modifier === "increment") {
        setMintAmount(mintAmount + 1);
      // }
    } else if (modifier === "decrement") {
      if (mintAmount - 1 >= 1) {
        setMintAmount(mintAmount - 1);
      }
    }
  }

  function converNums(rawData: Results[]) {
    let newData: Record<string, number | any> = {};
    for (let i = 0; i < rawData.length; i++) {
      if (rawData[i]?._hex) {
        newData[functions[i]] = parseInt(rawData[i]._hex, 16);
      } else {
        newData[functions[i]] = rawData[i];
      }
    }
    setContractData((prevData) => ({ ...prevData, ...newData }));
    return newData;
  }


  function copyWalletAddress(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  const cost = contractData?.cost ? ethers.utils.parseUnits(contractData.cost.toString(), 'wei') : ethers.utils.parseUnits('0.03', 'ether'); // Convert to BigNumber

  const { config, error } = usePrepareContractWrite({
    address: `0x${BadNFTContract.address}`,
    abi: BadNFTContract.abi,
    functionName: 'mint',
    chainId: 1,
    args: [ mintAmount ],
    overrides: {
      from: address,
      // Use BigNumber for multiplication
      value: ethers.BigNumber.from(mintAmount).mul(cost),
    },
  });

  const { write } = useContractWrite({...config})

  function mint() {
    if(error?.message?.substring(0, 18) == 'insufficient funds'){
      OpenModal()
    } else if (address && chain?.id !== 1 && switchNetwork) {
      switchNetwork(1);
    } else {
      write?.()
    }
  }

  return (
    <div>
      <h3 className="text-4xl">
        {contractData.totalSupply}/{contractData.maxSupply}
      </h3>
      <span className="text-2xl" >{+contractData.cost/1000000000000000000} Ξ</span>
      <div className="flex flex-col cursor-copy"
        onClick={() => copyWalletAddress(`0x${address?.slice(2)}`)}
      >
        <p className="text-xl" >{ copied ? 'Copied!' : 'Copy' }</p>
        <p className="text-sm">{address}</p>
      </div>
      <div style={{display:'flex', justifyContent: 'center',
          alignItems: 'center'}}>
        <button
          className="increment-button"
          onClick={() => handleMintAmountChange("decrement")}
        >
          -
        </button>
        <span >{mintAmount}</span>
        <button
          className="increment-button"
          onClick={() => handleMintAmountChange("increment")}
        >
          +
        </button>
      </div>
      <button
        className="market-button"
        style={{height: '50px'}}
        onClick={() => mint()}
      >
        <Image
          src={TextImages.Mint}
          width={275}
          height={50}
          style={{width:'50%', height:'auto'}}
          alt={'Mint page Button'}
        />
      </button>
    </div>
  )
}