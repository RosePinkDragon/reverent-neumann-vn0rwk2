import { useRoutes } from "react-router-dom";

import FormGenerator from "./FormikForm";
import Layout from "./layout";
import NotFound from "./pages/NotFoundPage";
import PinInput from "./PinInput";
import testData from "./testData.json";

export default function Router({
  userPermissions,
}: {
  userPermissions: string[];
}) {
  const hasRole = (role: string) => {
    return userPermissions.includes(role);
  };

  return useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "user",
          element: hasRole("role 2") ? (
            <FormGenerator formData={testData} />
          ) : (
            <NotFound />
          ),
          index: true,
        },
        {
          path: "app",
          element: hasRole("role 3") ? (
            <PinInput
              length={6}
              handlePinChange={(pin: string) => console.log(pin)}
            />
          ) : (
            <NotFound />
          ),
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
}
