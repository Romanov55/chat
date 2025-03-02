/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

export default function UserAvatar({session} : {session: any}) {

    return (
        <div>
            <img src={session.user.image || ""} alt="User Avatar" />
            <div>{session.user.name || ""}</div>
            <div>{session.user.email || ""}</div>
        </div>
    )
}