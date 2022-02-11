import React, { useState, useEffect } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import Item from "./Item";

function Home() {
	useEffect(() => {
		fetchItems();
	}, []);

	const [items, setItems] = useState([]);

	const fetchItems = async () => {
		const data = [
			{
				productCode: 1,
				name: "Bel London poklon set",
				price: 12000,
				quantity: 10,
				description: "deskripcija",
				image: "https://shop.lilly.rs/media/catalog/product/cache/e9fe89bb0d3d5e05736d64f06cc6558c/5/0/5060693811968_1.jpg",
				category: "set",
			},
			{
				productCode: 2,
				name: "Neki proba proizvod",
				price: 13000,
				quantity: 10,
				description: "deskripcija",
				image: "https://shop.lilly.rs/media/catalog/product/cache/e9fe89bb0d3d5e05736d64f06cc6558c/5/0/5060693811968_1.jpg",
				category: "proba",
			},
		];

		setItems(data);
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
