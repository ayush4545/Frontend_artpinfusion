import React, { MutableRefObject, useState } from "react";
import { BoardType } from "../Types/types";

type Props={
  styles:string,
  setBoards : ()=>void,
  originalBoards: MutableRefObject<null | BoardType[]>
}
const SearchBoard = (props:Props) => {
    const {styles,setBoards,originalBoards}=props
    const [input,setInput]=useState('')
    const handleChange=(e)=>{
        setInput(e.target.value)
        console.log(30,e.target.value,originalBoards)
      if(e.target.value === '' && originalBoards.current){
        setBoards(originalBoards?.current)
      }else{
        const filteredBoards = originalBoards?.current?.filter((board) =>
          board?.boardName?.toLowerCase()?.includes(e.target.value.toLowerCase())
        );
        console.log(35,filteredBoards)
        setBoards(filteredBoards);
      }
    }
  return (
    <input
      className={styles}
      id="search"
      name="search"
      placeholder="Search"
      type="search"
      value={input}
      onChange={handleChange}
    />
  );
};

export default SearchBoard;
