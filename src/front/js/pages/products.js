import React, {useState, useEffect, useContext} from "react";
import { Context } from "../store/appContext";


export const Products = () => {
    const {store, actions} = useContext(Context)

    const [products, setProducts] = useState([])

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState(0)
    const [stock, setStock] = useState(0)
    const [image, setImage] = useState("")
    const [activeTab, setActiveTab] = useState("list-tab")
    const [editProduct_Id, setEditProduct_Id] = useState(0)

    const getProducts = ()=>{
        fetch( process.env.BACKEND_URL + "/api/products",{ method: "GET"})
        .then((response) => response.json())
        .then((data) => {
            setProducts(data)
        })
    }

    useEffect(() => {
        getProducts();
    }, []);

    const cleanFilds = () =>{
        setName("");
        setDescription("");
        setPrice(0);
        setStock(0);
        setImage("");
    }

    const handleSubmitCreate = (e)=>{
        e.preventDefault()

        const raw = JSON.stringify({
            "name": name,
            "description": description,
            "price": parseInt(price),
            "stock": parseInt(stock),
            "image": image,
        });
        
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: raw,
            redirect: "follow"
        };
        
        fetch(process.env.BACKEND_URL + "/api/products", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            getProducts()
            setActiveTab("list-tab");
            cleanFilds()
        })
        .catch((error) => console.error(error))
    }

    const deleteProduct = (product_id) => {
        fetch(process.env.BACKEND_URL + `/api/products/${product_id}`, {method: "DELETE"})
        .then(response => {
            if (response.ok) {
                getProducts();
            } else {
                console.error("Error deleting product:", response.statusText);
            }
        })
        .catch((error) => console.error("Network error:", error));
    }

    const getToEdit = (product_id) => {
        fetch(process.env.BACKEND_URL + `/api/products/${product_id}`,{ method: "GET"})
        .then((response) => response.json())
        .then((data) => {
            setActiveTab("edit-tab");
            setName(data.name);
            setDescription(data.description);
            setPrice(data.price);
            setStock(data.stock);
            setImage(data.image);
            setEditProduct_Id(product_id);
        })
    }

    const handleSubmitEdit = (e)=>{
        e.preventDefault()

        const raw = JSON.stringify({
            "name": name,
            "description": description,
            "price": parseInt(price),
            "stock": parseInt(stock),
            "image": image,
        });
        
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: raw,
            redirect: "follow"
        };
        
        fetch(process.env.BACKEND_URL + `/api/products/${editProduct_Id}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            getProducts()
            setActiveTab("list-tab");
            cleanFilds()
        })
        .catch((error) => console.error(error))
    }
    const viewMore = (product_id)=>{
        fetch(process.env.BACKEND_URL + `/api/products/${product_id}`,{ method: "GET"})
        .then((response) => response.json())
        .then((data) => {
            setActiveTab("view-more-tab");
            setName(data.name);
            setDescription(data.description);
            setPrice(data.price);
            setStock(data.stock);
            setImage(data.image);
        })
    }
    return(
        <>
            <div className="container mt-5">
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
                            className={`nav-link ${activeTab === "create-tab" ? "active" : ""}`}
                            id="create-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#create-tab-pane"
                            type="button"
                            role="tab"
                            aria-controls="create-tab-pane"
                            aria-selected={activeTab === "create-tab"}
                            onClick={() => {setActiveTab("create-tab")
                                cleanFilds()}}
                        >Create</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "edit-tab" ? "active" : "d-none"}`}
                            id="edit-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#edit-tab-pane"
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "edit-tab"}
                        >Edit</button>
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
                                    <td></td>
                                    <th>Name</th>
                                    <th>description</th>
                                    <th>price</th>
                                    <th>stock</th>
                                    <th>image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ?
                                    (products.map((product, index) =>(
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td className="text-center">
                                                <i className="fas fa-edit me-3"
                                                style={{cursor:"pointer"}}
                                                onClick={()=> getToEdit(product.id)}>
                                                </i>
                                                <i className="fas fa-trash me-3"
                                                style={{cursor:"pointer"}}
                                                onClick={()=> deleteProduct(product.id)}>
                                                </i>
                                                <i style={{cursor:"pointer"}}
                                                className="fas fa-eye"
                                                onClick={() => viewMore(product.id)}
                                                ></i>
                                            </td>
                                            <td>{product.name}</td>
                                            <td>{product.description}</td>
                                            <td>{product.price}$</td>
                                            <td>{product.stock}</td>
                                            <td>{product.image}</td>
                                        </tr>
                                    ))
                                    ):(<tr><td>There are no items in the table.</td></tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className={`tab-pane fade ${activeTab === "create-tab" ? "show active" : ""}`} id="create-tab-pane" role="tabpanel" aria-labelledby="create-tab" tabIndex="0">
                        <form className="mt-4 ms-5" onSubmit={handleSubmitCreate}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" id="name"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" id="description"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="price" className="form-label">Price</label>
                                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control" id="price"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="stock" className="form-label">Stock</label>
                                <input type="text" value={stock} onChange={(e) => setStock(e.target.value)} className="form-control" id="stock"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">Image</label>
                                <input type="text"  value={image} onChange={(e) => setImage(e.target.value)} className="form-control" id="image"/>
                            </div>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </form>
                    </div>

                    <div className={`tab-pane fade ${activeTab === "edit-tab" ? "show active" : ""}`} id="edit-tab-pane" role="tabpanel" aria-labelledby="edit-tab" tabIndex="0">
                        <form className="mt-4 ms-5" onSubmit={handleSubmitEdit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" id="name"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" id="description"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="price" className="form-label">Price</label>
                                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control" id="price"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="stock" className="form-label">Stock</label>
                                <input type="text" value={stock} onChange={(e) => setStock(e.target.value)} className="form-control" id="stock"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">Image</label>
                                <input type="text"  value={image} onChange={(e) => setImage(e.target.value)} className="form-control" id="image"/>
                            </div>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </form>
                    </div>

                    <div className={`tab-pane fade ${activeTab === "view-more-tab" ? "show active" : ""}`} id="view-more-tab-pane" role="tabpanel" aria-labelledby="view-more-tab" tabIndex="0">
                    <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>description</th>
                                    <th>price</th>
                                    <th>stock</th>
                                    <th>image</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{name}</td>
                                    <td>{description}</td>
                                    <td>{price}$</td>
                                    <td>{stock}</td>
                                    <td>{image}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )

}