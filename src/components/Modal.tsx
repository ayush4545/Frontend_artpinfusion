import React from "react";
import { IoMdClose } from "react-icons/io";

import { labels } from "../config/constants/text.constant";

type Props = {
  onClose: () => void;
  children: React.ReactNode;
  isSignupPage?: boolean;
  title: string,
  showClose: boolean,
  widthHeightStyle:string
};
const Modal = (props: Props) => {
  const { onClose, children, isSignupPage ,title,showClose,widthHeightStyle} = props;
 
  return (
    <div className="w-screen h-screen bg-black/80 grid place-items-center fixed top-0 left-0 bottom-0 right-0 overflow-hidden z-50"  onClick={(e)=>{
      e.stopPropagation()
      e.preventDefault()
      onClose()
    }}
    >
      <div className={`relative ${widthHeightStyle} bg-white opacity-100 rounded-[30px] dark:bg-slate-700 z-40 pb-3 overflow-hidden`} onClick={(e)=>{
        e.stopPropagation()
      }}>
        { showClose && <IoMdClose
          className="absolute right-6 top-6 text-4xl text-black hover:bg-[#E9E9E9] rounded-full p-1 cursor-pointer "
          onClick={onClose}
        />}
        <p className="text-center text-[#000] mt-12 text-3xl  font-bold dark:text-white">
          {title}
        </p>
        {isSignupPage && (
          <p className="text-center mt-2 dark:text-white">
           {labels?.SIGN_UP_MODAL_TITLE}
          </p>
        )}
        <div className="w-full">
        {children}
        </div>
        
      </div>
    </div>
  );
};

export default Modal;
