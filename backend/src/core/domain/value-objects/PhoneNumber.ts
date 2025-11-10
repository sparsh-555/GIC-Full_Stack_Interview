import { DomainException } from '../exceptions/DomainException';

export class PhoneNumber {
  private readonly value: string;

  constructor(phone: string) {
    if (!this.isValid(phone)) {
      throw new DomainException(
        'Invalid Singapore phone number. Must start with 8 or 9 and have exactly 8 digits.'
      );
    }
    this.value = phone;
  }

  private isValid(phone: string): boolean {
    return /^[89][0-9]{7}$/.test(phone);
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
