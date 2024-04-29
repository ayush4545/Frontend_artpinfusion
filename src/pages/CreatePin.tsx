import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaCircleArrowUp } from "react-icons/fa6";
import config from "../config";
import CreatePinChooseBoard from "../components/CreatePinChooseBoard";
import {WithErrorBoundariesWrapper} from "../components/WithErrorBoundaries";
import ErrorImage from "../assets/404Page.gif"
import { labels } from "../config/constants/text.constant";
type pinData = {
  title: string;
  description: string;
  tags: string;
  link: string;
};
const CreatePin = () => {
  const { BACKEND_END_POINTS } = config.constant.api;
  const { getCookie } = config.utils.cookies;
  const { toastPopup } = config.utils.toastMessage;
  const [files, setFiles] = useState<File[]>([]);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openBoardDropDown, setOpenBoardDropDown] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  const [pinData, setPinData] = useState<pinData>({
    title: "",
    description: "",
    tags: "",
    link: "",
  });
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles: File[] = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
    if (droppedFiles.length) {
      getImageFromFile(droppedFiles[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    const selectedFiles: File[] = Array.from(e.target.files);
    setFiles(selectedFiles);

    if (selectedFiles.length) {
      // Use FileReader to read the selected image as a data URL
      getImageFromFile(selectedFiles[0]);
    }
  };

  const getImageFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputsChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPinData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleCreatePin = async () => {
    const formData = new FormData();
    formData.set("title", pinData.title);
    formData.set("link", pinData.link);
    formData.set("description", pinData.title);
    formData.set("tags", String(pinData.tags.split(",")));
    formData.set("pinUrl", files[0]);
    if (selectedBoard?.boardId) {
      formData.set("boardId", selectedBoard?.boardId);
    }

    const token = getCookie("accessToken");
    try {
      setBtnDisabled(true);
      const res = await axios.post(BACKEND_END_POINTS.CREATE_PIN, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await res.data;
      
      toastPopup("Your pin has been published", "success");
      setFiles([]);
      setSelectedImage(null);
      setPinData({
        title: "",
        description: "",
        tags: "",
        link: "",
      });
      setSelectedBoard(null);
      imageRef.current = null;
      setBtnDisabled(false);
    } catch (error) {
      
      if (error.response.status === 401) {
        toastPopup(labels?.UNAUTHORIZED_USER, "error");
      }

      if (error.response.statue === 422) {
        toastPopup(labels?.FILE_IS_REQUIRED, "error");
      }

      if (error.response.status === 500) {
        toastPopup(
          labels?.NOT_PUBLISHED_ERROR,
          "error"
        );
      }
    }
  };

  const handleWindowClick = (e) => {
   
    if(e.target.id !== "search"){
      setOpenBoardDropDown(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  return (
    <div className="relative top-[12vh] w-full h-full dark:bg-[#282828]">
      <div className="fixed top-[12vh] w-full py-5 px-5 border-b-[1px] border-gray-300 flex justify-between items-center z-50 bg-white dark:bg-[#282828] dark:text-white">
        <p className="text-xl font-semibold text-black dark:text-white">{labels?.CREATE_PIN}</p>
        {selectedImage && (
          <div>
            <button
              className={`bg-[#FF8C00] ${
                btnDisabled ? "opacity-80" : "hover:bg-[#FF5E0E] "
              }text-white rounded-[20px] p-2 px-4 font-semibold`}
              onClick={handleCreatePin}
              disabled={btnDisabled}
            >
              {labels?.PUBLISH}
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 justify-center w-full p-5 gap-10 mt-[11vh]">
        <div className="flex lg:justify-end justify-center h-auto">
          {/* image upload */}
          {!selectedImage ? (
            <div
              className="bg-[#e9e9e9] w-1/2 px-2 h-96 lg:h-full rounded-3xl overflow-hidden relative mt-1 border-2 border-gray-300 border-dashed text-center cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => {
                if (imageRef) {
                  imageRef.current.click();
                }
              }}
            >
              <div className="flex flex-col items-center h-5/6 justify-center">
                <FaCircleArrowUp className="text-2xl" />
                <p className="text-lg text-wrap w-3/4 mt-3">
                  {labels?.CHOOSE_FILE_DRAG_DROP}
                </p>
              </div>
              <div className="absolute bottom-5 text-center px-2 w-full">
                <p className="text-sm">
                  {labels?.FILE_RECOMMEND_20_MB}
                </p>
                <p className="text-sm">{labels?.LESS_THAN_200_MB}</p>
              </div>
              <input
                type="file"
                className="hidden"
                ref={imageRef}
                onChange={handleFileChange}
                accept="image/*,.mp4"
              />
            </div>
          ) : (
            <div className="w-3/4 rounded-3xl overflow-hidden h-auto">
              {selectedImage?.includes("video/mp4") ? (
                <video
                  autoPlay
                  loop
                  muted
                  controls
                  className="object-cover rounded-3xl w-full h-full"
                >
                  <source src={selectedImage} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={selectedImage as string}
                  onError={(e) => {
                    e.target.src = ErrorImage;
                  }}
                  className="w-full object-contain h-full rounded-3xl"
                />
              )}
            </div>
          )}
        </div>

        {/*  pin description input field */}
        <form className={`w-full ${files.length === 0 && "opacity-30"} flex flex-col items-center lg:items-start`}>
          <div className="flex flex-col w-4/5 gap-2">
            <label htmlFor="title" className="text-sm dark:text-white">
              {labels?.TITLE}
            </label>
            <input
              className="outline-none border-2 border-gray-400 rounded-xl  py-2 pl-4"
              id="title"
              name="title"
              placeholder={labels?.TITLE_PLACEHOLDER}
              type="text"
              disabled={files.length === 0}
              value={pinData.title}
              onChange={handleInputsChange}
            />
          </div>

          <div className="flex flex-col w-4/5 gap-2 mt-3">
            <label htmlFor="description" className="text-sm dark:text-white">
              {labels?.DESCRIPTION}
            </label>
            <textarea
              className="outline-none border-2 border-gray-400 rounded-xl  pl-4 md:h-28 resize-none py-2"
              id="description"
              name="description"
              placeholder={labels?.DESCRIPTION_PIN_PLACEHOLDER}
              rows={5}
              disabled={files.length === 0}
              value={pinData.description}
              onChange={handleInputsChange}
            />
          </div>

          <div className="flex flex-col w-4/5 gap-2 mt-5">
            <label htmlFor="link" className="text-sm dark:text-white">
              {labels?.LINK}
            </label>
            <input
              className="outline-none border-2 border-gray-400 rounded-xl  py-2 pl-4"
              id="link"
              name="link"
              placeholder={labels?.LINK_PLACEHOLDER}
              type="text"
              disabled={files.length === 0}
              value={pinData.link}
              onChange={handleInputsChange}
            />
          </div>

          <div className="flex flex-col w-4/5 gap-2 mt-3 relative">
            <p className="text-sm dark:text-white">{labels?.BOARD}</p>
            <div
              className={`border-gray-400 rounded-xl  py-2 px-4 border-2 flex items-center justify-between dark:text-white ${
                files.length === 0 ? "pointer-events-none" : "cursor-pointer"
              }`}
              id="board"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpenBoardDropDown((prev) => !prev);
              }}
            >
              {selectedBoard ? (
                <div className="w-full rounded-md  font-semibold flex gap-3 items-center dark:text-white">
                  <div className="w-7 aspect-square flex justify-center items-center bg-[#e9e9e9] rounded-lg">
                    {selectedBoard?.pinImage && (
                      <img
                        src={selectedBoard?.pinImage}
                        onError={(e:React.SyntheticEvent<HTMLImageElement, Event>) => {
                          e.target.src = ErrorImage;
                        }}
                        alt={selectedBoard?.pinTitle}
                        className="w-full aspect-square rounded-md object-contain"
                      />
                    )}
                  </div>
                  <p className="text-md font-medium">
                    {selectedBoard?.boardName}
                  </p>
                </div>
              ) : (
                <span>{labels?.CHOOSE_BOARD_TITLE}</span>
              )}
              <FaChevronDown />
            </div>

            {openBoardDropDown && (
              <CreatePinChooseBoard
                setSelectedBoard={setSelectedBoard}
                setOpenBoardDropDown={setOpenBoardDropDown}
              />
            )}
          </div>

          <div className="flex flex-col w-4/5 gap-2 mt-3">
            <label htmlFor="tags" className="text-sm dark:text-white">
              {labels?.TAG} <span className="text-sm -mt-2">- seperated by {"(,)"}</span>
            </label>
            <input
              placeholder={labels?.TAG_PLACEHOLDER}
              id="tags"
              name="tags"
              type="text"
              className="outline-none border-2 border-gray-400 rounded-xl  py-2 pl-4"
              disabled={files.length === 0}
              value={pinData.tags}
              onChange={handleInputsChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithErrorBoundariesWrapper(CreatePin);
