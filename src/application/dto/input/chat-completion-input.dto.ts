import { ChatConfigInputDTO } from "./chat-config-input.dto"

export type ChatCompletionInputDTO = {
  chatId: string
  userId: string
  content: string
  config: ChatConfigInputDTO
}