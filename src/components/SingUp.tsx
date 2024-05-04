import { createPortal } from "react-dom";
import React, { ReactElement, useRef, useState } from "react";
import Modal from "./Modal";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import config from "../config";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAppDispatch } from "../hooks/reduxHooks";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import ErrorImage from "../assets/images/notFound.gif"
import { labels } from "../config/constants/text.constant";
type Props = {
  onClose: () => void;
  handleSwitchToLogin: () => void;
};

type FormData = {
  username: string;
  name: string;
  password: string;
  emailId: string;
};

const SignUp = (props: Props) => {
  const [eyeOpen, setEyeOpen] = useState<boolean>(true);
  const { onClose, handleSwitchToLogin } = props;
  const [image, setImage] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [isDisabledSignUp, setIsDisabledSignUp] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const fileRef = useRef<React.LegacyRef<HTMLInputElement> | null>(null);
  const { signUpSchema } = config.utils.yup;
  const { BACKEND_END_POINTS } = config.constant.api;
  const { toastPopup } = config.utils.toastMessage;
  const saveUserInRedux = config.utils.saveUserInReduxAndSetAccessToken;
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      const userInfo = await config.utils.GoogleUserInfo.getGoogleUserInfo(
        access_token
      );

      const userLogin = await axios.post(
        config.constant.api.BACKEND_END_POINTS.GOOGLE_USER,
        userInfo
      );
      saveUserInRedux.useSaveLoginUserAndAccessToken(
        userLogin.data.data,
        dispatch
      );
      onClose();
    },
    onError: (error) => console.log(error),
  });

  const handleSignUp = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    handleGoogleLogin();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = event?.target?.files?.[0];
    setSelectedAvatar(selectedImage);
    // Check if an image is selected
    if (selectedImage) {
      // Use FileReader to read the selected image as a data URL
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const onSubmitHandler = async (data: FormData) => {
    try {
      setIsDisabledSignUp(true);
      const formsData = new FormData();
      formsData.set("username", data.username);
      formsData.set("name", data.name);
      formsData.set("emailId", data.emailId);
      formsData.set("password", data.password);
      if (selectedAvatar) {
        formsData.append("avatar", selectedAvatar);
      }
      const res = await axios.post(BACKEND_END_POINTS.SIGN_UP, formsData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const resData = await res.data;
      saveUserInRedux.useSaveLoginUserAndAccessToken(resData.data, dispatch);
      reset();
      toastPopup(labels?.SIGN_UP_SUCCESS_TOAST_MESSAGE(data.name), "success");
      onClose();
    } catch (error) {
      if (error?.response?.status === 400) {
        toastPopup(labels?.ALL_FIELDS_REQUIRED, "error");
      }
      if (error?.response?.status === 409) {
        toastPopup(labels?.USER_EXISTED, "error");
      }
      if (error?.response?.status === 500) {
        toastPopup(labels?.SIGN_ERROR, "error");
      }
    }finally{
      setIsDisabledSignUp(false)
    }
  };

  const getLoginModal = (): ReactElement => {
    return (
      <Modal
        onClose={onClose}
        isSignupPage={true}
        title="Welcome to PinIt"
        showClose={true}
        widthHeightStyle=" w-[90%] sm:w-2/3 lg:w-1/3 h-auto"
      >
        <div className="grid place-items-center mt-5 items-center w-full">
          <form
            className="w-full grid place-items-center"
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <div
              className="w-[80px] aspect-square rounded-full overflow-hidden  flex items-center justify-center  cursor-pointer transition-all"
              onClick={() => {
                if (fileRef) {
                  (fileRef?.current as HTMLElement)?.click();
                }
              }}
            >
              {image ? (
                <img
                  src={image as string}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = ErrorImage;
                  }}
                  alt="user"
                  className="object-cover w-full h-full rounded-full border-2 border-orange-600"
                />
              ) : (
                <p className="w-full h-full rounded-full flex items-center justify-center bg-gray-300 hover:bg-gray-400 hover:text-white">
                  {labels?.AVATAR}
                </p>
              )}

              <input
                type="file"
                className="hidden"
                ref={fileRef}
                onChange={handleImageChange}
              />
            </div>
            <div className="flex flex-col gap-2 w-[55%] mt-2">
              <label
                htmlFor="name"
                className="text-sm text-black dark:text-white  font-semibold"
                autoFocus
              >
                {labels?.FULL_NAME}
              </label>
              <input
                type="text"
                id="name"
                placeholder={labels?.FULL_NAME}
                className="outline-none border-2 border-gray-400 rounded-xl  py-1 pl-4"
                required
                {...register("name")}
              />
              <p className="text-red-800 text-sm">{errors?.name?.message}</p>
            </div>

            <div className="flex flex-col gap-2 w-[55%] mt-2">
              <label
                htmlFor="username"
                className="text-sm text-black dark:text-white  font-semibold"
                autoFocus
              >
                {labels?.USER_NAME}
              </label>
              <input
                type="text"
                id="username"
                {...register("username")}
                placeholder={labels?.USER_NAME}
                className="outline-none border-2 border-gray-400 rounded-xl  py-1 pl-4"
                required
              />
              <p className="text-red-800 text-sm">
                {errors?.username?.message}
              </p>
            </div>
            <div className="flex flex-col gap-2 w-[55%] mt-2">
              <label
                htmlFor="emailId"
                className="text-sm text-black dark:text-white  font-semibold"
                autoFocus
              >
                {labels?.EMAIL}
              </label>
              <input
                type="text"
                id="emailId"
                {...register("emailId")}
                placeholder={labels?.EMAIL}
                className="outline-none border-2 border-gray-400 rounded-xl  py-1 pl-4"
                required
              />
              <p className="text-red-800 text-sm">{errors.emailId?.message}</p>
            </div>
            <div className="flex flex-col gap-2 w-[55%] mt-2 relative">
              <label
                htmlFor="password"
                className="text-sm text-black dark:text-white  font-semibold"
              >
                {labels?.PASSWORD}
              </label>
              <input
                type={eyeOpen ? "password" : "text"}
                id="password"
                {...register("password")}
                placeholder={labels?.PASSWORD}
                className="outline-none border-2 border-gray-400 rounded-xl  py-1 pl-4"
                required
              />
              <p
                className={`absolute top-[50%] right-3 cursor-pointer ${
                  errors?.password?.message
                    ? "-translate-y-[50%]"
                    : "translate-y-[15%]"
                }`}
              >
                {eyeOpen ? (
                  <FaRegEye
                    onClick={() => {
                      setEyeOpen(false);
                    }}
                  />
                ) : (
                  <FaRegEyeSlash
                    onClick={() => {
                      setEyeOpen(true);
                    }}
                  />
                )}
              </p>
              <p className="text-red-800 text-sm">
                {errors?.password?.message}
              </p>
            </div>

            <button
              className="w-[55%] bg-[#FF8C00] hover:bg-[#FF5E0E] text-white rounded-[20px] p-2 px-4 mt-3 cursor-pointer"
              type="submit"
              disabled={isDisabledSignUp}
            >
              {isDisabledSignUp ? "Creating your account" : labels?.SIGN_UP}
            </button>
          </form>

          <button
            className="flex items-center gap-3 border-2 border-gray-400 w-[55%] p-2 px-4  mt-3 rounded-[20px] justify-center"
            onClick={handleSignUp}
            disabled={isDisabledSignUp}
          >
            <FcGoogle />
            {labels?.SIGN_UP_GOOGLE}
          </button>
          <p
            className="mt-2 font-bold cursor-pointer"
            onClick={handleSwitchToLogin}
          >
            {labels?.ALREADY_MEMBER}
          </p>
        </div>
      </Modal>
    );
  };
  return createPortal(getLoginModal(), document.body);
};

export default WithErrorBoundariesWrapper(SignUp);
