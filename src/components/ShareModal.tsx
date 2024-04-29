import React from "react";
import { BsWhatsapp } from "react-icons/bs";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import { labels } from "../config/constants/text.constant";

type Props={
  onClose : ()=> void,
  leftTopStyle: string
}
const ShareModal = (props:Props) => {
   const {onClose,leftTopStyle}=props
   const whatsappWebBaseUrl="https://web.whatsapp.com/send?text="
  return (
    <div className={`w-52  shadow-2xl rounded-lg absolute border-[1px] border-gray-300 p-3 bg-white ${leftTopStyle} z-50`}>
      <p className="text-center font-semibold text-lg">Share</p>
      <div className="flex items-center gap-5 mt-5 justify-center">
        <button
          className="flex flex-col items-center gap-2"
          onClick={()=>{
            window.open(`${whatsappWebBaseUrl}${labels?.WHATSAPP_SEND_MESSAGE}%0A${window.location.href}`) 
            onClose()
          }}
        >
          <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
            <BsWhatsapp className="text-white text-3xl" />
          </div>
          <p className="text-sm">{labels?.WHATSAPP}</p>
        </button>
      </div>
    </div>
  );
};
export default WithErrorBoundariesWrapper(ShareModal);
