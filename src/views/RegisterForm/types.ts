export interface IRegisterForm {
  fullName: string;
  email: string;
  phone: {
    code: string;
    number: string;
  }
  // password: string;
  // confirmPassword: string;
}