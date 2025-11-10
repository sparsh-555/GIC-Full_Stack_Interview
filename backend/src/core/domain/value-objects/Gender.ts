import { DomainException } from '../exceptions/DomainException';

export enum GenderType {
  MALE = 'Male',
  FEMALE = 'Female',
}

export class Gender {
  private readonly value: GenderType;

  constructor(gender: string) {
    if (!this.isValid(gender)) {
      throw new DomainException('Invalid gender. Must be either Male or Female.');
    }
    this.value = gender as GenderType;
  }

  private isValid(gender: string): boolean {
    return gender === GenderType.MALE || gender === GenderType.FEMALE;
  }

  toString(): string {
    return this.value;
  }

  getValue(): GenderType {
    return this.value;
  }
}
