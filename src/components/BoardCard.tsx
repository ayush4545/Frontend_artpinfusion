import React, { useState } from "react";
import { BoardType } from "../Types/types";
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import EditBoardPopup from "./EditBoardPopup";
import { useAppSelector } from "../hooks/reduxHooks";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import ErrorImage from "../assets/images/notFound.gif"
type Props = {
  board: BoardType;
  username: string;
};
const BoardCard = (props: Props) => {
  const { board, username } = props;
  const pins = board?.pins?.reverse().slice(0, 3);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const pinsArr:number[] = [...Array(3).keys()];
  const [boardName, setBoardName] = useState<string>(board?.boardName);
  const loggedInUser = useAppSelector((state) => state?.user);
  const pinStyle = [
    "w-2/3 h-full left-0",
    "w-1/3 h-1/2 right-0 top-0",
    "w-1/3 h-1/2 right-0 bottom-0 border-t-[1px]",
  ];

  return (
    <>
      <Link
        to={`/${username}/${boardName}`}
        className="w-full aspect-square rounded-2xl overflow-hidden textAnimation"
        state={{
          boardId: board?._id,
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className="w-full h-4/6  relative rounded-2xl overflow-hidden  cursor-pointer">
          {pinsArr.map((val) => (
            <BoardChip
              leftSideMargin={pinStyle[val]}
              imageUrl={pins[val]?.imageUrl}
              pinTitle={pins[val]?.title}
              key={pins[val]?._id}
            />
          ))}

          {loggedInUser?.username === username && isHover && (
            <div
              className="absolute right-2 bottom-2 w-10 h-10 rounded-full flex items-center justify-center bg-[#e9e9e9]"
              onClick={(e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                e.preventDefault();
                e.stopPropagation();
                setOpenEdit((prev) => !prev);
              }}
            >
              <MdEdit />
            </div>
          )}
        </div>
        <p className="font-semibold text-xl mx-2 mt-2 dark:text-white">
          {boardName}
        </p>
        <p className="mx-2 text-sm dark:text-white">
          {board?.pins?.length} pins
        </p>
      </Link>

      {/* Edit board modal */}
      {openEdit && (
        <EditBoardPopup
          boardName={board?.boardName}
          description={board?.description}
          onClose={() => setOpenEdit(false)}
          boardId={board?._id}
          setBoardName={setBoardName}
        />
      )}
    </>
  );
};

type BoardChipProps = {
  leftSideMargin: string;
  imageUrl: string;
  pinTitle?: string;
};
const BoardChip = (props: BoardChipProps) => {
  const { leftSideMargin, imageUrl, pinTitle } = props;
  return (
    <div
      className={` bg-[#efefef] absolute ${leftSideMargin} border-r-[1px] border-[#f7f7f7] hover:bg-[#d5d5d5] overflow-hidden`}
    >
      {imageUrl && !imageUrl.includes("video") && (
        <img
          src={imageUrl}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            (e.target as HTMLImageElement).src = ErrorImage;
          }}
          alt={pinTitle}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default WithErrorBoundariesWrapper(BoardCard);
