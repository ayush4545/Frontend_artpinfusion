import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import axios from "axios";
import config from "../config";
import { PinType, UserState } from "../Types/types";
import FollowersOrFollowing from "../components/FollowersOrFollowing";
import Pins from "../components/Pins";
import { createPortal } from "react-dom";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import { setHoverOn } from "../redux/hoverOn.slice";
import {WithErrorBoundariesWrapper} from "../components/WithErrorBoundaries";
import { PiPlusBold } from "react-icons/pi";
import ViewOption from "../components/ViewOption";
type BoardData = {
  boardName: string;
  creatorBy: UserState;
  pins: PinType[];
  _id: string;
  description?:string
};
const BoardDetails = () => {
  const { state ,pathname} = useLocation();
  const {routePaths} = config.constant.routes
  const loggedInUser = useAppSelector((state) => state.user);
  const dispatch=useAppDispatch()   
  const [openPinsModel, setOpenPinsModel] = useState(false);
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const { BACKEND_END_POINTS } = config.constant.api;
  const [openFollowersModel, setOpenFollowersModel] = useState(false);
  const navigate=useNavigate()
  const selectedViewOptions=useAppSelector(state=>state.viewOption)
  console.log("board state", state,pathname);

  const fetchBoardDetails = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_END_POINTS.GET_BOARD}/${state?.boardId}`
      );
      const resData = await res.data;

      if (resData.statusCode === 200) {
        const { boardName, creatorBy, pins, _id, description=''} = resData.data;
        setBoardData({ boardName, creatorBy, pins, _id,description });
        if(pathname.includes(loggedInUser?.username)){
          dispatch(setHoverOn("allPins"))
        }else{
          dispatch(setHoverOn("homePin"))
        }
      }
      console.log("boardData", resData);
    } catch (error) {
      console.log("board details error", error);
    }
  };
  useEffect(() => {
    if (loggedInUser && state && state?.openPinsModel) {
      setOpenPinsModel(true);
    } else {
      setOpenPinsModel(false);
    }

    if (state && state?.boardId) {
      fetchBoardDetails();
    }
    // return ()={}
  }, [state]);
  return (
    <>
  
    <div className="w-screen absolute top-[12vh] dark:bg-[#282828] p-5 -z-10">
      {boardData ? (
        <>
          <div className="w-full h-auto flex flex-col items-center gap-3">
            <div className="relative">
              <p className="text-[32px] font-bold text-wrap min-w-8 max-w-96 whitespace-break-spaces overflow-hidden text-center flex items-end gap-2 dark:text-white">
                {boardData?.boardName}
                <span className="w-8 h-8 rounded-full  p-2 flex-1 bg-[#e9e9e9] hover:bg-[#d2d1d1] flex items-center justify-center  cursor-pointer dark:text-black">
                  <BsThreeDots className="text-xl" />
                </span>
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Link to={`/${boardData?.creatorBy?.username}`}>
                <img
                  src={boardData?.creatorBy?.avatar}
                  alt={boardData?.creatorBy?.name}
                  className="w-14 aspect-square rounded-full object-cover"
                />
              </Link>

            {
              boardData?.description && (
                <p className="mt-2 dark:text-white">{boardData?.description}</p>
              )
            }  

              {boardData?.creatorBy?._id !== loggedInUser?._id && (
                <>
                  <p className="font-semibold text-md mt-2 dark:text-white">
                    {boardData?.creatorBy?.name}
                  </p>
                  <p
                    className="font-semibold text-md mt-3"
                    onClick={() => {
                      setOpenFollowersModel(true);
                    }}
                  >
                    {boardData?.creatorBy?.followers.length} followers
                  </p>

                  <button className="bg-[#E9E9E9] hover:bg-[#dad9d9]  rounded-[20px] p-2 px-4 mr-2 font-semibold mt-5">
                    Share
                  </button>
                </>
              )}
            </div>
          </div>

          {boardData?.creatorBy?._id === loggedInUser?._id && (
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold my-5 dark:text-white">
              {boardData?.pins?.length} pins
             </p>
             <ViewOption isBoard={true} top="-top-16" />
            </div>
            
          )}

          {/* show pins */}
          {boardData?.pins?.length > 0 ? (
            <div className="mt-5 w-full">
              <Pins
                pins={boardData?.pins}
                gridStyle={selectedViewOptions ==="standard" ?"columns-1 gap-4 lg:gap-4 sm:columns-2 lg:columns-4 xl:columns-6" : "columns-2 gap-4 lg:gap-4 sm:columns-4 lg:columns-6 xl:columns-8" }
              />
            </div>
          ) : (
            <p className="text-center text-gray-400">
              There aren’t any Pins on
              <span className="font-semibold mx-1">{boardData?.boardName}</span>
              yet
            </p>
          )}
        </>
      ) : (
        <p className="text-center text-3xl text-bold">Loading...</p>
      )}

      {/* show pins to save in board */}
      {openPinsModel && (
        <BoardPinsModel onClose={() => setOpenPinsModel(false)} boardId={boardData?._id}/>
      )}

      {/* show followers model */}
      {boardData &&
        boardData?.creatorBy?.followers.length > 0 &&
        openFollowersModel && (
          <FollowersOrFollowing
            title={"followers"}
            onClose={() => setOpenFollowersModel(false)}
            users={boardData?.creatorBy?.followers}
          />
        )}
    </div>
    
    <div className="fixed bottom-5 left-[50%] -translate-x-[50%] w-14 h-14 rounded-full bg-white shadow-3xl flex items-center justify-center cursor-pointer" onClick={()=>{
      navigate(routePaths?.CREATE_PIN)
    }}>
      <PiPlusBold className="text-3xl"/>
    </div>
    </>
  );
};

type Props = {
  onClose: () => void;
  boardId:string
};
const BoardPinsModel = (props: Props) => {
  const { onClose,boardId } = props;
  const { BACKEND_END_POINTS } = config.constant.api;
  const [pins, setPins] = useState<PinType[]>([]);

  const removeDuplicates = (array: PinType[], key: string) => {
    const uniqueKeys: any = {};
    return array.filter((item) => {
      if (!uniqueKeys[item[key]]) {
        uniqueKeys[item[key]] = true;
        return true;
      }
      return false;
    });
  };

  const fetchPins = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_END_POINTS.Get_ALL_PINS}?page=${1}&limit=${5}`
      );
      const resData = await res.data;
      if (resData?.data?.length) {
        const newPins = removeDuplicates([...pins, ...resData.data], "_id");
        console.log("newPins", newPins);
        setPins(newPins);
      }
      console.log("pins for board-->", resData);
    } catch (error) {
      console.log("board pins model error", error);
    }
  };
  useEffect(() => {
    fetchPins();
  }, []);

  const boardPinsModel = () => {
    return (
      <Modal
        title="Save some pins to your new board"
        onClose={onClose}
        showClose={false}
        widthHeightStyle="w-2/3"
      >
        {pins.length > 0 ? (
          <div className="w-full mt-3 px-3 py-2 h-full">
            <Pins
              pins={pins}
              gridStyle="columns-1 gap-4 lg:gap-4 sm:columns-2 lg:columns-3 xl:columns-4  max-h-[400px] bg-white overflow-scroll"
              boardId={boardId}
            />
            <div className="flex items-center justify-end  py-3 px-5">
              <button
                className="bg-[#FF8C00] hover:bg-[#FF5E0E] text-white rounded-[20px] p-2 px-4"
                onClick={() => {
                  onClose();
                }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </Modal>
    );
  };
  return createPortal(boardPinsModel(), document.body);
};

export default WithErrorBoundariesWrapper(BoardDetails);
