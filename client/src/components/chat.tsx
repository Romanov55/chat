'use client'

import { useState, useEffect } from "react";
import { useStore } from "@/store/chatStore";
import socket from "./socket";

export default function Chat() {
    const [message, setMessage] = useState("");
    const messages = useStore((state) => state.messages);
    const setMessages = useStore((state) => state.setMessages);

    useEffect(() => {
        const handleMessage = (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        };
    
        socket.on("message", handleMessage);
    
        return () => {
            socket.off("message", handleMessage);
        };
    }, [setMessages]);
    

    const sendMessage = () => {
        if (message.trim()) {
            const msg = { text: message, createdAt: new Date() };
            socket.emit("message", msg);
            setMessage("");
        }
    };
    
    return (
        <div className="p-4 max-w-lg mx-auto">
            <div className="border rounded-lg p-4 h-80 overflow-y-auto bg-gray-100">
                {messages && messages.map((msg, index) => (
                    <div key={index} className="mb-2 p-2 bg-white rounded-lg shadow">
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="mt-4 flex gap-2">
                <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Введите сообщение..." />
                <button onClick={sendMessage}>Отправить</button>
            </div>
        </div>
    );
}
