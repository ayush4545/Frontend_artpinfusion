import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import EditCreatePinModal from "./EditCreatePinModal";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import { labels } from "../config/constants/text.constant";

type Props = {
  pinId: string;
  setCardClicked?: React.Dispatch<React.SetStateAction<boolean>>;
};
const EditCreatePin = (props: Props) => {
  const { pinId, setCardClicked } = props;
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  return (
    <>
      <div
        title={labels?.EDIT_PIN_TITLE}
        className=" w-8 h-8 rounded-full flex items-center justify-center bg-[#e9e9e9] absolute bottom-3 right-3"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpenEditModal(true);
          setCardClicked?.(true);
        }}
      >
        <MdEdit className="text-black text-lg" />
      </div>
      {openEditModal && (
        <EditCreatePinModal
          onClose={() => {
            setCardClicked?.(false);
            setOpenEditModal(false);
          }}
          pinId={pinId}
          title={labels?.EDIT_PIN_TITLE}
        />
      )}
    </>
  );
};

export default WithErrorBoundariesWrapper(EditCreatePin);
