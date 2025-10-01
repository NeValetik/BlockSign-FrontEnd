export interface IProfileUpdateForm {
  fullName: string;
  idnp: string;
  email: string;
  avatar?: string;
  phone: {
    code: string;
    number: string;
  };
}
