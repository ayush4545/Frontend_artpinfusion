import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaRegHeart,
  FaArrowDown,
  FaChevronDown,
} from "react-icons/fa6";
import { MdOutlineArrowOutward, MdOutlineFileDownload } from "react-icons/md";
import { RiUnpinFill } from "react-icons/ri";
import axios from "axios";
import config from "../config";
import Pins from "../components/Pins";
import { PinType } from "../Types/types";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { BsFillPinAngleFill } from "react-icons/bs";
import useAuth from "../hooks/useAuth";
import ChooseBoardPopover from "../components/ChooseBoardPopover";
import ShowBoardName from "../components/ShowBoardName";
import Loader from "../components/Loader";
type PinData = {
  pin: PinType;
  exploreMore: PinType[];
};
const PinDetails = () => {
  const { id } = useParams();
  const { BACKEND_END_POINTS } = config.constant.api;
  const { getCookie } = config.utils.cookies;
  const { toastPopup } = config.utils.toastMessage;
  const downloadFile = config.utils.downloadFile;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const saveUserInRedux = config.utils.saveUserInReduxAndSetAccessToken;
  const loggedInUser = useAppSelector((state) => state.user);
  const [pinData, setPinData] = useState<PinData | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const isAuthenticate = useAuth();
  const [isPinSaved, setIsPinSaved] = useState<boolean>(false);
  const [selectedBoardDetails, setSelectedBoardDetails] = useState({
    boardName: "Profile",
    boardId: null,
  });
  const token = getCookie("accessToken");
  const [openBoardPopover, setOpenBoardPopover] = useState(false);
  console.log("pinData", setPinData);

  const fetchPin = async () => {
    try {
      const res = await axios.get(`${BACKEND_END_POINTS.Get_PIN}/${id}`);
      const resData = await res.data;
      if (resData.statusCode == 200) {
        setPinData(resData.data);
      }
      setIsFollowing(() => {
        const index = resData.data.pin?.user?.followers
          ?.map((f) => f._id)
          .indexOf(loggedInUser?._id!);
        if (index !== -1) {
          return true;
        }
        return false;
      });

      if (loggedInUser?.savedPins?.length > 0) {
        console.log("cdcsdcs", loggedInUser);
        setIsPinSaved(() => {
          const index = loggedInUser?.savedPins
            ?.map((pin) => pin?._id)
            .indexOf(resData?.data?.pin?._id);
          console.log(index, "Index");
          if (index !== -1) {
            return true;
          }
          return false;
        });
      }
    } catch (error: any) {
      toastPopup(error?.message, "error");
    }
  };
  console.log("isPinSaved", isPinSaved);

  useEffect(() => {
    if (id) {
      fetchPin();
    }
  }, [id]);

  useEffect(() => {
    if (loggedInUser?.savedPins?.length > 0 && pinData) {
      setIsPinSaved(() => {
        const index = loggedInUser?.savedPins
          ?.map((pin) => pin?._id)
          .indexOf(pinData?.pin?._id);
        if (index !== -1) {
          return true;
        }
        return false;
      });
    }
  }, [loggedInUser]);

  const handleScroll = () => {
    const targetElement = document.getElementById("moreToExplore");

    // Scroll to the target element
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleFollow = async () => {
    if (!isAuthenticate) {
      return navigate(`/`, {
        state: { isNeedToLogin: true },
      });
    }
    try {
      const token = getCookie("accessToken");

      if (!isFollowing) {
        const res = await axios.get(
          `${BACKEND_END_POINTS.FOLLOW_USER}/${pinData?.pin?.user?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const resData = await res.data;
        if (resData.statusCode === 200) {
          const newData = resData.data;
          const pin = JSON.parse(JSON.stringify(pinData));
          pin.pin.user = newData;
          setIsFollowing(true);
          setPinData(pin);
          toastPopup(`You start following ${resData?.data.name}`, "success");
        }
      } else {
        const res = await axios.get(
          `${BACKEND_END_POINTS.UNFOLLOW_USER}/${pinData?.pin?.user?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const resData = await res.data;
        console.log(355, resData);
        console.log(345, pinData);
        if (resData.statusCode === 200) {
          const newData = resData.data;
          const pin = JSON.parse(JSON.stringify(pinData));
          pin.pin.user = newData;
          setIsFollowing(false);
          setPinData(pin);
          toastPopup(`You unfollow ${resData?.data?.name}`, "success");
        }
      }
    } catch (error) {
      console.log("follow user", error);
    }
  };

  useEffect(() => {
    if (isPinSaved) {
      if (pinData?.pin?.boards.length > 0) {
        let board = pinData?.pin?.boards[pinData?.pin?.boards.length - 1];
        setSelectedBoardDetails({
          boardName: board?.boardName,
          boardId: board?._id,
        });
      }
    } else {
      setSelectedBoardDetails({
        boardName: "Profile",
        boardId: null,
      });
    }
  }, [isPinSaved, pinData]);

  const handleWindowClick = () => {
    setOpenBoardPopover(false);
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const handleSavePin = async (e, selectedBoardId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("selectedBoardId", e, selectedBoardId);
    try {
      if (!isAuthenticate) {
        return navigate(`/`, {
          state: { isNeedToLogin: true },
        });
      }

      selectedBoardId;
      if (!isPinSaved) {
        const body = {
          pinId: pinData?.pin?._id,
          boardId: selectedBoardId,
        };
        const res = await axios.post(BACKEND_END_POINTS.SAVE_PIN, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const resData = await res.data;

        if (resData.statusCode === 201) {
          saveUserInRedux.useSaveLoginUserAndAccessToken(
            { _doc: { ...resData.data } },
            dispatch
          );
          setIsPinSaved(true);

          const toastMessage = selectedBoardId
            ? `Pin is saved in ${selectedBoardDetails?.boardName} board`
            : "Pin is saved in your profile";
          toastPopup(toastMessage, "success");
        }
      } else {
        const body = {
          pinId: pinData?.pin?._id,
          boardId: id,
        };
        const res = await axios.post(BACKEND_END_POINTS.REMOVE_SAVE_PIN, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const resData = await res.data;

        if (resData.statusCode === 200) {
          saveUserInRedux.useSaveLoginUserAndAccessToken(
            { _doc: { ...resData.data } },
            dispatch
          );
          setIsPinSaved(false);

          const toastMessage = selectedBoardId
            ? `Pin is saved in ${selectedBoardDetails?.boardName} board`
            : "Pin is saved in your profile";
          toastPopup(toastMessage, "success");
        }
        console.log("save pin data", resData);
      }

      setOpenBoardPopover(false);
    } catch (error) {
      console.log("save pin error", error);
    }
  };
  return (
    <div className="w-screen absolute top-[12vh] homeSection  dark:bg-[#282828] min-h-[88%] flex flex-col items-center justify-center gap-10 snap-y snap-proximity">
      <div
        className="fixed w-12 aspect-square rounded-full  flex items-center justify-center hover:bg-[#e9e9e9] transition-all cursor-pointer left-2 top-32 bg-white"
        onClick={() => {
          navigate(-1);
        }}
      >
        <FaArrowLeft className="text-black text-xl dark:text-white" />
      </div>

      {/* main content */}
      <div className="flex items-center justify-center w-full h-screen">
        {pinData && pinData?.pin ? (
          <div className="grid grid-cols-1 lg:grid-cols-2  gap-5 w-3/5  overflow-hidden rounded-3xl shadow-2xl px-2 pt-3 pb-3 dark:shadow-white dark:shadow-lg">
            <div className="w-full h-full">
              {pinData?.pin?.imageUrl?.includes("video") ? (
                <video
                  controls
                  autoPlay
                  loop
                  className="w-full rounded-3xl h-full ml-2 flex-1 object-contain"
                >
                  <source src={pinData?.pin?.imageUrl} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={pinData?.pin?.imageUrl}
                  alt={pinData?.pin?.title}
                  className="w-full rounded-3xl h-full ml-2 flex-1 object-contain"
                />
              )}
            </div>

            <div className="w-full">
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {pinData.pin.sourceLink !== "" && (
                    <a
                      href={pinData.pin.sourceLink}
                      target="_blank"
                      title={pinData.pin.sourceLink}
                      className="rounded-full w-10 aspect-square  flex items-center justify-center hover:bg-[#e9e9e9] transition-all cursor-pointer"
                    >
                      <MdOutlineArrowOutward className="text-black text-2xl dark:text-white" />
                    </a>
                  )}

                  <div
                    className="rounded-full w-10 aspect-square  flex items-center justify-center hover:bg-[#e9e9e9] transition-all cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("heelo brother");
                      downloadFile(pinData?.pin?.imageUrl,pinData?.pin?.title)
                    }}
                    title="download"
                  >
                    <MdOutlineFileDownload className="text-black text-2xl dark:text-white" />
                  </div>
                </div>

                <div className="flex items-center gap-3 relative">
                  <ShowBoardName
                    loggedInUser={loggedInUser}
                    isPinSaved={isPinSaved}
                    selectedBoardDetails={selectedBoardDetails}
                    setOpenBoardPopover={setOpenBoardPopover}
                  />
                  <div
                    title={isPinSaved ? "removed pin" : "Save Pin"}
                    className="rounded-full w-10 aspect-square  flex items-center justify-center hover:bg-[#e9e9e9] transition-all cursor-pointer"
                    onClick={handleSavePin}
                  >
                    {isPinSaved ? (
                      <RiUnpinFill className="text-black text-lg" />
                    ) : (
                      <BsFillPinAngleFill className="text-black text-lg" />
                    )}
                  </div>

                  {/* board popover */}
                  {openBoardPopover && (
                    <div className="absolute top-12">
                      <ChooseBoardPopover
                        handleSave={handleSavePin}
                        boards={loggedInUser?.board}
                        setSelectedBoardDetails={setSelectedBoardDetails}
                        pinId={pinData?.pin?._id}
                      />
                    </div>
                  )}
                  <div
                    title="like pin"
                    className="rounded-full w-10 aspect-square  flex items-center justify-center hover:bg-[#e9e9e9] transition-all cursor-pointer"
                  >
                    <FaRegHeart className="text-black text-2xl dark:text-white" />
                    {/* <FaHeart/> */}
                  </div>
                </div>
              </div>

              {/* title */}
              {pinData?.pin?.title !== "" && (
                <p className="text-2xl font-bold text-wrap ml-3 mt-4 dark:text-white">
                  {pinData?.pin?.title}
                </p>
              )}

              {/* description */}
              {pinData?.pin?.description !== "" && (
                <p className="ml-3 mt-2 text-base dark:text-white">
                  {pinData?.pin?.description}
                </p>
              )}

              <div className="ml-3 mt-2">
                {pinData?.pin?.tags?.map((tag) => {
                  return <span className="text-blue-500 text-sm"> #{tag}</span>;
                })}
              </div>

              {/* user */}
              <div className="ml-3 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link
                    to={{
                      pathname: `/${pinData?.pin?.user?.username}`,
                    }}
                    state={pinData?.pin?.user?._id}
                  >
                    {pinData?.pin?.user?.avatar &&
                    pinData?.pin?.user?.avatar.length > 0 ? (
                      <img
                        src={pinData?.pin?.user?.avatar}
                        alt={pinData?.pin?.user?.name}
                        className="w-10 aspect-square rounded-full object-cover"
                      />
                    ) : (
                      <p className="font-bold w-10 aspect-square text-center bg-gray-200 rounded-full flex items-center justify-center">
                        {pinData?.pin?.user?.name?.toUpperCase()[0]}
                      </p>
                    )}
                  </Link>

                  <div>
                    <Link
                      to={{
                        pathname: `/${pinData?.pin?.user?.username}`,
                      }}
                      state={pinData?.pin?.user?._id}
                    >
                      <p className="font-semibold dark:text-white">
                        {pinData?.pin?.user?.name}
                      </p>
                    </Link>
                    <p className="text-sm -mt-[2px] text-[#767676]">
                      {pinData?.pin?.user?.followers?.length} followers
                    </p>
                  </div>
                </div>

                {!isAuthenticate ||
                  (loggedInUser?._id !== pinData.pin.user._id && (
                    <button
                      className={`${
                        isFollowing
                          ? "bg-black dark:bg-white dark:text-black text-white"
                          : "bg-[#E9E9E9] hover:bg-[#dad9d9]"
                      }  rounded-[20px] p-2 px-4 mr-2 font-semibold`}
                      onClick={handleFollow}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <Loader/>
        )}
      </div>

      {pinData && pinData?.exploreMore && pinData.exploreMore?.length > 0 && (
        <div
          className="fixed bottom-12 right-10 w-12 aspect-square rounded-full  flex items-center justify-center hover:bg-[#e9e9e9] transition-all cursor-pointer animate-bounce"
          onClick={handleScroll}
        >
          <FaArrowDown className="text-black text-xl dark:text-white" />
        </div>
      )}
      {/* Explore more pins */}

      {pinData && pinData?.exploreMore && pinData.exploreMore?.length > 0 && (
        <div className="w-full snap-start mt-2" id="moreToExplore">
          <h4 className="text-center">More to explore</h4>
          <Pins
            pins={pinData.exploreMore}
            gridStyle="columns-1 gap-4 lg:gap-4 sm:columns-2 lg:columns-4 xl:columns-6"
          />
        </div>
      )}
    </div>
  );
};

export default PinDetails;
