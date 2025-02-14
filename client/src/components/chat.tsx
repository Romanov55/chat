'use client'

import { useChat } from "@/hooks/useChat";
import { useState } from "react";

export default function Chat({ userId, receiverId, oldMessages }: { userId: string; receiverId: string, oldMessages: [] }) {
    const { messages, sendMessage } = useChat(userId);
    const [text, setText] = useState("");

    const handleSend = () => {
        if (text.trim()) {
            sendMessage(receiverId, text);
            setText("");
        }
    };

    return (
        <div>
            <h2>Чат с пользователем {receiverId}</h2>
            <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflowY: "scroll" }}>
                {oldMessages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: 10 }}>
                        <div>{msg.sender} {userId}</div>
                        <strong>{msg.sender === userId ? "Вы" : "Собеседник"}:</strong> {msg.text}
                    </div>
                ))}
                {messages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: 10 }}>
                        <strong>{msg.sender === userId ? "Вы" : "Собеседник"}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Введите сообщение..." />
            <button onClick={handleSend}>Отправить</button>
        </div>
    );
}
