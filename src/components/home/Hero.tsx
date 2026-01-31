import React, { ReactNode } from 'react';
import Image from 'next/image';
import { HeroImage } from '../../assets/img'


export function Hero() {

  return (
  <div >
      <Image
        src={HeroImage}
        width={1000}
        height={400}
        style={{width:'100%', height:'auto'}}
        alt={'Bad a Billiard banner'}
        priority={true}
      />
    </div>
  )
}