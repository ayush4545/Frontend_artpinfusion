import React from "react";
import { PinType } from "../Types/types";
import PinCard from "./PinCard";
import { Link } from "react-router-dom";

type Props = {
  pins: PinType[];
  gridStyle: string;
  boardId?: string;
  hoverOn:string
};

const Pins = (props: Props) => {
  const { pins, gridStyle, boardId,hoverOn } = props;
  console.log(pins);
  return (
    <div className={gridStyle}>
      {pins.map((pin) => (
        <Link to={`/pins/${pin._id}`} key={pin._id}>
          <PinCard
            imageUrl={pin.imageUrl}
            link={pin.sourceLink}
            title={pin.title}
            key={pin._id}
            user={pin.user}
            _id={pin._id}
            boardId={boardId}
            boards={pin?.boards}
            hoverOn={hoverOn}
          />
        </Link>
      ))}
    </div>
  );
};

export default Pins;
