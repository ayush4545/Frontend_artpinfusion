import React, { useRef, useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import { useAppSelector } from "../hooks/reduxHooks";
import BoardModel from "./BoardModel";
import SearchBoard from "./SearchBoard";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";

type Props = {
  setSelectedBoard: () => void;
  setOpenBoardDropDown: () => void;
};
const CreatePinChooseBoard = (props: Props) => {
  const { setSelectedBoard, setOpenBoardDropDown } = props;
  const loggedInUser = useAppSelector((state) => state.user);
  const [userBoards, setUserBoards] = useState(loggedInUser?.board);
  const originalBoards = useRef(loggedInUser?.board);
  const [openBoardModel, setOpenBoardModel] = useState<boolean>(false);
  const handleOpenBoard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenBoardModel(true);
  };

  const handleGetBoardNameAndId = (boardName: string, boardId: string) => {
    setSelectedBoard({
      boardName: boardName,
      pinImage: null,
      pinTitle: null,
      boardId: boardId,
    });

    setOpenBoardModel(false);
    setOpenBoardDropDown(false);
  };
  console.log("loggedInUser", loggedInUser);
  return (
    <>
      <div className="absolute  left-[50%] -translate-x-[50%] w-2/3 h-80 rounded-3xl overflow-hidden shadow-lg bg-white bottom-12">
        <div className="p-3 pt-4">
          <SearchBoard
            styles="outline-none border-2 border-gray-400 rounded-3xl  py-2 pl-4 w-full h-14"
            originalBoards={originalBoards}
            setBoards={setUserBoards}
          />
        </div>

        {userBoards?.length > 0 && (
          <div className="w-full  h-[180px] p-3">
            <p className="text-sm">All board</p>

            <div className="mt-2 overflow-auto h-[90%]">
              {userBoards?.map((board) => (
                <div
                  className="w-full rounded-md px-3 py-2 hover:bg-[#e9e9e9] font-semibold flex gap-3 items-center cursor-pointer"
                  key={board?._id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedBoard({
                      boardName: board.boardName,
                      pinImage:
                        board.pins?.length > 0 ? board.pins[0]?.imageUrl : null,
                      pinTitle:
                        board.pins?.length > 0 ? board.pins[0]?.title : null,
                      boardId: board?._id,
                    });
                    setOpenBoardDropDown(false);
                  }}
                >
                  <div className="w-8 aspect-square flex justify-center items-center bg-[#e9e9e9] rounded-lg">
                    {board.pins?.length > 0 &&
                      !board.pins[0]?.imageUrl.includes("video") && (
                        <img
                          src={board.pins[0]?.imageUrl}
                          alt={board.pins[0]?.title}
                          className="w-full aspect-square rounded-md object-cover"
                        />
                      )}
                  </div>
                  <p className="text-md font-semibold">{board.boardName}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          className=" absolute bottom-0 w-full h-14 left-0 text-left pl-5 border-t-[1px] border-gray-300 flex items-center gap-2 font-semibold hover:bg-[#e9e9e9] bg-white "
          onClick={handleOpenBoard}
        >
          <IoAddCircle className="text-[#FF5E0E] text-3xl" /> Create Board
        </button>
      </div>

      {/* Board model */}

      {openBoardModel && (
        <BoardModel
          title="Create Board"
          onClose={() => setOpenBoardModel(false)}
          isSavedButtonModel={false}
          isNeedToNavigateBoardDetails={false}
          handleGetBoardNameAndId={handleGetBoardNameAndId}
        />
      )}
    </>
  );
};

export default WithErrorBoundariesWrapper(CreatePinChooseBoard);
