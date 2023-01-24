import * as Yup from "yup";

import type { FormField, FormSchema, FormValues } from "./formelements";

const isFieldText = (field: { type: string }) =>
  field.type === "text" ||
  field.type === "textarea" ||
  field.type === "tel" ||
  field.type === "email" ||
  field.type === "password";

const getField = (schema: FormSchema, key: string) =>
  schema.sections.flatMap((s) => s.formFields).find((f) => f.name === key);

function textRuleGenerator(field: FormField) {
  let rule = Yup.string();
  if (field.type === "email") {
    rule = rule.email("A valid email is required");
  } else if (field.type === "password") {
    rule = rule
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "Password must contain at least one letter and one number"
      );
  } else if (field.type === "confirmPassword") {
    rule = rule
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required");
  } else if (field.type === "text" || field.type === "textarea") {
    if (field.maxlen) {
      rule = rule.max(
        field.maxlen,
        `Maximum length is ${field.maxlen} characters`
      );
    } else if (field.minlen) {
      rule = rule.min(
        field.minlen,
        `Minimum length is ${field.minlen} characters`
      );
    }
  } else if (field.type === "tel") {
    rule = rule.matches(
      /^(?:\+91|0)?[1-9]\d{9}$/,
      "Please enter a valid phone number"
    );
  }
  return rule;
}

function dateRuleGenerator(field: FormField) {
  let rule = Yup.date();
  if (field.minDate && field.maxDate) {
    rule = rule
      .min(field.minDate, `Date must be after ${field.minDate}`)
      .max(field.maxDate, `Date must be before ${field.maxDate}`);
  } else if (field.minDate) {
    rule = rule.min(field.minDate, `Date must be after ${field.minDate}`);
  } else if (field.maxDate) {
    rule = rule.max(field.maxDate, `Date must be before ${field.maxDate}`);
  }
  return rule;
}

const createValidationSchema = (schema: FormSchema) => {
  return Yup.lazy((obj: FormValues) =>
    Yup.object(
      Object.keys(obj).reduce((prev, key) => {
        const field = getField(schema, key);

        if (!field) return prev;

        let rule = null;

        if (isFieldText(field)) {
          rule = textRuleGenerator(field);
        }
        if (field.type === "date") {
          rule = dateRuleGenerator(field);
        }
        if (field.type === "boolean") {
          rule = Yup.bool().oneOf([true], `${field.name} is required`);
        }

        if (field.type === "number") {
          rule = Yup.number()
            .typeError("Age must be a number")
            .positive("Age must be a positive number")
            .integer("Age must be a whole number");
        }
        if (rule && field.required) {
          rule = rule.required(`Please enter ${field.label.toLowerCase()}`);
        }

        if (rule) {
          return { ...prev, [key]: rule };
        }
        return prev;
      }, {})
    )
  );
};

export default createValidationSchema;
