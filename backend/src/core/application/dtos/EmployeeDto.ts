export interface EmployeeDto {
  id: string;
  name: string;
  emailAddress: string;
  phoneNumber: string;
  daysWorked?: number;
  cafe?: string;
  gender: string;
}

export interface CreateEmployeeDto {
  name: string;
  emailAddress: string;
  phoneNumber: string;
  gender: string;
  cafeId?: string;
}

export interface UpdateEmployeeDto {
  id: string;
  name: string;
  emailAddress: string;
  phoneNumber: string;
  gender: string;
  cafeId?: string;
}
