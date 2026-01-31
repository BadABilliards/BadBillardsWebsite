import { Member } from '../lib'
import { TeamImages } from '../assets/team';
import { InstagramIcon, TwitterIcon, HomeIcon } from '../assets/social'

export const members: Member[] = [
    { 
      nameID: 'MagicWerx',
      name: TeamImages.MagicWerx,
      image: TeamImages.MagicWerxImage,
      position: TeamImages.Artist,
      about1: 'Digital Creation and Collaboration Specialist',
      about2: 'Topps Card Sketch Artist for Star Wars, TWD, TMNT, & MLB',
      social: [
        {
          name: 'Twitter',
          image: TwitterIcon,
          link: 'https://www.instagram.com/zachwoolseyartwerx/',
        },
        {
          name: 'Instagram',
          image: InstagramIcon,
          link: 'https://twitter.com/mr64magic',
        },
        {
          name: "Zach's Home page",
          image: HomeIcon,
          link: 'http://zachwoolsey.com/#welcome',
        },
      ]
    },
    { 
      nameID: 'Kelkwak',
      name: TeamImages.Kelkwak,
      image: TeamImages.KelkwakImage,
      position: TeamImages.ProjectLead,
      about1: 'Digital Asset Community Leader',
      about2: 'Develops community engagement strategies for digital asset enthusiasts',
      social: [
        {
          name: 'Twitter',
          image: TwitterIcon,
          link: 'https://www.instagram.com/codeman90/',
        },
        {
          name: 'Instagram',
          image: InstagramIcon,
          link: 'https://twitter.com/QUELkwaK',
        },
      ]
    },
    { 
      nameID: 'DevOn',
      name: TeamImages.DevOn,
      image: TeamImages.DevOnImage,
      position: TeamImages.Developer,
      about1: 'Full Stack Developer',
      about2: 'Develops web3 applications and provides design and support for systems',
      social: [
        {
          name: 'Twitter',
          image: TwitterIcon,
          link: 'https://www.instagram.com/blainthomas/',
        },
        {
          name: 'Instagram',
          image: InstagramIcon,
          link: 'https://twitter.com/RealDev_on',
        },
      ]
    },
  ];