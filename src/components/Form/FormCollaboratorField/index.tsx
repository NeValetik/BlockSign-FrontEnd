'use client';

import { FC } from "react";
import CollaboratorInput from "./components/CollaboratorInput";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useFieldArray, useFormContext } from "react-hook-form";
import Button from "../Button";
import { Minus, Plus } from "lucide-react";

interface FormCollaboratorFieldProps {
  name: string;
}

const FormCollaboratorField: FC<FormCollaboratorFieldProps> = ({ name }) => {
  const form = useFormContext(); 
  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: name,
  });

  const handleRemove = (index: number) => {
    remove(index);
  }

  const handleAdd = () => {
    append({ name: "", email: "", phone: "" });
  }
  
  return (
    <div className="flex flex-col gap-4">
      {
        fields.map((field, index) => (
          <FormField
            control={control}
            key={field.id}
            name={`${name}.${index}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collaborator</FormLabel>
                <div
                  className="flex gap-2 w-full"
                >
                  <div className="w-full">
                    <FormControl>
                      <CollaboratorInput {...field} />
                    </FormControl>
                  </div>
                  {
                    index > 0 && (
                      <Button
                        onClick={() => handleRemove(index)}
                        variant="outline"
                        className="border-brand gap-2"
                        type="button"
                      >
                        <Minus />
                      </Button>
                    )
                  }
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))
      }
      <Button 
        onClick={handleAdd}
        variant="outline"
        className="border-brand gap-2"
        type="button"
      >
        <span>Add Collaborator</span>
        <Plus />
      </Button>
    </div>
  )
}

export default FormCollaboratorField;