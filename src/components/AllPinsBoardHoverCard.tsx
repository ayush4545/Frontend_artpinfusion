import React, { useState } from "react";
import { MdOutlineFileDownload, MdDelete } from "react-icons/md";
import { downloadFile } from "../config/utils";
import AllPinsBoardSavePinModel from "./AllPinsBoardSavePinModel";
import AllPinsBoardEditSavePinModel from "./AllPinsBoardEditSavePinModel";

type Props = {
  pinId: string;
  title: string;
  setCardClicked: (val: boolean) => void;
  imageUrl: string;
};
const AllPinsBoardHoverCard = (props: Props) => {
  const { pinId, title, setCardClicked, imageUrl } = props;
  const [openSaveModel, setOpenSaveModel] = useState(false);
  const [openEditModel, setOpenEditModel] = useState(false);

  return (
    <>
      <div className="w-full h-full">
        <div className="flex items-center justify-end">
          <button
            className={`rounded-3xl px-3 py-2 text-md  font-bold cursor-pointer bg-[#FF8C00] hover:bg-[#FF5E0E] text-white tracking-wide`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenSaveModel(true);
              setCardClicked(true);
              // document.body.style.overflow="hidden"
            }}
          >
            Save
          </button>
        </div>

        <div className="absolute bottom-2 right-3 flex items-center gap-3">
          <div
            title="Delete Pin"
            className=" w-8 h-8 rounded-full flex items-center justify-center bg-[#e9e9e9]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpenEditModel(true);
              setCardClicked(true);
            }}
          >
            <MdDelete className="text-black text-lg" />
          </div>
          <div
            title="Download Pin"
            className=" w-8 h-8 rounded-full flex items-center justify-center bg-[#e9e9e9]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              downloadFile(imageUrl, title);
            }}
          >
            <MdOutlineFileDownload className="text-black text-lg" />
          </div>
        </div>
      </div>

      {openSaveModel && (
        <AllPinsBoardSavePinModel
          onClose={() => {
            setCardClicked(false);
            setOpenSaveModel(false);
            // document.body.style.overflow="auto"
          }}
          title="Save Pin"
          pinId={pinId}
        />
      )}

      {openEditModel && (
        <AllPinsBoardEditSavePinModel
          title="Delete Pin"
          pinId={pinId}
          onClose={() => {
            setOpenEditModel(false);
          }}
        />
      )}
    </>
  );
};

export default AllPinsBoardHoverCard;
