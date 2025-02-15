import Image from 'next/image';
import React from 'react';

interface Props {
    contacts?: Contacts[];
}

interface Contacts {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
}

export const Contacts: React.FC<Props> = ({contacts}) => {
    return (
        <div className='contacts'>
            {contacts?.map((contact) => (
                <div key={contact.id}>
                    <Image width={50} height={50} src={contact.avatar} alt="Contact Avatar" />
                    <div>{contact.name}</div>
                    <div>{contact.lastMessage}</div>
                </div>
            ))}
        </div>
    );
};