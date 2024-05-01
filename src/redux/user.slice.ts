import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { UserState } from '../Types/types'

// Define a type for the slice state


// Define the initial state using that type
const initialState: UserState = {
  name:'',
  emailId:'',
  imgUrl:'',
  pins:[],
  board:[],
  followedUsers:[],
  followers:[],
  savedPins:[],
  username:''
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    addUser: (state, action: PayloadAction<UserState>) => {
      state = {...action.payload}
    return state
    },
    removeUser: (state)=>{
      state={
        name:'',
        emailId:'',
        imgUrl:'',
        pins:[],
        board:[],
        followedUsers:[],
        followers:[],
        savedPins:[],
        username:''
      }
      return state
    }
  },
})

export const {addUser,removeUser} = userSlice.actions



export default userSlice.reducer