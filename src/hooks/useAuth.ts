import { useEffect, useState } from "react"
import { getCookie } from "../config/utils/setAndGetCookies"
import { labels } from "../config/constants/text.constant"

const useAuth=()=>{
   const cookies= getCookie(labels?.ACCESS_TOKEN)
   const [isAuthenticate,setIsAuthenticate]=useState<boolean>(cookies ? true : false)
   
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