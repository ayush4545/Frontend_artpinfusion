import { AppDispatch } from "./../../redux/store";

import { addUser } from "../../redux/user.slice";
import { setCookies } from "./setAndGetCookies";
import { labels } from "../constants/text.constant";
const useSaveLoginUserAndAccessToken = (data, dispatch: AppDispatch) => {
  const userData = data._doc;
  const userObj = {
    name: userData?.name,
    emailId: userData?.emailId,
    imgUrl: userData?.avatar,
    followers: userData?.followers,
    followedUsers: userData?.followedUsers,
    pins: userData?.pins,
    savedPins: userData.savedPins,
    board: userData.board,
    username: userData.username,
    _id: userData?._id
  };
  dispatch(addUser(userObj)); // Redux Action to store the data in
  if(data?.accessToken){
    setCookies(labels?.ACCESS_TOKEN, data?.accessToken);
  }
};

export { useSaveLoginUserAndAccessToken };
