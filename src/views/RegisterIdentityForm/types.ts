export interface IRegisterIdentityForm {
  idnp: string;
  email: string;
  fullName: string;
  phone: {
    code: string;
    number: string;
  };
  username: string;
  // birthDate: string;
  // selfie: File | undefined;
}
