export class NotFoundException extends Error {
  constructor(resource: string, identifier: string) {
    super(`${resource} with identifier '${identifier}' not found`);
    this.name = 'NotFoundException';
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}
