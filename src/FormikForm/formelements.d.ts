export interface FormValues {
  [key: string]: string;
}

export interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  minDate?: string;
  maxDate?: string;
  maxlen?: number;
  minlen?: number;
  options?: { label: string; value: string }[];
  initialValue?: string | boolean | number;
  value?: string;
}

export interface FormSection {
  name: string;
  label: string;
  formFields: FormField[];
}

export interface FormSchema {
  sections: FormSection[];
}
