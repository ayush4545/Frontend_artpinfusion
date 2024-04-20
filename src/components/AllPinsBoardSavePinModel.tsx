import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Modal from "./Modal";
import config from "../config";
import { PinType } from "../Types/types";
import axios from "axios";
import Loader from "./Loader";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import BoardCardWithSaveBtn from "./BoardCardWithSaveBtn";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { PiPlusBold } from "react-icons/pi";
import CreateBoardWithPin from "./CreateBoardWithPin";
import SearchBoard from "./SearchBoard";

type Props = {
  onClose: () => void;
  title: string;
  pinId: string;
};
const AllPinsBoardSavePinModel = (props: Props) => {
  const { onClose, title, pinId } = props;
  const { BACKEND_END_POINTS } = config.constant.api;
  const [pinDetails, setPinDetails] = useState<PinType | null>(null);
  const loggedInUser = useAppSelector((state) => state.user);
  const { getCookie } = config.utils.cookies;
  const { toastPopup } = config.utils.toastMessage;
  const saveUserInRedux = config.utils.saveUserInReduxAndSetAccessToken;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticate = useAuth();
  const [openCreateBoardModal, setOpenCreateBoardModel] = useState(false);
  const [showFirstModel, setShowFirstModel] = useState(true);
  const [userBoards, setUserBoards] = useState(loggedInUser?.board);
  const [modelTitle, setModelTitle] = useState("Create Board");
  const originalBoards = useRef(null);
  const [selectedBoardDetails, setSelectedBoardDetails] = useState({
    boardName: "",
    boardId: "",
  });
  console.log("345", selectedBoardDetails);
  console.log("234", loggedInUser);
  console.log("4o", userBoards);
  const fetchPin = async () => {
    try {
      const res = await axios.get(`${BACKEND_END_POINTS.Get_PIN}/${pinId}`);
      const resData = await res.data;
      console.log("resData", resData);
      if (resData.statusCode === 200) {
        setPinDetails(resData.data?.pin);
        setUserBoards((prevBoards) => {
          const filteredBoards = prevBoards?.filter((board) => {
            if (resData?.data?.pin?.boards?.length) {
              console.log(
                456,
                board,
                resData?.data?.pin?.boards,
                resData?.data?.pin?.boards?.every((b1) => b1?._id !== board._id)
              );
              return resData?.data?.pin?.boards?.every(
                (b1) => b1?._id !== board._id
              );
            }
            return true;
          });
          console.log("34523", filteredBoards);
          originalBoards.current = filteredBoards;
          return filteredBoards;
        });
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

  const handleSavePin = async (e, selectedBoardId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("selectedBoardId", e, selectedBoardId);
    console.log("selectedBoardDetails", selectedBoardDetails);

    try {
      if (!isAuthenticate) {
        return navigate(`/`, {
          state: { isNeedToLogin: true },
        });
      }

      const token = getCookie("accessToken");
      const body = {
        pinId,
        boardId: selectedBoardId,
      };

      const res = await axios.post(BACKEND_END_POINTS.SAVE_PIN, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await res.data;
      console.log(24, resData);
      if (resData.statusCode === 201) {
        saveUserInRedux.useSaveLoginUserAndAccessToken(
          { _doc: { ...resData.data } },
          dispatch
        );
        setUserBoards((prevBoards) => {
          const filteredBoards = prevBoards?.filter(
            (board) => board?._id !== selectedBoardId
          );
          console.log("34523", filteredBoards);
          return filteredBoards;
        });

        const toastMessage = `Pin is saved in your board`;
        toastPopup(toastMessage, "success");
      }
    } catch (error) {
      console.log("save pin error", error);
    }
  };
  const getModel = () => {
    return (
      <>
        {showFirstModel && (
          <Modal
            onClose={onClose}
            title={title}
            showClose={false}
            widthHeightStyle="w-5/6 lg:w-3/6 h-auto"
          >
            {pinDetails ? (
              <div className="w-full  pt-4 h-full">
                <div className="w-full h-auto max-h-[460px]  grid grid-cols-1 lg:grid-cols-3 gap-5  p-4 overflow-y-auto relative">
                  <div className="w-full lg:col-span-1 h-full">
                    {pinDetails?.boards.length > 0 && (
                      <div className=" rounded-xl p-2 text-white text-center w-1/3 lg:w-2/3 bg-orange-500 after:content-[''] left-[50%] -translate-x-[50%] mb-3 relative after:absolute after:border-[10px]  after:border-l-transparent after:border-r-transparent after:border-t-orange-500 after:border-b-transparent after:-bottom-[18px] after:left-[50%] after:-translate-x-[50%]">
                        This Pin is already saved in{" "}
                        {pinDetails?.boards[0]?.boardName}
                      </div>
                    )}
                    <div
                      className={`bg-[#e9e9e9] overflow-hidden ${
                        pinDetails?.boards?.length > 0 ? "h-5/6" : "h-full"
                      } rounded-2xl`}
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

                  <div className="lg:col-span-2 w-full h-full">
                    <SearchBoard
                      styles={
                        "outline-none border-2 border-gray-400 rounded-3xl  py-2 pl-4 w-full h-14"
                      }
                      setBoards={setUserBoards}
                      originalBoards={originalBoards}
                    />

                    <div className="mt-3 p-2">
                      <p>Other Boards</p>
                      <div className="w-full max-h-full lg:max-h-[400px] overflow-y-auto">
                        {userBoards?.length > 0 ? (
                          userBoards?.map((board) => (
                            <BoardCardWithSaveBtn
                              board={board}
                              handleSave={handleSavePin}
                              pinId={pinId}
                              setSelectedBoardDetails={setSelectedBoardDetails}
                              key={board._id}
                            />
                          ))
                        ) : (
                          <p>Their is not any board for this user.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full p-4 bg-white shadow-3xl -mb-5 mt-2">
                  <button
                    className="border-none bg-transparent flex items-center px-5 gap-4"
                    onClick={() => {
                      setShowFirstModel(false);
                      setOpenCreateBoardModel(true);
                      // onClose()
                    }}
                  >
                    <div className="w-10 h-10 rounded-md bg-[#e9e9e9] flex items-center justify-center overflow-hidden">
                      <PiPlusBold className="font-extrabold text-2xl" />
                    </div>
                    <p>Create Board</p>
                  </button>
                  <button
                    className={
                      "rounded-3xl p-3  font-bold cursor-pointer bg-[#FF8C00] hover:bg-[#FF5E0E] text-white"
                    }
                    onClick={onClose}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <Loader />
            )}
          </Modal>
        )}

        {openCreateBoardModal && (
          <Modal
            onClose={onClose}
            title={modelTitle}
            showClose={false}
            widthHeightStyle="w-5/6 lg:w-3/6 h-auto"
          >
            <CreateBoardWithPin
              pinId={pinId}
              onClose={() => {
                onClose();
                setOpenCreateBoardModel(false);
              }}
              setSelectedBoardDetails={setSelectedBoardDetails}
              setModelTitle={setModelTitle}
            />
          </Modal>
        )}
      </>
    );
  };
  return createPortal(getModel(), document.body);
};

export default AllPinsBoardSavePinModel;
