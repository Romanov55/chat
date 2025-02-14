import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

// Адрес твоего сервера (замени на свой)
const SERVER_URL = "http://localhost:4000";

export function useChat(userId: string) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        if (!userId) return;

        // Подключаемся к WebSocket серверу
        const newSocket = io(SERVER_URL);
        setSocket(newSocket);

        // Входим в свою комнату (по userId)
        newSocket.emit("joinRoom", userId);

        // Обрабатываем входящие сообщения
        newSocket.on("receiveMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        // Очистка при размонтировании
        return () => {
            newSocket.disconnect();
        };
    }, [userId]);

    // Функция для отправки сообщения
    const sendMessage = (receiver: string, text: string) => {
        if (socket) {
            socket.emit("sendMessage", { sender: userId, receiver, text });
        }
    };

    return { messages, sendMessage };
}
