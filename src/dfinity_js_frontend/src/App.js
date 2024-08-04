import React, { useEffect, useCallback, useState } from "react";
import "./App.css";
import "./styles/tailwind.css";
import "./styles/font.css";
import "./index.css";

// src/dfinity_js_frontend/src/index.css
// import "./styles/font.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Donor from "./pages/Donor/Donor"
import Receiver from "./pages/Receiver/Receiver";
import Driver from "./pages/Driver/Driver";



const App = function AppWrapper() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donor" element={<Donor />} />
          <Route path="/receiver" element={<Receiver />} />
          <Route path="/driver" element={<Driver />} />
        </Routes>
      </Router>
 
 
    </>
  );
};

export default App;
