import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../styles/detailProduct.css";


export const DetailProduct = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [activeTab, setActiveTab] = useState("details");

    const navigate = useNavigate();

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };


    useEffect(() => {
        const token = actions.verifyTokenBuyer()
        if (!token) {
            navigate("buyer/login");
        } else {
            const selectedProduct = store.products.find((product) => product.id === parseInt(id));
            setProduct(selectedProduct);
        }

    }, [id, store.products]);

   


    return (
        <div className="container">
           <div className="ProductDetail container">
    {product ? (
        <div className="row">
            <div className="col-md-6">
                <img src={product.image} alt={product.name} className="img-fluid" />
            </div>
            <div className="col-md-6">
                <p className="product-category">{product.category.name}</p>
                <h2 className="product-title">{product.name}</h2>
                <hr />
                <p className="product-description">{product.description}</p>
                <p className="product-price">Price: ${product.price}</p>

                <input
                    type="number"
                    size={10}
                    value={store.amounts[product.id] || ""}
                    onChange={(e) => actions.handleAmountChangeflux(product.id, e.target.value)}
                    placeholder="Amount"
                    className="form-control mb-3"
                />
                <button
                    className="btn btn-outline-warning"
                    onClick={() => actions.addToCartFlux(product.id)}
                >
                    Add to Cart
                </button>
                <hr />
                <ul className="product-info">
                    <li><strong>Product Code:</strong> FBB00255</li>
                    <li><strong>Availability:</strong> In Stock</li>
                    <li><strong>Type:</strong> Fruits</li>
                    <li><strong>Shipping:</strong> 01 day shipping. (Free pickup today)</li>
                </ul>
               
            </div>
        </div>
    ) : (
        <p>Loading...</p>
    )}
</div>

            <div className="ProductDetail">
                <ul className="nav nav-underline">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "details" ? "active" : ""}`}
                            onClick={() => handleTabClick("details")}
                        >
                            Product details
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "information" ? "active" : ""}`}
                            onClick={() => handleTabClick("information")}
                        >
                            Information
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "seller" ? "active" : ""}`}
                            onClick={() => handleTabClick("seller")}
                        >
                            Seller Information
                        </button>
                    </li>
                </ul>

                <div className="tab-content">
                    {activeTab === "details" && (
                        <div>
                            <h2>Product Details</h2>
                            {product ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        
                        <div style={{ flex: 2 }}>
                            <p>{product.category.name}</p>
                            <p>{product.name}</p>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                           
                            
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
                        </div>
                    )}
                    {activeTab === "information" && (
                        <div>
                            <h2>Additional Information</h2>
                            <p>Información adicional sobre el producto...</p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            
                        </div>
                    )}
                    {activeTab === "seller" && (
                        <div>
                            <h2>Seller Information</h2>
                            {product ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        
                        <div style={{ flex: 2 }}>
                            <p>{product.seller.name}</p>
                            <p>{product.seller.email}</p>
                            <p>{product.seller.phone}</p>
                           
                           
                            
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
                        </div>
                    )}
                </div>
            </div>
          


            <div>
                <h2>Other Products</h2>

                <div className="card-container">
                    {store.products.map((product, index) => (
                        <Link to={`/detail/${product.id}`} key={product.id || index} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div key={product.id || index} className="card mb-4" style={{ minWidth: "18rem", maxWidth: "300px" }}>
                                <img src={product.image} className="card-img-top" alt={product.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="mb-0">Category: {product.category.name}</p>
                                    <p className="mb-0">Price: ${product.price}</p>
                                    <p className="mb-0">Stock: {product.stock}</p>
                                </div>
                                <div className="card-footer d-flex justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-outline-warning"
                                        onClick={() => actions.addToCartFlux(product.id)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
