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

        const navigate = useNavigate();

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
                <div className="ProductDetail">
                    {product ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ flex: 1, marginRight: "20px" }}>
                                <img src={product.image} alt={product.name} />
                            </div>
                            <div style={{ flex: 2 }}>
                                <p>{product.category.name}</p>
                                <h2>{product.name}</h2>
                                <p>{product.description}</p>
                                <p>Price: ${product.price}</p>
                                <input
                                    type="number"
                                    size={10}
                                    value={store.amounts[product.id] || ""}
                                    onChange={(e) => actions.handleAmountChangeflux(product.id, e.target.value)}
                                    placeholder="Amount"
                                    className="form-control"
                                    id="amount"
                                />
                                <button
                                    className="btn btn-outline-warning"
                                    onClick={() => actions.addToCartFlux(product.id)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <div className="ProductDetail">
                    <ul class="nav nav-underline">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#">Product details</a>
                           
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">information</a>
                           
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Seller Information</a>
                        </li>

                    </ul>
                    {product ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            
                            <div style={{ flex: 2 }}>
                                <p>{product.category.name}</p>
                                <h2>{product.name}</h2>
                                <p>{product.description}</p>
                                <p>Price: ${product.price}</p>
                                <input
                                    type="number"
                                    size={10}
                                    value={store.amounts[product.id] || ""}
                                    onChange={(e) => actions.handleAmountChangeflux(product.id, e.target.value)}
                                    placeholder="Amount"
                                    className="form-control"
                                    id="amount"
                                />
                            
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
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
