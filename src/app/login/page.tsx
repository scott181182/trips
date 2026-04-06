import { Card, CardActions, CardContent, Container, Typography } from "@mui/material";

import { GoogleSignInButton } from "./GoogleSignInButton";

export default function LoginPage() {
  return (
    <Container
      sx={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
    >
      <Card sx={{ width: "max-content", padding: "1rem" }}>
        <CardContent>
          <Typography variant="h1" fontSize="2rem" textAlign="center">
            Log In
          </Typography>
        </CardContent>
        <CardActions>
          <GoogleSignInButton />
        </CardActions>
      </Card>
    </Container>
  );
}
