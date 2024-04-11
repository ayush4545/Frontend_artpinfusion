import Cookies from "js-cookie"

const setCookies=(key:string,value:string)=>{
   Cookies.set(key,value,{expires:1})  
}

const getCookie=(key:string) : string=>{
  const allCookies=Cookies.get()
  return allCookies[key]
}

const removeCookie=(key:string)=>{
  Cookies.remove(key)
  
}

export {getCookie,setCookies,removeCookie}