import React, { useState } from "react";
import { MdEdit, MdOutlineFileDownload } from "react-icons/md";
import { downloadFile } from "../config/utils";
import AllPinsBoardSavePinModel from "./AllPinsBoardSavePinModel";
import config from "../config";
import axios from "axios";
import { PinType } from "../Types/types";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";

type Props={
  pinId: string
  title: string,
  setCardClicked:(val:boolean)=> void,
  imageUrl: string
}
const AllPinsBoardHoverCard = (props : Props) => {
    const {pinId,title,setCardClicked,imageUrl}=props
    const [openSaveModel,setOpenSaveModel]=useState(false)
   
  return (
    <>
      <div className="w-full h-full">
      <div className="flex items-center justify-end">
        <button
          className={`rounded-3xl px-3 py-2 text-md  font-bold cursor-pointer bg-[#FF8C00] hover:bg-[#FF5E0E] text-white tracking-wide`}
          onClick={(e)=>{
            e.stopPropagation()
            e.preventDefault()
            setOpenSaveModel(true)
            setCardClicked(true)
            // document.body.style.overflow="hidden"
          }}
        >
          Save
        </button>
      </div>

      <div className="absolute bottom-2 right-3 flex items-center gap-3">
       <div
          className=" w-8 h-8 rounded-full flex items-center justify-center bg-[#e9e9e9]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <MdEdit className="text-black text-lg"/>
        </div>
        <div
          className=" w-8 h-8 rounded-full flex items-center justify-center bg-[#e9e9e9]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            downloadFile(imageUrl,title)
          }}
        >
          <MdOutlineFileDownload className="text-black text-lg" />
        </div>
      </div>
    </div>

    {
      openSaveModel && <AllPinsBoardSavePinModel 
       onClose={()=>{
         setCardClicked(false)
        setOpenSaveModel(false)
        // document.body.style.overflow="auto"
      }}
       title="Save Pin"
       pinId={pinId}
      />
    }
    </>
    
  );
};

export default AllPinsBoardHoverCard;
