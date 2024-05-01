import React, { useState } from "react";
import { MdOutlineFileDownload, MdDelete } from "react-icons/md";
import { downloadFile } from "../config/utils";
import AllPinsBoardSavePinModel from "./AllPinsBoardSavePinModel";
import AllPinsBoardEditSavePinModel from "./AllPinsBoardEditSavePinModel";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import { labels } from "../config/constants/text.constant";

type Props = {
  pinId: string;
  title: string;
  setCardClicked: React.Dispatch<React.SetStateAction<boolean>>;
  imageUrl: string;
};
const AllPinsBoardHoverCard = (props: Props) => {
  const { pinId, title, setCardClicked, imageUrl } = props;
  const [openSaveModel, setOpenSaveModel] = useState<boolean>(false);
  const [openEditModel, setOpenEditModel] = useState<boolean>(false);

  return (
    <>
      <div className="w-full h-full">
        <div className="flex items-center justify-end">
          <button
            className={`rounded-3xl px-3 py-2 text-md  font-bold cursor-pointer bg-[#FF8C00] hover:bg-[#FF5E0E] text-white tracking-wide`}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenSaveModel(true);
              setCardClicked(true);
            }}
          >
            {labels?.SAVE}
          </button>
        </div>

        <div className="absolute bottom-2 right-3 flex items-center gap-3">
          <div
            title={labels?.DELETE_PIN}
            className=" w-8 h-8 rounded-full flex items-center justify-center bg-[#e9e9e9]"
            onClick={(e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              e.preventDefault();
              e.stopPropagation();
              setOpenEditModel(true);
              setCardClicked(true);
            }}
          >
            <MdDelete className="text-black text-lg" />
          </div>
          <div
            title={labels?.DOWNLOAD_PIN}
            className=" w-8 h-8 rounded-full flex items-center justify-center bg-[#e9e9e9]"
            onClick={(e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
          }}
          title={labels?.SAVE_PIN}
          pinId={pinId}
        />
      )}

      {openEditModel && (
        <AllPinsBoardEditSavePinModel
          title={labels?.DELETE_PIN}
          pinId={pinId}
          onClose={() => {
            setCardClicked(false);
            setOpenEditModel(false);
          }}
        />
      )}
    </>
  );
};

export default WithErrorBoundariesWrapper(AllPinsBoardHoverCard);
