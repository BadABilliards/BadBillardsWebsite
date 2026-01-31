import Image from 'next/image';
import { IntroImage } from '../../assets/img'
import { TextImages } from '../../assets/text'


export function Intro() {

  return (
    <div className='lg:flex text-center flex-row-reverse'>
      <div className='my-auto px-6 mx-auto lg:w-1/2 sm:w-3/4 w-80' >
        <Image
          src={TextImages.BadABilliards}
          width={711}
          height={100}
          style={{width:'350px', height:'auto', margin: '0 auto 30px'}}
          alt={'Bad a Billiard banner'}
        />
        <p>
          Bad A Billiards is your step into the universe of gaming. 
          Unlock the ordinary and step in the extraordinary sphere 
          of art, collecting and gaming. Digital ownership is here 
          - control how you play and look badass doing it.
        </p>
      </div>
      <Image
        src={IntroImage}
        width={600}
        height={600}
        className=' md:w-1/3 w-3/4'
        style={{ margin:'10px auto', borderRadius:'25px', border:'5px black solid' }}
        alt={'Bad a Billiard intro image'}
      />
    </div>
  )
}