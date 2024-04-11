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

const LIMIT = 20;
const Home = () => {
  const isAuthenticate = useAuth();
  const { BACKEND_END_POINTS } = config.constant.api;
  const { toastPopup } = config.utils.toastMessage;
  console.log(isAuthenticate);
  const [page, setPage] = useState(1);
  const containerRef = useRef(null);
  const [pins, setPins] = useState<PinType[] | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [isAuthenticateValue, setIsAuthenticatedValue] =
    useState(isAuthenticate);

  useEffect(() => {
    setIsAuthenticatedValue(isAuthenticate);
  }, [isAuthenticate]);

  const fetchPins = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BACKEND_END_POINTS.Get_ALL_PINS}?page=${page}&limit=${LIMIT}`
      );
      const resData = await res.data;
      if (resData?.data?.length) {
        const initialPins= pins ? pins : []
        const newPins = [...new Set([...initialPins, ...resData.data])];
        setPins(newPins);
        setPage((prevPage) => prevPage + 1);
      }

      setLoading(false);
      console.log("pins", resData);
    } catch (error) {
      toastPopup("Something went wrong", "error");
      setLoading(false);
    }
  };

  console.log("pins", pins);

  useEffect(() => {
    if (isAuthenticateValue) {
      fetchPins();
      dispatch(setHoverOn("homePin"));
    }
  }, []);

  const handleScroll = () => {
    // if (
    //   window.innerHeight + document.documentElement.scrollTop >=
    //   document.documentElement.scrollHeight - 30
    // ) {
    //   fetchPins();
    // }

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    console.log("scrollTop", containerRef, scrollTop);
    if (containerRef && scrollHeight - scrollTop >= clientHeight && !loading) {
      fetchPins();
    }
  };
  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

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
                  gridStyle="columns-1 gap-4 lg:gap-4 sm:columns-2 lg:columns-4 xl:columns-6"
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

export default Home;
