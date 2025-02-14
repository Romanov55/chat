import { Server } from "socket.io";
import Message from "./models/Message";

let io: Server; // Глобальная переменная для хранения экземпляра Socket.IO сервера

// Функция инициализации WebSocket-сервера
export function initSocket(server: any) {
    io = new Server(server, {
        cors: { origin: "*" } // Разрешаем доступ к WebSocket с любого домена
    });

    // Обрабатываем новое подключение клиента
    io.on("connection", (socket) => {
        // Присоединение к комнате по userId
        socket.on("joinRoom", (userId) => {
            socket.join(userId);
            console.log(`👤 Пользователь ${userId} вошел в свою комнату`);
        });

        // Обработчик отправки сообщений
        socket.on("sendMessage", async ({ sender, receiver, text }) => {
            try {
                const message = new Message({ sender, receiver, text });
                await message.save();

                io.to(receiver).emit("receiveMessage", message);
                io.to(sender).emit("receiveMessage", message);

                console.log(`📩 Сообщение отправлено от ${sender} к ${receiver}`);
            } catch (error) {
                console.error("Ошибка при отправке сообщения:", error);
            }
        });
    });

    return io;
}

// Функция для получения экземпляра io (если он уже инициализирован)
export function getIo() {
    if (!io) {
        throw new Error("Socket.io не инициализирован");
    }
    return io;
}
