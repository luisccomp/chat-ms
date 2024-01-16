export abstract class DomainEntity<T> {
  constructor (protected readonly props: T) {
    
  }
}