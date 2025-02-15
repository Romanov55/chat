/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { auth } from "../auth"
 
export default async function UserAvatar() {
    const session = await auth()
    
    if (!session?.user) return null

    await axios.post("http://localhost:4000/api/user/registration", { 
        email: session.user.email, 
        name: session.user.name,
        avatar: session.user.image
    });

    return (
        <div>
            <img src={session.user.image || ""} alt="User Avatar" />
            <div>{session.user.name}</div>
            <div>{session.user.email}</div>
        </div>
    )
}