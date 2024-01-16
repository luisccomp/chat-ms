import { countTokens } from "../../../src/domain/utilities/tiktoken.utils"

describe('tiktoken utilities specs', () => {
  it('Should return the number of tokens', () => {
    const model = 'gpt-3.5-turbo'
    const content = 'The quick brown fox jumps over the lazy dog'

    expect(countTokens(model, content)).toBe(9)
  })
})