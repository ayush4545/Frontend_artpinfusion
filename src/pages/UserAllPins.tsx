import React, { Suspense, lazy, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CreateBoardPinButton from "../components/CreateBoardPinButton";
import axios from "axios";
import config from "../config";
import { setHoverOn } from "../redux/hoverOn.slice";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import Loader from "../components/Loader";
import { WithErrorBoundariesWrapper } from "../components/WithErrorBoundaries";
import ViewOption from "../components/ViewOption";
const Pins = lazy(() => import("../components/Pins"));

const UserAllPins = () => {
  const {
    state: { userId },
  } = useLocation();
  const { BACKEND_END_POINTS } = config.constant.api;
  const [pins, setPins] = useState([]);
  const loggedInUser = useAppSelector((state) => state.user);
  const selectedViewOptions = useAppSelector((state) => state.viewOption);
  const dispatch = useAppDispatch();
  const fetchSavedPins = async () => {
    const res = await axios.get(
      `${BACKEND_END_POINTS.GET_SAVED_PINS}/${userId}`
    );
    const resData = await res.data;
    if (resData.statusCode === 200) {
      setPins(resData.data);
      if (userId === loggedInUser?._id) {
        dispatch(setHoverOn("allPins"));
      } else {
        dispatch(setHoverOn("homePin"));
      }
    }
  };
  useEffect(() => {
    if (userId) {
      fetchSavedPins();
    }
  }, [userId]);

  return (
    <div className="w-screen absolute top-[12vh]   -z-10">
      <div className="fixed w-full h-20 top-[12vh] left-0  pr-3 z-50 bg-white dark:bg-[#282828] flex items-center">
        <p className="text-xl lg:text-2xl text-center flex-1 font-semibold absolute left-[50%] -translate-x-[50%] dark:text-white">
          All Pins
        </p>
        {userId === loggedInUser?._id && (
          <div className="flex items-center gap-3 absolute right-3 pr-2">
            <ViewOption isBoard={false} top="-top-8" />
            <CreateBoardPinButton showBoard={false} top="-top-8" />
          </div>
        )}
      </div>
      <div className="absolute  w-full px-4 top-20 dark:bg-[#282828]">
        {pins && pins?.length > 0 ? (
          <div className="mt-5 w-full dark:bg-[#282828]">
            <Suspense fallback={<Loader />}>
              <Pins
                pins={pins}
                gridStyle={
                  selectedViewOptions === "standard"
                    ? "columns-2 gap-4 lg:gap-4 sm:columns-2 lg:columns-4 xl:columns-6"
                    : "columns-2 gap-4 lg:gap-4 sm:columns-4 lg:columns-6 xl:columns-8"
                }
              />
            </Suspense>
          </div>
        ) : (
          <p className="text-center text-gray-400 dark:text-white">
            There aren’t any Pins saved yet
          </p>
        )}
      </div>
    </div>
  );
};

export default WithErrorBoundariesWrapper(UserAllPins);
