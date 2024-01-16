import { v4 } from "uuid"
import { ChatConfig } from "./chat-config.entity"
import { DomainEntity } from "./domain.entity"
import { Message } from "./message.entity"
import { DomainError } from "../errors/domain.error"
import { CHAT_SESSION_TERMINATED } from "../const/messages/chat.messages"

export type ChatProps = {
  id: string
  userId: string
  status: string
  tokenUsage: number
  
  config: ChatConfig
  initialSystemMessage: Message
  messages: Message[]
  erasedMessages: Message[]
}

export class Chat extends DomainEntity<ChatProps> {
  constructor(userId: string, config: ChatConfig, initialSystemMessage: Message, id?: string) {
    super({
      id: id ?? v4(),
      userId,
      status: 'active',
      tokenUsage: 0,
      config,
      initialSystemMessage,
      messages: [],
      erasedMessages: [],
    })

    this.addMessage(initialSystemMessage)
  }

  get id() {
    return this.props.id
  }

  set id(id) {
    this.props.id = id
  }

  get userId() {
    return this.props.userId
  }

  get status() {
    return this.props.status
  }

  get tokenUsage() {
    return this.props.tokenUsage
  }

  get config() {
    return this.props.config
  }

  get messages() {
    return this.props.messages
  }
  
  get erasedMessages() {
    return this.props.erasedMessages
  }

  addMessage(message: Message) {
    if (this.isFinished())
      throw new DomainError(CHAT_SESSION_TERMINATED)

    let done = false

    while (!done) {
      if (this.config.model.maxTokens >= this.tokenUsage + message.tokens) {
        this.messages.push(message)
        done = true
      } else {
        this.erasedMessages.push(this.messages.shift())
      }

      this.refreshTokenUsage()
    }
  }

  finish() {
    this.props.status = 'ended'
  }

  getAllMessages(): Message[] {
    return [...this.erasedMessages, ...this.messages]
  }

  isFinished(): boolean {
    return this.status === 'ended'
  }

  private refreshTokenUsage() {
    this.props.tokenUsage = this.messages.reduce((total, message) => total + message.tokens, 0)
  }
}