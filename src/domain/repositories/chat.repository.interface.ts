import { Chat } from "../entities/chat.entity"

export interface IChatRepository {
  findChatById(id: string): Promise<Chat>
  save(chat: Chat): Promise<Chat>
}