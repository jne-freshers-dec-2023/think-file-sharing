import "../App.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Container, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", pwd);

    try {
      const response = await axios.post(
        "http://localhost:3200/api/auth/login",
        {
          email: email,
          password: pwd,
        }
      );

      const { data, statusCode } = response.data;

      if (statusCode === 200 && data && data.token) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("token", data.token);

        toast.success("Login successful!");

        setEmail("");
        setPwd("");
        navigate("/home");
      } else {
        console.error("Login failed:", response.data.message);

        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error.message);

      toast.error("Error during login. Please try again later.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h3">Login Page</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth type="submit">
          Login
        </Button>

        <Button
          variant="text"
          color="primary"
          fullWidth
          type="button"
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Login;
