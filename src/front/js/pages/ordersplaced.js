import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/addproduct.css";

export const OrdersPlaced = () => {
    const { store, actions } = useContext(Context);
    const [errorMessage, setErrorMessage] = useState("");
    const [carts, setCarts] = useState([])
    const navigate = useNavigate();

    const getCartItems = () => {
        const token = actions.verifyTokenBuyer(); 

        fetch(process.env.BACKEND_URL + "/api/carts/itemscart", {
            method: "GET",
            headers: {
            "Authorization": `Bearer ${token}`
        }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error fetching cart items: " + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            setCarts(data);
            
        })
        .catch((error) => {
            console.error("Error fetching cart items:", error);
        });
    }

    useEffect(() => {
        getCartItems();
    }, []);

    return (
        <div className="container">
            <div className="row mb-4 mt-5">
                <div className="col-12 d-flex">
                    <h2>Orders Placed</h2>
                </div>
            </div>
            {carts ? (carts.map((cart)=>(
                <div key={cart.cart_id} className="mb-5">
                    <div className="row">
                        <div className="col-12">
                            <div className="card-black">
                                <div className="body-card">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="d-flex justify-content-between">
                                                <h3 className="mb-4 ">Order ID: {cart.cart_id}</h3>
                                            </div>
                                            <div className="mt-2 order-placed-header">
                                                <div className="d-flex">
                                                    <h5>Date: </h5><h5 className="text-gray">{cart.created_at}</h5>
                                                </div>
                                                <div className="d-flex">
                                                    <h5 className="align-items-center">Status: </h5><h5 className="status-placed">{cart.state}</h5>
                                                </div>
                                                <div className="d-flex">
                                                    <h5>Total Price:</h5><h5 className="text-gray">${cart.total_price}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className=" table-responsive px-0 mt-2">
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
                                            {cart?.items.map((item, index) => (
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
                                                <td className="fs-5">Total:</td>
                                                <td className="fs-5">${cart.total_price}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))):(<></>)}
        </div>
    );
};
