import Input from "../Input/Input";
import ControlField from "../ControlField/ControlField";

import type { InputProps } from "../Input/Input";

interface InputFieldProps {
  label: string;
  error?: string;
  inputProps: InputProps;
}

export default function InputField({ label, error, inputProps }: InputFieldProps) {
  const { id } = inputProps;

  return (
    <ControlField label={label} error={error} controlId={id}>
      <Input {...inputProps} error={error} />
    </ControlField>
  );
}
