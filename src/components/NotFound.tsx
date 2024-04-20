import React from 'react';
import { WithErrorBoundariesWrapper } from './WithErrorBoundaries';
import { useAppSelector } from '../hooks/reduxHooks';
import ImgURL404 from "../assets/404Page.gif"
const NotFoundPage = () => {
  const loggedInUser=useAppSelector(state=>state.user)
  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden">
      {loggedInUser?.name && <h1 className='lg:text-7xl text-6xl text-orange-500 mb-10'>Hello {loggedInUser?.name}!</h1>
     }
        <img src={ImgURL404} alt="404" className='w-2/4'/>
      <p className="text-gray-500 mb-4">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <a href="/" className="text-blue-600 hover:underline">Go to Home Page</a>
    </div>
  );
};

export default WithErrorBoundariesWrapper(NotFoundPage);
