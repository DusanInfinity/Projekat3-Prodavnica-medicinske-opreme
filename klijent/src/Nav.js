import React, { useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Kategorije from "./kategorije";

function Nav() {
	const [searchInput, setSearchInput] = useState("");

	
	let navigate = useNavigate();
	const pretraga = () => {
		let path = `search/${searchInput}`;
		let input = document.getElementById("search-input");
		input.value = "";
		navigate(path)
	};

	return (
		<nav>
			<div className="col-md-12 border-gray border-bottom d-flex justify-content-center">
				<div className="col-md-8 d-flex justify-content-end align-items-center">
					<i
						className="bi bi-person"
						style={{ fontSize: "2rem", color: "blue" }}
					></i>
					<Link to={"/login"} className="mx-2">
						Prijava
					</Link>
					/
					<Link to={"/registracija"} className="mx-2">
						Registracija
					</Link>
				</div>
			</div>
			<div className="nav col-md-8 justify-content-between">
				<Link to={"/"}>
					<img className="logo-img" src={require("./Logo.png")}></img>
				</Link>
				<div className="d-flex col-md-5 align-items-center">
					<div className="input-group">
						<input
							type="text"
							className="form-control"
							placeholder="Naziv proizvoda..."
							aria-describedby="basic-addon2"
							id="search-input"
							onChange={(e) => setSearchInput(e.target.value)}
						/>
						<div className="input-group-append">
							<button
								className="btn btn-outline-secondary"
								type="button"
								onClick={pretraga}
							>
								<i className="bi bi-search"></i>
							</button>
						</div>
					</div>
				</div>
				<div className="col-md-3 d-flex justify-content-between align-items-center">
					<Link
						to={"/listazelja"}
						className="col-md-6 d-flex justify-content-between"
						style={{ textDecoration: "none" }}
					>
						<div className="lista-zelja-div">
							<i
								className="bi bi-heart me-2"
								style={{ fontSize: "1.2rem" }}
							></i>
							Lista zelja (
							<span className="lista-zelja-counter">0</span>)
						</div>
					</Link>
					<Link
						to={"/korpa"}
						className="col-md-6 d-flex-row justify-content-between"
						style={{ textDecoration: "none" }}
					>
						<div className="">
							<i
								className="bi bi-cart me-2"
								style={{ fontSize: "1.2rem" }}
							></i>
							Korpa (<span className="korpa-counter">0</span>)
						</div>
					</Link>
				</div>
			</div>
			<Kategorije />
		</nav>
	);
}

export default Nav;
