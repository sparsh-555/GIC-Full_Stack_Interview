import { DomainException } from '../exceptions/DomainException';

export class EmployeeId {
  private readonly value: string;

  constructor(id: string) {
    if (!this.isValid(id)) {
      throw new DomainException(
        'Invalid employee ID format. Must be in format UIXXXXXXX where X is alphanumeric.'
      );
    }
    this.value = id.toUpperCase();
  }

  private isValid(id: string): boolean {
    return /^UI[A-Z0-9]{7}$/.test(id.toUpperCase());
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
