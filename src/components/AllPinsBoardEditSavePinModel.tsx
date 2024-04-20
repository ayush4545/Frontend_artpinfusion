import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Modal from "./Modal";
import config from "../config";
import { PinType } from "../Types/types";
import axios from "axios";
import Loader from "./Loader";
import { FaChevronDown } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import useAuth from "../hooks/useAuth";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
type Props = {
  onClose: () => void;
  title: string;
  pinId: string;
};

const AllPinsBoardEditSavePinModel = (props: Props) => {
  const { onClose, title, pinId } = props;
  const {state}=useLocation()
  console.log("state",state)
  const { BACKEND_END_POINTS } = config.constant.api;
  const [pinDetails, setPinDetails] = useState<PinType | null>(null);
  const [openDropDown,setOpenDropDown] = useState(false)
  const { getCookie } = config.utils.cookies;
  const { toastPopup } = config.utils.toastMessage;
  const saveUserInRedux = config.utils.saveUserInReduxAndSetAccessToken;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticate = useAuth();
  const loggedInUser=useAppSelector(state => state.user)
  const [boards,setBoards]=useState(null)
  const [selectedBoard,setSelectedBoard]=useState({
    boardName:'',
    boardId:''
  })
  const fetchPin = async () => {
    try {
      const res = await axios.get(`${BACKEND_END_POINTS.Get_PIN}/${pinId}`);
      const resData = await res.data;
      console.log("resData", resData);
      if (resData.statusCode === 200) {
        setPinDetails(resData.data?.pin);

        if(state?.boardId){
          const board=resData.data?.pin?.boards.filter((board)=>board?._id === state?.boardId)
          console.log("dfvdfv",board)
          if(board.length >0){
            setSelectedBoard({
              boardName: board[0].boardName,
              boardId: board[0]._id,
            })
          }
        }else{
          setSelectedBoard({
            boardName:resData.data?.pin?.boards[0]?.boardName,
            boardId:resData.data?.pin?.boards[0]?._id,
          })
        }

        const userBoards= loggedInUser?.board.filter((board)=>{
          return resData.data?.pin?.boards?.some(
             (b1) => b1?._id === board?._id
           );
         })
         setBoards(userBoards?.length ===0 ? null : userBoards)        
      }
    } catch (error) {
      console.log("getting pin error", error);
    }
  };
 console.log("selectedBoard",selectedBoard)
  useEffect(() => {
    if (pinId) {
      fetchPin();
    }
  }, [pinId]);



  console.log("pinDetails", pinDetails);

  const handleDelete=async()=>{
    try {
      if (!isAuthenticate) {
        return navigate(`/`, {
          state: { isNeedToLogin: true },
        });
      }

      const token = getCookie("accessToken");
      const body = {
        pinId: pinId,
        boardId: selectedBoard?.boardId === undefined ? null : selectedBoard?.boardId,
      };
      const res = await axios.post(BACKEND_END_POINTS.REMOVE_SAVE_PIN, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await res.data;
      console.log("345",resData)
      if (resData.statusCode === 200) {
        saveUserInRedux.useSaveLoginUserAndAccessToken(
          { _doc: { ...resData.data } },
          dispatch
        );
        const toastMessage =`Pin is removed from your ${selectedBoard?.boardName === undefined ? "Profile" : selectedBoard?.boardName}`;
        toastPopup(toastMessage, "success");
        onClose()
      }
    } catch (error) {
      console.log("delete pin error",error)
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
            <div className={`w-full h-[400px] lg:overflow-hidden  grid grid-cols-1 lg:grid-cols-3 gap-5 ${pinDetails?.boards?.length ===0 ? "lg:grid-cols-1" : 'lg:grid-cols-3'} p-4 overflow-y-auto relative`}>
               {
                boards && boards?.length > 0 && (
                  <div className="lg:col-span-2 w-full h-full">
                  <p>Boards</p>
                  <div className="bg-[#f1f1f1] flex items-center justify-between py-3 rounded-lg px-4 cursor-pointer mt-3" onClick={(e)=>{
                    e.preventDefault()
                    e.stopPropagation()
                      setOpenDropDown((prev)=>!prev)
                  }}>
                      <p className="text-lg font-semibold">{selectedBoard?.boardName}</p>
                      <FaChevronDown />
                  </div>
               {
                  openDropDown && (
                      <div className="w-full h-auto border-2 border-gray-200 rounded-lg overflow-hidden">
                        {
                          boards && boards?.map((board)=>{
                           return  <p className={`w-full px-4 py-2 hover:bg-[#e9e9e9] cursor-pointer font-medium ${selectedBoard?.boardName === board?.boardName && "bg-[#f6f5f5]"}`} key={board?._id}
                           onClick={(e)=>{
                            e.preventDefault()
                            e.stopPropagation()
                            setSelectedBoard({
                              boardName: board?.boardName,
                              boardId:  board?._id
                            })
                            setOpenDropDown(false)
                           }}
                           >{board?.boardName}</p>
                          })
                        }
                   </div>
                  )
               }  
              </div>
                )
               }
               <div className={`${boards && boards.length >0 ? 'lg:col-span-1': 'lg:col-span-3'} overflow-hidden text-center w-full flex  justify-center rounded-2xl`}>
                <div
                  className={`bg-[#e9e9e9] overflow-hidden rounded-2xl ${
                    boards && boards.length > 0 ? "w-full" : "w-1/3 aspect-9/16"
                  }`}
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
            </div>

            <div className="flex items-center justify-between w-full p-4 bg-white shadow-3xl -mb-5 mt-2">
                <button
                  className="rounded-3xl px-3 py-2  font-semibold bg-[#e9e9e9]"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className={
                    "rounded-3xl px-3 py-2 font-bold cursor-pointer bg-[#FF8C00] hover:bg-[#FF5E0E] text-white"
                  }
                  onClick={handleDelete}
                >
                  Delete
                </button>
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
export default WithErrorBoundariesWrapper(AllPinsBoardEditSavePinModel);
