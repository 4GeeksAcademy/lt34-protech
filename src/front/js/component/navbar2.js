import { useContext, useEffect, useState } from "react";
import React from "react";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/navbar.css";
import { Trash, Bag, Person, Motherboard, GeoAlt } from 'react-bootstrap-icons';

export const Navbar2 = () => {
	const { store, actions } = useContext(Context);
	const location = useLocation()
	const navigate = useNavigate();

	const routesButton = ["/seller/login", "/seller/signup"]
    const showButton =  routesButton.some(route => location.pathname.startsWith(route))

	return (
		<>	
			<nav className="navbar bg-dark navbar-expand-lg bgd-black" style={{padding: "14px 5px 14px"}}>
				<div className="container">
                    <div className="collapse navbar-collapse w-100" id="navbarNavAltMarkup">
                        <div className="d-flex justify-content-between w-100">
                            <h3 className="text-white ms-3" style={{cursor: "pointer"}} onClick={()=>navigate("/")}>Protech</h3>
							<div>
								<button className={showButton ? "purple-button me-3": "d-none"} style={{cursor: "pointer"}} onClick={()=>navigate("/buyer/signup")}>Login buyer</button>
								<button className="purple-button" style={{cursor: "pointer"}} onClick={()=>navigate("/seller/signup")}>Start Selling</button>
							</div>
                        </div>
                    </div>
				</div>
			</nav>
		</>
	);
};
