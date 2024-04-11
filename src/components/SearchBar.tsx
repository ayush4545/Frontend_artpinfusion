import React, { useState } from 'react'
import { ImSearch } from "react-icons/im";
import { IoMdCloseCircle } from "react-icons/io";

const SearchBar = () => {
    const [isSearchFocused,setIsSearchFocused]=useState(false)

  return (

    <div className={`flex-1 bg-[#E9E9E9] mx-4 h-2/3 rounded-3xl overflow-hidden p-5  pr-0 flex items-center  justify-between ${isSearchFocused ? 'border-4 border-orange-600': ''}`}
    >
       <div className='flex items-center flex-1 gap-3'>
       {
        !isSearchFocused && (
            <ImSearch className='text-gray-500'/>
        )
       }
       <input type="search" placeholder="Search" className='flex-1 aspect-square bg-inherit outline-none tracking-wider placeholder:text-gray-500'
        onFocus={()=> setIsSearchFocused(true)}
        onBlur={()=> setIsSearchFocused(false)}
       />
       </div>

       {
        isSearchFocused && (
            <div className='hover:bg-[#dad9d9] w-[50px] aspect-square rounded-full  flex items-center justify-center cursor-pointer'>
            <IoMdCloseCircle className='text-xl'/>
          </div>
        )
       }

    </div>
  )
}

export default SearchBar