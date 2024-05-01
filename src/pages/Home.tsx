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
import { labels } from "../config/constants/text.constant";

const LIMIT = 10;
const Home = () => {
  const isAuthenticate = useAuth();
  const { BACKEND_END_POINTS } = config.constant.api;
  const { toastPopup } = config.utils.toastMessage;
  const page = useRef<number>(1);
  const [pins, setPins] = useState<PinType[]>([]);
  const newPins = useRef<PinType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const isAllPinsComing = useRef<boolean>(false);
  const dispatch = useAppDispatch();
  const [isAuthenticateValue, setIsAuthenticatedValue] =
    useState(isAuthenticate);

  useEffect(() => {
    setIsAuthenticatedValue(isAuthenticate);
  }, [isAuthenticate]);

  const fetchPins = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_END_POINTS.Get_ALL_PINS}?page=${page?.current}&limit=${LIMIT}`
      );
      const resData = await res.data;
      if (resData?.data?.length) {
        const setOfPins = [...new Set([...newPins?.current, ...resData?.data])];
        newPins.current = setOfPins;
        setPins(setOfPins);
        page.current += 1;
      } else {
        isAllPinsComing.current = true;
      }
    } catch (error) {
      toastPopup(labels?.FETCHING_PINS_ERROR, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticateValue) {
      fetchPins();
      dispatch(setHoverOn(labels?.HOVER_ON_HOME_PIN));
    }
  }, []);

  const handleScroll = () => {
    if (
      isAuthenticateValue &&
      !isAllPinsComing.current &&
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 30
    ) {
      setLoading(true);
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
      <main className="w-screen h-auto homeSection snap-y snap-proximity relative">
        {!isAuthenticateValue ? (
          <>
            <HeroSection />
          </>
        ) : (
          <div className="w-screen absolute top-[12vh] homeSection min-h-[90%] dark:bg-[#282828] p-3">
            {pins ? (
              pins.length > 0 ? (
                <Pins
                  pins={pins}
                  gridStyle="columns-2 gap-4 lg:gap-4 sm:columns-2 lg:columns-4 xl:columns-6"
                />
              ) : (
                <h2 className="text-center font-bold text-4xl mt-10 text-gray-700">
                  {labels?.NO_PINS_FOUND}
                </h2>
              )
            ) : (
              <Loader />
            )}

            {loading && <Loader />}
          </div>
        )}
      </main>
    </>
  );
};

export default WithErrorBoundariesWrapper(Home);
