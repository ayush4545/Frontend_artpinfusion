import axios from "axios";
import { UserState } from "../../Types/types";
const GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const getGoogleUserInfo = async (accessToken: string): Promise<UserState> => {
  const userInfo = await axios.get(GOOGLE_USER_INFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const obj: any = {};

  if (userInfo?.data) {
    obj.name = userInfo.data.name;
    obj.emailId = userInfo.data.email;
    obj.imgUrl = userInfo.data.picture;
  }
  return obj;
};

export { getGoogleUserInfo };
