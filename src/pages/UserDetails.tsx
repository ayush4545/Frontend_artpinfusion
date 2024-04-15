import React, { useEffect, useState, Suspense } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import config from "../config";
import axios from "axios";
import { UserState } from "../Types/types";
import { FiShare } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import FollowersOrFollowing from "../components/FollowersOrFollowing";
import Saved from "../components/Saved";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import { setHoverOn } from "../redux/hoverOn.slice";

const Pins = React.lazy(() => import("../components/Pins"));
const UserDetails = () => {
  const { state,pathname } = useLocation();
  const { BACKEND_END_POINTS } = config.constant.api;
  const { getCookie } = config.utils.cookies;
  const loggedInUser = useAppSelector((state) => state.user);
  const [userData, setUserData] = useState<UserState | null>(null);
  const isNotLoggedInUser = loggedInUser?._id !== userData?._id;
  const [selectedTab, setSelectedTab] = useState<string>(
    isNotLoggedInUser ? "created" : "saved"
  );
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [selectedFollow, setSelectedFollow] = useState<
    "followers" | "followedUsers" | null
  >(null);
  const pins = userData?.pins;
  const isAuthenticate=useAuth()
  const dispatch= useAppDispatch()
  const navigate=useNavigate()
  console.log("userData", isNotLoggedInUser);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BACKEND_END_POINTS.GET_USER}/${state}`);
      const resData = await res.data;
      if (resData.statusCode === 200) {
        setUserData(resData.data);
        setSelectedTab(
          loggedInUser?._id !== resData.data?._id ? "created" : "saved"
        );
        if(pathname.includes(loggedInUser?.username)){
          dispatch(setHoverOn("allPins"))
        }else{
          dispatch(setHoverOn("homePin"))
        }

        setIsFollowing(() => {
          const index = resData.data.followers
            ?.map((f) => f._id)
            .indexOf(loggedInUser?._id!);
          if (index !== -1) {
            return true;
          }
          return false;
        });
      }
      console.log(344, resData);
    } catch (error) {
      console.log("user error", error);
    }
  };

  useEffect(() => {
    if (state) {
      fetchUser();
    }
  }, [state]);

  const handleFollow = async () => {
    if(!isAuthenticate){
      return navigate(`/`,{
        state:{isNeedToLogin:true}
    })
    }
    try {
      const token = getCookie("accessToken");

      if (!isFollowing) {
        const res = await axios.get(
          `${BACKEND_END_POINTS.FOLLOW_USER}/${userData?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const resData = await res.data;
        if (resData.statusCode === 200) {
          setUserData(resData.data);
          setIsFollowing(true);
        }
      } else {
        const res = await axios.get(
          `${BACKEND_END_POINTS.UNFOLLOW_USER}/${userData?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const resData = await res.data;
        if (resData.statusCode === 200) {
          setUserData(resData.data);
          setIsFollowing(false);
        }
      }
    } catch (error) {
      console.log("follow user", error);
    }
  };

  

  return (
    <div className="w-screen absolute top-[12vh] dark:bg-[#282828]">
      <div className="flex flex-col items-center w-full p-3">
        {userData ? (
          <>
            <div className="flex flex-col items-center">
              {userData?.avatar && userData?.avatar.length > 10 ? (
                <img
                  src={userData?.avatar}
                  alt={userData.name}
                  className="w-[120px] aspect-square rounded-full object-cover border-2 border-[#282828] dark:border-white"
                />
              ) : (
                <p className="font-bold w-[120px] aspect-square text-center bg-gray-200 rounded-full flex items-center justify-center">
                  {userData.name?.toUpperCase()[0]}
                </p>
              )}

              <p className="text-3xl font-bold mt-4 dark:text-white">
                {userData.name}
              </p>
              <p className="text-[#767676] text-sm mt-2">
                @{userData?.username}
              </p>
              <p className="flex gap-1 items-center mt-2 dark:text-white">
                <span
                  className={`${
                    userData?.followers.length > 0
                      ? "font-bold tracking-widest cursor-pointer"
                      : "pointer-events-none"
                  }`}
                  onClick={() => {
                    setSelectedFollow("followers");
                  }}
                >
                  {userData?.followers.length} followers
                </span>
                <span>.</span>
                <span
                  className={`${
                    userData?.followedUsers.length > 0
                      ? "font-bold tracking-widest cursor-pointer"
                      : "pointer-events-none"
                  }`}
                  onClick={() => {
                    setSelectedFollow("followedUsers");
                  }}
                >
                  {userData?.followedUsers.length} following
                </span>
              </p>

              {/* share ,follow and edit profile buttons */}
              <div
                className={`flex items-center justify-center ${
                  isNotLoggedInUser ? "gap-5" : "gap-2"
                } mt-3`}
              >
                {isNotLoggedInUser ? (
                  <div
                    title="share"
                    className="rounded-full w-10 aspect-square  flex items-center justify-center hover:bg-[#e9e9e9] transition-all cursor-pointer"
                  >
                    <FiShare className="text-black text-2xl dark:text-white" />
                  </div>
                ) : (
                  <button className="bg-[#E9E9E9] hover:bg-[#dad9d9]  rounded-[20px] p-2 px-4 mr-2 font-semibold">
                    Share
                  </button>
                )}

                {isNotLoggedInUser ? (
                  <button
                    className={`${
                      isFollowing
                        ? "bg-black dark:bg-white dark:text-black"
                        : "bg-[#FF8C00] hover:bg-[#FF5E0E]"
                    } text-white rounded-[20px] p-2 px-4 font-semibold`}
                    onClick={handleFollow}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                ) : (
                  <button className="bg-[#E9E9E9] hover:bg-[#dad9d9]  rounded-[20px] p-2 px-4 mr-2 font-semibold">
                    Edit Profile
                  </button>
                )}
              </div>

              {/* created and saved button */}
              <div className="flex items-center gap-5 mt-12 justify-center w-full">
                <button
                  className={`rounded-lg p-2 border-b-4 ${
                    selectedTab === "created"
                      ? " border-black dark:border-white "
                      : "hover:bg-[#E9E9E9] border-white dark:border-[#282828]"
                  } font-semibold dark:text-white`}
                  onClick={() => {
                    setSelectedTab("created");
                    if(pathname.includes(loggedInUser?.username)){
                      dispatch(setHoverOn("created"))
                    }else{
                      dispatch(setHoverOn("homePin"))
                    }
                  }}
                >
                  Created
                </button>

                <button
                  className={`rounded-lg p-2 border-b-4 ${
                    selectedTab === "saved"
                      ? " border-black dark:border-white"
                      : "hover:bg-[#E9E9E9] border-white dark:border-[#282828] dark:hover:text-black"
                  } font-semibold dark:text-white`}
                  onClick={() => {
                    setSelectedTab("saved");
                    if(pathname.includes(loggedInUser?.username)){
                      dispatch(setHoverOn("allPins"))
                    }else{
                      dispatch(setHoverOn("homePin"))
                    }
                  }}
                >
                  Saved
                </button>
              </div>
            </div>

            {/* created and saved pins hear */}
            <div className="mt-10 w-full">
              {selectedTab === "created" &&
                (pins && pins.length > 0 ? (
                  <Suspense fallback={<Loader />}>
                    <Pins pins={pins} gridStyle="columns-1 gap-4 lg:gap-4 sm:columns-2 lg:columns-4 xl:columns-6"/>
                  </Suspense>
                ) : (
                  <div className="text-center">
                    <p className="text-center">Nothing to show...yet! Pins you create will live here</p>
                    <Link to="/create-pin" className="rounded-3xl px-3 py-2 font-bold cursor-pointer bg-[#FF8C00] hover:bg-[#FF5E0E] text-white">
                      Create Pin
                    </Link>
                  </div>
                ))}

              {selectedTab === "saved" && ((isNotLoggedInUser || userData?.savedPins?.length > 0) ?  (
                <Saved userData={userData} isNotLoggedInUser={isNotLoggedInUser}/>
              ) :(
                <p className="text-center">{userData?.name} hasn't saved any pins yet</p>
              ))
            }
            </div>
          </>
        ) : (
          <Loader />
        )}
      </div>

      {userData && selectedFollow && (
        <FollowersOrFollowing
          title={selectedFollow}
          onClose={() => setSelectedFollow(null)}
          users={userData[selectedFollow]}
        />
      )}
    </div>
  );
};

export default UserDetails;
