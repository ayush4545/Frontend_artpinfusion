export interface UserState {
    name:string,
    emailId:string,
    imgUrl:string,
    followers:[],
    followedUsers:[],
    pins:[],
    savedPins:[],
    board:BoardType[],
    username:'',
    _id?:string,
    avatar?:string
}

export interface PinType{
   imageUrl:string,
   sourceLink?:string,
   tags?:string[],
   _id:string,
    title?:string,
    user: UserState,
    boards: [],
    description?:string

}

export interface BoardType{
    boardName: string,
    _id: string,
    creatorBy: UserState,
    pins: PinType[],
    description?:string
}