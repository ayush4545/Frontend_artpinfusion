import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { Link, useNavigate } from "react-router-dom";
import config from "../config";
import axios from "axios";
import { removeUser } from "../redux/user.slice";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import ErrorImage from "../assets/images/notFound.gif";
import { labels } from "../config/constants/text.constant";
type Props = {
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
};
const RightSidePopup = (props: Props) => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const { setShowPopup } = props;
  const { BACKEND_END_POINTS } = config.constant.api;
  const handleLogout = async () => {
    const token = config.utils.cookies.getCookie(labels?.ACCESS_TOKEN);
    const res = await axios.get(BACKEND_END_POINTS.LOGOUT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = await res.data;
    if (resData.statusCode === 200) {
      config.utils.cookies.removeCookie(labels?.ACCESS_TOKEN);
      document.cookie = "accessToken=";
      dispatch(removeUser());
      setShowPopup(false);
      navigation("/");
      window.location.reload();
    }
  };
  return (
    <div
      className="absolute w-[70vw] sm:w-[30vw] lg:w-[20vw] bg-white right-1 top-12 shadow-3xl rounded-lg z-40 p-2"
      tabIndex={1}
      onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <p className="text-sm mb-2 pl-3">{labels?.CURRENTLY_IN}</p>
      <Link
        to={`/${user?.username}`}
        state={user?._id}
        // onClick={()=>}
        className="flex w-full bg-[#E9E9E9] p-1  items-center rounded-lg gap-3 py-2 pl-3"
      >
        <img
          src={user?.imgUrl}
          alt={user.name}
          onError={(e:React.SyntheticEvent<HTMLImageElement, Event>) => {
            (e.target as HTMLImageElement).src = ErrorImage;
          }}
          className="object-cover rounded-full w-[60px] aspect-square"
        />
        <div className="w-full overflow-hidden">
          <p className="font-bold">{user?.name}</p>
          <p className="text-sm">Personal</p>
          <p className="text-[12px] lg:text-sm text-wrap w-full whitespace-normal">
            {user?.emailId}
          </p>
        </div>
      </Link>
      <p className="text-sm my-3 pl-3">{labels?.MORE_OPTIONS}</p>

      <button
        className="w-full text-left pl-3 rounded-lg py-1 font-bold hover:bg-gray-200"
        onClick={handleLogout}
      >
        {labels?.LOGOUT}
      </button>
    </div>
  );
};

export default WithErrorBoundariesWrapper(RightSidePopup);
