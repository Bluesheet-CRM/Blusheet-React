import React, { useState } from "react";
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
import signup from "../../Assets/signup.jpg";
import app from "../../utils/base";
import google from "../../Assets/google_logo.svg";
import axios from "axios";
function Signup() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignUp = () => {
    setError("");
    setIsLoading(true);
    app
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        app
          .auth()
          .currentUser.getIdToken()
          .then((token) => {
            try {
              axios({
                method: "post",
                url: `${process.env.REACT_APP_BACKEND_URL}/user`,
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-type": "application/json",
                },
                data: JSON.stringify({
                  fullName: fullName,
                  email: email,
                  phoneNumber: phone,
                  salesforceUser: false,
                }),
              });
            } catch (err) {
              window.alert(err.message);
            }
          });
      })
      .catch((e) => {
        setError(e.message);
        setIsLoading(false);
      });
  };
  const handleGoogleSignUp = () => {
    setError("");
    setIsLoading(true);
    const provider = new app.auth.GoogleAuthProvider();
    app
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        console.log(result.profile);
        app
          .auth()
          .currentUser.getIdToken()
          .then((token) => {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/user`, {
              method: "post",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                fullName: result.user.displayName,
                email: result.user.email,
                phoneNumber: phone,
                salesforceUser: false,
              }),
            })
              .then((response) => console.log(response))
              .catch((err) => window.alert(err.message));
          });
          window.location.href="/home"
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.message);
      });
  };

  return (
    <Container>
      <Grid container style={{ margin: "auto", marginTop: "10vh" }}>
        <Grid item md={6}>
          <h2>Welcome to Bluesheet!</h2>
          <br />
          <br />
          <Card raised={true} variant="outlined" style={{ width: "80%" }}>
            <CardContent style={{ padding: "2% 7%" }}>
              <h3 style={{ padding: "1rem" }}>
                Already a member ? <Link to="/login">Sign in.</Link>
              </h3>
              <br />
              <TextField
                id="outlined-basic2"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Name"
                variant="outlined"
                style={{ width: "95%", margin: "auto" }}
              />
              <br />
              <br />
              <TextField
                id="outlined-basic3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile Number"
                variant="outlined"
                style={{ width: "95%", margin: "auto" }}
              />
              <br />
              <br />
              <TextField
                id="outlined-basic"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                variant="outlined"
                style={{ width: "95%", margin: "auto" }}
              />
              <br />
              <br />
              <TextField
                id="outlined-basic1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                variant="outlined"
                style={{ width: "95%" }}
              />
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                style={{ width: "95%", height: "3rem" }}
                onClick={handleEmailSignUp}
              >
                Signup
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                style={{ width: "95%", height: "3rem" }}
                onClick={handleGoogleSignUp}
              >
                Sign up with Google &nbsp;
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
          <img src={signup} alt="signup" />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Signup;
