import React, { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SaleImage } from '../../assets/img'
import { TextImages } from '../../assets/text';


export function SaleInfo() {

  return (
    <div className='lg:flex text-center flex-row-reverse'>
      <div className='my-auto px-6 mx-auto lg:w-1/2 sm:w-3/4 w-80' >
        <Image
          src={TextImages.YardSale}
          width={275}
          height={50}
          style={{margin:'30px auto', width:'300px', height:'auto' }}
          alt={'Yardsale text'}
        />
        <p >
        One man's trash is another man's treasure! Our Marketplace consists 
        of items for purchase with crypto, USD and with BAD coin, the official 
        currency of our mobile game.
        </p>
        <p >
        Check it out!
        </p>
        <Link className='market-button' href={'/marketplace'}>
          <Image
            src={TextImages.Marketplace}
            width={275}
            height={50}
            style={{width:'150px', height:'auto'}}
            alt={'Marketplace Button'}
          />
        </Link>
      </div>
      <Image
        src={SaleImage}
        width={1024}
        height={768}
        className=' md:w-1/2 w-3/4'
        style={{ height:'auto', margin: '10px auto', border:'5px black solid', borderRadius:'25px' }}
        alt={'Yardsale image'}
      />
    </div>
  )
}