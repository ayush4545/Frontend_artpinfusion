import { createPortal } from "react-dom";
import React, { ReactElement, useRef, useState } from "react";
import Modal from "./Modal";
import { Link } from "react-router-dom";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import config from "../config";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAppDispatch } from "../hooks/reduxHooks";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
type Props = {
  onClose: () => void;
  handleSwitchToSignUp: ()=> void
};
const LogIn = (props: Props) => {
  const { onClose , handleSwitchToSignUp } = props;
  const [eyeOpen, setEyeOpen] = useState<boolean>(true);
  const dispatch= useAppDispatch()
  const { loginSchema } = config.utils.yup;
  const { BACKEND_END_POINTS } = config.constant.api;
  const {toastPopup}=config.utils.toastMessage
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
      const userInfo = await config.utils.GoogleUserInfo.getGoogleUserInfo(access_token)
      console.log(userInfo)
      const userLogin=await axios.post(config.constant.api.BACKEND_END_POINTS.GOOGLE_USER,userInfo)
      config.utils.saveUserInReduxAndSetAccessToken.useSaveLoginUserAndAccessToken(userLogin.data.data,dispatch)
      onClose()
      toastPopup(`Welcome back, ${userLogin?.data?.data?._doc?.name}`,"success")
      window.location.reload()
    },
    onError:(error)=> toastPopup(error?.error_description as string,"warning")
  });

  const handleSignUp=(e: { stopPropagation: () => void; })=>{
    e.stopPropagation();
    handleGoogleLogin()
 }

 const onSubmitHandler=async(data)=>{
   try {
     if(data.password && data.emailId){
      const res= await axios.post(BACKEND_END_POINTS.LOGIN,data)
      const resData=await res?.data
      console.log("login",resData)
      config.utils.saveUserInReduxAndSetAccessToken.useSaveLoginUserAndAccessToken(
        resData.data,
        dispatch
      );
      reset()
      toastPopup(`Welcome back, ${resData?.data?._doc?.name}`,"success")
      onClose();
      window.location.reload()
     }
   } catch (error) {
      console.log("error",error)
      if(error?.response?.status===401){
      toastPopup("Invalid user credientials","warning")
      }
      if(error?.response?.status === 404){
        toastPopup("User does not exists","warning")
      }
   }
 }

  const getLoginModal = (): ReactElement => {
    return (
      <Modal onClose={onClose} isSignupPage={false} title={"Welcome to ArtPinFusion"} showClose={true} widthHeightStyle="w-1/3 h-auto">
        <div className="grid place-items-center mt-10 items-center w-full">
          <form className="w-full grid place-items-center" onSubmit={handleSubmit(onSubmitHandler)} >
            <div className="flex flex-col gap-3 w-[55%]">
              <label
                htmlFor="emailId"
                className="text-md text-black dark:text-white  font-semibold"
                autoFocus
              >
                Email
              </label>
              <input
                type="text"
                id="emailId"
                {...register("emailId")}
                placeholder="Email"
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
                Password
              </label>
              <input
                type={eyeOpen ? "password" : "text"}
                id="password"
                {...register("password")}
                placeholder="Password"
                className="outline-none border-2 border-gray-400 rounded-xl  py-2 pl-4"
                required
              />
              <p className={`absolute top-[50%] right-3 cursor-pointer ${
                  errors?.password?.message
                    ? "-translate-y-[50%]"
                    : "translate-y-[15%]"
                }`}>
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
              <p className="text-red-800 text-sm">{errors?.password?.message}</p>
            </div>
            <Link to="/password-reset" className="w-[55%] mt-2 font-bold">
            Forgot your password?
          </Link>
          <button className="w-[55%] bg-[#FF8C00] hover:bg-[#FF5E0E] text-white rounded-[20px] p-2 px-4 mt-5">
            Log in
          </button>
          </form>
         
          <p className="font-extrabold mt-5">OR</p>
          <button className="flex items-center gap-3 border-2 border-gray-400 w-[55%] p-2 px-4  mt-5 rounded-[20px] justify-center"
           onClick={handleSignUp}
          >
            <FcGoogle />
            Sign up with Google
          </button>

          <p className="mt-5 font-bold cursor-pointer" onClick={handleSwitchToSignUp}>
            Not on ArtPinFusion yet ? Sign up
          </p>
        </div>
      </Modal>
    );
  };
  return createPortal(getLoginModal(), document.body);
};

export default LogIn;
