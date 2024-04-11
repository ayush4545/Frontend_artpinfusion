import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { Link, useNavigate } from "react-router-dom";
import config from "../config";
import axios from "axios";
import { rem, removeUser } from "../redux/user.slice";

type Props={
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>
}
const RightSidePopup = (props : Props) => {
  const user = useAppSelector((state) => state.user);
  const dispatch= useAppDispatch()
  const navigation=useNavigate()
  const {setShowPopup} =props
  const {BACKEND_END_POINTS}= config.constant.api
  const handleLogout=async()=>{
    const token=config.utils.cookies.getCookie("accessToken")
    const res= await axios.get(BACKEND_END_POINTS.LOGOUT,{
      headers:{
        "Authorization" : `Bearer ${token}`
      }
    })

    const resData=await res.data
    console.log(resData)
    if(resData.statusCode === 200){
      config.utils.cookies.removeCookie("accessToken")
      document.cookie="accessToken="
      dispatch(removeUser())
      setShowPopup(false)
      navigation("/")
      window.location.reload()
    }
  }
  return (
    <div className="absolute lg:w-[20vw] bg-white right-1 top-12 shadow-3xl rounded-lg z-40 p-2" tabIndex={1} 
    onClick={(e)=>{
     e.stopPropagation()
     e.preventDefault()
    }}>
      <p className="text-sm mb-2 pl-3">Currently in</p>
      <Link
        to={`/${user?.username}`}
        className="flex w-full bg-[#E9E9E9] p-1  items-center rounded-lg gap-3 py-2 pl-3"
      >
        <img
          src={user?.imgUrl}
          alt={user.name}
          className="object-cover rounded-full w-[60px] aspect-square"
        />
        <div>
          <p className="font-bold">{user?.name}</p>
          <p className="text-sm">Personal</p>
          <p className="text-sm text-wrap">{user?.emailId}</p>
        </div>
      </Link>
      <p className="text-sm my-3 pl-3">More Options</p>

      <button className="w-full text-left pl-3 rounded-lg py-1 font-bold hover:bg-gray-200" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default RightSidePopup;
