import { v4 } from "uuid"
import { Message } from "../../../src/domain/entities/message.entity"
import { Model } from "../../../src/domain/entities/model.entity"
import { ChatConfig } from "../../../src/domain/entities/chat-config.entity"
import { Chat } from "../../../src/domain/entities/chat.entity"
import { DomainError } from "../../../src/domain/errors/domain.error"
import { CHAT_SESSION_TERMINATED } from "../../../src/domain/const/messages/chat.messages"

describe('Chat specs', () => {
  it('Should create a chat instance', () => {
    const role = 'system'
    const content = 'The quick brown fox jumps over the lazy dog'
    const model = new Model({ name: 'gpt-3.5-turbo', maxTokens: 4096 })

    const initialSystemMessage = new Message(role, content, model)

    const userId = v4()
    const config = new ChatConfig({ model })

    const chat = new Chat(userId, config, initialSystemMessage)

    expect(chat.userId).toBe(userId)
    expect(chat.status).toBe('active')
    expect(chat.tokenUsage).toBe(9)
    expect(chat.config).toBe(config)
    expect(chat.messages.length).toBe(1)
    expect(chat.erasedMessages.length).toBe(0)
    expect(chat.isFinished()).toBeFalsy()
  })

  it('Should add a message', () => {
    const role = 'system'
    const content = 'The quick brown fox jumps over the lazy dog'
    const model = new Model({ name: 'gpt-3.5-turbo', maxTokens: 4096 })

    const initialSystemMessage = new Message(role, content, model)

    const userId = v4()
    const config = new ChatConfig({ model })

    const chat = new Chat(userId, config, initialSystemMessage)

    const message = new Message('user', 'Alpacas are cute', model)

    chat.addMessage(message)

    expect(chat.messages.length).toBe(2)
    expect(chat.tokenUsage).toBe(initialSystemMessage.tokens + message.tokens)
    expect(chat.erasedMessages.length).toBe(0)
  })

  it('Should move a message to erasedMessages', () => {
    const role = 'system'
    const content = 'The quick brown fox jumps over the lazy dog'
    const model = new Model({ name: 'gpt-3.5-turbo', maxTokens: 18 })

    const initialSystemMessage = new Message(role, content, model)

    const userId = v4()
    const config = new ChatConfig({ model })

    const chat = new Chat(userId, config, initialSystemMessage)

    chat.addMessage(new Message('user', content, model))
    chat.addMessage(new Message('user', content, model))

    expect(chat.messages.length).toBe(2)
    expect(chat.erasedMessages.length).toBe(1)
    expect(chat.tokenUsage).toBe(18)
  })

  it('Should throw DomainError when attempt to add a message to a finished chat', () => {
    const role = 'system'
    const content = 'The quick brown fox jumps over the lazy dog'
    const model = new Model({ name: 'gpt-3.5-turbo', maxTokens: 4096 })

    const initialSystemMessage = new Message(role, content, model)

    const userId = v4()
    const config = new ChatConfig({ model })

    const chat = new Chat(userId, config, initialSystemMessage)

    chat.finish()

    expect(() => chat.addMessage(new Message('user', 'Hello, World!', model))).toThrow(new DomainError(CHAT_SESSION_TERMINATED))
  })
})