import Chat from "@/components/chat";
import { SignOut } from "@/components/sign-out";
import UserAvatar from "@/components/userAvatar";
import { auth } from "../auth"
import axios from "axios";

export default async function ChatPage() {
    const session = await auth()
    if (!session?.user) return null

    const response = await axios.get(`http://localhost:4000/api/message?sender=67af24c99ff781d79c184f06&receiver=67af3ab82f84e5236268fbb3`);
    const oldMessages = response.data;
    
    return (
        <div >
            <UserAvatar />
            <SignOut />
            <Chat userId={'67af24c99ff781d79c184f06'} receiverId={'67af3ab82f84e5236268fbb3'} oldMessages={oldMessages} />
        </div>
    );
}
