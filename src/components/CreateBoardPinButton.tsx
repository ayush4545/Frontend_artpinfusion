import React, { useEffect, useState } from "react";
import { PiPlusBold } from "react-icons/pi";
import config from "../config";
import { Link } from "react-router-dom";
import BoardModel from "./BoardModel";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";

type Props={
  showBoard:boolean,
  top:string
}
const CreateBoardPinButton = ({showBoard,top}:Props) => {
  const { routePaths } = config.constant.routes;
  const [open, setOpen] = useState<boolean>(false);
  const [openBoard, setOpenBoard] = useState(false);
  const handleWindowClick=(e)=>{
    console.log("window clicked",e)
    setOpen(false)
   }
 
   useEffect(()=>{
     
     window.addEventListener("click",handleWindowClick)
 
     return ()=>{
       window.removeEventListener("click",handleWindowClick)
     }
   },[])
  return (
    <>
      <div className="relative">
        <div
          className={`w-12 aspect-square rounded-full ${
            open
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "hover:bg-[#e9e9e9] dark:bg-white"
          } transition-all cursor-pointer grid place-items-center`}
          onClick={(e) =>{
            e.preventDefault()
              e.stopPropagation()
             setOpen((prev) => !prev)
            }}
        >
          <PiPlusBold className="font-extrabold text-3xl" />
        </div>

        {open && (
          <div className={`absolute shadow-2xl w-44 h-auto bg-white dark:bg-[#282828] dark:shadow-white dark:border-2 dark:border-white -left[-50%] -translate-x-[50%] lg:translate-x-0 lg:-left-48 md:top-0 lg:${top} rounded-xl dark:shadow-md p-3 dark:text-white z-10`}>
            <p className="text-sm p-2">Create</p>

            <Link to={routePaths.CREATE_PIN} className="-mt-2">
              <div className="w-full rounded-md px-3 py-2 hover:bg-[#e9e9e9] font-semibold">
                Pin
              </div>
            </Link>
            {
              showBoard && (
                <button
                className="w-full rounded-md px-3 py-2 hover:bg-[#e9e9e9] text-left font-semibold"
                onClick={() => {
                  setOpenBoard(true);
                }}
              >
                Board
              </button>
              )
            }
           
          </div>
        )}
      </div>
      {openBoard && (
        <BoardModel
          title="Create Board"
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
