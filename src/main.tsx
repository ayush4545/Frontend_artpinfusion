import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import config from "./config/index.ts";
import { store ,persistor} from "./redux/store.ts";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import Loader from "./components/Loader.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <PersistGate loading={<Loader/>} persistor={persistor}>
      <GoogleOAuthProvider
        clientId={config.constant.auth.authConstant.GOOGLE_CLIENT_ID}
      >
        <App />
      </GoogleOAuthProvider>
      </PersistGate>
      
    </Provider>
);
