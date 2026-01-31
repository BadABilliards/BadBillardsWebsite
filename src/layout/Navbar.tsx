import React, { Fragment } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai'
import Link from 'next/link';
import Image from 'next/image';
import { DiscordIcon, InstagramIcon, TwitterIcon, OpenSeaIcon} from '../assets/social'
import { Banner } from './components';
import { TextImages } from '../assets/text'
import { IoClose, IoMenu } from 'react-icons/io5';
import { Popover, Transition } from '@headlessui/react'
import Router from 'next/router'

export function Navbar() {

  const links = [
    { name: 'Home',
      link: '/',
      image: TextImages.Home,
    },
    { name: 'Marketplace',
      link: '/marketplace',
      image: TextImages.Marketplace,
    },
    { name: 'Slot',
      link: '/slots',
      image: TextImages.Slots,
    },
    { name: 'Buy',
      link: '/mint',
      image: TextImages.Mint,
    },
  ]

  const socialLinks = [
    { name: 'Open Sea',
      link: 'https://opensea.io/collection/bad-a-billiards-nft',
      image: OpenSeaIcon,
    },
    { name: 'Twitter',
      link: 'https://twitter.com/Bad_A_Billiards',
      image: TwitterIcon,
    },
    { name: 'Instagram',
      link: 'https://www.instagram.com/nft_badabilliards/',
      image: InstagramIcon,
    },
    { name: 'Discord',
      link: 'https://discord.gg/wk6JeX6aSX',
      image: DiscordIcon,
    },
  ]

  
  return (
    <Popover className='navbar'>
      <div className='navbar-grid'>
        <Link className='w-10 my-1 mx-4' href={'/'}>
          <Image
            src={TextImages.LogoClear}
            width={60}
            height={60}
            className='mx-auto'
            alt={'Bad A Billiard Logo'} />
        </Link>
        <div className='navbar-links hidden md:grid'>
          {links.map(link => 
            <Link className='mx-4' key={link.name} href={link.link} >
              <Image
                src={link.image}
                width={550}
                height={100}
                className='mx-auto mt-2'
                alt={link.name} />
            </Link>
          )}
        </div>
        <Link className='text-4xl mt-4' href={'/cart'}>
          <AiOutlineShoppingCart />
        </Link>
        <div className='social-grid'>
          {socialLinks.map(link => 
            <Link className='mx-2' key={link.name} href={link.link}>
              <Image
                src={link.image}
                width={50}
                height={50}
                className='mt-1'
                alt={link.name} />
            </Link>
          )}
        </div>
        <Popover.Button className='md:hidden text-4xl mt-1 mx-10'>
          <IoMenu />
        </Popover.Button>
        <Transition
          as={Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel className="absolute p-2 z-20 right-0">
            <div className="rounded-lg shadow-xl bg-felt px-6">
              <Popover.Button className="block mx-auto mr-0 text-2xl">
                <IoClose />
              </Popover.Button>
              <div className="flex flex-col pb-4">
                {links.map(link => 
                  <Popover.Button key={link.name} onClick={() => Router.push(link.link)} >
                    <Image
                      src={link.image}
                      width={550}
                      height={100}
                      style={{width:'150px', height:'auto', margin:'.75rem auto'}}
                      alt={link.name} />
                  </Popover.Button>
                )}
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </div>
      <Banner />
    </Popover>
  )
}
