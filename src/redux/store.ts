import { configureStore,combineReducers } from '@reduxjs/toolkit'
import userReducer from "./user.slice";
import darkModeReducer from "./darkMode.slice"
import hoverOnReducer from "./hoverOn.slice";
import viewOptionReducer from "./viewOptions.slice";
import storageSession from 'redux-persist/lib/storage/session';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage:storageSession,
}

const rootReducer = combineReducers({ 
  user: userReducer,
  mode: darkModeReducer,
  hoverOn: hoverOnReducer,
  viewOption:viewOptionReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
})

export const  persistor=persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch