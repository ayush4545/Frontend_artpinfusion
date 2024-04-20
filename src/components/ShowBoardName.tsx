import React from 'react'
import { FaChevronDown } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { WithErrorBoundariesWrapper } from './WithErrorBoundaries';

const ShowBoardName = (props) => {
    const {loggedInUser,boardId=null,isPinSaved,selectedBoardDetails,setOpenBoardPopover,setCardClicked=()=>{}}=props
  return (
    <>
    {(loggedInUser?.board.length > 0 &&
                !boardId) ?
                (isPinSaved ? (
                  selectedBoardDetails?.boardName === "Profile" ? (
                    <Link
                      to={`/${loggedInUser?.username}`}
                      state={loggedInUser?._id}
                      className="underline underline-offset-8"
                    >
                      Save to profile
                    </Link>
                  ) : (
                    <Link
                      to={`/${loggedInUser?.username}/${selectedBoardDetails.boardName}`}
                      state={{
                        boardId: selectedBoardDetails?.boardId,
                      }}
                      className="underline underline-offset-8"
                    >
                      {selectedBoardDetails?.boardName}
                    </Link>
                  )
                ) : <div
                className={`flex items-center gap-2 font-semibold cursor-pointer ${
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
              </div>) : (
                  isPinSaved ? (
                    selectedBoardDetails?.boardName === "Profile" ? (
                      <Link
                        to={`/${loggedInUser?.username}`}
                        state={loggedInUser?._id}
                        className="underline underline-offset-8"
                      >
                        Save to profile
                      </Link>
                    ) : (
                      <Link
                        to={`/${loggedInUser?.username}/${selectedBoardDetails.boardName}`}
                        state={{
                          boardId: selectedBoardDetails?.boardId,
                        }}
                        className="underline underline-offset-8"
                      >
                        {selectedBoardDetails?.boardName}
                      </Link>
                    )
                  ):
                  <div
                    className={`flex items-center gap-2 font-semibold cursor-pointer${
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
                )}
    </>
  )
}

export default WithErrorBoundariesWrapper(ShowBoardName)