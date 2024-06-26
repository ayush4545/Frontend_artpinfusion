import React, { useEffect, useState } from "react";
import { UserState } from "../Types/types";
import CreateBoardPinButton from "./CreateBoardPinButton";
import Pins from "./Pins";
import AllPinsBoards from "./AllPinsBoards";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
type Props = {
  userData: UserState;
  isNotLoggedInUser: boolean;
};
const Saved = (props: Props) => {
  const { userData, isNotLoggedInUser } = props;
  const [openCreateButtonModel, setOpenCreateButtonModel] =
    useState<boolean>(false);
  const handleWindowClick = () => {
    setOpenCreateButtonModel(false);
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);
  return (
    <div className="w-full dark:bg-[#282828]">
      {!isNotLoggedInUser && (
        <div className="w-full flex items-center justify-end pr-4 dark:bg-[#282828]">
          <CreateBoardPinButton
            showBoard={true}
            top="-top-16"
            openCreateButtonModel={openCreateButtonModel}
            setOpenCreateButtonModel={setOpenCreateButtonModel}
          />
        </div>
      )}
      <div className="w-full mt-4">
        {userData?.savedPins.length > 0 && userData?.board?.length === 0 && (
          <div className="w-full">
            <Pins
              pins={userData?.savedPins}
              gridStyle="columns-2 gap-4 lg:gap-4 sm:columns-2 lg:columns-4 xl:columns-6"
            />
          </div>
        )}
        {userData?.savedPins.length > 0 && userData?.board?.length > 0 && (
          <AllPinsBoards userData={userData} />
        )}
      </div>
    </div>
  );
};

export default WithErrorBoundariesWrapper(Saved);
