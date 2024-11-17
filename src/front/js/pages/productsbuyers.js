import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const ProductsBuyers = () => {
    const { store, actions } = useContext(Context);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [image, setImage] = useState("");
    const [activeTab, setActiveTab] = useState("list-tab");
    const [amounts, setAmounts] = useState({});
    const [filter, setFilter] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

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
    }

    useEffect(() => {
        getProducts();
    }, []);

    const handleMinPriceChange = (e) => {
        setMinPrice(e.target.value);
    };

    const handleMaxPriceChange = (e) => {
        setMaxPrice(e.target.value);
    };

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

    const viewMore = (product_id) => {
        fetch(process.env.BACKEND_URL + `/api/products/${product_id}`, { method: "GET" })
            .then((response) => response.json())
            .then((data) => {
                setActiveTab("view-more-tab");
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
                setStock(data.stock);
                setImage(data.image);
                setCategory(data.category ? data.category.name : "");
            });
    }

    const addToCart = (productId) => {
        const token = actions.verifyTokenBuyer()

        const raw = JSON.stringify({
            "amount": parseInt(amounts[productId]) || 1,
            "product_id": parseInt(productId)
        });

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: raw,
            redirect: "follow"
        };

        fetch(process.env.BACKEND_URL + "/api/itemscarts", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                getProducts();
                setActiveTab("list-tab");
            })
            .catch((error) => console.error(error));
    }

    const handleAmountChange = (productId, value) => {
        if (value === "") {
            setAmounts({
                ...amounts,
                [productId]: ""
            });
        } else {
            const amountValue = Math.max(1, parseInt(value));
            setAmounts({
                ...amounts,
                [productId]: amountValue
            });
        }
    }

    return (
        <>
            {/* Product Slider Section */}
            <div className="container-fluid mb-5">
                <h2 className="text-center mb-4">Featured Products</h2>
                <div className="row flex-nowrap overflow-auto pb-3" style={{ scrollSnapType: 'x mandatory' }}>
                    {products.slice(0, 6).map((product) => (
                        <div key={product.id} className="col-md-4 col-lg-3 px-2" style={{ scrollSnapAlign: 'start' }}>
                            <div className="card h-100">
                                <img
                                    src={product.image || "https://res.cloudinary.com/dqs1ls601/image/upload/v1731206219/vbxdwt1xqinu1ffd82mm.jpg"}
                                    className="card-img-top"
                                    alt={product.name}
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text text-truncate">{product.description}</p>
                                    <p className="card-text"><strong>${product.price}</strong></p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => addToCart(product.id)}
                                        >
                                            Add to Cart
                                        </button>
                                        <Link to={`/detail/${product.id}`} className="btn btn-outline-secondary">
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search Section */}
            <div className="container mb-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fas fa-search"></i>
                            </span>
                            <input 
                                value={filter} 
                                onChange={filtering} 
                                type="text" 
                                placeholder="Search by name or category" 
                                className="form-control" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="container mt-3">
                {/* ... resto del código de la tabla ... */}
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "list-tab" ? "active" : ""}`}
                            id="list-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#list-tab-pane"
                            type="button" role="tab"
                            aria-controls="list-tab-pane"
                            aria-selected={activeTab === "list-tab"}
                            onClick={() => setActiveTab("list-tab")}
                        >List</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "view-more-tab" ? "active" : "d-none"}`}
                            id="edit-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#view-more-tab-pane"
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "view-more-tab"}
                        >View More</button>
                    </li>
                </ul>

                <div className="tab-content" id="myTabContent">
                    <div className={`tab-pane fade ${activeTab === "list-tab" ? "show active" : ""}`} id="list-tab-pane" role="tabpanel" aria-labelledby="list-tab" tabIndex="0">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <td>View more</td>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Image</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    results.map((product, index) => (
                                        <tr key={product.id}>
                                            <td>{index + 1}</td>
                                            <td className="text-center">
                                                <i style={{ cursor: "pointer" }}
                                                    className="fas fa-eye"
                                                    onClick={() => viewMore(product.id)}
                                                ></i>
                                                <Link to={`/detail/${product.id}`}>
                                                    <button type="button" className="btn btn-outline-primary">Learn more</button>
                                                </Link>
                                            </td>
                                            <td>{product.name}</td>
                                            <td>{product.description}</td>
                                            <td>{product.price}$</td>
                                            <td>{product.stock}</td>
                                            <td>
                                                <img
                                                    src={product.image || "https://res.cloudinary.com/dqs1ls601/image/upload/v1731206219/vbxdwt1xqinu1ffd82mm.jpg"}
                                                    alt={product.name}
                                                    style={{ width: "100px" }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    size={10}
                                                    value={amounts[product.id] || ""}
                                                    onChange={(e) => handleAmountChange(product.id, e.target.value)}
                                                    placeholder="Amount"
                                                    className="form-control"
                                                    id="amount"
                                                />
                                                <button
                                                    className="btn btn-primary mt-2"
                                                    onClick={() => addToCart(product.id)}
                                                >Add to Cart</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="8">There are no items in the table.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className={`tab-pane fade ${activeTab === "view-more-tab" ? "show active" : ""}`} id="view-more-tab-pane" role="tabpanel" aria-labelledby="view-more-tab" tabIndex="0">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Image</th>
                                    <th>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{name}</td>
                                    <td>{description}</td>
                                    <td>{price}$</td>
                                    <td>{stock}</td>
                                    <td>{image}</td>
                                    <td>{category}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}