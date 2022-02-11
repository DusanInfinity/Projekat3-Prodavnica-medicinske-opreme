import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Kategorije() {

  let navigate = useNavigate();
  const routeChange = (kategorija) => {
    let path = `/kategorija/${kategorija}`
    navigate(path);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const [kategorije, setKategorije] = useState([]);

  const fetchItems = async () => {
    const data = [
      "Lekovi",
      "Parfemi",
      "Deciji kutak",
      "Muski kutak",
      "Zenski kutak",
    ];

    setKategorije(data);
  };

  return (
    <div className="my-3 col-md-8 d-flex flex-row justify-content-center align-items-center">
      {kategorije.map((item) => {
        return (
          <button key={item} className="btn btn-primary kategorija-dugme" onClick={() => routeChange(item)}>
            {item}
          </button>
        );
      })}
    </div>
  );
}

export default Kategorije;
