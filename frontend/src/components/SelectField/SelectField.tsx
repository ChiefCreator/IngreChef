import Select from "../Select/Select";
import ControlField from "../ControlField/ControlField";

import type { SelectProps } from "../Select/Select";

interface InputFieldProps {
  label: string;
  error?: string;
  selectProps: SelectProps;
}

export default function SelectField({ label, selectProps }: InputFieldProps) {

  return (
    <ControlField label={label}>
      <Select {...selectProps} />
    </ControlField>
  );
}
