import React, { useEffect, useState } from "react";
import { BoardType } from "../Types/types";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import ErrorImage from "../assets/404Page.gif";
import { labels } from "../config/constants/text.constant";
type BoardProps = {
  board: BoardType;
  handleSave: (
    e: React.MouseEvent<HTMLDivElement>,
    selectedBoardId: number | string
  ) => void;
  setSelectedBoardDetails: ({
    boardName,
    boardId,
  }: {
    boardName: string;
    boardId: string;
  }) => void;
  pinId: string;
};
const BoardCardWithSaveBtn = (props: BoardProps) => {
  const { board, handleSave, setSelectedBoardDetails, pinId } = props;
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (board?.pins?.length > 0) {
      setIsSaved(() => {
        const index = board?.pins?.map((pin) => pin?._id).indexOf(pinId);
        if (index !== -1) {
          return true;
        }
        return false;
      });
    }
  }, [board,pinId]);
  return (
    <div
      className="hover:bg-[#dddcdc] p-2 flex items-center justify-between rounded-md mt-2"
      key={board?._id}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        setSelectedBoardDetails({
          boardName: board?.boardName,
          boardId: board?._id,
        });
        handleSave(e, board?._id);
      }}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-md bg-[#e9e9e9] flex items-center justify-center overflow-hidden">
          {board?.pins?.length > 0 &&
            !board?.pins[0]?.imageUrl?.includes("video") && (
              <img
                src={board?.pins[0]?.imageUrl}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  (e.target as HTMLImageElement).src = ErrorImage;
                }}
                alt={board?.boardName}
                className="h-full w-full rounded-md object-cover"
              />
            )}
        </div>
        <p>{board?.boardName}</p>
      </div>
      <button
        className={`${
          isSaved
            ? "bg-black dark:bg-white "
            : "bg-[#FF8C00] hover:bg-[#FF5E0E] "
        }text-white rounded-[20px] p-2 px-4`}
      >
        {isSaved ? labels?.SAVED : labels?.SAVE}
      </button>
    </div>
  );
};

export default WithErrorBoundariesWrapper(BoardCardWithSaveBtn);
