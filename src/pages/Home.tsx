import React, { useEffect, useRef, useState } from "react";
import HeroSection from "../components/HeroSection";
import useAuth from "../hooks/useAuth";
import config from "../config";
import axios from "axios";
import Pins from "../components/Pins";
import { PinType } from "../Types/types";
import { setHoverOn } from "../redux/hoverOn.slice";
import { useAppDispatch } from "../hooks/reduxHooks";
import Loader from "../components/Loader";
import { WithErrorBoundariesWrapper } from "../components/WithErrorBoundaries";

const LIMIT = 10;
const Home = () => {
  const isAuthenticate = useAuth();
  const { BACKEND_END_POINTS } = config.constant.api;
  const { toastPopup } = config.utils.toastMessage;
  const page=useRef(1)
  const containerRef = useRef(null);
  const [pins, setPins] = useState<PinType[]>([]);
  const newPins=useRef([])
  const [loading, setLoading] = useState(false);
  const isAllPinsComing=useRef(false)
  const dispatch = useAppDispatch();
  const [isAuthenticateValue, setIsAuthenticatedValue] =
    useState(isAuthenticate);

  useEffect(() => {
    setIsAuthenticatedValue(isAuthenticate);
  }, [isAuthenticate]);

  const fetchPins = async () => {
    console.log(123,page,newPins)
    try {
      const res = await axios.get(
        `${BACKEND_END_POINTS.Get_ALL_PINS}?page=${page?.current}&limit=${LIMIT}`
      );
      const resData = await res.data;
      if (resData?.data?.length) {
        // const initialPins= pins ? pins : []
        console.log(234,pins)
        const setOfPins = [...new Set([...newPins?.current, ...resData.data])];
        newPins.current=setOfPins
        setPins(setOfPins);
        page.current +=1
      }else{
        isAllPinsComing.current=true
      }

    } catch (error) {
      toastPopup("Something went wrong", "error");
      
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticateValue) {
      fetchPins();
      dispatch(setHoverOn("homePin"));
    }
  }, []);

  const handleScroll = () => {
    if (
      isAuthenticateValue &&
      !isAllPinsComing.current &&
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.scrollHeight - 30
    ) {
      console.log("height",window.innerHeight + document.documentElement.scrollTop,document.documentElement.scrollHeight - 60)
      setLoading(true)
      fetchPins();
    }

  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <main
        className="w-screen h-auto homeSection snap-y snap-proximity relative"
        ref={containerRef}
      >
        {!isAuthenticateValue ? (
          <>
            <HeroSection />
          </>
        ) : (
          <div className="w-screen absolute top-[12vh] homeSection min-h-[90%] dark:bg-[#282828] p-3">
            {
              pins ? (
                  pins.length > 0 ?
                  <Pins
                  pins={pins}
                  gridStyle="columns-2 gap-4 lg:gap-4 sm:columns-2 lg:columns-4 xl:columns-6"
                /> : 
                <h2 className="text-center font-bold text-4xl mt-10 text-gray-700">
                No pins found
              </h2>
              ) : <Loader/>
            }

            {loading && <Loader />}
          </div>
        )}
      </main>
    </>
  );
};

export default WithErrorBoundariesWrapper(Home);
