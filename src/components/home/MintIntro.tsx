import Link from 'next/link';
import Image from 'next/image';
import { FanNFT } from '../../assets/img'
import { TextImages } from '../../assets/text'


export function MintIntro() {

  return (
    <div className='lg:flex text-center'>
      <div className='my-auto px-6 mx-auto lg:w-1/2 sm:w-3/4 w-80' >
        <Image
          src={TextImages.Mint}
          width={275}
          height={50}
          style={{margin:'30px auto', display:'block', width:'250px' }}
          alt={'Mint text'}
        />
        <p>
          Join the badass community - Mint your Bad A Billiard NFT now!
        </p>
        <Link className='market-button' href={'/mint'}>
          <Image
            src={TextImages.Mint}
            width={275}
            height={50}
            style={{width:'125px', height:'auto'}}
            alt={'Mint page Button'}
          />
        </Link>
      </div>
      <Image
          src={FanNFT}
          width={600}
          height={343}
        className=' md:w-1/2 w-3/4'
        style={{ height:'auto', margin: 'auto'}}
        alt={'Card Fan of Bad A Billiard NFTs'}
        />
    </div>
  )
}