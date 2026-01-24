import type { ReactNode } from "react";
import type { To } from "react-router-dom";

export interface DataCustomerServicesType {
  id: number;
  img: string;
  title: string;
  desc: string;
  link?: any;
  onClick?: any;
}
export interface ContactDataService {
  id: number;
  img: ReactNode;
  title: string;
  desc: string;
  
  onClick?: () => void;
}
export interface AboutDataService {
  id: number;
  img: ReactNode;
  title: string;
  desc: string;
  link?: string;
  onClick?: () => void;
}
export interface DataSocialMediaType {
  id: number;
  icons: ReactNode;
  title: string;
  desc: string;
}
export interface dataPartnersType {
  id: number;
  img: string;
}
export interface FooterItemType {
  id: number;
  title: string;
  option: {
    id: number;
    item: string;
    link?: any;
  }[];
}
export interface FooterSocialMediaType {
  id: number;
  icons: ReactNode;
  link: string;
}

export interface HeaderItemType {
  id: number;
  li: string;
  linkBTN?: To;
  link: string;
  content?: {
    title?: string;
    subTitle?: string;
    option: {
      id: number;
      icon?: string;
      item: string;
    }[];
  };
  img?: string;
  titleImg?: string;
  descImg?: string;
  textBTN?: string;
}
export interface DataMarketPlaceType {
  id: number;
  icons: string;
  title: string;
  desc: string;
}
export interface DataOurClientsType {
  id: number;
  icons: string;
  name: string;
  time: string;
  title: string;
  desc: string;
}

export interface DataAllpopertiesType {
  id: number;
  images: {
    id: number;
    img: string;
  }[];
  countImg: number;
  price: number;
  desc: string;
  locaton: string;
  type: string;
  info: string;
}

export interface DataOurTeamType {
  id: number;
  img: string;
  name: string;
  languages: string;
  email: string;
  call: string;
  whatsApp: string;
}

export interface inputArraySubscribeType {
  id: number;
  name: string;
  placeholder?: string;
  control: string;
  type?: string;
  required?: boolean;
  inptClass?: string;
  isIcons?: ReactNode;
  label?: string | ReactNode;
  className?: string;
}

export interface SideBarItemType {
  id: number;
  title: string;
  icons: ReactNode;
  link: any;
}
export interface DataRecommendedType {
  id: number;
  img: string;
  title: string;
  desc: string;
  link: any;
}
