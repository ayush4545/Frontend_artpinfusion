const BACKEND_API_URL=`${import.meta.env.VITE_BACKEND_URL}/api/v1`

const endPoints={
    GOOGLE_USER:"users/googleUser",
    GET_LOGINED_USER:"users/getUser",
    SIGN_UP:"users/register",
    LOGOUT:"users/logout",
    LOGIN:"users/login",
    CREATE_PIN: "pins/create-pin",
    GET_ALL_PINS:"pins/getPins",
    GET_PIN:"pins/singlePin",
    GET_USER:"users/user",
    FOLLOW_USER:"users/follow",
    UNFOLLOE_USER:"users/unfollow",
    CREATE_BOARD:"boards/createBoard",
    GET_BOARD:"boards/getBoard",
    SAVE_PIN:"pins/savePin",
    REMOVE_SAVE_PINS:"pins/removeSavePin",
    GET_SAVED_PINS:"pins/savedPins",
    UPDATE_BOARD_DETAILS:"boards/updateDetails",
    DELETE_BOARD:"boards/deleteBoard",
    UPDATE_PIN_DETAILS:"pins/updatePinDetails",
    DELETE_PIN:"pins/deletePin"
}

const BACKEND_END_POINTS={
    GOOGLE_USER:`${BACKEND_API_URL}/${endPoints?.GOOGLE_USER}`,
    GET_LOGINED_USER:`${BACKEND_API_URL}/${endPoints?.GET_LOGINED_USER}`,
    SIGN_UP:`${BACKEND_API_URL}/${endPoints?.SIGN_UP}`,
    LOGOUT:`${BACKEND_API_URL}/${endPoints?.LOGOUT}`,
    LOGIN: `${BACKEND_API_URL}/${endPoints?.LOGIN}`,
    CREATE_PIN:`${BACKEND_API_URL}/${endPoints?.CREATE_PIN}`,
    Get_ALL_PINS: `${BACKEND_API_URL}/${endPoints?.GET_ALL_PINS}`,
    Get_PIN: `${BACKEND_API_URL}/${endPoints?.GET_PIN}`,
    GET_USER: `${BACKEND_API_URL}/${endPoints?.GET_USER}`,
    FOLLOW_USER:`${BACKEND_API_URL}/${endPoints?.FOLLOW_USER}`,
    UNFOLLOW_USER:`${BACKEND_API_URL}/${endPoints?.UNFOLLOE_USER}`,
    CREATE_BOARD: `${BACKEND_API_URL}/${endPoints?.CREATE_BOARD}`,
    GET_BOARD: `${BACKEND_API_URL}/${endPoints?.GET_BOARD}`,
    SAVE_PIN: `${BACKEND_API_URL}/${endPoints?.SAVE_PIN}`,
    REMOVE_SAVE_PIN: `${BACKEND_API_URL}/${endPoints?.REMOVE_SAVE_PINS}`,
    GET_SAVED_PINS: `${BACKEND_API_URL}/${endPoints?.GET_SAVED_PINS}`,
    UPDATE_BOARD_DETAILS: `${BACKEND_API_URL}/${endPoints?.UPDATE_BOARD_DETAILS}`,
    DELETE_BOARD: `${BACKEND_API_URL}/${endPoints?.DELETE_BOARD}`,
    UPDATE_PIN_DETAILS: `${BACKEND_API_URL}/${endPoints?.UPDATE_PIN_DETAILS}`,
    DELETE_PIN: `${BACKEND_API_URL}/${endPoints?.DELETE_PIN}`,
}

export {BACKEND_END_POINTS}