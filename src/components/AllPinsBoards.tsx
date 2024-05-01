import React from "react";
import AllPinsCard from "./AllPinsCard";
import { UserState } from "../Types/types";
import BoardCard from "./BoardCard";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";

type Props = {
  userData: UserState;
};
const AllPinsBoards = (props: Props) => {
  const { userData } = props;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 p-4">
      <AllPinsCard
        pins={userData?.savedPins}
        username={userData?.username}
        _id={userData?._id}
      />
      {userData?.board?.length > 0 &&
        userData?.board.map((board) => (
          <BoardCard
            board={board}
            username={userData?.username}
            key={board?._id}
          />
        ))}
    </div>
  );
};

export default WithErrorBoundariesWrapper(AllPinsBoards);
