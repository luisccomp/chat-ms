import { DomainEntity } from "./domain.entity"

export type ModelProps = {
  name: string
  maxTokens: number
}

export class Model extends DomainEntity<ModelProps> {
  get name() {
    return this.props.name
  }

  get maxTokens() {
    return this.props.maxTokens
  }
}