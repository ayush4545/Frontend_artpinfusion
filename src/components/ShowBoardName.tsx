import React from "react";
import { FaChevronDown } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import { UserState } from "../Types/types";
import { labels } from "../config/constants/text.constant";

type Props = {
  loggedInUser: UserState;
  boardId: string | null;
  isPinSaved: boolean;
  selectedBoardDetails: {
    boardId: string;
    boardName: string;
  };
  setOpenBoardPopover: React.Dispatch<React.SetStateAction<boolean>>;
  setCardClicked: React.Dispatch<React.SetStateAction<boolean>>;
};
const ShowBoardName = (props: Props) => {
  const {
    loggedInUser,
    boardId = null,
    isPinSaved,
    selectedBoardDetails,
    setOpenBoardPopover,
    setCardClicked = () => {},
  } = props;
  return (
    <>
      {loggedInUser?.board.length > 0 && !boardId ? (
        isPinSaved ? (
          selectedBoardDetails?.boardName === labels?.PROFILE ? (
            <Link
              to={`/${loggedInUser?.username}`}
              state={loggedInUser?._id}
              className="underline underline-offset-8 dark:text-white"
            >
              {labels?.SAVE_TO_PROFILE}
            </Link>
          ) : (
            <Link
              to={`/${loggedInUser?.username}/${selectedBoardDetails.boardName}`}
              state={{
                boardId: selectedBoardDetails?.boardId,
              }}
              className="underline underline-offset-8 dark:text-white"
            >
              {selectedBoardDetails?.boardName}
            </Link>
          )
        ) : (
          <div
            className={`flex items-center gap-2 font-semibold cursor-pointer dark:text-white ${
              isPinSaved ? "pointer-events-none" : "pointer-events-auto"
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpenBoardPopover((prev) => !prev);
              setCardClicked((prev) => !prev);
            }}
          >
            {selectedBoardDetails?.boardName?.substring(0, 10)}
            {selectedBoardDetails?.boardName.length > 10 && "..."}

            {!isPinSaved && <FaChevronDown />}
          </div>
        )
      ) : isPinSaved ? (
        selectedBoardDetails?.boardName === "Profile" ? (
          <Link
            to={`/${loggedInUser?.username}`}
            state={loggedInUser?._id}
            className="underline underline-offset-8 dark:text-white"
          >
            {labels?.SAVE_TO_PROFILE}
          </Link>
        ) : (
          <Link
            to={`/${loggedInUser?.username}/${selectedBoardDetails.boardName}`}
            state={{
              boardId: selectedBoardDetails?.boardId,
            }}
            className="underline underline-offset-8 dark:text-white"
          >
            {selectedBoardDetails?.boardName}
          </Link>
        )
      ) : (
        <div
          className={`flex items-center gap-2 font-semibold cursor-pointer dark:text-white${
            isPinSaved ? "pointer-events-none" : "pointer-events-auto"
          }`}
          onClick={(e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenBoardPopover((prev) => !prev);
            setCardClicked((prev) => !prev);
          }}
        >
          {selectedBoardDetails?.boardName?.substring(0, 10)}
          {selectedBoardDetails?.boardName.length > 10 && "..."}

          {!isPinSaved && <FaChevronDown className="dark:text-white" />}
        </div>
      )}
    </>
  );
};

export default WithErrorBoundariesWrapper(ShowBoardName);
