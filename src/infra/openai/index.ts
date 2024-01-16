import OpenAI from "openai";
import { clientOptions } from "../config/openai.config";

let openai: OpenAI = null

export default function getOpenAIClient(): OpenAI {
  if (!openai)
    openai = new OpenAI(clientOptions)

  return openai
}