import React, { useState } from "react";
import "../App.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Container, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const validationErrors = {};

    if (!username.trim() || username.length < 5 || username.length > 10) {
      validationErrors.username =
        "Username should be between 5 and 10 characters.";
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Please enter a valid email.";
    }

    if (!pwd.trim() || pwd.length < 5 || pwd.length > 10) {
      validationErrors.password =
        "Password should be between 5 and 10 characters.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3200/api/auth/register",
        {
          email: email,
          password: pwd,
          username: username,
        }
      );

      const { data, statusCode } = response.data;
      console.log("Data ", data);
      console.log("statusCode ", statusCode);

      setEmail("");
      setPwd("");
      setUsername("");
      setErrors({});
      navigate("/");

      toast.success("User registered successfully!", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error during Register:", error.message);

      if (error.response && error.response.data && error.response.data.data) {
        const validationErrors = error.response.data.data;
        Object.values(validationErrors).forEach((error) => {
          toast.error(error.msg, {
            position: "top-right",
          });
        });
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h3">Register Page</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          type="text"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username !== undefined}
          helperText={errors.username}
        />
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email !== undefined}
          helperText={errors.email}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          error={errors.password !== undefined}
          helperText={errors.password}
        />
        <Button variant="contained" color="primary" fullWidth type="submit">
          Register
        </Button>
        <Button
          variant="text"
          color="primary"
          fullWidth
          type="button"
          onClick={() => navigate("/")}
        >
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Register;
