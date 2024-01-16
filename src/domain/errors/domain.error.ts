export class DomainError extends Error {
  constructor (message: string, public readonly details?: string[]) {
    super(message)
  }
}