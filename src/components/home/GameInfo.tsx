import React from 'react';
import Image from 'next/image';
import { TextImages } from '../../assets/text'; 
import { BadBuilding, GoogleImage, AppleImage } from '../../assets/img'
import { useRouter } from 'next/router';


export function GameInfo() {
  const router = useRouter();


  return (
    <div className='lg:flex text-center'>
      <div className='my-auto px-6 mx-auto lg:w-1/2 sm:w-3/4 w-80' >
        <Image
          src={TextImages.Game}
          width={275}
          height={50}
          style={{margin:'30px auto', display:'block', width:'300px'}}
          alt={'Game text'}
        />
        <p>
          Check out some of the best communities in the Bad A Billiards game.
        </p>
        <p>
          Download the app on your mobile device now and start playing!
        </p>
        {/* <div style={{marginTop: '30px'}}> */}
          {/* <button onClick={ () => router.push("https://play.google.com/store/apps/details?id=com.dev_on.badabilliards")}
          className='md:w-1/3 w-40'
          style={{ margin:'auto', backgroundColor: 'transparent', border:'none'}}
          >
            <Image
              src={GoogleImage}
              width={350}
              height={100}
              style={{width:'100%', height:'auto'}}
              alt={'Google play Bad a Billiard Link'}
            />
          </button> */}
          
          {/* <button onClick={ () => router.push("https://apps.apple.com/us/app/bad-a-billiards/id6443683898")} */}
          <button onClick={ () => router.push("https://dev-on.itch.io/bad-a-billiards")}
           className='market-button text-2xl'
          // style={{ margin:'10px', backgroundColor: 'transparent', border:'none'}}
          >
            Itch.IO
            {/* <Image
              src={AppleImage}
              width={350}
              height={100}
              style={{width:'100%', height:'auto'}}
              alt={'Apple store Bad a Billiard Link'}
            /> */}
          </button>
        {/* </div> */}
      </div>
      <Image
        src={BadBuilding}
        width={600}
        height={400}
        className=' md:w-1/2 w-3/4'
        style={{ height:'auto', margin:'10px auto', border:'5px black solid', borderRadius:'25px'  }}
        alt={"Bad A Billiard's pool hall"}
      />
    </div>
  )
}