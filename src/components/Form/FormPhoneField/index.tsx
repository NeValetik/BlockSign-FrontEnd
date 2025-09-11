import { FormControl, FormField, FormItem, FormLabel } from "@/components/FormWrapper";
import { FieldPath, FieldValues, get, FieldError } from "react-hook-form";
import { Input, InputText } from "../Input";

type PhoneFieldError = {
  code?: FieldError;
  number?: FieldError;
};

type ErrorMessage = string | undefined;

interface FormPhoneFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
}

// TODO: code should be changed to dropdown with country code + the field should be validated by country
// TODO: add validation for the number field to allow only numbers
const FormPhoneField = <T extends FieldValues>({ name }: FormPhoneFieldProps<T>) => {
  return (
    <FormField
      name={name}
      render={({ field, formState }) => {
        const fieldErrors = get(formState.errors, name) as PhoneFieldError | undefined;
        const codeError: ErrorMessage = fieldErrors?.code?.message;
        const numberError: ErrorMessage = fieldErrors?.number?.message;
        const phoneError: ErrorMessage = codeError || numberError;
        
        return (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <div className="flex gap-1">
                <Input
                  placeholder="+1"
                  type="number"
                  value={field.value?.code || ""}
                  onChange={(e) =>
                    field.onChange({ ...field.value, code: e.target.value })
                  }
                  // className="basis-1/8"  can be used if code field should be dunamic
                  className="w-20"
                  aria-invalid={!!codeError}
                />
                <InputText
                  placeholder="123456789"
                  value={field.value?.number || ""}
                  onChange={(e) =>
                    field.onChange({ ...field.value, number: e.target.value })
                  }
                  aria-invalid={!!numberError}
                />
              </div>
            </FormControl>
            {phoneError && <p className="text-sm text-destructive">{phoneError}</p>}
          </FormItem>
        );
      }}
    />
  );
};

export default FormPhoneField;