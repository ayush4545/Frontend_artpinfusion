import React, { ReactElement, useState } from "react";
import { createPortal } from "react-dom";
import Modal from "./Modal";
import axios from "axios";
import config from "../config";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/reduxHooks";
import CreateBoardWithPin from "./CreateBoardWithPin";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";


type Props = {
  onClose: () => void;
  isSavedButtonModel: boolean;
  title: string;
  isNeedToNavigateBoardDetails?: boolean;
  handleGetBoardNameAndId?: (boardName: string, boardId: string) => void | null;
  pinId?:string | null,
  setSelectedBoardDetails?: ()=> void | null
};
const BoardModel = (props: Props) => {
  const {
    onClose,
    isSavedButtonModel,
    title,
    isNeedToNavigateBoardDetails = true,
    handleGetBoardNameAndId = null,
    pinId=null,
    setSelectedBoardDetails=null
  } = props;
  const { BACKEND_END_POINTS } = config.constant.api;
  const { getCookie } = config.utils.cookies;
  const saveUserInRedux = config.utils.saveUserInReduxAndSetAccessToken;
  const [boardName, setBoardName] = useState("");
  const [duplicateName, setDuplicateName] = useState(false);
  const isAuthenticate = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [modelTitle,setModelTitle]=useState(title)
  const handleCreateBoard = async () => {
    if (!isAuthenticate) {
      return navigate(`/`, {
        state: { isNeedToLogin: true },
      });
    }
    try {
      const token = getCookie("accessToken");
      const res = await axios.post(
        BACKEND_END_POINTS.CREATE_BOARD,
        { boardName },
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
        console.log(`/${resData?.data?._doc?.username}/${boardName}`);
        if (handleGetBoardNameAndId) {
          handleGetBoardNameAndId(boardName, resData?.data?.boardId);
        }
        if (isNeedToNavigateBoardDetails) {
          navigate(`/${resData?.data?._doc?.username}/${boardName}`, {
            state: {
              openPinsModel: true,
              boardId: resData?.data?.boardId,
            },
          });
        }
      }
      console.log("board", resData);
    } catch (error) {
      if (error?.response?.status === 409) {
        setDuplicateName(true);
      }
      console.log("create board error", error);
    }
  };
  const normalBoard = () => {
    return (
      <div className="w-full p-10 mt-10 h-full">
        <div className="flex flex-col gap-2">
          <label htmlFor="boardName" className="text-sm">
            Name
          </label>
          <input
            type="text"
            placeholder='Like "Watching Anime" or "Traveling"'
            value={boardName}
            className="outline-none border-2 border-gray-400 rounded-xl  py-2 pl-4"
            onChange={(e) => {
              setDuplicateName(false);
              setBoardName(e.target.value);
            }}
          />
          {duplicateName && (
            <p className="text-sm text-red-500">
              This board name is already taken.
            </p>
          )}
        </div>

        <div className="w-full flex items-center justify-end mt-5">
          <button
            className={`rounded-3xl p-3  font-bold ${
              boardName === ""
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer bg-[#FF8C00] hover:bg-[#FF5E0E] text-white"
            }`}
            disabled={boardName === ""}
            onClick={handleCreateBoard}
          >
            Create
          </button>
        </div>
      </div>
    );
  };
  const getBoardModel = (): ReactElement => {
    return (
      <Modal
        onClose={onClose}
        title={modelTitle}
        showClose={false}
        widthHeightStyle={`${isSavedButtonModel ? ' w-5/6 lg:w-3/6 h-auto' : 'w-1/3 h-auto'}`}
      >
        {isSavedButtonModel ? <CreateBoardWithPin pinId={pinId} setSelectedBoardDetails={setSelectedBoardDetails} onClose={onClose} setModelTitle={setModelTitle}/> : normalBoard()}
      </Modal>
    );
  };
  return createPortal(getBoardModel(), document.body);
};

export default WithErrorBoundariesWrapper(BoardModel);
