import React, { useState } from "react";
import { BoardType, UserState } from "../Types/types";


import useAuth from "../hooks/useAuth";
import {  useAppSelector } from "../hooks/reduxHooks";

import HomePinHoverCard from "./HomePinHoverCard";
import AllPinsBoardHoverCard from "./AllPinsBoardHoverCard";
type Props = {
  imageUrl: string;
  user?: UserState;
  link: string | undefined;
  title: string | undefined;
  _id: string;
  boardId?: string;
  boards?: BoardType[];
  hoverOn: string;
};
const PinCard = (props: Props) => {
  const {
    imageUrl,
    user,
    link = "",
    title = "",
    _id,
    boardId,
    boards,
    // hoverOn,
  } = props;
  const [isHover, setIsHover] = useState(false);
  const isAuthenticate = useAuth();
  const [cardClicked, setCardClicked] = useState<boolean>(false);
  const hoverOn=useAppSelector(state=>state.hoverOn)

  return (
    <div
      className="relative rounded-3xl  cursor-pointer mb-3"
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
        // setCardClicked(false);
      }}
      onClick={() => {
        setCardClicked(true);
      }}
    >
      {imageUrl?.includes("video") ? (
        <video
          autoPlay
          loop
          muted
          className="w-full object-cover h-full  rounded-3xl"
        >
          <source src={imageUrl} type="video/mp4" />
        </video>
      ) : (
        <img
          src={imageUrl}
          alt=""
          className="w-full object-cover h-full  rounded-3xl"
        />
      )}

      {(isHover || cardClicked) && (
        <div className="absolute bottom-0 left-0 p-3 bg-black bg-opacity-50 text-white w-full h-full rounded-3xl -z-1">
          {isAuthenticate ? (
            <>
              {hoverOn === "homePin" && (
                <HomePinHoverCard
                  boardId={boardId}
                  boards={boards}
                  setCardClicked={setCardClicked}
                  _id={_id}
                  link={link}
                  title={title}
                  user={user}
                  imageUrl={imageUrl}
                />
              )}

              {
                hoverOn === "allPins" && <AllPinsBoardHoverCard imageUrl={imageUrl} title={title} setCardClicked={setCardClicked} pinId={_id}/>
              }
            </>
          ) : (
            <p className="text-lg text-center absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
              Open
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PinCard;
