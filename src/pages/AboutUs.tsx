import React from 'react'

const AboutUs = () => {
  return (
    <div className='relative top-[12vh] flex items-center justify-center w-screen dark:bg-[#282828] h-[810px] lg:h-[610px] overflow-hidden'>
        <div className='w-2/3 rounded-lg shadow-2xl p-5  dark:shadow-white'>
            <h1 className='text-4xl text-center text-orange-500'>About Us</h1>
            <p className='text-center mt-5 text-xl dark:text-white'>Welcome to <span className='font-semibold'>'PinIt'</span>, This project is made by <span className='font-semibold'>'Ayush Mishra'</span> , Fullstack developer and created for fun.</p>
            <p className='text-center mt-2 text-lg dark:text-white'>User able to download pins , create pin, create board, save pins in board etc</p>
            <p className='text-center mt-2 text-lg dark:text-white'>Please Explore this site and have fun!</p>
        </div>
    </div>
  )
}

export default AboutUs