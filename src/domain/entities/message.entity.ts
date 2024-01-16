import { DomainEntity } from "./domain.entity"
import { v4 } from "uuid"
import { countTokens } from "../utilities/tiktoken.utils"
import { Model } from "./model.entity"

export type MessageRole = 'system' | 'user' | 'assistant'

export type MessageProps = {
  id: string
  role: MessageRole
  content: string
  tokens: number
  createdAt: Date
  model: Model
}

export class Message extends DomainEntity<MessageProps> {
  constructor (role: MessageRole, content: string, model: Model) {
    super({
      id: v4(),
      role,
      content,
      tokens: countTokens(model.name, content),
      createdAt: new Date(),
      model,
    })
  }

  get id() {
    return this.props.id
  }

  get role() {
    return this.props.role
  }

  get content() {
    return this.props.content
  }

  get tokens() {
    return this.props.tokens
  }

  get createdAt() {
    return this.props.createdAt
  }

  get model() {
    return this.props.model
  }
}