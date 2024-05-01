import React, { useState, useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import ErrorImage from "../assets/404Page.gif";
import { labels } from "../config/constants/text.constant";

const Header = () => {
  const { pathname, state } = useLocation();

  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isSignup, setIsSignUp] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user);
  const [showRightSidePopup, setShowRightSidePopup] = useState<boolean>(false);
  const isAuthenticate = useAuth();
  const { routePaths } = config.constant.routes;
  const navigate = useNavigate();
  const [dropDownValue, setDropDownValue] = useState<string>(() => {
    return pathname === routePaths.CREATE_PIN ? "Create" : "Home";
  });
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const handleSwitchToSignUp = useCallback(() => {
    setIsLogin(false);
    setIsSignUp(true);
  }, []);

  const handleSwitchToLogin = useCallback(() => {
    setIsSignUp(false);
    setIsLogin(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticate && state && state[labels?.NEED_TO_LOGIN]) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [state]);

  const handleWindowClick = () => {
    setShowRightSidePopup(false);
    setOpenDropDown(false);
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  return (
    <header className="w-full flex h-[12vh] items-center justify-between  px-4 dark:bg-[#282828] dark:border-b-[2px] border-[#3b3b3b]  bg-white fixed top-0 left-0 z-50 gap-5">
      {/* left side of header */}
      <div className=" dark:text-white flex items-center gap-[20px]">
        <Link
          to={routePaths?.HOME}
          className="font-bold text-[#FF8C00] flex items-center gap-1 text-xl"
        >
          <BsFillPinAngleFill />
          <p>{labels?.PINIT}</p>
        </Link>

        {isAuthenticate && (
          <>
            <div className="item-center font-bold gap-[20px] hidden sm:flex">
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
            <div className="relative sm:hidden">
              <div
                className={`flex items-center gap-2 text-sm p-2 px-3 rounded-3xl ${
                  openDropDown &&
                  "bg-slate-900 text-white  dark:bg-[#E9E9E9] dark:text-black font-semibold"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenDropDown(!openDropDown);
                  setShowRightSidePopup(false);
                }}
              >
                <p>{dropDownValue}</p>
                <FaChevronDown className="text-sm" />
              </div>
              {openDropDown && (
                <div
                  className={`absolute shadow-2xl w-32 h-auto bg-white dark:bg-[#282828] dark:shadow-white dark:border-2 dark:border-white left-[50%] -translate-x-[50%]  rounded-xl dark:shadow-md p-3 dark:text-white z-50`}
                >
                  <button
                    type="button"
                    className={`w-full text-left rounded-md px-3 py-2  font-semibold ${
                      dropDownValue === labels?.HOME
                        ? "bg-orange-500 text-white"
                        : "hover:bg-[#e9e9e9] dark:hover:text-black"
                    }`}
                    onClick={() => {
                      setDropDownValue(labels?.HOME);
                      navigate(routePaths.HOME);
                      setOpenDropDown(false);
                    }}
                  >
                    {labels?.HOME}
                  </button>

                  <button
                    type="button"
                    className={`w-full text-left rounded-md px-3 py-2  font-semibold mt-2 ${
                      dropDownValue === labels?.CREATE
                        ? "bg-orange-500 text-white "
                        : "hover:bg-[#e9e9e9] dark:hover:text-black"
                    }`}
                    onClick={() => {
                      setDropDownValue(labels?.CREATE);
                      navigate(routePaths.CREATE_PIN);
                      setOpenDropDown(false);
                    }}
                  >
                    {labels?.CREATE}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* right side of header */}

      <div className="flex items-center gap-[20px] md:gap-[32px]">
        {!isAuthenticate && (
          <div>
            <Link
              to={routePaths.ABOUT_US}
              className={`  rounded-3xl p-2 font-bold  ${
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
          <div className="flex items-center gap-2">
            <button
              className="bg-[#FF8C00] hover:bg-[#FF5E0E] flex-1 md:flex-none text-white rounded-xl p-2 px-2  lg:px-4 text-sm md:text-md font-semibold"
              onClick={() => {
                setIsLogin(true);
              }}
            >
              {labels?.LOG_IN}
            </button>

            <button
              className="bg-[#E9E9E9] hover:bg-[#dad9d9]  rounded-xl p-2 px-2 lg:px-4 text-sm md:text-md  font-semibold"
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
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    (e.target as HTMLImageElement).src = ErrorImage;
                  }}
                  className={`rounded-full object-cover w-full h-full ${
                    pathname === `/${user.username}` &&
                    "border-2 border-orange-600"
                  }`}
                />
              ) : (
                <p className="font-bold w-full h-full text-center bg-gray-200 rounded-full flex items-center justify-center">
                  {user?.name?.toUpperCase()[0]}
                </p>
              )}
            </Link>

            <div
              className=" rounded-full p-1  w-[30px] h-[30px] cursor-pointer flex items-center justify-center text-gray-500 relative"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowRightSidePopup((prev) => !prev);
                setOpenDropDown(false);
              }}
            >
              <FaChevronDown className="dark:text-white" />
              {showRightSidePopup && (
                <RightSidePopup setShowPopup={setShowRightSidePopup} />
              )}
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
