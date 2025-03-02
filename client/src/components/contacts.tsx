/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react';
import Chat from './chat';
import { UserType } from '@/app/types';

export const Contacts = ({userInfo} : {userInfo: UserType}) => {
    const [activeChat, setActiveChat] = useState(false);
    const [activeContact, setActiveContact] = useState('');

    const openChat = () => {
        setActiveChat(true);
    };

    const activateChat = (_id:string) => {
        if (!activeChat) {
            openChat();
        }

        setActiveContact(_id);
    };

    return (
        <div className='contacts'>
            {userInfo.friends && userInfo.friends?.map((contact: UserType) => (
                <div key={contact._id} onClick={() => activateChat(contact._id)}>
                    <img  src={contact.avatar || ""} alt={`Аватар ${contact.name}`} />
                    <div>{contact.name}</div>
                    <div>{contact.lastMessage}</div>
                </div>
            ))}
            {activeChat && <Chat userId={userInfo._id} receiverId={activeContact} />}
        </div>
    );
};