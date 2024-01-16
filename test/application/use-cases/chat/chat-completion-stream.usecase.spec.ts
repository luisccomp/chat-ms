import { v4 } from "uuid"
import { chatCompletionStreamUseCase } from "../../../../src/application/use-cases/chat/chat-completion-stream.usecase"
import { ChatCompletionInputDTO } from "../../../../src/application/dto/input/chat-completion-input.dto"
import { Chat } from "../../../../src/domain/entities/chat.entity"
import { Model } from "../../../../src/domain/entities/model.entity"
import { Message } from "../../../../src/domain/entities/message.entity"
import { ChatConfig } from "../../../../src/domain/entities/chat-config.entity"

describe('chat-completion-stream usecase specs', () => {
  it('Should create a chat completion', async () => {
    const chatId = v4()
    const userId = v4()
    const content = 'The quick brown fox jumps over the lazy dog'
    
    const config = {
      model: 'gpt-3.5-turbo',
      maxTokens: 4096,
      initialSystemMessage: 'The quick brown fox jumps over the lazy dog',
    }

    const input = {
      chatId,
      userId,
      content,
      config,
    }

    const chatRepositoryMock = {
      findChatById: jest.fn(),
      save: jest.fn()
    }
    const openAIClientMock = {
      chat: {
        completions: {
          create: jest.fn(),
        }
      }
    }

    openAIClientMock.chat.completions.create.mockReturnValue({
      [Symbol.asyncIterator]: async function* () {
        const completions = 'The quick brown fox jumps over the lazy dog'.split(' ')

        for (const completion of completions) {
          yield {
            choices: [{ delta: { content: completion } }]
          }
        }
      }
    })

    // Setting up mocks
    chatRepositoryMock.findChatById.mockReturnValue(Promise.resolve(undefined))
    chatRepositoryMock.save.mockReturnValue(Promise.resolve(createChat(input)))

    const output = await chatCompletionStreamUseCase(
      input,
      chatRepositoryMock as any,
      openAIClientMock as any,
    )

    expect(output.chatId).toBe(chatId)
    expect(output.userId).toBe(userId)
  })
})

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