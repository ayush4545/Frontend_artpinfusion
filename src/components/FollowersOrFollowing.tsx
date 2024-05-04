import React, { ReactElement, useState } from "react";
import Modal from "./Modal";
import { createPortal } from "react-dom";
import { UserState } from "../Types/types";
import { useAppSelector } from "../hooks/reduxHooks";
import config from "../config";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import ErrorImage from "../assets/images/notFound.gif"
import { labels } from "../config/constants/text.constant";
type Props = {
  title: string;
  onClose: () => void;
  users: UserState[] | undefined;
};
const FollowersOrFollowing = (props: Props) => {
  const { title, onClose, users } = props;

  const getFollowsModel = (): ReactElement => {
    return (
      <Modal
        onClose={onClose}
        title={title === "followers" ? "Followers" : "Followings"}
        showClose={true}
        widthHeightStyle="w-1/3 h-4/5"
      >
        <div className="w-full h-full overflow-auto mt-4 p-4 scroll">
          {users &&
            users.length > 0 &&
            users.map((user) => (
              <FollowListComp user={user} key={user._id} title={title} />
            ))}
        </div>
      </Modal>
    );
  };
  return createPortal(getFollowsModel(), document.body);
};

type FollowListProps = {
  user: UserState;
  title: string;
};
const FollowListComp = (props: FollowListProps) => {
  const { user, title } = props;
  const loggedInUser = useAppSelector((state) => state.user);
  const { BACKEND_END_POINTS } = config.constant.api;
  const { getCookie } = config.utils.cookies;
  const { toastPopup } = config.utils.toastMessage;
  const isAuthenticate = useAuth();
  const navigate = useNavigate();
  const [isLoggedInUser] = useState<boolean>(() => {
    if (user._id === loggedInUser?._id) {
      return true;
    } else return false;
  });
  const [isFollowing, setIsFollowing] = useState(() => {
    if (user?.followers?.includes(loggedInUser?._id)) return true;
    return false;
  });

  const handleFollow = async () => {
    if (!isAuthenticate) {
      return navigate(`/`, {
        state: { isNeedToLogin: true },
      });
    }
    try {
      const token = getCookie(labels?.ACCESS_TOKEN);

      if (!isFollowing) {
        const res = await axios.get(
          `${BACKEND_END_POINTS.FOLLOW_USER}/${user?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const resData = await res.data;
        if (resData.statusCode === 200) {
          setIsFollowing(true);
          toastPopup(
            labels?.FOLLOWING_TOAST_MESSAGE(resData?.data.name),
            "success"
          );
        }
      } else {
        const res = await axios.get(
          `${BACKEND_END_POINTS.UNFOLLOW_USER}/${user?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const resData = await res.data;

        if (resData.statusCode === 200) {
          setIsFollowing(false);
          toastPopup(
            labels?.UNFOLLOWING_TOAST_MESSAGE(resData?.data?.name),
            "success"
          );
        }
      }
    } catch (error) {
      console.log("follow user", error);
    }
  };
  return (
    <div className="w-full flex items-center justify-between mt-3">
      <div className="flex items-center gap-3">
        {user.avatar && user.avatar.length > 10 ? (
          <img
            src={user?.avatar}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              (e.target as HTMLImageElement).src = ErrorImage;
            }}
            alt={user?.name}
            className="rounded-full w-14 aspect-square object-cover"
          />
        ) : (
          <p className="font-bold w-full h-full text-center bg-gray-200 rounded-full flex items-center justify-center">
            {user?.name?.toUpperCase()[0]}
          </p>
        )}

        <p className="text-lg font-semibold">{user?.name}</p>
      </div>

      <button
        className={`${
          isFollowing
            ? "bg-black dark:bg-white dark:text-black text-white"
            : "bg-[#E9E9E9] hover:bg-[#dad9d9]"
        }  rounded-[20px] p-2 px-4 mr-2 font-semibold`}
        onClick={handleFollow}
        disabled={isLoggedInUser}
      >
        {isLoggedInUser
          ? title === labels?.FOLLOWERS
            ? labels?.THAS_YOU
            : labels?.UNFOLLOW
          : isFollowing
          ? title === labels?.FOLLOWERS
            ? labels?.FOLLOWING
            : labels?.UNFOLLOW
          : labels?.FOLLOW}
      </button>
    </div>
  );
};
export default WithErrorBoundariesWrapper(FollowersOrFollowing);
