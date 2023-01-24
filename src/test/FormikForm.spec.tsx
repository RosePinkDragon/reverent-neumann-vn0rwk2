import FormGenerator from "../FormikForm";
import createValidationSchema from "../FormikForm/generateValidationSchema";
import testData from "../testData.json";

import { render } from "./testUtils";

// write test for FormGenerator
describe("FormGenerator", () => {
  it("should render a form", async () => {
    const component = render(<FormGenerator formData={testData} />);
    expect(component).toMatchSnapshot();
    expect(await component.findByText("Submit")).toBeTruthy();
  });
});

describe("the validation schema generates proper schema", async () => {
  const validationSchema = await createValidationSchema(testData);

  test("it should generate the correct validation schema", async () => {
    expect(validationSchema).toMatchSnapshot();
  });

  test("it should say the schema is valid", async () => {
    const schemaToValidate = await validationSchema.isValid({
      date: "2023-04-13",
      email: "asdf@adsfasd",
      firstName: "asdfasd",
      lastName: "asdfas",
      password: "1231231231asdfasd",
      phone: "1231231231",
      question1: "",
      question2: ["option3", "option1"],
      question3: "option2",
    });

    expect(schemaToValidate).toBe(true);
  });

  test("it should say the schema is inValid", async () => {
    const inValidSchema = async () => {
      await validationSchema.validate({
        date: "2023-04-13",
        email: "asdfa@dsfasd",
        firstName: "asdfasd",
        lastName: "asdfas",
        password: "12312",
        phone: "1231231231",
        question1: "",
        question2: ["option3", "option1"],
        question3: "option2",
      });
    };

    expect(inValidSchema).rejects.toThrow(
      "Password must be at least 8 characters"
    );
  });
});
