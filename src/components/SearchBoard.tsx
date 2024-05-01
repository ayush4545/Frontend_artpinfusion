import React, { MutableRefObject, useState } from "react";
import { BoardType } from "../Types/types";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import { labels } from "../config/constants/text.constant";

type Props={
  styles:string,
  setBoards :React.Dispatch<React.SetStateAction<BoardType[] | undefined>>,
  originalBoards: MutableRefObject<BoardType[] | null>
}
const SearchBoard = (props:Props) => {
    const {styles,setBoards,originalBoards}=props
    const [input,setInput]=useState<string>('')
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setInput(e.target.value)
        
      if(e.target.value === '' && originalBoards.current){
        setBoards(originalBoards?.current)
      }else{
        const filteredBoards = originalBoards?.current?.filter((board) =>
          board?.boardName?.toLowerCase()?.includes(e.target.value.toLowerCase())
        );
       
        setBoards(filteredBoards);
      }
    }
  return (
    <input
      className={styles}
      id="search"
      name="search"
      placeholder={labels?.SEARCH_PLACEHOLDER}
      type="search"
      value={input}
      onChange={handleChange}
    />
  );
};

export default WithErrorBoundariesWrapper(SearchBoard);
