export type ChatConfigInputDTO = {
  model: string
  maxTokens: number

  temperature?: number
  topP?: number
  frequencePenalty?: number
  presencePenalty?: number
  stop?: string[] | string
  n?: number
  initialSystemMessage: string
}