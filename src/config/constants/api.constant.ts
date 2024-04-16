const BACKEND_API_URL="http://localhost:8000/api/v1"


const BACKEND_END_POINTS={
    GOOGLE_USER:`${BACKEND_API_URL}/users/googleUser`,
    GET_LOGINED_USER:`${BACKEND_API_URL}/users/getUser`,
    SIGN_UP:`${BACKEND_API_URL}/users/register`,
    LOGOUT:`${BACKEND_API_URL}/users/logout`,
    LOGIN: `${BACKEND_API_URL}/users/login`,
    CREATE_PIN:`${BACKEND_API_URL}/pins/create-pin`,
    Get_ALL_PINS: `${BACKEND_API_URL}/pins/getPins`,
    Get_PIN: `${BACKEND_API_URL}/pins/singlePin`,
    GET_USER: `${BACKEND_API_URL}/users/user`,
    FOLLOW_USER:`${BACKEND_API_URL}/users/follow`,
    UNFOLLOW_USER:`${BACKEND_API_URL}/users/unfollow`,
    CREATE_BOARD: `${BACKEND_API_URL}/boards/createBoard`,
    GET_BOARD: `${BACKEND_API_URL}/boards/getBoard`,
    SAVE_PIN: `${BACKEND_API_URL}/pins/savePin`,
    REMOVE_SAVE_PIN: `${BACKEND_API_URL}/pins/removeSavePin`,
    GET_SAVED_PINS: `${BACKEND_API_URL}/pins/savedPins`,
    UPDATE_BOARD_DETAILS: `${BACKEND_API_URL}/boards/updateDetails`,
    DELETE_BOARD: `${BACKEND_API_URL}/boards/deleteBoard`,
    UPDATE_PIN_DETAILS: `${BACKEND_API_URL}/pins/updatePinDetails`,
    DELETE_PIN: `${BACKEND_API_URL}/pins/deletePin`,
}

export {BACKEND_END_POINTS}