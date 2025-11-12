export interface Employee {
  id: string;
  name: string;
  emailAddress: string;
  phoneNumber: string;
  gender: 'Male' | 'Female';
  daysWorked?: number;
  cafe?: string;
}

export interface CreateEmployeeInput {
  name: string;
  emailAddress: string;
  phoneNumber: string;
  gender: 'Male' | 'Female';
  cafeId?: string;
}

export interface UpdateEmployeeInput {
  id: string;
  name: string;
  emailAddress: string;
  phoneNumber: string;
  gender: 'Male' | 'Female';
  cafeId?: string;
}
