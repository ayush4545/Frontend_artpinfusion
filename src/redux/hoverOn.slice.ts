import { createSlice } from '@reduxjs/toolkit'


// Define a type for the slice state

// type hoverOnType={
//     hoverOn:string
// }
// Define the initial state using that type
const initialState:string= 'homePin'


export const hoverOnSlice = createSlice({
  name: 'hoverOn',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
     setHoverOn: (state,action) => {
      state= action.payload;
      return state
    }
  },
})

export const {setHoverOn} = hoverOnSlice.actions


export default hoverOnSlice.reducer