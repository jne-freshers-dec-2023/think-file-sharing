import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import PageNotFound from "./components/PageNotFound";
import Unauthorized from "./components/Unauthorized";
import Register from "./components/Register";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
