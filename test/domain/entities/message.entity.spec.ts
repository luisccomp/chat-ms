import { Message } from "../../../src/domain/entities/message.entity"
import { Model } from "../../../src/domain/entities/model.entity"

describe('Message specs', () => {
  it('Should create an instance of a message', () => {
    const role = 'user'
    const content = 'The quick brown fox jumps over the lazy dog'
    const model = new Model({ name: 'gpt-3.5-turbo', maxTokens: 4096 })

    const message = new Message(role, content, model)

    expect(message.id).toBeTruthy()
    expect(message.role).toBe(role)
    expect(message.content).toBe(content)
    expect(message.tokens).toBe(9)
    expect(message.createdAt).toBeTruthy()
    expect(message.model).toBe(model)
  })
})