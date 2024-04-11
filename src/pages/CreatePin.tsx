import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaCircleArrowUp } from "react-icons/fa6";
import config from "../config";
import CreatePinChooseBoard from "../components/CreatePinChooseBoard";
import { useAppSelector } from "../hooks/reduxHooks";

type pinData = {
  title: string;
  description: string;
  tags: string;
  board: string;
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
  const [btnDisabled,setBtnDisabled]=useState<boolean>(false)
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
    if(selectedBoard?.boardId){
      formData.set("boardId",selectedBoard?.boardId)
    }

    const token = getCookie("accessToken");
    try {
      setBtnDisabled(true)
      const res = await axios.post(BACKEND_END_POINTS.CREATE_PIN, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await res.data;
      console.log(resData);
      toastPopup("Your pin has been published", "success");
      setFiles([]);
      setSelectedImage(null);
      setPinData({
        title: "",
        description: "",
        tags: "",
        link: "",
      });
      setSelectedBoard(null)
      imageRef.current = null;
      setBtnDisabled(false)
    } catch (error) {
      console.log("create pin error", error);
      if (error.response.status === 401) {
        toastPopup("Unauthorized user", "error");
      }

      if (error.response.statue === 422) {
        toastPopup("File is required", "error");
      }

      if (error.response.status === 500) {
        toastPopup(
          "Sorry!, due to some problem pin not able to published",
          "error"
        );
      }
    }
  };

  const handleWindowClick = () => {
    setOpenBoardDropDown(false);
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  return (
    <div className="mt-[12vh] w-full">
      <div className="py-5 px-5 border-[1px] border-gray-300 flex justify-between items-center">
        <p className="text-xl font-semibold text-black">Create Pin</p>
        {selectedImage && (
          <div>
            <button
              className={`bg-[#FF8C00] ${btnDisabled ? 'opacity-80': 'hover:bg-[#FF5E0E] '}text-white rounded-[20px] p-2 px-4 font-semibold`}
              onClick={handleCreatePin}
              disabled={btnDisabled}
            >
              Publish
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-center w-full p-5 gap-10">
        <div className="w-1/2 flex justify-end">
          {/* image upload */}
          {!selectedImage ? (
            <div
              className="bg-[#e9e9e9] w-1/2 px-2 h-full rounded-3xl overflow-hidden relative mt-1 border-2 border-gray-300 border-dashed text-center cursor-pointer"
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
                  Choose a file or drag and drop it here
                </p>
              </div>
              <div className="absolute bottom-5 text-center px-1">
                <p className="text-sm">
                  We recommend using high quality files less than 20MB
                </p>
                <p className="text-sm">or .mp4 files less than 200MB</p>
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
                  className="w-full object-contain h-full rounded-3xl"
                />
              )}
            </div>
          )}
        </div>

        {/*  pin description input field */}
        <form className={`w-1/2 ${files.length === 0 && "opacity-30"}`}>
          <div className="flex flex-col w-4/5 gap-2">
            <label htmlFor="title" className="text-sm">
              Title
            </label>
            <input
              className="outline-none border-2 border-gray-400 rounded-xl  py-2 pl-4"
              id="title"
              name="title"
              placeholder="Add a title"
              type="text"
              disabled={files.length === 0}
              value={pinData.title}
              onChange={handleInputsChange}
            />
          </div>

          <div className="flex flex-col w-4/5 gap-2 mt-3">
            <label htmlFor="description" className="text-sm">
              Description
            </label>
            <textarea
              className="outline-none border-2 border-gray-400 rounded-xl  pl-4 md:h-28 resize-none py-2"
              id="description"
              name="description"
              placeholder="Add a detailed description"
              rows={5}
              disabled={files.length === 0}
              value={pinData.description}
              onChange={handleInputsChange}
            />
          </div>

          <div className="flex flex-col w-4/5 gap-2 mt-5">
            <label htmlFor="link" className="text-sm">
              Link
            </label>
            <input
              className="outline-none border-2 border-gray-400 rounded-xl  py-2 pl-4"
              id="link"
              name="link"
              placeholder="Add a link"
              type="text"
              disabled={files.length === 0}
              value={pinData.link}
              onChange={handleInputsChange}
            />
          </div>

          <div className="flex flex-col w-4/5 gap-2 mt-3 relative">
            <p className="text-sm">Board</p>
            <div
              className={`border-gray-400 rounded-xl  py-2 px-4 border-2 flex items-center justify-between ${
                files.length === 0 ? "pointer-events-none" : "cursor-pointer"
              }`}
              id="board"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOpenBoardDropDown((prev) => !prev);
              }}
            >
              {selectedBoard ?<div className='w-full rounded-md  font-semibold flex gap-3 items-center'>
                            <div className='w-7 aspect-square flex justify-center items-center bg-[#e9e9e9] rounded-lg'>
                              {
                                selectedBoard?.pinImage && (
                                    <img src={selectedBoard?.pinImage} alt={selectedBoard?.pinTitle} className='w-full aspect-square rounded-md object-contain'/>
                                )
                              }  
                            </div>
                            <p className='text-md font-medium'>
                             {selectedBoard.boardName}
                            </p>
                         </div>: <span>Choose a board</span>}
              <FaChevronDown />
            </div>

            {openBoardDropDown && <CreatePinChooseBoard setSelectedBoard={setSelectedBoard} setOpenBoardDropDown={setOpenBoardDropDown}/>}
          </div>

          <div className="flex flex-col w-4/5 gap-2 mt-3">
            <label htmlFor="tags" className="text-sm">
              Tags <span className="text-sm -mt-2">- seperated by {"(,)"}</span>
            </label>
            <input
              placeholder="Add a tag"
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

export default CreatePin;
