import React, { useState, useEffect } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import Item from "./Item";
import ApiClient from "./Global/apiClient";

function Home({ korpaCounter, setKorpaCounter }) {
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

		// try {
		// 	const produkt = {
		// 		_id: {
		// 			timestamp: 0,
		// 		},
		// 		productCode: 2,
		// 		name: "bromazepoam",
		// 		price: 11111,
		// 		quantity: 10,
		// 		description: "deskripcija",
		// 		image: "https://shop.lilly.rs/media/catalog/product/cache/e9fe89bb0d3d5e05736d64f06cc6558c/5/0/5060693811968_1.jpg",
		// 		category: "lekovi",
		// 	};
		// 	api.setHeader("Content-Type", "application/json");
		// 	await api.produkti.dodajProdukt(produkt);
		// } catch (e) {
		// 	alert(e);
		// }
	};

	return (
		<div className="col-md-8 d-flex flex-column justify-content-center align-items-center">
			<h1>Home</h1>
			<div className="proizvodi-container col-sm-12">
				{items.map((item) => {
					return <Item key={item.productCode} proizvod={item} korpaCounter={korpaCounter} setKorpaCounter={setKorpaCounter}/>;
				})}
			</div>
		</div>
	);
}

export default Home;
