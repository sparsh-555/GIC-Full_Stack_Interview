export interface IEmployeeIdGenerator {
  generate(): Promise<string>;
}
