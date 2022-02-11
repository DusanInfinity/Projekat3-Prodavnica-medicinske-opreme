import React, { useState, useEffect } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import Item from "./Item";

function Shop() {
	useEffect(() => {
		fetchItems();
	}, []);

	const [items, setItems] = useState([]);

	const fetchItems = async () => {
		const data = [
			{ id: 1, name: "Stefan" },
			{ id: 2, name: "Snezana" },
		];

		setItems(data);
	};

	return (
		<div>
			<h1>Shop page</h1>
			{items.map((item) => {
				return <Item key={item.id} proizvod={item} />;
			})}
		</div>
	);
}

export default Shop;
