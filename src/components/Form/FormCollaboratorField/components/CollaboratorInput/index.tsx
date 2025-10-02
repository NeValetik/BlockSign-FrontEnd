import { FC, InputHTMLAttributes } from "react";
import { Input } from "@/components/Form/Input";

// interface CollaboratorInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
//   value: {
//     username: string;
//   };
// }

// TODO: change to dropdown
const CollaboratorInput:FC<InputHTMLAttributes<HTMLInputElement>> = ( props ) => {
  return (
    <div>
      <Input
        placeholder="Collaborator"
        {...props}
      />
    </div>
  )
}

export default CollaboratorInput;