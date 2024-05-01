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
import { labels } from "../config/constants/text.constant";
import { SelectedBoardDetailsType,ErrorTypes } from "../Types/types";

type Props = {
  onClose: () => void;
  isSavedButtonModel: boolean;
  title: string;
  isNeedToNavigateBoardDetails?: boolean;
  handleGetBoardNameAndId?: (boardName: string, boardId: string) => void | null;
  pinId?: string | null;
  setSelectedBoardDetails?: React.Dispatch<React.SetStateAction<SelectedBoardDetailsType>> | null;
};
const BoardModel = (props: Props) => {
  const {
    onClose,
    isSavedButtonModel,
    title,
    isNeedToNavigateBoardDetails = true,
    handleGetBoardNameAndId = null,
    pinId = null,
    setSelectedBoardDetails = null,
  } = props;
  const { BACKEND_END_POINTS } = config.constant.api;
  const { getCookie } = config.utils.cookies;
  const saveUserInRedux = config.utils.saveUserInReduxAndSetAccessToken;
  const [boardName, setBoardName] = useState<string>("");
  const [duplicateName, setDuplicateName] = useState<boolean>(false);
  const isAuthenticate = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [modelTitle, setModelTitle] = useState<string>(title);
  const handleCreateBoard = async () => {
    if (!isAuthenticate) {
      return navigate(`/`, {
        state: { isNeedToLogin: true },
      });
    }
    try {
      const token = getCookie(labels?.ACCESS_TOKEN);
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
    } catch (error:unknown) {
      if (error?.response?.status === 409) {
        setDuplicateName(true);
      }
    }
  };
  const normalBoard = () => {
    return (
      <div className="w-full p-10 mt-10 h-full">
        <div className="flex flex-col gap-2">
          <label htmlFor="boardName" className="text-sm">
            {labels?.NAME}
          </label>
          <input
            type="text"
            placeholder={labels?.BOARD_NAME_PLACEHOLDER}
            value={boardName}
            className="outline-none border-2 border-gray-400 rounded-xl  py-2 pl-4"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setDuplicateName(false);
              setBoardName(e.target.value);
            }}
          />
          {duplicateName && (
            <p className="text-sm text-red-500">
              {labels?.DUPLICATE_BOARD_NAME_WARNING}
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
            {labels?.CREATE}
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
        widthHeightStyle={`${
          isSavedButtonModel ? " w-5/6 lg:w-3/6 h-auto" : "w-1/3 h-auto"
        }`}
      >
        {isSavedButtonModel ? (
          <CreateBoardWithPin
            pinId={pinId}
            setSelectedBoardDetails={setSelectedBoardDetails}
            onClose={onClose}
            setModelTitle={setModelTitle}
          />
        ) : (
          normalBoard()
        )}
      </Modal>
    );
  };
  return createPortal(getBoardModel(), document.body);
};

export default WithErrorBoundariesWrapper(BoardModel);
