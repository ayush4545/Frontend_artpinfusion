import React, { useState } from "react";
import Modal from "./Modal";
import { createPortal } from "react-dom";
import config from "../config";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import { labels } from "../config/constants/text.constant";

type Props = {
  onClose: () => void;
  boardName: string;
  description?: string;
  boardId: string;
  setBoardName: (boardName:string) => void
};
const EditBoardPopup = (props: Props) => {
  const { onClose, boardName, description = "", boardId,setBoardName } = props;
  const { getCookie } = config.utils.cookies;
  const { BACKEND_END_POINTS } = config.constant.api;
  const isAuthenticate = useAuth();
  const navigate = useNavigate();
  const saveUserInRedux = config.utils.saveUserInReduxAndSetAccessToken;
  const dispatch= useDispatch()
  const [isDoneBtnClicked,setIsDoneBtnClicked]=useState(false)
  const token = getCookie("accessToken");
  const [inputs, setInputs] = useState({
    boardName: boardName,
    description: description,
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateDetails = async () => {
    try {
      if (!isAuthenticate) {
        return navigate(`/`, {
          state: { isNeedToLogin: true },
        });
      }
      setIsDoneBtnClicked(true)
      
      const res = await axios.put(
        `${BACKEND_END_POINTS?.UPDATE_BOARD_DETAILS}/${boardId}`,
        inputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resData=await res.data
      if(resData.statusCode === 201){
        saveUserInRedux.useSaveLoginUserAndAccessToken( { _doc: { ...resData.data } },dispatch)
        setBoardName(inputs.boardName);
        setIsDoneBtnClicked(false)
        onClose()
      }
      
    } catch (error) {
    
      setIsDoneBtnClicked(false)
    }
  };

  const handleDeleteBoard=async()=>{
   try {
    if (!isAuthenticate) {
      return navigate(`/`, {
        state: { isNeedToLogin: true },
      });
    }

    const res=await axios.delete(`${BACKEND_END_POINTS.DELETE_BOARD}/${boardId}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const resData=await res.data
    if(resData?.statusCode === 200){
        saveUserInRedux.useSaveLoginUserAndAccessToken( { _doc: { ...resData.data } },dispatch)
        onClose()
        window.location.reload()
    }
    
   } catch (error) {
     console.log("delete board error",error)
   }
  }
  const getEditBoardModel = () => {
    return (
      <Modal
        onClose={onClose}
        title="Edit your board"
        showClose={true}
        widthHeightStyle="w-2/3 lg:w-1/3 h-4/6"
      >
        <div className="w-full flex item-center flex-col p-10">
          <div className="flex flex-col  gap-2">
            <label htmlFor="boardName" className="text-sm">
              {labels?.NAME}
            </label>
            <input
              className="outline-none border-2 border-gray-400 rounded-xl  py-2 pl-4"
              id="boardName"
              name="boardName"
              placeholder={labels?.NAME}
              type="text"
              value={inputs?.boardName}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col  gap-2 mt-8">
            <label htmlFor="description" className="text-sm">
              {labels?.DESCRIPTION}
            </label>
            <textarea
              className="outline-none border-2 border-gray-400 rounded-xl  pl-4 md:h-28 resize-none py-2"
              id="description"
              name="description"
              placeholder={labels?.DESCRIPTION_BOARD_PLACEHOLDER}
              rows={5}
              value={inputs?.description}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="absolute bottom-0 shadow-2xl w-full flex items-center justify-between py-4 px-3 border-t-2 border-gray-300">
           <button className="rounded-3xl px-3 py-2  font-semibold bg-[#e9e9e9]" onClick={handleDeleteBoard}>
              {labels?.DELETE_BOARD}
            </button>
          <button
            className={`bg-[#FF8C00]  text-white rounded-[20px] p-2 px-4 ${
              (boardName === inputs?.boardName &&
              description === inputs?.description) || isDoneBtnClicked
                ? "opacity-50"
                : "opacity-100 hover:bg-[#FF5E0E]"
            }`}
            onClick={handleUpdateDetails}
            disabled={
              (boardName === inputs?.boardName &&
              description === inputs?.description)
              || isDoneBtnClicked
            }
          >
            {labels?.DONE}
          </button>
        </div>
      </Modal>
    );
  };
  return createPortal(getEditBoardModel(), document.body);
};

export default WithErrorBoundariesWrapper(EditBoardPopup);
