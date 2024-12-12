import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/addproduct.css";
import { setsEqual } from "chart.js/helpers";

export const OrderSingle = () => {
    const { store, actions } = useContext(Context);
    const [stateOrder,setStateOrder] = useState("");
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const { cartId } = useParams()
    const navigate = useNavigate();

    const getLastOrder = () => {
        const token = actions.verifyTokenSeller();

        fetch(`${process.env.BACKEND_URL}/api/seller/last-order`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setOrder(data);

            })
            .catch((error) => {
                console.error("Error fetching cart items:", error);
            });
    };

    const getOrder = () => {
        const token = actions.verifyTokenSeller();

        fetch(`${process.env.BACKEND_URL}/api/carts/${cartId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setOrder(data);

            })
            .catch((error) => {
                console.error("Error fetching cart items:", error);
            });
    };

    const changeStatus = () => {
        const token = actions.verifyTokenSeller();

        fetch(`${process.env.BACKEND_URL}/api/carts/${order.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ state: stateOrder }) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update order status");
            }
            return response.json();
        })
        .then(()=>{
            setOrder({})
            getLastOrder()
        })
        .catch(error => console.error("Error updating order status:", error));
    };

    useEffect(() => {
        cartId ? getOrder() : getLastOrder();
    }, [cartId]);

    return (
        <div>
            {order?.comprador ? (
                <div>
                    <div className="row mb-5">
                        <div className="col-12 d-flex">
                            <h2>Order Details</h2>
                            <button
                                className="purple-button ms-auto mt-2"
                                onClick={() => navigate("/dashboard/order-list")}
                            >
                                Back to all orders
                            </button>
                        </div>
                    </div>
                    <div className="card-black">
                        <div className="body-card">
                            <div className="row">
                                <div className="col-12">
                                    <div className="d-flex justify-content-between">
                                        <h3 className="mb-4 ">Order ID: {order.id} <span className="status align-middle">{order.state}</span></h3>
                                        <div className="d-flex wrap">
                                            <div className="me-3">
                                                <select value={stateOrder} style={{width: "100px"}} onChange={(e)=> setStateOrder(e.target.value)} className="form-select ms-auto" id="opciones" name="opciones">
                                                    <option value="" disabled>state</option>
                                                    <option value="sent">Sent</option>
                                                    <option value="cancel">Cancel</option>
                                                </select>
                                                {errorMessage && <p className="error-message text-danger">{errorMessage}</p>}
                                            </div>
                                            <div>
                                                <button className="purple-button" onClick={()=> {
                                                    if (stateOrder !== "") {
                                                        changeStatus();
                                                        setErrorMessage(""); 
                                                    } else {
                                                        setErrorMessage("You must select a state before saving.");
                                                    }
                                                }}>Save</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-2 details-order">
                                        <div className="col-4">
                                            <h6 className="px-0">Customer Details:</h6>
                                            <p>Name: {order.comprador?.name}</p>
                                            <p>Email: {order.comprador?.email}</p>
                                            <p>Phone: {order.comprador?.telefono}</p>
                                        </div>
                                        <div className="col-4">
                                            <h6 className="px-0">Shipping Address:</h6>
                                            <p>Name: {order.comprador?.address?.[0]?.name || "N/A"}</p>
                                            <p>Address: {order.comprador?.address?.[0]?.address || "N/A"}</p>
                                            <p>Details: {order.comprador?.address?.[0]?.description || "N/A"}</p>
                                        </div>
                                        <div className="col-4">
                                            <h6 className="px-0">Order Info:</h6>
                                            <p>Order ID: {order.id}</p>
                                            <p>Date: {order.created_at}</p>
                                            <p>Total price: {order.total_price}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=" table-responsive px-0 mt-5">
                            <table className="table-centered text-nowrap table table-borderless table-hover mb-5">
                                <thead>
                                    <tr className="bg-purple">
                                        <th>Products</th>
                                        <th>price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order?.items.map((item, index) => (
                                        <tr className="order-single" key={index}>
                                            <td>{item.product.name}</td>
                                            <td>${item.product.price}</td>
                                            <td>{item.amount}</td>
                                            <td>${(item.product.price * item.amount).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <tr className="order-single">
                                        <td></td>
                                        <td></td>
                                        <td className="fs-6">Total:</td>
                                        <td className="fs-6">${order.total_price}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};
