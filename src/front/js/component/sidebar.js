import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import githublogo from "../../img/rigo-baby.jpg";
import { Bag, House, Cart, ListTask, CaretDown, CaretUp, CircleFill } from 'react-bootstrap-icons';
import "../../styles/sidebar.css"

export const Sidebar = () => {
    const { store, actions } = useContext(Context);
    const [infoProfile, setInfoProfile] = useState({});
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const logOut = () => {
		localStorage.removeItem("jwt-token-seller");
		localStorage.removeItem("jwt-token-buyer");
		actions.changeAuthenticatedBuyer(false);
		actions.changeAuthenticatedSeller(false);
		navigate("/buyer/login");
	};

    const getProfileImage = () => {
		const token = actions.verifyTokenSeller();

        fetch(process.env.BACKEND_URL + "/api/seller/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error deleting item: " + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
				setInfoProfile(data)
            })
            .catch((error) => {
                console.error("Error removing item from cart:", error);
            });
	};

    useEffect(()=>{
        getProfileImage();
    },[])
    return (
        <>
            <div className="sidebar">
                <div className="navbar-dashboard">
                    <div className="container text-end">
                        <div className="nav-item">
                            <div className="dropdown-toggle "  role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src={infoProfile.image} alt="" className="rounded-circle avatar cover"/>
                            </div>
                            <ul className="dropdown-menu dropdown-menu-end p-2">
                                <div className="py-1 px-2 mb-2">
                                    <span className="name">{infoProfile.name}</span>
                                    <small>{infoProfile.email}</small>
                                </div>
                                <hr className="dropdown-divider"/>
                                <li><NavLink to="/" className="item-dropdown" >Home</NavLink></li>
                                <li><NavLink to="/blog" className="item-dropdown" >Blog</NavLink></li>
                                <li><NavLink to="/profile/seller" className="item-dropdown" >Profile</NavLink></li>
                                <hr className="dropdown-divider"/>
                                <li><a onClick={logOut} className="item-dropdown log-out" >Log Out</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <NavLink to="/"><h3>Protech</h3></NavLink>
                <ul>
                    <li>
                        <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? "active sidebar-item" : "sidebar-item")}>
                            <House className="icon-li" /> Dashboard
                        </NavLink>
                    </li>
                    <p>Store Managements</p>
                    <li>
                        <NavLink to="/dashboard/products" className={({ isActive }) => (isActive ? "active sidebar-item" : "sidebar-item")}>
                            <Cart className="icon-li" /> Products
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/categories" className={ ({ isActive }) => (isActive ? "active sidebar-item" : "sidebar-item")}>
                            <ListTask className="icon-li" /> Categories
                        </NavLink>
                    </li>
                    <li className="dropdownn-trigger not-hover">
                        <a  onClick={()=>setIsDropdownOpen(!isDropdownOpen)} className={"sidebar-item hover"}>
                            <Bag className="icon-li" /> Orders
                            {isDropdownOpen ? (
                                <CaretUp className="drop-icon" />
                            ) : (
                                <CaretDown className="drop-icon" />
                            )}
                        </a>
                        {isDropdownOpen && (
                            <ul className="dropdownn-menu">
                                <li>
                                    <NavLink to="/dashboard/order-list" className={({ isActive }) => (isActive ? "active sidebar-item" : "sidebar-item")}>
                                        <CircleFill className="icon-circle" /> List
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/order-single" className={({ isActive }) => (isActive ? "active sidebar-item" : "sidebar-item")}>
                                        <CircleFill className="icon-circle" /> Single
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </>
    );
};