import React from "react";
import "./App.css";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Kategorije from "./kategorije";

function Nav() {
  return (
    <nav>
      <div className="col-md-12 border-gray border-bottom d-flex justify-content-center">
        <div className="col-md-8 d-flex justify-content-end align-items-center">
          <i
            className="bi bi-person"
            style={{ fontSize: "2rem", color: "blue" }}
          ></i>
          <Link to={"/"} className="mx-2">
            Prijava
          </Link>
          /
          <Link to={"/"} className="mx-2">
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
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-3 d-flex justify-content-between align-items-center">
          <Link
            to={"/about"}
            className="col-md-6 d-flex justify-content-between"
            style={{ textDecoration: "none" }}
          >
            <div className="lista-zelja-div">
              <i
                className="bi bi-heart me-2"
                style={{ fontSize: "1.2rem" }}
              ></i>
              Lista zelja (<span className="lista-zelja-counter">0</span>)
            </div>
          </Link>
          <Link
            to={"/shop"}
            className="col-md-6 d-flex-row justify-content-between"
            style={{ textDecoration: "none" }}
          >
            <div className="">
              <i className="bi bi-cart me-2" style={{ fontSize: "1.2rem" }}></i>
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
