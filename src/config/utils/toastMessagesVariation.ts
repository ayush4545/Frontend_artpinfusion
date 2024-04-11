import { toast ,Bounce} from 'react-toastify';

const toastPopup=(message:string,type:string,theme:string="dark") : void=>{
    
    toast[type](message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme,
        transition: Bounce,
        });
}

export {toastPopup}