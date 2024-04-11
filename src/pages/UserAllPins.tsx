import React, { Suspense, lazy, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import CreateBoardPinButton from '../components/CreateBoardPinButton'
import axios from 'axios'
import config from '../config'
import { setHoverOn } from '../redux/hoverOn.slice'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import Loader from '../components/Loader'
const Pins = lazy(()=>import('../components/Pins')) 

const UserAllPins = () => {
    const {state:{userId}}=useLocation()
    const {BACKEND_END_POINTS}=config.constant.api
    const [pins,setPins]=useState([])
    const loggedInUser=useAppSelector(state=>state.user)
    const dispatch=useAppDispatch()   
    const fetchSavedPins=async()=>{
         const res=await axios.get(`${BACKEND_END_POINTS.GET_SAVED_PINS}/${userId}`)
         const resData=await res.data
         if(resData.statusCode === 200){
            setPins(resData.data)
            if(userId === loggedInUser?._id){

              dispatch(setHoverOn("allPins"))
            }else{
              dispatch(setHoverOn("homePin"))
            }
         } 
    }
    useEffect(()=>{
       if(userId){
        fetchSavedPins()
       }
    },[userId])

  return (
    <div className='w-screen absolute top-[12vh] dark:bg-[#282828] p-5 -z-10'>
       <div className='fixed w-full h-20 top-[12vh] left-0 flex items-center justify-between gap-10 pr-3 z-50 bg-white'>
            <p className='text-xl text-center flex-1 font-semibold'>
              All Pins
            </p>
             <CreateBoardPinButton showBoard={false} top="-top-8"/>
       </div>
      <div className='absolute  w-[98%] top-20'>
      {
        pins && pins?.length > 0 ? (
            <div className="mt-5 w-full">
              <Suspense fallback={<Loader />} >
              <Pins
                pins={pins}
                gridStyle="columns-1 gap-4 lg:gap-4 sm:columns-2 lg:columns-4 xl:columns-6"
              />
              </Suspense>
              
            </div>
        ):(
            <p className="text-center text-gray-400 text">
              There aren’t any Pins saved yet
            </p>
        )
       }
      </div>
    </div>
  )
}

export default UserAllPins