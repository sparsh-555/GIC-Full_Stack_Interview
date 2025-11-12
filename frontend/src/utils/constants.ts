export const VALIDATION_RULES = {
  NAME: {
    MIN: 6,
    MAX: 10,
  },
  DESCRIPTION: {
    MAX: 256,
  },
  PHONE: {
    PATTERN: /^[89][0-9]{7}$/,
    MESSAGE: 'Phone number must start with 8 or 9 and have exactly 8 digits',
  },
  EMAIL: {
    PATTERN: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
    MESSAGE: 'Invalid email address',
  },
};

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];
