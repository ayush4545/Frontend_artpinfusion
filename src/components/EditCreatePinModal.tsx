import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Modal from "./Modal";
import config from "../config";
import { PinType } from "../Types/types";
import axios from "axios";
import Loader from "./Loader";
import { FaChevronDown } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import CreatePinChooseBoard from "./CreatePinChooseBoard";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

type Props = {
  onClose: () => void;
  title: string;
  pinId: string;
};
const EditCreatePinModal = (props: Props) => {
  const { onClose, title, pinId } = props;
  const { BACKEND_END_POINTS } = config.constant.api;
  const [pinDetails, setPinDetails] = useState<PinType | null>(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const { getCookie } = config.utils.cookies;
  const { toastPopup } = config.utils.toastMessage;
  const saveUserInRedux = config.utils.saveUserInReduxAndSetAccessToken;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticate = useAuth();
  const token=getCookie('accessToken')
  const loggedInUser=useAppSelector(state=>state.user)
  const [openBoardDropDown, setOpenBoardDropDown] = useState(false);
  const [pinInput,setPinInput]=useState({
    title:'',
    description:''
  })
  const fetchPin = async () => {
    try {
      const res = await axios.get(`${BACKEND_END_POINTS.Get_PIN}/${pinId}`);
      const resData = await res.data;
      console.log("resData", resData);
      if (resData.statusCode === 200) {
        setPinDetails(resData.data?.pin);
        setPinInput({
          title:resData.data?.pin?.title,
          description:resData.data?.pin?.description
        })
        const board=loggedInUser?.board.filter((board)=>{
          return resData.data?.pin?.boards?.some(
             (b1) => b1?._id === board?._id
           );
         })
         if(board.length){
          setSelectedBoard({
            boardName: board[0]?.boardName,
            pinImage: board[0]?.pins[0]?.imageUrl,
            pinTitle: board[0]?.pins[0]?.title,
            boardId: board[0]?._id,
          })
         }
        
      }
    } catch (error) {
      console.log("getting pin error", error);
    }
  };

  useEffect(() => {
    if (pinId) {
      fetchPin();
    }
  }, [pinId]);

  const handleInputsChange=(e)=>{
    console.log(e.target.name,e.target.value)
    setPinInput(prev=>{
      return {...prev,[e.target.name]:e.target.value}
    })
  }

  const checkingBoardChange=()=>{
    if(selectedBoard && selectedBoard?.boardId){
      
      const board=pinDetails?.boards?.filter((board)=>board?._id === selectedBoard?.boardId)
      console.log(209,board)
      if(!board?.length){
        return true
      }
      else{
        return false
      }
    }
    return false
  }

  const handleSaveDetails=async()=>{
    try {
      if (!isAuthenticate) {
        return navigate(`/`, {
          state: { isNeedToLogin: true },
        });
      }

      let body={
        title: pinInput?.title === undefined ? pinDetails?.title : pinInput?.title,
        description: pinInput?.description === undefined ? pinDetails?.description : pinInput?.description,
        boardId: selectedBoard?.boardId
      }


      console.log("dcsdcscdd",body)
    } catch (error) {
      console.log("update pin details error",error)
    }
  }
  const getModel = () => {
    return (
      <Modal
        onClose={onClose}
        title={title}
        showClose={false}
        widthHeightStyle="w-5/6 lg:w-3/6 h-auto"
      >
        {pinDetails ? (
          <div className="w-full  pt-4 h-full">
            <div
              className={`w-full h-[400px] lg:overflow-hidden  grid grid-cols-1 lg:grid-cols-3 gap-5 ${
                pinDetails?.boards?.length === 0
                  ? "lg:grid-cols-1"
                  : "lg:grid-cols-3"
              } p-4 overflow-y-auto relative`}
            >
              <div className="lg:overflow-hidden text-center w-full flex  justify-center rounded-2xl lg:col-span-1">
                <div
                  className={`bg-[#e9e9e9] overflow-hidden rounded-2xl w-full`}
                >
                  {pinDetails?.imageUrl?.includes("video") ? (
                    <video
                      autoPlay
                      loop
                      muted
                      className="w-full object-cover h-full  rounded-2xl"
                    >
                      <source src={pinDetails?.imageUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={pinDetails?.imageUrl}
                      alt={pinDetails?.title || pinDetails?.description}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  )}
                </div>
              </div>

              <div className="w-full lg:col-span-2">
                <div className="flex flex-col w-full gap-2">
                  <label htmlFor="title" className="text-sm">
                    Title
                  </label>
                  <input
                    className="outline-none border-2 border-gray-400 rounded-xl  py-2 pl-4"
                    id="title"
                    name="title"
                    placeholder="Add a title"
                    type="text"
                    value={pinInput.title}
                    onChange={handleInputsChange}
                  />
                </div>

                <div className="flex flex-col w-full gap-2 mt-3">
                  <label htmlFor="description" className="text-sm">
                    Description
                  </label>
                  <textarea
                    className="outline-none border-2 border-gray-400 rounded-xl  pl-4 md:h-28 resize-none py-2"
                    id="description"
                    name="description"
                    placeholder="Add a detailed description"
                    rows={5}
                    value={pinInput.description}
                    onChange={handleInputsChange}
                  />
                </div>

                <div className="flex flex-col w-full gap-2 mt-12 relative">
                  <p className="text-sm">Board</p>
                  <div
                    className={`border-gray-400 rounded-xl  py-2 px-4 border-2 flex items-center justify-between cursor-pointer`}
                    id="board"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenBoardDropDown((prev) => !prev);
                    }}
                  >
                    {selectedBoard ? (
                      <div className="w-full rounded-md  font-semibold flex gap-3 items-center">
                        <div className="w-7 aspect-square flex justify-center items-center bg-[#e9e9e9] rounded-lg">
                          {!selectedBoard?.pinImage?.includes("video") && (
                            <img
                              src={selectedBoard?.pinImage}
                              alt={selectedBoard?.pinTitle}
                              className="w-full aspect-square rounded-md object-cover"
                            />
                          )}
                        </div>
                        <p className="text-md font-medium">
                          {selectedBoard.boardName}
                        </p>
                      </div>
                    ) : (
                      <span>Choose a board</span>
                    )}
                    <FaChevronDown />
                  </div>

                  {openBoardDropDown && (
                    <CreatePinChooseBoard
                      setSelectedBoard={setSelectedBoard}
                      setOpenBoardDropDown={setOpenBoardDropDown}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full p-4 bg-white shadow-3xl -mb-5 mt-2">
              <button
                className="rounded-3xl px-3 py-2  font-semibold bg-[#e9e9e9]"
                onClick={onClose}
              >
                Cancel
              </button>
              <div className="flex items-center gap-5">
                <button
                  className="rounded-3xl px-3 py-2  font-semibold bg-[#e9e9e9]"
                  onClick={onClose}
                >
                  Delete
                </button>
                <button
                  className={
                    `rounded-3xl px-3 py-2 font-bold  bg-[#FF8C00] text-white ${pinInput.title === pinDetails?.title && pinInput.description === pinDetails?.description ? "opacity-70 pointer-events-none": " hover:bg-[#FF5E0E] cursor-pointer"}` 
                  }
                  onClick={handleSaveDetails}
                  disabled={pinInput.title === pinDetails?.title && pinInput.description === pinDetails?.description}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </Modal>
    );
  };
  return createPortal(getModel(), document.body);
};

export default EditCreatePinModal;
