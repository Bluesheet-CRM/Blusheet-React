import React,{useState} from "react";
import app from "../../utils/base";
import {
  Grid,
  Card,
  Container,
  Divider,
  Button,
  CardContent,
  TextField,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import login from "../../Assets/login.jpg";
import axios from "axios";
import google from "../../Assets/google_logo.svg";
function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleEmailSignIn = () => {
		setError("");
		setIsLoading(true);
		app.auth()
			.signInWithEmailAndPassword(email, password)
			.then(user => {
        window.location.href = "/home";
        
			})
			.catch(e => {
				setError(e.message);
				setIsLoading(false);
			});
	};

  return (
    <Container>
      <Grid container style={{ margin: "auto", marginTop: "10vh" }}>
        <Grid item md={6}>
          <h2>Welcome back to Bluesheet!</h2>
          <br />
          <br />
          <Card raised={true} variant="outlined" style={{ width: "80%" }}>
            <CardContent style={{ padding: "2% 7%" }}>
              <h3 style={{ padding: "1rem" }}>
                Don't have an account.
                <Link to="/signup">Register for FREE</Link>{" "}
              </h3>
              <br />
              <TextField
                id="outlined-basic"
                placeholder="Email Address"
                value={email}
							onChange={e => setEmail(e.target.value)}
                variant="outlined"
                style={{ width: "95%", margin: "auto" }}
              />
              <br />
              <br />
              <TextField
                id="outlined-basic1"
                placeholder="Password"
                variant="outlined"
                style={{ width: "95%" }}
                type="password"
                value={password}
							onChange={e => setPassword(e.target.value)}
              />
              <br />
              <br />
              <p style={{ padding: "1rem" }}>
                Forgot your password?. Reset your password.
              </p>
              <br />
              <Button
                variant="contained"
                color="primary"
                style={{ width: "95%", height: "3rem" }}
                onClick={handleEmailSignIn}
              >
                Login
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                style={{ width: "95%", height: "3rem" }}
              >
                Sign in with Google &nbsp;
                <img
                  style={{ height: "30px", width: "30px" }}
                  src={google}
                  alt="google"
                />
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={6}>
          <img src={login} alt="login" />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Login;
