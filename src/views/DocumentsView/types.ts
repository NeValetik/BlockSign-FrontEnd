export interface Collaborator {
  name: string;
  email: string;
  phone: string;
}

export interface VerifyFormFields {
  document: File[] | undefined;
  collaborators: Collaborator[] | undefined;
};

export interface UploadFormFields {
  document: File[] | undefined;
};