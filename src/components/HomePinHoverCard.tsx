import React, { useEffect, useState } from "react";
import { MdOutlineArrowOutward, MdOutlineFileDownload } from "react-icons/md";
import downloadFile from "../config/utils/downloadFile";
import { RiUnpinFill } from "react-icons/ri";
import { BsFillPinAngleFill } from "react-icons/bs";
import ShowBoardName from "./ShowBoardName";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import BoardModel from "./BoardModel";
import ChooseBoardPopover from "./ChooseBoardPopover";
import { useNavigate } from "react-router-dom";
import config from "../config";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";


const HomePinHoverCard = (props) => {
  const { boardId, setCardClicked, _id, boards, link, user, title, imageUrl } =
    props;
  const { BACKEND_END_POINTS } = config.constant.api;
  const { getCookie } = config.utils.cookies;
  const { toastPopup } = config.utils.toastMessage;
  const saveUserInRedux = config.utils.saveUserInReduxAndSetAccessToken;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticate = useAuth();
  const loggedInUser = useAppSelector((state) => state.user);
  const [openCreateBoardModel, setOpenCreateBoardModel] = useState(false);
  const [openBoardPopover, setOpenBoardPopover] = useState(false);
  const [selectedBoardDetails, setSelectedBoardDetails] = useState({
    boardName: "Profile",
    boardId: null,
  });
  const [isPinSaved, setIsPinSaved] = useState<boolean>(false);
  
  useEffect(() => {
    if (loggedInUser?.savedPins?.length > 0) {
      setIsPinSaved(() => {
        const index = loggedInUser?.savedPins
          ?.map((pin) => pin?._id)
          .indexOf(_id);
        if (index !== -1) {
          return true;
        }
        return false;
      });
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (isPinSaved) {
      console.log(1000,boards, loggedInUser?.board)
      if (boards && boards?.length > 0) {
        const board = loggedInUser?.board.filter((board)=>{
         return boards?.some(
            (b1) => b1?._id === board?._id
          );
        })
        console.log("if me arha hboard id wala",board);
        if(board.length > 0){
         setSelectedBoardDetails({
          boardName: board[0]?.boardName,
          boardId: board[0]?._id,
        });
        }else{
          setSelectedBoardDetails({
            boardName: "Profile",
            boardId: null,
          });
        }
      }
    } else {
      setSelectedBoardDetails({
        boardName: "Profile",
        boardId: null,
      });
    }
  }, [isPinSaved, boards]);
  console.log("209",selectedBoardDetails)

  const handleWindowClick = (e) => {
    setOpenBoardPopover(false);
    setCardClicked(false);
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const handleSavePin = async (e, selectedBoardId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("selectedBoardId", e, selectedBoardId);
    console.log("selectedBoardDetails", selectedBoardDetails);
    // return
    try {
      if (!isAuthenticate) {
        return navigate(`/`, {
          state: { isNeedToLogin: true },
        });
      }

      const token = getCookie("accessToken");
      const id = boardId ? boardId : selectedBoardId;
      console.log("hello ji", id);
      if (!isPinSaved) {
        const body = {
          pinId: _id,
          boardId: id,
        };
        const res = await axios.post(BACKEND_END_POINTS.SAVE_PIN, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const resData = await res.data;
        console.log(24,resData)
        if (resData.statusCode === 201) {
          saveUserInRedux.useSaveLoginUserAndAccessToken(
            { _doc: { ...resData.data } },
            dispatch
          );
          setIsPinSaved(true);

          const toastMessage = boardId ? "" : "Pin is saved in your profile";
          toastPopup(toastMessage, "success");
        }
      } else {
        const body = {
          pinId: _id,
          boardId: id,
        };
        const res = await axios.post(BACKEND_END_POINTS.REMOVE_SAVE_PIN, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const resData = await res.data;

        if (resData.statusCode === 200) {
          saveUserInRedux.useSaveLoginUserAndAccessToken(
            { _doc: { ...resData.data } },
            dispatch
          );
          setIsPinSaved(false);

          const toastMessage = boardId
            ? ""
            : "Pin is removed from your profile";
          toastPopup(toastMessage, "success");
        }
      }

      setOpenBoardPopover(false);
      setCardClicked(false);
    } catch (error) {
      console.log("save pin error", error);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between">
        {
          loggedInUser?.board?.length > 0 ?
          <ShowBoardName
          loggedInUser={loggedInUser}
          boardId={boardId}
          isPinSaved={isPinSaved}
          selectedBoardDetails={selectedBoardDetails}
          setOpenBoardPopover={setOpenBoardPopover}
          setCardClicked={setCardClicked}
        /> : <div />
        }
       

        {/* saved and likes pin */}
        <div className="flex items-center gap-3 justify-self-end">
          <div
            title="Save Pin"
            className="rounded-full w-8 aspect-square bg-[#e9e9e9] flex items-center justify-center hover:bg-[#d7d5d5] transition-all cursor-pointer"
            onClick={(e) => {
              handleSavePin(e, selectedBoardDetails?.boardId);
            }}
          >
            {isPinSaved ? (
              <RiUnpinFill className="text-black text-lg" />
            ) : (
              <BsFillPinAngleFill className="text-black text-lg" />
            )}
          </div>
        </div>

        {/* pin user and link */}

        <div className="absolute bottom-3 left-3 flex items-center justify-between w-[90%] ">
          <div className="flex items-center gap-2">
            {user?.avatar && user.avatar.length > 0 ? (
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 aspect-square rounded-full object-cover overflow-hidden"
              />
            ) : (
              <p className="font-bold w-8 aspect-square text-center bg-gray-200 rounded-full flex items-center justify-center">
                {user?.name?.toUpperCase()[0]}
              </p>
            )}

            <p className="text-[8px] md:text-xs">{user?.name}</p>
          </div>

          <div className="flex items-center gap-3">
            {link !== "" && (
              <a
                href={link}
                target="_blank"
                title={link?.padEnd(10,'.')}
                className="rounded-full w-8 aspect-square bg-[#e9e9e9] flex items-center justify-center hover:bg-[#d7d5d5] transition-all cursor-pointer"
              >
                <MdOutlineArrowOutward className="text-black text-lg" />
              </a>
            )}

            <div
              className="rounded-full w-8 aspect-square bg-[#e9e9e9] flex items-center justify-center hover:bg-[#d7d5d5] transition-all cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                downloadFile(imageUrl, title);
              }}
              title="download"
            >
              <MdOutlineFileDownload className="text-black text-lg" />
            </div>
          </div>
        </div>
      </div>
      {openBoardPopover && (
        <div className="absolute top-14">
          <ChooseBoardPopover
            handleSave={handleSavePin}
            boards={loggedInUser?.board}
            setSelectedBoardDetails={setSelectedBoardDetails}
            pinId={_id}
            handleOpenCreateBoardModelAndclosePopOver={() => {
              setOpenCreateBoardModel(true);
              setOpenBoardPopover(false);
            }}
          />
        </div>
      )}
      {/* Create Board Model */}
      {openCreateBoardModel && (
        <BoardModel
          onClose={() => setOpenCreateBoardModel(false)}
          title="Create Board"
          isSavedButtonModel={true}
          pinId={_id}
          setSelectedBoardDetails={setSelectedBoardDetails}
        />
      )}
    </>
  );
};

export default WithErrorBoundariesWrapper(HomePinHoverCard);
