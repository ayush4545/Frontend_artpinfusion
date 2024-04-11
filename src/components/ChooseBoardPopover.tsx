import React, { ReactEventHandler, useEffect, useState } from "react";
import { RxCountdownTimer } from "react-icons/rx";
import { PiPlusBold } from "react-icons/pi";
import { BoardType, PinType } from "../Types/types";
import BoardModel from "./BoardModel";
import BoardCardWithSaveBtn from "./BoardCardWithSaveBtn";
type Props = {
  boards?: {
    boardName: string;
    pins: PinType[];
    _id: string;
    creatorBy: string;
  }[];
  handleSave?: (e: ReactEventHandler, selectedBoardId: string) => void;
  setSelectedBoardDetails?: (name: string) => void;
  pinId?: string;
  handleOpenCreateBoardModelAndclosePopOver?:()=>void
};
const ChooseBoardPopover = (props: Props) => {
  const { boards, handleSave, setSelectedBoardDetails, pinId ,handleOpenCreateBoardModelAndclosePopOver} = props;
  return (
    <>
    <div
      className="w-80 h-96 rounded-lg z-50 p-2 px-3 shadow-lg bg-white text-black relative overflow-hidden"
      id="chooseBoardPopover"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <p className="text-lg font-bold text-center my-5">Save</p>
      <div className="mt-2">
        <p className="text-sm font-medium text-[#313131] px-2">
          Quick save and organize later
        </p>
        <div
          className="hover:bg-[#dddcdc] p-2 flex items-center justify-between rounded-md mt-2"
          onClick={(e) => {
            setSelectedBoardDetails({
              boardName:"Profile",
              boardId: null
            });
            handleSave(e);
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-[#e9e9e9] flex items-center justify-center">
              <RxCountdownTimer />
            </div>
            <p>Profile</p>
          </div>
          <button className="bg-[#FF8C00] hover:bg-[#FF5E0E] text-white rounded-[20px] p-2 px-4">
            Save
          </button>
        </div>
      </div>

      <div className="mt-2 h-[40%] overflow-y-auto">
        <p className="text-sm font-medium text-[#313131] px-2">Save to board</p>
        {boards &&
          boards?.length > 0 &&
          boards.map((board) => (
            <BoardCardWithSaveBtn
              board={board}
              key={board?._id}
              handleSave={handleSave}
              setSelectedBoardDetails={setSelectedBoardDetails}
              pinId={pinId}
            />
          ))}
      </div>

      <div className="absolute w-[100%] bottom-0 left-0 right-1 h-[15%] flex items-center px-5 gap-4 hover:bg-[#dddcdc] shadow-3xl" onClick={()=>{
        handleOpenCreateBoardModelAndclosePopOver()
      }}>
        <div className="w-10 h-10 rounded-md bg-[#e9e9e9] flex items-center justify-center overflow-hidden">
          <PiPlusBold className="font-extrabold text-2xl" />
        </div>
        <p>Create Board</p>
      </div>
    </div>
    </>
    
  );
};


export default ChooseBoardPopover;
