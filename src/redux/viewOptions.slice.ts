import { createSlice } from '@reduxjs/toolkit'


// Define a type for the slice state

// type hoverOnType={
//     hoverOn:string
// }
// Define the initial state using that type
const initialState:string= 'standard'


export const viewOptionSlice = createSlice({
  name: 'viewOption',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
     setViewOptions: (state,action) => {
      state= action.payload;
      return state
    }
  },
})

export const {setViewOptions} = viewOptionSlice.actions


export default viewOptionSlice.reducer