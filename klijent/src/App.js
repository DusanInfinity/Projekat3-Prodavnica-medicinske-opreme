import React, { useState, useEffect } from "react";
import "./App.css";
import Nav from "./Nav";
import About from "./About";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ItemProfil from "./ItemProfil";
import Home from "./home";
import Kategorija from "./kategorija";
import Korpa from "./Korpa";
import Login from "./Login/Login";
import Registracija from "./Registracija/registracija";
import Search from "./Search/search";

function App() {
	const [korpaCounter, setKorpaCounter] = useState(0);

	useEffect(() => {
		let products = localStorage.getItem("korpa_proizvodi");
		if (products) {
			products = JSON.parse(products);
			setKorpaCounter(products.length);
		}
		//document.title = "DSMed";
	}, []);

	return (
		<Router basename="/">
			<div className="App">
				<Nav korpaCounter={korpaCounter} />
				<Routes>
					<Route
						path="/"
						element={
							<Home
								korpaCounter={korpaCounter}
								setKorpaCounter={setKorpaCounter}
							/>
						}
					/>
					<Route path="/about" element={<About />} />
					<Route
						path="/korpa"
						element={
							<Korpa
								korpaCounter={korpaCounter}
								setKorpaCounter={setKorpaCounter}
							/>
						}
					/>
					<Route
						path="/item/:id"
						element={
							<ItemProfil
								korpaCounter={korpaCounter}
								setKorpaCounter={setKorpaCounter}
							/>
						}
					/>
					<Route
						path="/kategorija/:kat"
						element={
							<Kategorija
								korpaCounter={korpaCounter}
								setKorpaCounter={setKorpaCounter}
							/>
						}
					/>
					<Route path="/login" element={<Login />} />
					<Route path="/registracija" element={<Registracija />} />
					<Route
						path="/search/:parametri"
						element={
							<Search
								korpaCounter={korpaCounter}
								setKorpaCounter={setKorpaCounter}
							/>
						}
					/>
				</Routes>
				<div className="pb-5"></div>
				<div id="footer">
					<div className="text-right">
						<label>© 2022 Copyright: DSoft team</label>
					</div>
				</div>
			</div>
		</Router>
	);
}

export default App;
