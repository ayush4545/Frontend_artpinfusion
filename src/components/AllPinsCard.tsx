import React from 'react'
import { Link } from 'react-router-dom';
import { PinType } from '../Types/types';

type Props={
  pins:PinType[],
  username:string,
  _id: string | undefined
}
const AllPinsCard = (props:Props) => {
  const {pins,username,_id}=props
  const reversedPins=pins?.reverse()?.slice(0,5)
  const pinsArr=[...Array(5).keys()]
  const leftmarginArray=["-left-10 z-50","-left-2 z-30","left-8 z-20","left-16 z-10","left-24 z-5" ]
  return (
    <Link to={`/${username}/pins`} className='w-full aspect-square rounded-2xl overflow-hidden' state={{userId:_id}}>
      <div className='w-full h-4/6  relative rounded-2xl overflow-hidden  cursor-pointer'>
        {
         pinsArr.map((val)=>{
          return <PinChip leftSideMargin={leftmarginArray[val]} imageUrl={reversedPins[val]?.imageUrl} pinTitle={reversedPins[val]?.title} key={reversedPins[val]?._id}/>
         })
        }
      </div>
      <p className='font-semibold text-xl mx-2 mt-2'>All Pins</p>
      <p className='mx-2 text-sm'>{pins?.length} pins</p>
    </Link>
  )
};

type PinChipProps={
  leftSideMargin:string,
  imageUrl:string,
  pinTitle?:string
}
const PinChip=(props:PinChipProps)=>{
  const {leftSideMargin,imageUrl,pinTitle}=props
    return  <div className={`w-3/5 h-full bg-[#efefef] rounded-2xl absolute ${leftSideMargin} border-r-[1px] border-[#f7f7f7] hover:bg-[#d5d5d5] overflow-hidden`}>
      {
        imageUrl && (
          <img src={imageUrl} alt={pinTitle} className='w-full h-full object-cover rounded-2xl'/>
        )
      }
    </div>
}

export default AllPinsCard