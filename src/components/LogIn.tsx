import { createPortal } from "react-dom";
import React, { ReactElement, useState } from "react";
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
import { labels } from "../config/constants/text.constant";
type Props = {
  onClose: () => void;
  handleSwitchToSignUp: () => void;
};

type Data={
  password:string,
  emailId:string
}
const LogIn = (props: Props) => {
  const { onClose, handleSwitchToSignUp } = props;
  const [eyeOpen, setEyeOpen] = useState<boolean>(true);
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { loginSchema } = config.utils.yup;
  const { BACKEND_END_POINTS } = config.constant.api;
  const { toastPopup } = config.utils.toastMessage;
  const {getGoogleUserInfo}=config.utils.GoogleUserInfo
  const saveUserInRedux=config.utils.saveUserInReduxAndSetAccessToken
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      setIsLogging(true)
      const userInfo = await getGoogleUserInfo(
        access_token
      );

      const userLogin = await axios.post(
        BACKEND_END_POINTS.GOOGLE_USER,
        userInfo
      );
      saveUserInRedux?.useSaveLoginUserAndAccessToken(
        userLogin.data.data,
        dispatch
      );
      onClose();
      toastPopup(
        labels?.WELCOME_USER_TOAST_MESSAGE(userLogin?.data?.data?._doc?.name),
        "success"
      );
      setIsLogging(false)
      window.location.reload();
    },
    onError: (error) =>{
      setIsLogging(false)
      toastPopup(error?.error_description as string, "warning")
    }
      
  });

  const handleSignUp = (e: React.MouseEvent<HTMLButtonElement,Event>) => {
    e.stopPropagation();
    handleGoogleLogin();
  };

  const onSubmitHandler = async (data:Data) => {
    try {
      if (data.password && data.emailId) {
        setIsLogging(true)
        const res = await axios.post(BACKEND_END_POINTS.LOGIN, data);
        const resData = await res?.data;

        saveUserInRedux?.useSaveLoginUserAndAccessToken(
          resData.data,
          dispatch
        );
        reset();
        toastPopup(
          labels?.WELCOME_USER_TOAST_MESSAGE(resData?.data?._doc?.name),
          "success"
        );
        onClose();
        window.location.reload();
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        toastPopup(labels?.INVALID_USER_TOAST_MESSAGE, "warning");
      }
      if (error?.response?.status === 404) {
        toastPopup(labels?.USER_NOT_EXIST_TOAST_MESSAGE, "warning");
      }
    }finally{
      setIsLogging(false)
    }
  };

  const getLoginModal = (): ReactElement => {
    return (
      <Modal
        onClose={onClose}
        isSignupPage={false}
        title={labels?.LOGIN_TITLE}
        showClose={true}
        widthHeightStyle=" w-[90%] sm:w-2/3 lg:w-1/3 h-auto"
      >
        <div className="grid place-items-center mt-10 items-center w-full">
          <form
            className="w-full grid place-items-center"
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <div className="flex flex-col gap-3 w-[55%]">
              <label
                htmlFor="emailId"
                className="text-md text-black dark:text-white  font-semibold"
                autoFocus
              >
                {labels?.EMAIL}
              </label>
              <input
                type="text"
                id="emailId"
                {...register("emailId")}
                placeholder={labels?.EMAIL}
                className="outline-none border-2 border-gray-400 rounded-xl  py-2 pl-4 bg-white"
                required
              />
              <p className="text-red-800 text-sm">{errors?.emailId?.message}</p>
            </div>
            <div className="flex flex-col gap-3 w-[55%] mt-3 relative">
              <label
                htmlFor="password"
                className="text-md text-black dark:text-white  font-semibold"
              >
                {labels?.PASSWORD}
              </label>
              <input
                type={eyeOpen ? "password" : "text"}
                id="password"
                {...register("password")}
                placeholder={labels?.PASSWORD}
                className="outline-none border-2 border-gray-400 rounded-xl  py-2 pl-4"
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

            <button className="w-[55%] bg-[#FF8C00] hover:bg-[#FF5E0E] text-white rounded-[20px] p-2 px-4 mt-5" disabled={isLogging}>
              {isLogging ? "Logging..." : labels?.LOG_IN}
            </button>
          </form>

          <p className="font-extrabold mt-5">OR</p>
          <button
            className="flex items-center gap-3 border-2 border-gray-400 w-[55%] p-2 px-4  mt-5 rounded-[20px] justify-center"
            onClick={handleSignUp}
            disabled={isLogging}
          >
            <FcGoogle />
            {labels?.SIGN_UP_GOOGLE}
          </button>

          <p
            className="mt-5 font-bold cursor-pointer"
            onClick={handleSwitchToSignUp}
          >
            {labels?.NOT_SIGN_UP}
          </p>
        </div>
      </Modal>
    );
  };
  return createPortal(getLoginModal(), document.body);
};

export default WithErrorBoundariesWrapper(LogIn);
