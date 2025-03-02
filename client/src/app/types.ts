export interface MessageType {
  sender: string;
  text: string;
  timestamp: Date;
}

export interface UserType {
  _id: string;
  email: string;
  name: string;
  avatar: string;
  friends: UserType[];
  lastMessage?: string;
}