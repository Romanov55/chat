/* eslint-disable @next/next/no-img-element */
'use client'

import { UserType } from '@/app/types';
import { useStore } from '@/app/context';

export const Contacts = ({userInfo} : {userInfo: UserType}) => {
    const { setReceiverId } = useStore();

    const activateChat = (_id:string) => {
        setReceiverId(_id);
    };

    return (
        <div className='container__chat'>
            <div className='contacts'>
                {userInfo.friends && userInfo.friends?.map((contact: UserType) => (
                    <div key={contact._id} onClick={() => activateChat(contact._id)}>
                        <img  src={contact.avatar || ""} alt={`Аватар ${contact.name}`} />
                        <div>{contact.name}</div>
                        <div>{contact.lastMessage}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};