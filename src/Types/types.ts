export interface UserState {
  name: string;
  emailId: string;
  imgUrl: string;
  followers: UserState[];
  followedUsers: UserState[];
  pins: PinType[];
  savedPins: PinType[];
  board: BoardType[];
  username: string;
  _id?: string;
  avatar?: string;
}

export interface PinType {
  imageUrl: string;
  sourceLink?: string;
  tags?: string[];
  _id: string;
  title?: string;
  user: UserState;
  boards: BoardType[];
  description?: string;
}

export interface BoardType {
  boardName: string;
  _id: string;
  creatorBy: UserState;
  pins: PinType[];
  description?: string;
}

export type SelectedBoardDetailsType = {
  boardName: string;
  boardId: string | null;
};


export type ErrorTypes={
    response:{
        status:number
    }
}