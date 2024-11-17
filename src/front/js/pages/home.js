import { useState, useEffect, useContext } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Home = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [amounts, setAmounts] = useState({});

    const logOut = () => {
        localStorage.removeItem("jwt-token-seller");
        localStorage.removeItem("jwt-token-buyer");
        actions.changeAuthenticatedBuyer(false);
        actions.changeAuthenticatedSeller(false);
        navigate("/buyer/login");
    };

    const getProducts = () => {
        fetch(process.env.BACKEND_URL + "/api/products", { method: "GET" })
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
                const initialAmounts = {};
                data.forEach(product => {
                    initialAmounts[product.id] = 1;
                });
                setAmounts(initialAmounts);
            });
    };

    useEffect(() => {
        getProducts();
    }, []);

    const filtering = (e) => {
        setFilter(e.target.value);
    };

    let results = [];
    if (!filter && minPrice === "" && maxPrice === "") {
        results = products;
    } else {
        results = products.filter((product) => {
            const matchesName = product.name && product.name.toLowerCase().includes(filter.toLowerCase());
            const matchesCategory = product.category && product.category.name.toLowerCase().includes(filter.toLowerCase());
            const price = product.price;
            const inPriceRange =
                (minPrice === "" || price >= parseFloat(minPrice)) &&
                (maxPrice === "" || price <= parseFloat(maxPrice));
            return (matchesName || matchesCategory) && inPriceRange;
        });
    }

    return (
        <div>
            {/* Image Slider */}
           

            <div className="border-bottom">
                <div className="bg-light py-4">
                    <div className="container">
                        <div className="row align-items-center">
                            {/* Logo */}
                            <div className="col-md-3">
                                <Link to="/">
                                    <span className="navbar-brand h1 text-primary fs-3">Pro Tech</span>
                                </Link>
                            </div>

                            {/* Search Bar */}
                            <div className="col-md-6">
                                <div className="input-group">
                                    <input
                                        value={filter}
                                        onChange={filtering}
                                        type="text"
                                        placeholder="Search products..."
                                        className="form-control"
                                    />
                                    <button className="btn btn-outline-primary">
                                        Search
                                    </button>
                                </div>
                            </div>

                            {/* Auth Buttons */}
                            <div className="col-md-3 text-end">
                                {store.authenticatedBuyer || store.authenticatedSeller ? (
                                    <button className="btn btn-danger" onClick={logOut}>
                                        Log Out
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn-primary me-2"
                                            onClick={() => navigate("/buyer/login")}
                                        >
                                            Log In
                                        </button>
                                        {!store.authenticatedSeller && (
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() => navigate("/seller/login")}
                                            >
                                                Start Selling
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Navigation Links */}
                        {(store.authenticatedBuyer || store.authenticatedSeller) && (
                            <div className="row mt-3">
                                <div className="col-12">
                                    <div className="d-flex gap-2 flex-wrap">
                                        {store.authenticatedBuyer && (
                                            <>
                                                <Link to="/buyer/profile" className="btn btn-outline-primary btn-sm">
                                                    Profile
                                                </Link>
                                                <Link to="/cartview" className="btn btn-outline-primary btn-sm">
                                                    Cart
                                                </Link>
                                                <Link to="/productsbuyers" className="btn btn-outline-primary btn-sm">
                                                    Products
                                                </Link>
                                                <Link to="/ordersplaced" className="btn btn-outline-primary btn-sm">
                                                    Orders
                                                </Link>
                                                <Link to="/buyeraddress" className="btn btn-outline-primary btn-sm">
                                                    Address
                                                </Link>
                                            </>
                                        )}

                                        {store.authenticatedSeller && (
                                            <>
                                                <Link to="/orders" className="btn btn-outline-primary btn-sm">
                                                    Orders
                                                </Link>
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => navigate("/selleraddress")}
                                                >
                                                    Address
                                                </button>
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => navigate("/product/seller")}
                                                >
                                                    My Products
                                                </button>
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => navigate("/dashboard")}
                                                >
                                                    Dashboard
                                                </button>
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => navigate("/profile/seller")}
                                                >
                                                    Profile
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

          
            <div className="carousel slide mb-4" id="carouselExampleCaptions" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="https://via.placeholder.com/1920x400" className="d-block w-100" alt="Slide 1" />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Slide 1 Title</h5>
                            <p>Some description for slide 1.</p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="https://via.placeholder.com/1920x400" className="d-block w-100" alt="Slide 2" />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Slide 2 Title</h5>
                            <p>Some description for slide 2.</p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="https://via.placeholder.com/1920x400" className="d-block w-100" alt="Slide 3" />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Slide 3 Title</h5>
                            <p>Some description for slide 3.</p>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            <div className="container py-4">
                <div className="row g-4">
                    {results.map((product) => (
                        <div key={product.id} className="col-md-3">
                            <div className="card h-100">
                                <img
                                    src={product.image || "/api/placeholder/300/200"}
                                    className="card-img-top"
                                    alt={product.name}
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text text-truncate">{product.description}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0">${product.price}</h6>
                                        <span className="text-muted">Stock: {product.stock}</span>
                                    </div>
                                    <button
                                        className="btn btn-primary w-100 mt-3"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            ñ
        </div>
    );
};
