import { SignOut } from "@/components/sign-out";
import UserAvatar from "@/components/userAvatar";
import { auth } from "../auth"
import { Contacts } from "@/components/contacts";
import { authUser } from "./actions/user";
import Chat from "@/components/chat";

export default async function MainPage() {
    const session = await auth()
    if (!session?.user) return null

    const userInfo = await authUser(session.user)

    return (
        <>
            <div className="left__part">
                <UserAvatar session={session} />
                <SignOut />
                <Contacts userInfo={userInfo}/>
            </div>
            <Chat userId={userInfo._id} />
        </>
    );
}
