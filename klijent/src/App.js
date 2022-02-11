import React from "react";
import "./App.css";
import Nav from "./Nav";
import About from "./About";
import Shop from "./Shop";
import Item from "./Item";
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import ItemProfil from "./ItemProfil";
import Home from "./home";
import Kategorija from "./kategorija";

function App() {
  return (
    <Router basename="/">
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/item/:id" element={<ItemProfil />} />
          <Route path="/kategorija/:kat" element={<Kategorija />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
