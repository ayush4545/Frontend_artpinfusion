import React, { useEffect, useState } from "react";
import { PiPlusBold } from "react-icons/pi";
import config from "../config";
import { Link } from "react-router-dom";
import BoardModel from "./BoardModel";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import { labels } from "../config/constants/text.constant";

type Props = {
  showBoard: boolean;
  top: string;
};
const CreateBoardPinButton = ({ showBoard, top }: Props) => {
  const { routePaths } = config.constant.routes;
  const [open, setOpen] = useState<boolean>(false);
  const [openBoard, setOpenBoard] = useState(false);
  const handleWindowClick = () => {
    setOpen(false);
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);
  return (
    <>
      <div className="relative">
        <div
          className={`w-8 lg:w-10 aspect-square rounded-full ${
            open
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "hover:bg-[#e9e9e9] dark:bg-white"
          } transition-all cursor-pointer grid place-items-center`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
        >
          <PiPlusBold className="font-extrabold text-xl lg:text-2xl" />
        </div>

        {open && (
          <div
            className={`absolute shadow-2xl w-44 h-auto bg-white dark:bg-[#282828] dark:shadow-white dark:border-2 dark:border-white -left[-50%] -translate-x-[50%] lg:translate-x-0 lg:-left-48 md:top-0 lg:${top} rounded-xl dark:shadow-md p-3 dark:text-white z-10`}
          >
            <p className="text-sm p-2">{labels?.CREATE}</p>

            <Link to={routePaths.CREATE_PIN} className="-mt-2">
              <div className="w-full rounded-md px-3 py-2 hover:bg-[#e9e9e9] font-semibold dark:hover:text-black">
                {labels?.PIN}
              </div>
            </Link>
            {showBoard && (
              <button
                className="w-full rounded-md px-3 py-2 hover:bg-[#e9e9e9] text-left font-semibold dark:hover:text-black"
                onClick={() => {
                  setOpenBoard(true);
                }}
              >
                {labels?.BOARD}
              </button>
            )}
          </div>
        )}
      </div>
      {openBoard && (
        <BoardModel
          title={labels?.CREATE_BOARD}
          onClose={() => {
            setOpenBoard(false);
          }}
          isSavedButtonModel={false}
          isNeedToNavigateBoardDetails={true}
        />
      )}
    </>
  );
};

export default WithErrorBoundariesWrapper(CreateBoardPinButton);
