import { useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import React from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/navbar.css";
import { Trash, Bag, Person, Motherboard, GeoAlt, Search } from 'react-bootstrap-icons';

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const [cart, setCart] = useState({});
	const search = useRef();
	const [infoProfile,setInfoProfile] = useState({})
	
	const logOut = () => {
		localStorage.removeItem("jwt-token-seller");
		localStorage.removeItem("jwt-token-buyer");
		actions.changeAuthenticatedBuyer(false);
		actions.changeAuthenticatedSeller(false);
		navigate("/buyer/login");
	};


	useEffect(() => {
		setCart(store.cart);

		if(store.authenticatedSeller){
			getInfoSellerProfile()
		}
		if(store.authenticatedBuyer){
			getInfoBuyerProfile()
		}
    }, [store.cart, store.authenticatedBuyer, store.authenticatedSeller]);

	const removeItem = (itemId) => {
        const token = actions.verifyTokenBuyer();

        fetch(process.env.BACKEND_URL + "/api/buyer/cart/products/" + itemId, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error deleting item: " + response.statusText);
                }
                return response.json();
            })
            .then(() => {
                actions.getCart();
            })
            .catch((error) => {
                console.error("Error removing item from cart:", error);
            });
    };

	const getInfoSellerProfile = () => {
		const token = actions.verifyTokenSeller();
		
        fetch(process.env.BACKEND_URL + "/api/seller/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
				if (response.status === 401) {
                    actions.changeAuthenticatedSeller(false);
                }
                if (!response.ok) {
                    throw new Error("Error deleting item: " + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
				setInfoProfile(data)
            })
            .catch((error) => {
                console.error("no seller found:", error);
            });
	};
	const getInfoBuyerProfile = () => {
		const token = actions.verifyTokenBuyer();

        fetch(process.env.BACKEND_URL + "/api/buyer/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.status === 401) {
                    actions.changeAuthenticatedBuyer(false);
                }
                if (!response.ok) {
                    throw new Error("no buyer found: " + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
				setInfoProfile(data)
            })
	};

	const searchProducts = () => {
		actions.setSearch(search.current.value);
	};

	return (
		<>	
			<div className="bgd-black" style={{padding: "20px 0px 20px 0px"}}>
				<div className="container">
					<div className="w-100 align-items-center gx-lg-2 gx-0 row">
						<div className="col-xxl-2 col-lg-3 col-md-6 col-5">
							<div>
								<h3 className="text-white ms-3 title"
								onClick={()=>{
									actions.setSearch("")
									navigate("/")
								}}
								>
									<Motherboard className="icon-board"/>Protech
								</h3>
							</div>
						</div>
						<div className="d-lg-block col-xxl-5 col-lg-5 position-relative">
							<input 
								type = "text"
								style={{height: "41px"}}
								className="form-control ps-3"
								ref={search}
								onKeyDown ={
									(e)=>{
										if(e.key == "Enter"){
											searchProducts()
										}
									}
								} 
								placeholder="Search for products"
							>
							</input>
							<Search onClick={()=>searchProducts()} className="icon-search"/>
						</div>
						<div className="d-lg-block col-xxl-3 col-md-2">
							<Link to={store.authenticatedBuyer ? ("/buyeraddress"):(
								store.authenticatedSeller ? ("/selleraddress"):("/buyer/login")
							)}>
								<button className="purple-button" style={{fontSize: "14.5px"}}><GeoAlt className="me-1"/> Location</button>
							</Link>
						</div>
						<div className="text-end text-white col-xxl-2 col-lg-2 col-md-6 col-7">
							<Person className="dropdown-toggle icon-nav fs-5 me-3" role="button" data-bs-toggle="dropdown" aria-expanded="false"></Person>

							<ul className="dropdown-menu dropdown-menu-end hover-li p-2">
								{store.authenticatedSeller ? (<>
									<div className="py-1 px-2 mb-2">
										<span className="name">{infoProfile.name}</span>
										<small>{infoProfile.email}</small>
									</div>
									<hr className="dropdown-divider"/>
									<li><NavLink to="/dashboard" className="item-dropdown hover-li" >Dashboard</NavLink></li>
									<li><NavLink to="/profile/seller" className="item-dropdown" >Profile</NavLink></li>
									<hr className="dropdown-divider"/>
									<li><a onClick={()=>logOut()} className="item-dropdown log-out" >Log Out</a></li>
								</>):(
									store.authenticatedBuyer ? (<>
										<div className="py-0 px-2 mb-2">
											<span className="name">{infoProfile.name}</span>
											<small>{infoProfile.email}</small>
										</div>
										<hr className="dropdown-divider"/>
										<li><NavLink to="/profile/buyer" className="item-dropdown" >Profile</NavLink></li>
										<hr className="dropdown-divider"/>
										<li><a onClick={()=>logOut()} className="item-dropdown log-out" >Log Out</a></li>	
									</>):(<>
										<div className="py-1 px-1">
											<li><Link to="/buyer/login" className="item-dropdown" >Log in</Link></li>
											<li><Link to="/buyer/signup" className="item-dropdown" >Sign up</Link></li>
										</div>
									</>)
								)}
							</ul>
							{store.authenticatedBuyer ? (<>
								<Bag className="fs-5 me-3 icon-nav" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling"></Bag>
								
								<div className="offcanvas offcanvas-end text-white" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" 
									id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
									<div className="offcanvas-header border-bottom border-secondary">
										<h4 className="offcanvas-title" id="offcanvasScrollingLabel">Shop Cart</h4>
										<button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
									</div>
									<div className="offcanvas-body">
										<ul className="list-group list-group-flush ">
											{cart.items?.length > 0 ? (cart.items.map((item, index) =>(
												<li key={index} className="px-0 border-bottom border-secondary list-group-item item-cart justify-content center">
													<div className="row text-white text-start">
														<div className="col-6">
															<div className="ms-3">
																<p>{item.product.name}</p>
																<a className="text-secondary" onClick={()=>removeItem(item.item_id)} ><Trash/> Remove</a>
															</div>
														</div>
														<div className="col-3">
															<div className="input-group">
																<button style={{borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px"}}
																	className="button-input"
																	onClick={() =>
																		actions.updateCartItemAmount(item.item_id, item.amount - 1)
																	}
																	disabled={item.amount === 1}
																>
																	-
																</button>
																<input
																	type="number"
																	value={item.amount || 1}
																	className="input-amount text-center"
																	onChange={(e) =>
																		actions.updateCartItemAmount(item.item_id, parseInt(e.target.value) || 1)
																	}
																	min="1"
																/>
																<button style={{borderEndEndRadius: "5px", borderTopRightRadius: "5px"}}
																	className="button-input"
																	onClick={() =>
																		actions.updateCartItemAmount(item.item_id, item.amount + 1)
																	}
																>
																	+
																</button>
															</div>
														</div>
														<div className="col-3">
															<div>
																<p className="text-center">${(item.product.price * item.amount).toFixed(2)}</p>
															</div>
														</div>
													</div>
												</li>
											))):(<>
												<div className="row d-flex justify-content-center mt-5">
													<div className="col-12">
														<h3 className="text-center">the cart is empty</h3>
													</div>
												</div>
											</>)}
										</ul>
										{store.cart?.items?.length > 0 ? (<>
											<div className="border-div list-group-item item-cart">
												<h6 className="d-inline ms-2"><span className="me-4">Total: </span>{cart?.total_price?.toFixed(2)}</h6>
											</div>
											<div className="ms-auto d-flex mt-4">
												<button onClick={() => navigate("/cart")} data-bs-dismiss="offcanvas" aria-label="Close" 
													className="purple-button ms-auto">
													Proceed To Checkout
												</button>
											</div>
										</>):(<></>)}
									</div>
								</div>
							</>):(<></>)}
						</div>
					</div>
				</div>
			</div>
			<nav className="navbar bg-dark navbar-expand-lg bgd-black" style={{padding: "0px 5px 20px"}}>
				<div className="container">
					<div className="container-fluid">
						<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
						</button>
						<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
							<div className="navbar-nav">
								{store.authenticatedBuyer ? (
									<>
										<Link to="/" >
											<button className="main-button" onClick={()=>{
											actions.setSearch("")
											navigate("/")
										}}><Motherboard style={{fontSize: "17px"}}/> Products</button>
										</Link>
										<Link className="nav-link ms-3" to="/orders-placed">Orders</Link>
										<Link className="nav-link ms-3" to="/blog">Blog</Link>
										<Link className="nav-link ms-3" to="/cart">Cart</Link>
										<Link className="nav-link ms-3" to="/profile/buyer">Profile</Link>
									</>
								):(
									store.authenticatedSeller ? (
									<>
										<Link to="/" >
											<button className="main-button" onClick={()=>{
												actions.setSearch("")
												navigate("/")
											}}><Motherboard style={{fontSize: "17px"}}/> Products</button>
										</Link>
										<Link className="nav-link ms-3" to="/blog">Blog</Link>
										<Link className="nav-link ms-3" to="/profile/seller">Profile</Link>
										<Link className="nav-link ms-3" to="/dashboard">Dashboard</Link>
									</>
									):(<>
										<Link to="/" >
											<button className="main-button" onClick={()=>{
												actions.setSearch("")
												navigate("/")
											}}><Motherboard style={{fontSize: "17px"}}/> Products</button>
										</Link>
										<Link className="nav-link ms-3" to="/blog">Blog</Link>
									</>)
								)}
							</div>
						</div>
					</div>
				</div>
			</nav>
		</>
	);
};
