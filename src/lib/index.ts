import { StaticImageData } from 'next/image';

export interface Member {
  nameID: string;
  name: StaticImageData;
  image: StaticImageData;
  position: StaticImageData;
  about1: string;
  about2: string;
  social: SocialLink[];
}

interface SocialLink {
  name: string;
  image: StaticImageData;
  link: string;
}

export interface Product {
  artist: string | null,
  inactive: boolean,
  avalibleBadCoin: boolean | null,
  color: string | null,
  created_at: string | null,
  description: string,
  deliveryDetails: string,
  id: number,
  image: string,
  image_black: string | null,
  image_blue: string | null,
  link: string | null,
  material: string | null,
  name: string,
  price: number,
  badCoin: number | null,
  shipping: number,
  size: string | null,
  stock: number | null,
  style: string | null,
  total_stock: number | null,
  type: string | null,
  digital: boolean,
  custom: boolean,
  apparel: boolean,
  experiences: boolean,
  buyNow: boolean,
  raffle: boolean,

}

export interface Cart {
  [id: string]: number;
}

export interface UserInfoProp {
  playfabId: string | null,
  pfp: string | null,
  coins: number | null,
  userName: string | null,
  publicAddress: string | null,
}

export interface ItemInstance {
  ItemId: string | undefined;
  ItemInstanceId: string | undefined;
  DisplayName: string | undefined;
  CatalogVersion: string | undefined;
  ItemClass: string | undefined;
}

export interface Stats{
  StatisticName: string | undefined,
  value: number,
}