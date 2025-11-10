import { DomainException } from '../exceptions/DomainException';

export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new DomainException('Invalid email address format.');
    }
    this.value = email.toLowerCase();
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    return emailRegex.test(email);
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
