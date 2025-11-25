import Images from '@/Constants/Images';
import type { DataAllpopertiesType } from '@/Types';
import  { useMemo } from 'react';

const DataAllpoperties = () => {
     const data:DataAllpopertiesType[] = useMemo(()=>[
    {
    id  :1,
    images : [
      {
        id :1 ,
        img :Images.imgExplorePropertyCard
      },
      {
        id :2 ,
        img : Images.imgExplorePropertyCard2
      }
    ],
    countImg : 16,
    price : 353.936,
    desc :"investor deal | motivated seller | sea View",
    locaton : "oceanz 1 ,oceanz by danbe ,maritime city ,dubai",
    type :"Apartment",
    info : "studio"
  },
    {
    id  :2,
    images : [
      {
        id :1 ,
        img :Images.imgExplorePropertyCard
      },
      {
        id :2 ,
        img : Images.imgExplorePropertyCard2
      }
    ],
    countImg : 16,
    price : 353.936,
    desc :"investor deal | motivated seller | sea View",
    locaton : "oceanz 1 ,oceanz by danbe ,maritime city ,dubai",
    type :"Apartment",
    info : "studio"
  },
    {
    id  :3,
    images : [
      {
        id :1 ,
        img :Images.imgExplorePropertyCard
      },
      {
        id :2 ,
        img : Images.imgExplorePropertyCard2
      }
    ],
    countImg : 16,
    price : 353.936,
    desc :"investor deal | motivated seller | sea View",
    locaton : "oceanz 1 ,oceanz by danbe ,maritime city ,dubai",
    type :"Apartment",
    info : "studio"
  },
    {
    id  :4,
    images : [
      {
        id :1 ,
        img :Images.imgExplorePropertyCard
      },
      {
        id :2 ,
        img : Images.imgExplorePropertyCard2
      }
    ],
    countImg : 16,
    price : 353.936,
    desc :"investor deal | motivated seller | sea View",
    locaton : "oceanz 1 ,oceanz by danbe ,maritime city ,dubai",
    type :"Apartment",
    info : "studio"
  },
    {
    id  :5,
    images : [
      {
        id :1 ,
        img :Images.imgExplorePropertyCard
      },
      {
        id :2 ,
        img : Images.imgExplorePropertyCard2
      }
    ],
    countImg : 16,
    price : 353.936,
    desc :"investor deal | motivated seller | sea View",
    locaton : "oceanz 1 ,oceanz by danbe ,maritime city ,dubai",
    type :"Apartment",
    info : "studio"
  },
    {
    id  :6,
    images : [
      {
        id :1 ,
        img :Images.imgExplorePropertyCard
      },
      {
        id :2 ,
        img : Images.imgExplorePropertyCard2
      }
    ],
    countImg : 16,
    price : 353.936,
    desc :"investor deal | motivated seller | sea View",
    locaton : "oceanz 1 ,oceanz by danbe ,maritime city ,dubai",
    type :"Apartment",
    info : "studio"
  },
     ],[])
    return data
}

export default DataAllpoperties;
