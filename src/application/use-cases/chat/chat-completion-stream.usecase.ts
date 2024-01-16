import { ChatCompletionInputDTO } from "../../dto/input/chat-completion-input.dto";
import { Model } from "../../../domain/entities/model.entity";
import { Message } from "../../../domain/entities/message.entity";
import { ChatConfig } from "../../../domain/entities/chat-config.entity";
import { Chat } from "../../../domain/entities/chat.entity";
import { ChatCompletionOutputDTO } from "../../dto/output/chat-completion-output.dto";
import { IChatRepository } from "../../../domain/repositories/chat.repository.interface";
import OpenAI from "openai";

export async function chatCompletionStreamUseCase(
    input: ChatCompletionInputDTO, 
    chatRepository: IChatRepository, 
    openAIClient: OpenAI,
): Promise<ChatCompletionOutputDTO> {
  let chat = await chatRepository.findChatById(input.chatId)

  if (!chat)
    chat = createChat(input)

  const message = new Message('user', input.content, chat.config.model)

  chat.addMessage(message)

  const messages = []

  for (const message of chat.messages)
    messages.push({
      role: message.role,
      content: message.content,
    })

  const stream = await openAIClient.chat.completions.create({
    model: chat.config.model.name,
    messages,
    stream: true
  })

  const completions = []

  for await (const chunk of stream)
    completions.push(chunk.choices[0]?.delta?.content ?? '')

  await chatRepository.save(chat)

  return {
    chatId: input.chatId,
    userId: input.userId,
    content: completions.join(' ')
  }
}

function createChat(input: ChatCompletionInputDTO): Chat {
  const model = new Model({
    name: input.config.model,
    maxTokens: input.config.maxTokens,
  })

  const initialSystemMessage = new Message('system', input.config.initialSystemMessage, model)

  const config = new ChatConfig({
    model,
    temperature: input.config.temperature,
    topP: input.config.topP,
    n: input.config.n,
    stop: input.config.stop,
    frequencePenalty: input.config.frequencePenalty,
    presencePenalty: input.config.presencePenalty,
  })

  return new Chat(input.userId, config, initialSystemMessage, input.chatId)
}