export type FieldType =
  | "radio"
  | "checkbox-group"
  | "text"
  | "email"
  | "tel"
  | "consent";

interface FieldBase {
  name: string;
  label: string;
  required?: boolean;
  helpText?: string;
}

export interface OptionItem {
  value: string;
  label: string;
}

export interface RadioField extends FieldBase {
  type: "radio";
  options: OptionItem[];
}

export interface CheckboxGroupField extends FieldBase {
  type: "checkbox-group";
  options: OptionItem[];
}

export interface TextField extends FieldBase {
  type: "text" | "email" | "tel";
  placeholder?: string;
  autocomplete?: string;
}

export interface ConsentField extends FieldBase {
  type: "consent";
}

export type FormField =
  | RadioField
  | CheckboxGroupField
  | TextField
  | ConsentField;

export interface FormSection {
  id: string;
  heading?: string;
  fields: FormField[];
}

// Form state is a flat name -> value map; arrays for multi-select fields.
export type FormState = Record<string, string | string[] | boolean>;
