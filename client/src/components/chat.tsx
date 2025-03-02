'use client'

import { getMessages } from "@/app/actions/messages";
import { MessageType } from "@/app/types";
import { useChat } from "@/hooks/useChat";
import { useEffect, useState, useCallback, useRef } from "react";

export default function Chat({ userId, receiverId }: { userId: string; receiverId: string }) {
    const { messages, sendMessage } = useChat(userId);
    const [oldMessages, setOldMessages] = useState<MessageType[]>([]);
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getAllMessages = async (sender: string, receiver: string) => {
            setIsLoading(true);
            try {
                const resultMessages = await getMessages(sender, receiver);
                if (Array.isArray(resultMessages)) {
                    setOldMessages(resultMessages);
                } else {
                    console.error("Received data is not an array:", resultMessages);
                    setError("Ошибка загрузки сообщений");
                }
            } catch (err) {
                setError("Не удалось загрузить сообщения");
                console.error(err);
            } finally {
                setIsLoading(false); 
            }
        };

        getAllMessages(userId, receiverId);
    }, [userId, receiverId]);

    const handleSend = useCallback(() => {
        if (text.trim()) {
            sendMessage(receiverId, text);
            setText("");
            // Возвращаем фокус на инпут
            const inputElement = document.querySelector('input');
            inputElement?.focus();
        }
    }, [text, receiverId, sendMessage]);

    useEffect(() => {
        // Автопрокрутка вниз при добавлении новых сообщений
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, oldMessages]);

    // Объединяем старые и новые сообщения и сортируем по времени
    const allMessages = [...oldMessages, ...messages].sort((a, b) => {
        return (b.timestamp instanceof Date ? b.timestamp.getTime() : b.timestamp) - 
               (a.timestamp instanceof Date ? a.timestamp.getTime() : a.timestamp);
    });
    
    return (
        <div>
            <h2>Чат с пользователем {receiverId}</h2>
            <div ref={chatContainerRef} style={{ border: "1px solid #ccc", padding: 10, height: 300, overflowY: "scroll" }}>
                {isLoading && <p>Загрузка...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {/* Все сообщения (новые и старые) */}
                {allMessages.length > 0 ? (
                    allMessages.map((msg, index) => (
                        <div key={index} style={{ marginBottom: 10 }}>
                            <strong>{msg.sender === userId ? "Вы" : "Собеседник"}:</strong> {msg.text}
                            <div>{new Date(msg.timestamp).toLocaleString()}</div>
                        </div>
                    ))
                ) : (
                    !isLoading && <p>Нет сообщений</p>
                )}
            </div>

            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Введите сообщение..." />
            <button onClick={handleSend}>Отправить</button>
        </div>
    );
}
