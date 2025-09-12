import { FC, InputHTMLAttributes } from "react";
import { Input } from "@/components/Form/Input";

interface CollaboratorInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value: {
    name: string;
    email: string;
    phone: string;
  };
}

// TODO: change to dropdown
const CollaboratorInput:FC<CollaboratorInputProps> = ( props ) => {
  const { value, ...rest } = props;
  return (
    <div>
      <Input
        placeholder="Collaborator"
        value={ value?.name }
        {...rest}
      />
    </div>
  )
}

export default CollaboratorInput;