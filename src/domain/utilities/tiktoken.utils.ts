import { TiktokenModel, encoding_for_model } from "tiktoken";

export function countTokens(model: string, content: string): number {
  return encoding_for_model(model as TiktokenModel).encode(content).length
}