import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { toggleMode } from "../redux/darkMode.slice";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";

const ModeToggle = () => {
  const dispatch = useAppDispatch();
  const { darkMode }:{darkMode:boolean} = useAppSelector((status) => status.mode);
  return (
    <label className="switch">
      <input
        type="checkbox"
        onChange={() => {
          dispatch(toggleMode());
        }}
        checked={darkMode}
      />
      <span className="slider round"></span>
    </label>
  );
};

export default WithErrorBoundariesWrapper(ModeToggle);
