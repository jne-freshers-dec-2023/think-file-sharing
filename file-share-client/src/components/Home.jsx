import React, { useState } from "react";
import PermanentDrawerLeft from "./Sidebar";
import Navbar from "./Navbar";
import DocumentSection from "./DocumentSection";

const Home = () => {
  const [searchBy, setSearchBy] = useState();

  console.log("SearchBy value from Home", searchBy);

  return (
    <div style={{ display: "flex" }}>
      <PermanentDrawerLeft />
      <div style={{ flexGrow: 1 }}>
        <Navbar setSearchOn={setSearchBy} />
        <DocumentSection searchOn={searchBy} />
      </div>
    </div>
  );
};

export default Home;
