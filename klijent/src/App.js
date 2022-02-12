import React, { useState } from "react";
import "./App.css";
import Nav from "./Nav";
import About from "./About";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ItemProfil from "./ItemProfil";
import Home from "./home";
import Kategorija from "./kategorija";
import Korpa from "./Korpa";
import ListaZelja from "./Lista zelja/ListaZelja";
import Login from "./Login/Login";
import Registracija from "./Registracija/registracija";
import Search from "./Search/search";



function App() {
	return (
		<Router basename="/">
			<div className="App">
				<Nav />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/korpa" element={<Korpa />} />
					<Route path="/item/:id" element={<ItemProfil />} />
					<Route path="/kategorija/:kat" element={<Kategorija />} />
					<Route path="/listazelja" element={<ListaZelja />} />
					<Route path="/login" element={<Login />}/>
					<Route path="/registracija" element={<Registracija />} />
					<Route path="/search/:parametri" element={<Search />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
