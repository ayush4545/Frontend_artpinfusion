import React, { useEffect, useState } from "react";
import config from "../config";
import axios from "axios";
import { PinType } from "../Types/types";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useAppDispatch } from "../hooks/reduxHooks";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import ErrorImage from "../assets/404Page.gif"
type Props = {
  pinId: string;
  setSelectedBoardDetails : ({
    boardName,
    boardId
  }:{boardName:string,boardId:string})=> void;
  onClose: () => void;
  setModelTitle : (boardName:string)=> void
};
const CreateBoardWithPin = (props: Props) => {
  const { pinId, setSelectedBoardDetails, onClose,setModelTitle } = props;
  console.log("pinId", pinId);
  const { BACKEND_END_POINTS } = config.constant.api;
  const { getCookie } = config.utils.cookies;
  const saveUserInRedux = config.utils.saveUserInReduxAndSetAccessToken;
  const [pinDetails, setPinDetails] = useState<PinType | null>(null);
  const isAuthenticate = useAuth();
  const token = getCookie("accessToken");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isPinSaved, setIsPinSaved] = useState(false);
  const [boardDetails, setBoardDetails] = useState({
    boardName: "",
    description: "",
  });

  const fetchPin = async () => {
    try {
      const res = await axios.get(`${BACKEND_END_POINTS.Get_PIN}/${pinId}`);
      const resData = await res.data;
      console.log("resData", resData);
      if (resData.statusCode === 200) {
        setPinDetails(resData.data?.pin);
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

  const handleChange = (e) => {
    setBoardDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateBoardWithPin = async () => {

    if (!isAuthenticate) {
      return navigate(`/`, {
        state: { isNeedToLogin: true },
      });
    }
    try {
      const res = await axios.post(
        BACKEND_END_POINTS.CREATE_BOARD,
        { boardName: boardDetails?.boardName, pinId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resData = await res.data;
      if (resData.statusCode === 201) {
        saveUserInRedux.useSaveLoginUserAndAccessToken(resData.data, dispatch);
        console.log("user after board create", resData.data);
        setSelectedBoardDetails({
          boardName: boardDetails?.boardName,
          boardId: resData?.data?.boardId,
        });
        setIsPinSaved(true)
        setModelTitle("Board Created")
        setTimeout(()=>{

          onClose();
        },2000)
      }
      console.log("board", resData);
    } catch (error) {
      console.log("create board error", error);
    }
  };
  return (
    <div className="relative w-full  pt-4 h-full">
      {isPinSaved ? (
        <div className="w-full h-96 overflow-y-hidden">
            <div className="w-full rounded-2xl  pinAnimate overflow-hidden">
              {pinDetails?.imageUrl.includes("video") ? (
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
                  onError={(e)=>{
                    e.target.src=ErrorImage
                   }}
                  alt={pinDetails?.title || pinDetails?.description}
                  className="w-full h-full object-cover rounded-2xl"
                />
              )}
            </div>
            <p className="text-4xl font-bold relative top-28 text-center pinSavedAnimation">You saved this pin to {boardDetails?.boardName}</p>
        </div>
      ) : (
        <>
          <div className="w-full  h-auto max-h-[400px] overflow-y-scroll grid grid-cols-1 lg:grid-cols-3 gap-5  p-4 overflow-hidden">
            <div className="w-full rounded-2xl bg-[#e9e9e9] overflow-hidden lg:col-span-1">
              {pinDetails?.imageUrl.includes("video") ? (
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
                  onError={(e)=>{
                    e.target.src=ErrorImage
                   }}
                  alt={pinDetails?.title || pinDetails?.description}
                  className="w-full h-full object-cover rounded-2xl"
                />
              )}
            </div>
            <div className="w-full lg:col-span-2">
              <div className="flex flex-col  gap-2">
                <label htmlFor="boardName" className="text-sm">
                  Name
                </label>
                <input
                  className="outline-none border-2 border-gray-400 rounded-xl  py-2 pl-4"
                  id="boardName"
                  name="boardName"
                  placeholder="Name"
                  type="text"
                  value={boardDetails?.boardName}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col  gap-2 mt-8">
                <label htmlFor="description" className="text-sm">
                  Description
                </label>
                <textarea
                  className="outline-none border-2 border-gray-400 rounded-xl  pl-4 md:h-28 resize-none py-2"
                  id="description"
                  name="description"
                  placeholder="What's your board about"
                  rows={5}
                  value={boardDetails?.description}
                  onChange={handleChange}
                />
              </div>
              {pinDetails?.user && (
                <div className=" mt-3">
                  <p className="capitalize text-sm text-[#282828] font-medium">
                    pin created by
                  </p>
                  <Link
                    to={`/${pinDetails?.user?.username}`}
                    state={pinDetails?.user?._id}
                    className="flex items-center gap-4 mt-3"
                  >
                    <div className="w-10 aspect-square rounded-full flex items-center justify-center overflow-hidden">
                      {pinDetails?.user?.avatar &&
                      pinDetails?.user?.avatar?.length > 10 ? (
                        <img
                          src={pinDetails?.user?.avatar}
                          onError={(e)=>{
                            e.target.src=ErrorImage
                           }}
                          alt={pinDetails?.user?.name}
                          className="w-10 h-full rounded-full object-cover"
                        />
                      ) : (
                        <p className="text-lg">
                          {pinDetails?.user?.name?.toUpperCase()[0]}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-semibold">
                        {pinDetails?.user?.name}
                      </p>
                      <p className="text-[12px] font-normal">
                        {pinDetails?.user?.username}
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between w-full p-4 bg-white shadow-3xl -mb-5 mt-2">
            <button
              className="rounded-3xl p-3  font-bold bg-[#e9e9e9]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`rounded-3xl p-3  font-bold ${
                boardDetails?.boardName === ""
                  ? " pointer-events-none bg-[#e9e9e9] text-[#767676]"
                  : "cursor-pointer bg-[#FF8C00] hover:bg-[#FF5E0E] text-white"
              }`}
              disabled={boardDetails?.boardName === ""}
              onClick={handleCreateBoardWithPin}
            >
              Create
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WithErrorBoundariesWrapper(CreateBoardWithPin);
