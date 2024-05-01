import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowDown } from "react-icons/fa6";
import { MdOutlineArrowOutward, MdOutlineFileDownload } from "react-icons/md";
import { RiUnpinFill } from "react-icons/ri";
import { MdShare } from "react-icons/md";
import axios from "axios";
import config from "../config";
import Pins from "../components/Pins";
import {
  BoardType,
  PinType,
  SelectedBoardDetailsType,
  UserState,
} from "../Types/types";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { BsFillPinAngleFill } from "react-icons/bs";
import useAuth from "../hooks/useAuth";
import ChooseBoardPopover from "../components/ChooseBoardPopover";
import ShowBoardName from "../components/ShowBoardName";
import Loader from "../components/Loader";
import ShareModal from "../components/ShareModal";
import ErrorImage from "../assets/404Page.gif";
import { labels } from "../config/constants/text.constant";
import { WithErrorBoundariesWrapper } from "../components/WithErrorBoundaries";
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
  const [openShareModel, setOpenShareModel] = useState<boolean>(false);
  const isAuthenticate = useAuth();
  const [isPinSaved, setIsPinSaved] = useState<boolean>(false);
  const [selectedBoardDetails, setSelectedBoardDetails] =
    useState<SelectedBoardDetailsType>({
      boardName: labels?.PROFILE,
      boardId: null,
    });
  const token = getCookie(labels?.ACCESS_TOKEN);
  const [openBoardPopover, setOpenBoardPopover] = useState<boolean>(false);

  const fetchPin = async () => {
    try {
      const res = await axios.get(`${BACKEND_END_POINTS.Get_PIN}/${id}`);
      const resData = await res.data;
      if (resData.statusCode == 200) {
        setPinData(resData.data);
      }
      setIsFollowing(() => {
        const index = resData.data.pin?.user?.followers
          ?.map((f: UserState) => f._id)
          .indexOf(loggedInUser?._id!);
        if (index !== -1) {
          return true;
        }
        return false;
      });

      if (loggedInUser?.savedPins?.length > 0) {
        setIsPinSaved(() => {
          const index = loggedInUser?.savedPins
            ?.map((pin) => pin?._id)
            .indexOf(resData?.data?.pin?._id);

          if (index !== -1) {
            return true;
          }
          return false;
        });
      }
    } catch (error: unknown) {
      toastPopup(error?.message, "error");
    }
  };

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
          toastPopup(
            labels?.FOLLOWING_TOAST_MESSAGE(resData?.data.name),
            "success"
          );
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

        if (resData.statusCode === 200) {
          const newData = resData.data;
          const pin = JSON.parse(JSON.stringify(pinData));
          pin.pin.user = newData;
          setIsFollowing(false);
          setPinData(pin);
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

  useEffect(() => {
    if (isPinSaved) {
      if (pinData?.pin?.boards?.length > 0) {
        const board = loggedInUser?.board.filter((board) => {
          return pinData?.pin?.boards?.some(
            (b1: BoardType) => b1?._id === board?._id
          );
        });

        if (board.length > 0) {
          setSelectedBoardDetails({
            boardName: board[0]?.boardName,
            boardId: board[0]?._id,
          });
        } else {
          setSelectedBoardDetails({
            boardName: labels?.PROFILE,
            boardId: null,
          });
        }
      }
    } else {
      setSelectedBoardDetails({
        boardName: labels?.PROFILE,
        boardId: null,
      });
    }
  }, [isPinSaved, pinData]);

  const handleWindowClick = () => {
    setOpenBoardPopover(false);
    setOpenShareModel(false);
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const handleSavePin = async (
    e: React.MouseEvent<HTMLDivElement>,
    selectedBoardId?: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

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
            ? labels?.PIN_SAVED_IN_BOARD_TOAST_MESSAGE(
                selectedBoardDetails?.boardName
              )
            : labels?.PIN_SAVED_PROFILE_TOAST_MESSAGE;
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
            ? labels?.PIN_REMOVED_EDIT_TOAST_MESSAGE(
                selectedBoardDetails?.boardName
              )
            : labels?.PIN_REMOVE_PROFILE_TOAST_MESSAGE;
          toastPopup(toastMessage, "success");
        }
      }

      setOpenBoardPopover(false);
    } catch (error) {
      console.log("save pin error", error);
    }
  };

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.documentElement.scrollIntoView({ behavior: "smooth" });
  }, []);
  return (
    <div className="w-screen absolute top-[12vh] homeSection  dark:bg-[#282828] min-h-[88%] flex flex-col items-center justify-center gap-10 snap-y snap-proximity">
      <div
        className="fixed w-12 aspect-square rounded-full  flex items-center justify-center hover:bg-[#e9e9e9] transition-all cursor-pointer left-2 top-32 bg-white"
        onClick={() => {
          navigate(-1);
        }}
      >
        <FaArrowLeft className="text-black text-xl" />
      </div>

      {/* main content */}
      <div
        className="flex items-center justify-center w-screen h-[80%] py-5"
        id="mainContent"
      >
        {pinData && pinData?.pin ? (
          <div className="grid grid-cols-1 lg:grid-cols-2  gap-5 w-4/5 md:w-3/5   rounded-3xl shadow-2xl px-2 pt-3 pb-3 dark:shadow-white dark:shadow-lg">
            <div className="w-full h-full p-2">
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
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    (e.target as HTMLImageElement).src = ErrorImage;
                  }}
                  alt={pinData?.pin?.title}
                  className="w-full rounded-3xl h-full  object-cover"
                />
              )}
            </div>

            <div className="w-full">
              <div className="mt-5 flex items-center justify-between flex-wrap">
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
                    onClick={(
                      e: React.MouseEvent<HTMLDivElement, MouseEvent>
                    ) => {
                      e.preventDefault();
                      e.stopPropagation();

                      downloadFile(pinData?.pin?.imageUrl, pinData?.pin?.title);
                    }}
                    title={labels?.DONWLOAD}
                  >
                    <MdOutlineFileDownload className="text-black text-2xl dark:text-white" />
                  </div>
                  <div
                    className="relative rounded-full w-10 aspect-square  flex items-center justify-center hover:bg-[#e9e9e9] transition-all cursor-pointer"
                    onClick={(
                      e: React.MouseEvent<HTMLDivElement, MouseEvent>
                    ) => {
                      e.stopPropagation();
                      setOpenShareModel((prev) => !prev);
                    }}
                    title={labels?.SHARE}
                  >
                    <MdShare className="text-black text-2xl dark:text-white" />
                    {openShareModel && (
                      <ShareModal
                        onClose={() => {
                          setOpenShareModel(false);
                        }}
                        leftTopStyle="top-4 left-10"
                      />
                    )}
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
                    title={isPinSaved ? labels?.REMOVE_PIN : labels?.SAVE_PIN}
                    className="rounded-full w-10 aspect-square  flex items-center justify-center hover:bg-[#e9e9e9] transition-all cursor-pointer"
                    onClick={handleSavePin}
                  >
                    {isPinSaved ? (
                      <RiUnpinFill className="text-black text-lg dark:text-white" />
                    ) : (
                      <BsFillPinAngleFill className="text-black text-lg dark:text-white" />
                    )}
                  </div>

                  {/* board popover */}
                  {openBoardPopover && (
                    <div className="absolute top-12 left-[50%] -translate-x-[50%] z-50 lg:left-0 lg:translate-x-0">
                      <ChooseBoardPopover
                        handleSave={handleSavePin}
                        boards={loggedInUser?.board}
                        setSelectedBoardDetails={setSelectedBoardDetails}
                        pinId={pinData?.pin?._id}
                      />
                    </div>
                  )}
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
              <div className="ml-3 mt-4 flex items-center justify-between flex-wrap gap-5">
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
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = ErrorImage;
                        }}
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
                      {pinData?.pin?.user?.followers?.length}{" "}
                      {labels?.FOLLOWERS}
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
                      }  rounded-[20px] p-2 px-4 mr-2 font-semibold flex-1 md:flex-none sm:flex-none lg:flex-none`}
                      onClick={handleFollow}
                    >
                      {isFollowing ? labels?.FOLLOWING : labels?.FOLLOW}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>

      {pinData && pinData?.exploreMore && pinData.exploreMore?.length > 0 && (
        <div
          className="fixed bottom-12 right-10 w-12 aspect-square rounded-full  flex items-center justify-center hover:bg-[#e9e9e9] transition-all cursor-pointer animate-bounce bg-white"
          onClick={handleScroll}
        >
          <FaArrowDown className="text-black text-xl" />
        </div>
      )}
      {/* Explore more pins */}

      {pinData && pinData?.exploreMore && pinData.exploreMore?.length > 0 && (
        <div className="w-full snap-start mt-2" id="moreToExplore">
          <h4 className="text-center lg:text-lg dark:text-white">
            {labels?.MORE_TO_EXPLORE}
          </h4>
          <div className="mt-10 p-4">
            <Pins
              pins={pinData?.exploreMore}
              gridStyle="columns-2 gap-4 lg:gap-4 sm:columns-2 lg:columns-4 xl:columns-6"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WithErrorBoundariesWrapper(PinDetails);
