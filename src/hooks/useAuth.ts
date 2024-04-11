import { useEffect, useState } from "react"
import { getCookie } from "../config/utils/setAndGetCookies"

const useAuth=()=>{
   const cookies= getCookie("accessToken")
   const [isAuthenticate,setIsAuthenticate]=useState<boolean>(cookies ? true : false)

   // if(cookies){
   //  return {isAuthenticate : true}
   // }
   // return {isAuthenticate : false}
   useEffect(()=>{
      if(cookies){
         setIsAuthenticate(true)
      }else{
         setIsAuthenticate(false)
      }
   },[cookies])

   return isAuthenticate
}

export default useAuth