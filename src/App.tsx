import { Box } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

import Router from "./routes";

const roles = ["main", "role 2"];

const App = () => {
  return (
    <BrowserRouter>
      <Box margin="15px" maxWidth="450px">
        <Router userPermissions={roles} />
      </Box>
    </BrowserRouter>
  );
};

export default App;
