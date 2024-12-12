import React, { useState, useEffect, useContext, useRef } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Context } from "../store/appContext";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/cart.css";
import { Trash } from "react-bootstrap-icons";

export const Cart = () => {
    const { store, actions } = useContext(Context);
    const [cart, setCart] = useState({});
    const [message, setMessage] = useState("");
    const totalPrice = useRef(0);
    const cartId = useRef(0);
    const navigate = useNavigate();


	useEffect(() => {
        if (store.cart) {
            
            setCart(store.cart);
            totalPrice.current = store.cart.total_price
            cartId.current = store.cart.cart_id
            
        }
    }, [store.cart]);

    const createOrder = (data, actions) => {
        if (totalPrice.current == 0) {
            setMessage("the cart is empty")
            return;
        }

        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: totalPrice.current, 
                    },
                },
            ],
        });
    };

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

    const onApprove = () => {
        const token = actions.verifyTokenBuyer();
        fetch(process.env.BACKEND_URL + `/api/cart/${cartId.current}/generate`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then(() => {
            actions.getCart();
            navigate("/")
        })
    };

    return (
        <div className="container">
            {cart ? (
                <div className="mt-5">
                    <div className="row mb-5 mt-5">
                        <div className="col-12 d-flex">
                            <h2>Cart</h2>
                            <button
                                className="purple-button ms-auto mt-2"
                                onClick={() => navigate("/")}
                            >
                                Back to shopping
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8">
                            <div className="card-black body-card cart-list">
                                <ul className="list-group list-group-flush ">
                                        <li className="px-0 border-bottom border-secondary list-group-item">
                                            <div className="align-items-center row text-white">
                                                <div className="col-3 me-5 ">
                                                    <div>
                                                        <h5>Product</h5>
                                                    </div>
                                                </div>
                                                <div className="col-3 ms-1">
                                                    <div className="ms-3">
                                                        <h5>Price</h5>
                                                    </div>
                                                </div>
                                                <div className="col-3">
                                                    <div className="ms-3">
                                                            <h5>Amount</h5>
                                                        </div>
                                                    </div>
                                                <div className="col-2">
                                                    <div>
                                                        <h5 className="text-end me-2">Total</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    {cart.items?.length > 0 ? (cart.items.map((item, index) =>(
                                        <li key={index} className="px-0 border-bottom border-secondary list-group-item item-cart justify-content center mb-4">
                                            <div className="align-items-center row text-white">
                                                <div className="col-4">
                                                    <div className="ms-3">
                                                        <p className="fs-6">{item.product.name}</p>
                                                        <a className="text-secondary" onClick={()=>removeItem(item.item_id)}><Trash/> Remove</a>
                                                    </div>
                                                </div>
                                                <div className="col-3">
                                                    <div className="ms-3">
                                                        <p className="fs-6">${item.product.price?.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <div className="col-3">
                                                    <div className="input-group">
                                                        <button style={{borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px", margin: "0px"}}
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
                                                <div className="col-2">
                                                    <div>
                                                        <p className="text-center fs-6">${(item.product.price * item.amount).toFixed(2)}</p>
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
                            </div>
                        </div>

                        <div className="col-4">
                            <div className="card-black order-sumary mb-3">
                                <div className="body-card py-3">
                                   <h4>Order Summary</h4>
                                </div>
                                <hr></hr>
                                <div className="body-card py-4 d-flex justify-content-between">
                                    <div className="py-2">
                                        <h6>Subtotal:</h6>
                                        <h6>Shipping:</h6>
                                    </div>
                                    <div className="py-2">
                                        <h6>${cart?.total_price?.toFixed(2)}</h6>
                                        <h6>Free</h6>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="py-3 body-card d-flex justify-content-between">
                                   <h5>Total:</h5>
                                   <h5>${cart?.total_price?.toFixed(2)}</h5>
                                </div>
                            </div>
                            <p className="text-danger text-center mb-3 fs-6 me-3">{message}</p>
                            <PayPalScriptProvider
                                options={{
                                    "client-id": "AZQaE8q4sHLoA6t11j6OvMYkpAhcykSsXil8Q0PtKiKGHJhxkAvUN154cqZGvUAH7RQcu8LeFuknfBOQ",
                                    currency: "USD",
                                    intent: "capture",
                                }}
                            >
                                <div style={{width: "390px"}}>
                                    <PayPalButtons
                                        createOrder={createOrder}
                                        onApprove={onApprove}
                                        style={{ color: "blue" }}
                                        
                                    />
                                </div>
                            </PayPalScriptProvider>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading order details...</p>
            )}
        </div>
    );
};

