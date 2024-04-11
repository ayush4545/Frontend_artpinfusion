import { createSlice } from '@reduxjs/toolkit'


// Define a type for the slice state

type darkTypes={
    darkMode:boolean
}
// Define the initial state using that type
const initialState:darkTypes= {
   darkMode:false
}

export const darkModeSlice = createSlice({
  name: 'mode',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    toggleMode: (state) => {
      state.darkMode= !state.darkMode;
      return state
    }
  },
})

export const {toggleMode} = darkModeSlice.actions


export default darkModeSlice.reducer