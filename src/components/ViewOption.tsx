import React, { useEffect, useState } from 'react'
import { LuSettings2 } from "react-icons/lu";
import { WithErrorBoundariesWrapper } from './WithErrorBoundaries';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setViewOptions } from '../redux/viewOptions.slice';

type Props={
    isBoard:boolean,
    top:string
}
const ViewOption = (props:Props) => {
    const {isBoard,top}=props
    const [open, setOpen] = useState<boolean>(false);
    const selectedViewOptions=useAppSelector(state=>state.viewOption)
    const dispatch=useAppDispatch()

  const handleWindowClick=(e)=>{
    console.log("window clicked",e)
    setOpen(false)
   }
 
   useEffect(()=>{
     
     window.addEventListener("click",handleWindowClick)
 
     return ()=>{
       window.removeEventListener("click",handleWindowClick)
     }
   },[])
  return (
    <div className='relative'>
                 <div
          className={`w-8 lg:w-10 aspect-square rounded-full ${
            open
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "hover:bg-[#e9e9e9] dark:bg-white"
          } transition-all cursor-pointer grid place-items-center`}
          onClick={(e) =>{
            e.preventDefault()
              e.stopPropagation()
             setOpen((prev) => !prev)
            }}
        >
          <LuSettings2 className="font-extrabold text-xl lg:text-2xl" />
        </div>

        {open && (
          <div className={`absolute shadow-2xl w-44 h-auto bg-white dark:bg-[#282828] dark:shadow-white dark:border-2 dark:border-white -left[-50%] -translate-x-[50%] lg:translate-x-0 lg:-left-48 lg:${top} rounded-xl dark:shadow-md p-3 dark:text-white z-50`}>
            <p className="text-sm p-2">View Options</p>

            
              <button
              type="button"
               className={`w-full text-left rounded-md px-3 py-2  font-semibold ${selectedViewOptions === "standard" ? "bg-orange-500 text-white" :"hover:bg-[#e9e9e9] dark:hover:text-black"}`} onClick={()=>{
                dispatch(setViewOptions("standard"))
                // setOpen(false)
              }}>
               {isBoard ? "Default" : "Standard"} 
              </button>
            
                <button
                type="button"
                className={`w-full text-left rounded-md px-3 py-2  font-semibold mt-2 ${selectedViewOptions === "compact" ? "bg-orange-500 text-white " :"hover:bg-[#e9e9e9] dark:hover:text-black"}`}
                onClick={()=>{
                    dispatch(setViewOptions("compact"))
                  }}
              >
                Compact
              </button>
          </div>
        )}

    </div>
  )
}

export default WithErrorBoundariesWrapper(ViewOption)