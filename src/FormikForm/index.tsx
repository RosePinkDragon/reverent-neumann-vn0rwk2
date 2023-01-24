import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Formik, Form } from "formik";
import { FaPhoneAlt } from "react-icons/fa";

import testData from "../testData.json";

import type { FormSchema, FormValues } from "./formelements";
import createValidationSchema from "./generateValidationSchema";

function FormGenerator({ formData }: { formData: FormSchema }) {
  const validationSchema = createValidationSchema(testData);

  const formSchema: FormSchema = formData;
  const initialValues: FormValues = {};

  formSchema.sections.forEach((section) => {
    section.formFields.forEach((field) => {
      if (field.initialValue) {
        initialValues[field.name] = field.initialValue.toString();
      } else {
        initialValues[field.name] = "";
      }
    });
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={() => {}}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
      }) => (
        <Form>
          {formSchema.sections.map((section) => (
            <div key={section.name}>
              <h3>{section.name}</h3>
              {section.formFields.map((field) => {
                switch (field.type) {
                  case "text":
                  case "email":
                  case "password":
                    return (
                      <TextField
                        margin="normal"
                        key={field.name}
                        id={field.name}
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={values[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched[field.name] && Boolean(errors[field.name])
                        }
                        helperText={touched[field.name] && errors[field.name]}
                        fullWidth
                      />
                    );
                  case "checkbox":
                    return (
                      <FormGroup>
                        {field.options?.map((option) => (
                          <FormControlLabel
                            key={option.label + option.value}
                            control={
                              <Checkbox
                                id={option.label}
                                name={field.name}
                                value={option.value}
                                checked={Boolean(
                                  values[field.name].includes(option.value)
                                )}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                color="primary"
                                required={field.required}
                              />
                            }
                            label={field.label}
                          />
                        ))}
                      </FormGroup>
                    );
                  case "date":
                    return (
                      <FormControl key={field.name}>
                        <DatePicker
                          label={field.label}
                          value={
                            values[field.name]
                              ? dayjs(values[field.name])
                              : null
                          }
                          onChange={(date) =>
                            setFieldValue(
                              field.name,
                              date?.format("YYYY-MM-DD")
                            )
                          }
                        />
                        {errors[field.name] && (
                          <FormHelperText error>
                            {errors[field.name]}
                          </FormHelperText>
                        )}
                      </FormControl>
                    );
                  case "tel":
                    return (
                      <FormControl key={field.name}>
                        <TextField
                          margin="normal"
                          key={field.name}
                          name={field.name}
                          label={field.label}
                          type="tel"
                          placeholder={field.placeholder}
                          required={field.required}
                          fullWidth
                          variant="outlined"
                          value={values[field.name]}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FaPhoneAlt />
                              </InputAdornment>
                            ),
                          }}
                          error={
                            touched[field.name] && Boolean(errors[field.name])
                          }
                        />
                        {errors[field.name] && (
                          <FormHelperText error>
                            {errors[field.name]}
                          </FormHelperText>
                        )}
                      </FormControl>
                    );
                  case "radio":
                    return (
                      <FormControl
                        component="fieldset"
                        key={field.name}
                        margin="normal"
                        fullWidth
                      >
                        <FormLabel component="legend">{field.label}</FormLabel>
                        <RadioGroup
                          aria-label={field.name}
                          name={field.name}
                          value={values[field.name]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          {field.options?.map((option) => (
                            <FormControlLabel
                              key={option.value + option.label}
                              value={option.value}
                              control={<Radio color="primary" />}
                              label={option.label}
                            />
                          ))}
                        </RadioGroup>
                        {touched[field.name] && errors[field.name] && (
                          <FormHelperText error>
                            {errors[field.name]}
                          </FormHelperText>
                        )}
                      </FormControl>
                    );
                  case "select":
                    return (
                      <FormControl key={field.name} fullWidth margin="normal">
                        <InputLabel id={`${field.name}-label`}>
                          {field.label}
                        </InputLabel>
                        <Select
                          labelId={`${field.name}-label`}
                          id={field.name}
                          name={field.name}
                          value={values[field.name]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched[field.name] && Boolean(errors[field.name])
                          }
                          required={field.required}
                        >
                          <MenuItem value="" disabled>
                            {field.placeholder}
                          </MenuItem>
                          {field.options?.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched[field.name] && errors[field.name] && (
                          <FormHelperText error>
                            {errors[field.name]}
                          </FormHelperText>
                        )}
                      </FormControl>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          ))}
          <Button type="submit" variant="contained" role="button">
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default FormGenerator;
