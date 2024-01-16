import { DomainEntity } from "./domain.entity"
import { Model } from "./model.entity"

export type ChatConfigProps = {
  temperature?: number
  topP?: number
  frequencePenalty?: number
  presencePenalty?: number
  stop?: string[] | string
  n?: number

  model: Model
}

export class ChatConfig extends DomainEntity<ChatConfigProps> {
  get temperature() {
    return this.props.temperature ?? 1.0
  }

  get topP() {
    return this.props.topP ?? 1.0
  }

  get frequencePenalty() {
    return this.props.frequencePenalty ?? 0.0
  }

  get presencePenalty() {
    return this.props.presencePenalty ?? 0.0
  }

  get stop() {
    return this.props.stop ?? null
  }

  get n() {
    return this.props.n ?? 1
  }

  get model() {
    return this.props.model
  }
}