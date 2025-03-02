import { SignOut } from "@/components/sign-out";
import UserAvatar from "@/components/userAvatar";
import { auth } from "../auth"
import { Contacts } from "@/components/contacts";
import { authUser } from "./actions/user";

export default async function MainPage() {
    const session = await auth()
    if (!session?.user) return null

    const userInfo = await authUser(session.user)

    return (
        <div >
            <UserAvatar session={session} />
            <SignOut />
            <Contacts userInfo={userInfo}/>
        </div>
    );
}
