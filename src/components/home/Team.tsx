import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Member } from '../../lib'
import { members } from '../../data/Team'
import { TextImages } from '../../assets/text';

export const Team: React.FC = () => {

  const TeamMember: React.FC<{ member: Member, key: string }> = ({ member }) => {
    return (
      <div className='member lg:mx-2 md:w-2/3 w-7/8 mx-auto my-10 '>
        <div className='flex text-center' style={{flexDirection:'column', justifyContent:'space-between', height:'100%' }}>
          <div >
            <Image
              src={member.name}
              width={800}
              height={100}
              style={{width:'90%', height:'auto', display:'block', margin:' 10px auto'}}
              alt={'Bad a Billiard banner'}
            />
            <Image
              src={member.image}
              width={350}
              height={350}
              style={{display:'block', margin:'auto', width:'70%', height:'auto'}}
              alt={'Bad a Billiard banner'}
            />
            <div style={{margin:'10px auto', width:'90%', textAlign:'center', height: 'fit-content'}}>
              <p className='mt-2 text-3xl h-16'>{member.about1}</p>
              <p className='my-4 text-xl' >{member.about2}</p>
            </div>
          </div>
          <div>
            <Image
              src={member.position}
              width={800}
              height={100}
              style={{display:'block', margin:'auto', width:'60%', height:'auto'}}
              alt={'Bad a Billiard banner'}
            />
            <div style={{display:'flex', margin:'10px auto', justifyContent:'center' }}>
              { member.social.map( social => 
                <Link key={`${member.name} ${social.name}`} style={{margin:'0 5px'}} href={social.link}>
                  <Image
                    src={social.image}
                    width={30}
                    height={30}
                    alt={`${member.name}'s ${social.name} link`}
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <Image
        src={TextImages.Team}
        width={275}
        height={50}
        style={{margin:'0 auto 30px', display:'block', width: '300px' }}
        alt={'Game text'}
      />
      <div className='lg:flex text-center'>
        {members.map((member) => (
          <TeamMember member={member} key={member.nameID} />
        ))}
        
      </div>
    </div>
  );
}