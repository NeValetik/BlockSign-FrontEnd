export interface Collaborator {
  username: string;
}

export interface VerifyFormFields {
  document: File[];
};

export interface UploadFormFields {
  document: File[];
  collaborators: Collaborator[];
  docTitle: string;
};