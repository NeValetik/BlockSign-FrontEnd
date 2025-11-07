'use client';

import { FC } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Minus, Plus } from "lucide-react";

import CollaboratorInput from "./components/CollaboratorInput";
import Button from "../Button";

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
    append({ username: "" });
  }
  
  return (
    <div className="flex flex-col gap-4">
      {
        fields.map((field, index) => (
          <FormField
            control={control}
            key={field.id}
            name={`${name}.${index}.username`}
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
                        className="border-destructive text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
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
        className="border-brand gap-2 text-muted-foreground"
        type="button"
      >
        <span>Add Collaborator</span>
        <Plus />
      </Button>
    </div>
  )
}

export default FormCollaboratorField;