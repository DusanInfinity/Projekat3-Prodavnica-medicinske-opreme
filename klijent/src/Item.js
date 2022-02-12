import React, { useState, useEffect } from "react";
import "./App.css";
import { Link, useParams } from "react-router-dom";

function Item({ proizvod }) {
  useEffect(() => {
    fetchItem();
  }, []);

  const [item, setItem] = useState([]);

  const fetchItem = async () => {
    const data = proizvod;

    setItem(data);
  };

  return (
    <div className="proizvod-container">
      <Link to={`/item/${item.productCode}`}>
        <img src={item.image} alt="/"/>
      </Link>
      <div className="">
        <h4>{item.name}</h4>
        <h4 style={{ color: "red", fontWeight: "700" }}>{item.price} RSD</h4>
        <div className="d-flex justify-content-around mb-3">
          <button className="btn btn-warning mx-2">
            <i className="bi bi-cart me-2" style={{ fontSize: "1.3rem" }}></i>
            Dodaj u korpu
          </button>
          <button className="btn btn-info mx-2">
            <i className="bi bi-heart" style={{ fontSize: "1.3rem" }}></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Item;