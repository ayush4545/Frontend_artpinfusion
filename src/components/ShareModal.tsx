import React from "react";
import { BsWhatsapp } from "react-icons/bs";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";

type Props={
  onClose : ()=> void,
  leftTopStyle: string
}
const ShareModal = (props:Props) => {
   const {onClose,leftTopStyle}=props
  return (
    <div className={`w-52  shadow-2xl rounded-lg absolute border-[1px] border-gray-300 p-3 bg-white ${leftTopStyle} z-50`}>
      <p className="text-center font-semibold text-lg">Share</p>
      <div className="flex items-center gap-5 mt-5 justify-center">
        <button
          className="flex flex-col items-center gap-2"
          onClick={()=>{
            window.open(`https://web.whatsapp.com/send?text=I found some funny pins for you in PinIt!%0A${window.location.href}`) 
            onClose()
          }}
        >
          <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
            <BsWhatsapp className="text-white text-3xl" />
          </div>
          <p className="text-sm">Whatsapp</p>
        </button>

        {/* <div className="flex flex-col items-center gap-2" onClick={handleCopyLink}>
            <div className="bg-[#e9e9e9] w-12 h-12 rounded-full flex items-center justify-center">
                <GrLink className="text-xl"/>
            </div>
            <p className="text-sm">{isLinkCopy ?'Link copied' : 'Copy link'}</p>
        </div> */}
      </div>
    </div>
  );
};
export default WithErrorBoundariesWrapper(ShareModal);
