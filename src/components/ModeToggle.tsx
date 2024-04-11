import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { toggleMode } from "../redux/darkMode.slice";

const ModeToggle = () => {
    const dispatch=useAppDispatch()
    const {darkMode} =useAppSelector(status=>status.mode)
  return (
    <label className="switch">
      <input type="checkbox" onChange={()=>{
        dispatch(toggleMode())
      }} value={`${darkMode}`}/>
      <span className="slider round"></span>
    </label>
  );
};

export default ModeToggle;
