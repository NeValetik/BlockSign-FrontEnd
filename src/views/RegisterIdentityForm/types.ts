export interface IRegisterIdentityForm {
  idnp: string;
  email: string;
  fullName: string;
  phone: {
    code: string;
    number: string;
  };
  // birthDate: string;
  // selfie: File | undefined;
}
