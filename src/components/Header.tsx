import React, { useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LogIn from "./LogIn";
import SignUp from "./SingUp";
import { useAppSelector } from "../hooks/reduxHooks";
import useAuth from "../hooks/useAuth";
import config from "../config";
import { FaChevronDown } from "react-icons/fa";
import RightSidePopup from "./RightSidePopup";
import ModeToggle from "./ModeToggle";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import { BsFillPinAngleFill } from "react-icons/bs";
import ErrorImage from "../assets/404Page.gif"
import { labels } from "../config/constants/text.constant";
const Header = () => {
  const { pathname,state } = useLocation();
  
  const [isLogin, setIsLogin] = useState(false)
  const [isSignup, setIsSignUp] = useState(false);
  const user = useAppSelector((state) => state.user);
  const [showRightSidePopup,setShowRightSidePopup]=useState(false)
  const  isAuthenticate  = useAuth();
  const { routePaths } = config.constant.routes;
  
  const handleSwitchToSignUp = useCallback(() => {
    setIsLogin(false);
    setIsSignUp(true);
  }, []);

  const handleSwitchToLogin = useCallback(() => {
    setIsSignUp(false);
    setIsLogin(true);
  }, []);

  useEffect(()=>{
   if(!isAuthenticate && state && state[labels?.NEED_TO_LOGIN]){
    setIsLogin(true)
   }else{
     setIsLogin(false)
   }
  },[state])

  const handleWindowClick=()=>{
   
    setShowRightSidePopup(false)
   }
 
   useEffect(()=>{
     
     window.addEventListener("click",handleWindowClick)
 
     return ()=>{
       window.removeEventListener("click",handleWindowClick)
     }
   },[])

  return (
    <header className="w-full flex h-[12vh] items-center justify-between  px-4 dark:bg-[#282828] dark:border-b-[2px] border-[#3b3b3b]  bg-white fixed top-0 left-0 z-50">
      {/* left side of header */}
      <div className=" dark:text-white flex items-center gap-[20px]">
        <Link to={routePaths?.HOME} className="font-bold text-[#FF8C00] flex items-center gap-1 text-xl">
         <BsFillPinAngleFill/>
         <p>{labels?.PINIT}</p>
        </Link>

        {isAuthenticate && (
          <div className="flex item-center font-bold gap-[32px]">
            <Link
              to={routePaths.HOME}
              className={`rounded-3xl p-2 ${
                pathname === routePaths.HOME
                  ? "bg-slate-900 text-white  dark:bg-[#E9E9E9] dark:text-black"
                  : "hover:bg-[#E9E9E9] dark:hover:text-black"
              }`}
            >
              {labels?.HOME}
            </Link>
            
            <Link
              to={routePaths.CREATE_PIN}
              className={`rounded-3xl p-2 ${
                pathname === routePaths.CREATE_PIN
                  ? "bg-slate-900 text-white  dark:bg-[#E9E9E9] dark:text-black"
                  : "hover:bg-[#E9E9E9]"
              }`}
            >
              {labels?.CREATE}
            </Link>
          </div>
        ) }
      </div>

      {/* right side of header */}

      <div className="flex items-center gap-[32px]">
        {!isAuthenticate && (
          <div>
            <Link
              to={routePaths.ABOUT_US}
              className={`  rounded-3xl p-2  ${
                pathname === routePaths.ABOUT_US
                  ? "bg-slate-900 text-white  dark:bg-[#E9E9E9] dark:text-black"
                  : "hover:bg-[#E9E9E9] dark:hover:text-black dark:text-white"
              }`}
            >
              {labels?.ABOUT}
            </Link>
          </div>
        )}

        {/* Dark and light toggle button */}
        <ModeToggle />

        {!isAuthenticate ? (
          <div className="flex items-center gap-[8px]">
            <button
              className="bg-[#FF8C00] hover:bg-[#FF5E0E] text-white rounded-[20px] p-2 px-4"
              onClick={() => {
                setIsLogin(true);
              }}
            >
              {labels?.LOG_IN}
            </button>

            <button
              className="bg-[#E9E9E9] hover:bg-[#dad9d9]  rounded-[20px] p-2 px-4 "
              onClick={() => {
                setIsSignUp(true);
              }}
            >
              {labels?.SIGN_UP}
            </button>
          </div>
        ) : (
          
          // User image
          <div className="flex items-center gap-[8px]">
            <Link
              to={`/${user?.username}`}
              state={user?._id}
              className=" rounded-full p-2 hover:bg-[#dad9d9] w-[50px] h-[50px] cursor-pointer flex items-center justify-center"
            >
              {user.imgUrl && user.imgUrl.length > 10 ? (
                <img
                  src={user?.imgUrl}
                  alt={user?.name}
                  onError={(e:React.SyntheticEvent<HTMLImageElement, Event>)=>{
                   e.target.src=ErrorImage
                  }}
                  className={`rounded-full object-cover w-full h-full ${
                    pathname === `/${user.username}`
                      &&"border-2 border-orange-600"
                  }`}
                />
              ) : (
                <p className="font-bold w-full h-full text-center bg-gray-200 rounded-full flex items-center justify-center">
                  {user?.name?.toUpperCase()[0]}
                </p>
              )}
            </Link>

            <div className=" rounded-full p-1  w-[30px] h-[30px] cursor-pointer flex items-center justify-center text-gray-500 relative"
             onClick={(e)=>{
               e.preventDefault()
               e.stopPropagation();
               setShowRightSidePopup(prev=>!prev)
            }}>
              <FaChevronDown className="dark:text-white"/>
              { showRightSidePopup && (
                   <RightSidePopup setShowPopup={setShowRightSidePopup} />
              )
              }
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {isLogin && (
        <LogIn
          onClose={() => {
            setIsLogin(false);
          }}
          handleSwitchToSignUp={handleSwitchToSignUp}
        />
      )}

      {/* Signup modal */}
      {isSignup && (
        <SignUp
          onClose={() => {
            setIsSignUp(false);
          }}
          handleSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </header>
  );
};

export default WithErrorBoundariesWrapper(Header);
