import { Typography } from "@mui/material";

function NotFound() {
  return (
    <div style={{ textAlign: "center", paddingTop: 64 }}>
      <Typography variant="h4" gutterBottom>
        404 - Page not found
      </Typography>
      <Typography variant="body1">
        The page you are looking for does not exist.
      </Typography>
    </div>
  );
}

export default NotFound;
