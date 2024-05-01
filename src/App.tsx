import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import config from "./config";
import { useEffect } from "react";
import { getCookie } from "./config/utils/setAndGetCookies";
import axios from "axios";
import { addUser } from "./redux/user.slice";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import CreatePin from "./pages/CreatePin";
import PinDetails from "./pages/PinDetails";
import UserDetails from "./pages/UserDetails";
import WithAuthentication from "./components/WithAuthentication";
import BoardDetails from "./pages/BoardDetails";
import UserAllPins from "./pages/UserAllPins";
import NotFoundPage from "./components/NotFound";
import {WithErrorBoundariesWrapper} from "./components/WithErrorBoundaries";
import AboutUs from "./pages/AboutUs";
import { labels } from "./config/constants/text.constant";

function App() {
  const { GET_LOGINED_USER } = config.constant.api.BACKEND_END_POINTS;
  const {routePaths}=config.constant.routes
  const user=useAppSelector(state=>state.user)
  const dispatch = useAppDispatch();
  const modeValue=useAppSelector(state=>state.mode)
  const routes = [
    {
      path: routePaths.HOME,
      component: <Home/>,
    },
    {
      path: routePaths.CREATE_PIN,
      component: <WithAuthentication>
           <CreatePin/>
        </WithAuthentication>,
    },
    {
       path: routePaths.PIN,
       component: <PinDetails />
    },
    {
      path: routePaths.USER,
      component: <UserDetails/>,
    },
    {
      path:routePaths.BOARD,
      component: <BoardDetails/>
    },
    {
      path: routePaths?.ALL_PINS,
      component: <UserAllPins/>
    },
    {
      path: routePaths?.ABOUT_US,
      component: <AboutUs/>
    },
    {
      path: "*",
      component: <NotFoundPage/>,
    },
  ];

  const getLoggedInUser = async () => {
    const token = getCookie(labels?.ACCESS_TOKEN);

    if (token && user.name ==="") {
      const res = await axios.get(GET_LOGINED_USER, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await res?.data?.data;
      const userObj = {
        name: userData?.name,
        emailId: userData?.emailId,
        imgUrl: userData?.avatar,
        followers: userData?.followers,
        followedUsers: userData?.followedUsers,
        pins: userData?.pins,
        savedPins: userData.savedPins,
        board: userData.board,
        username: userData?.username,
        _id: userData?._id,
      };

      dispatch(addUser(userObj));
    }
  };
  useEffect(() => {
    getLoggedInUser();

    return () => {};
  }, []);

  return (
    <div className={`w-screen h-auto ${modeValue.darkMode ? "dark" : ''} scrollbar-thin scrollbar-track-gray-400/20 scrollbar-thumb-[#f7ab0a]/80`}>
      <BrowserRouter>
        <Header />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          draggable
          theme="light"
          transition={Bounce}
        />

        <Routes>
          {routes.map((route) => {
            return (
              <Route
                exact
                key={route.path}
                path={route.path}
                element={route.component}
              />
            );
          })}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default WithErrorBoundariesWrapper(App);
