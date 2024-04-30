import React, {useState } from "react";
import { LuSettings2 } from "react-icons/lu";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { setViewOptions } from "../redux/viewOptions.slice";
import { labels } from "../config/constants/text.constant";

type Props = {
  isBoard: boolean;
  top: string;
  openViewOption: boolean;
  setOpenViewOption: (value: boolean) => void;
  setOpenCreateButtonModel?: (value: boolean) => void;
};
const ViewOption = (props: Props) => {
  const {
    isBoard,
    top,
    openViewOption,
    setOpenViewOption,
    setOpenCreateButtonModel = () => {},
  } = props;
  const selectedViewOptions = useAppSelector((state) => state.viewOption);
  const dispatch = useAppDispatch();

  return (
    <div className="relative">
      <div
        className={`w-8 lg:w-10 aspect-square rounded-full ${
          openViewOption
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "hover:bg-[#e9e9e9] dark:bg-white"
        } transition-all cursor-pointer grid place-items-center`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpenViewOption((prev) => !prev);
          if(setOpenCreateButtonModel){

            setOpenCreateButtonModel?.(false);
          }
        }}
      >
        <LuSettings2 className="font-extrabold text-xl lg:text-2xl" />
      </div>

      {openViewOption && (
        <div
          className={`absolute shadow-2xl w-44 h-auto bg-white dark:bg-[#282828] dark:shadow-white dark:border-2 dark:border-white -left[-50%] -translate-x-[50%] lg:translate-x-0 lg:-left-48 lg:-top-8 rounded-xl dark:shadow-md p-3 dark:text-white z-50`}
        >
          <p className="text-sm p-2">{labels?.VIEW_OPTIONS}</p>

          <button
            type="button"
            className={`w-full text-left rounded-md px-3 py-2  font-semibold ${
              selectedViewOptions === "standard"
                ? "bg-orange-500 text-white"
                : "hover:bg-[#e9e9e9] dark:hover:text-black"
            }`}
            onClick={() => {
              dispatch(setViewOptions(labels?.STANDARD_VALUE));
              setOpenViewOption(false);
            }}
          >
            {isBoard ? labels?.STANDARD : labels?.STANDARD}
          </button>

          <button
            type="button"
            className={`w-full text-left rounded-md px-3 py-2  font-semibold mt-2 ${
              selectedViewOptions === "compact"
                ? "bg-orange-500 text-white "
                : "hover:bg-[#e9e9e9] dark:hover:text-black"
            }`}
            onClick={() => {
              dispatch(setViewOptions(labels?.COMPACT_VALUE));
            }}
          >
            {labels?.COMPACT}
          </button>
        </div>
      )}
    </div>
  );
};

export default WithErrorBoundariesWrapper(ViewOption);
