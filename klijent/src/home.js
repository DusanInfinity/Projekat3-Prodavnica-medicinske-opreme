import React, { useState, useEffect } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import Item from "./Item";
import ApiClient from "./Global/apiClient";

function Home() {
	const api = new ApiClient();

	useEffect(() => {
		fetchItems();
	}, []);

	const [items, setItems] = useState([]);

	const fetchItems = async () => {
		try {
			const data = await api.produkti.vratiNasumicneProdukte();
			setItems(data);
		} catch (e) {
			alert(e.message);
		}
	};

	return (
		<div className="col-md-8 d-flex flex-column justify-content-center align-items-center">
			<h1>Home page</h1>
			<div className="proizvodi-container col-sm-12">
				{items.map((item) => {
					return <Item key={item.productCode} proizvod={item} />;
				})}
			</div>
		</div>
	);
}

export default Home;
