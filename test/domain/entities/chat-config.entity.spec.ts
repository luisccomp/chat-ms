import { ChatConfig } from "../../../src/domain/entities/chat-config.entity"
import { Model } from "../../../src/domain/entities/model.entity"

describe('ChatConfig specs', () => {
  it('Should create a config with default values', () => {
    const model = new Model({ name: 'gpt-3.5-turbo', maxTokens: 4096 })
    const config = new ChatConfig({ model })

    expect(config.temperature).toBe(1.0)
    expect(config.topP).toBe(1.0)
    expect(config.frequencePenalty).toBe(0.0)
    expect(config.presencePenalty).toBe(0.0)
    expect(config.stop).toBeNull()
    expect(config.n).toBe(1)
    expect(config.model).toBe(model)
  })
})