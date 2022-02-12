import React, { useState, useEffect } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import Item from "../Item";
import "./ListaZelja.css";
import ItemListaZelja from "./ItemListaZelja";

function ListaZelja() {
	useEffect(() => {
		fetchItems();
	}, []);

	const [items, setItems] = useState([]);

    const izbaciItem = (item) => {
        setItems(items.filter((i) => i.productCode !== item.productCode));
    }

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
				name: "Neki proba proizvod asdasdasdasdasd",
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
		<div className="col-md-8">
			<h1>Lista zelja</h1>
			<div className="lista-zelja-container col-md-12">
				{items.map((item) => {
					return <ItemListaZelja key={item.productCode} proizvod={item} izbaciItem={izbaciItem}/>;
				})}
			</div>
		</div>
	);
}

export default ListaZelja;
