import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Button, Typography, Container, Box } from "@mui/material";
// import Page from "../components/shortComponents/Page";

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
}));

export default function PageNotFound() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/login");
  };

  return (
      <Container>
        <ContentStyle sx={{ textAlign: "center", alignItems: "center" }}>
          <Typography variant="h3" paragraph>
            Sorry, page not found!
          </Typography>

          <Typography sx={{ color: "text.secondary" }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
            mistyped the URL? Be sure to check your spelling.
          </Typography>

          <Box
            component="img"
            src="/static/images/404.png"
            sx={{ height: 300, mx: "auto", my: 1 }}
          />

          <Button size="large" variant="contained" onClick={handleBack}>Go back</Button>
        </ContentStyle>
      </Container>
  );
}
