import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";
import { Cart, CurrencyDollar, People, CaretDown } from 'react-bootstrap-icons';
import TopSellerProductsChart from "../component/topsellerproducts";
import TopCategoriesChart from "../component/topcategorieschart";

export const Dashboard = () => {
	const { store, actions } = useContext(Context);
	const [earnings, setEarnings] = useState(0)
	const [orders, setOrders] = useState(0)
	const [customers, setCustomers] = useState(0)
	const [recentOrders, setRecentOrders] = useState([])
	const navigate = useNavigate();

	const getMonthlyRevenue = () => {
		const token = actions.verifyTokenSeller();

        fetch(process.env.BACKEND_URL + "/api/sales/revenue", {
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
				setEarnings(data[data.length - 1].total_revenue)
            })
            .catch((error) => {
                console.error("Error removing item from cart:", error);
            });
	};

	const getMonthlyOrders = () => {
		const token = actions.verifyTokenSeller();

        fetch(process.env.BACKEND_URL + "/api/orders/count", {
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
				setOrders(data.orders_count)
            })
            .catch((error) => {
                console.error("Error removing item from cart:", error);
            });
	};

	const getMonthlyCustomers = () => {
		const token = actions.verifyTokenSeller();

        fetch(process.env.BACKEND_URL + "/api/customers/count", {
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
				setCustomers(data.customers_count)
            })
            .catch((error) => {
                console.error("Error removing item from cart:", error);
            });
	};

	const getRecentOrders = () => {
		const token = actions.verifyTokenSeller();

        fetch(process.env.BACKEND_URL + "/api/orders/recent", {
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
				setRecentOrders(data)
				
            })
            .catch((error) => {
                console.error("Error removing item from cart:", error);
            });
	};
	
	useEffect(() => {
		getMonthlyRevenue();
		getMonthlyOrders();
		getMonthlyCustomers();
		getRecentOrders();
	}, []);

	return (
		<div className="dashboard pb-5">
            <div className="row mb-4">
				<div className="col-12">
					<div className="card-black">
						<div style={{padding: "55px 77px"}}>
							<h1>Welcome to the dashboard</h1>
							<p style={{fontSize: "16px", marginBottom: "15px"}}>Here you can see all about yours products</p>
							<button className="purple-button mt-4" onClick={()=>navigate("/add-product")}>Create product</button>
						</div>
					</div>
				</div>
			</div>
			<div className="flex-nowrap row mb-4">
				<div className="col-4 ">
					<div className="body-card card-black">
						<div className="d-flex justify-content-between align-items-center mb-4">
							<div>
								<h5 className="px-0">Earnings</h5>
							</div>
							<div className="container-icon">
								<h5><CurrencyDollar className="card-icon"/></h5>
							</div>
						</div>
						<div>
							<h3 className="mb-2">${earnings}</h3>
							<span className="text-gray">Monthly revenue</span>
						</div>
					</div>
				</div>
				<div className="col-4 ">
					<div className="body-card card-black">
						<div className="d-flex justify-content-between align-items-center mb-4">
							<div>
								<h5 className="px-0">Orders</h5>
							</div>
							<div className="container-icon">
								<h5><Cart className="card-icon"/></h5>
							</div>
						</div>
						<div>
							<h3 className="mb-2">{orders}</h3>
							<span className="text-gray">Monthly orders</span>
						</div>
					</div>
				</div>
				<div className="col-4">
					<div className="body-card card-black">
						<div className="d-flex justify-content-between align-items-center mb-4">
							<div>
								<h5 className="px-0">Customer</h5>
							</div>
							<div className="container-icon">
								<h5><People className="card-icon"/></h5>
							</div>
						</div>
						<div>
							<h3 className="mb-2">{customers}</h3>
							<span className="text-gray">Monthly customers</span>
						</div>
					</div>
				</div>
				
			</div>
			<div className="row gx-4 gy-4 mb-4">
				<div className="col-xl-8 col-lg-12">
					<div className="card-black body-card h-100">
						<div className="d-flex justify-content-between">
							<div>
								<h5>Best Selling Categories</h5>
							</div>
						</div>
						<div className="grafic">
							<TopCategoriesChart></TopCategoriesChart>
						</div>
					</div>
				</div>
				<div className="col-xl-4 col-lg-12">
					<div className="card-black h-100" style={{ paddingTop: "15px" }}>
						<div className="mb-3 ps-3 pt-2">
							<h5>Top Products</h5>
						</div>
						<div className="grafic">
							<TopSellerProductsChart></TopSellerProductsChart>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-12">
					<div className="card-black">
						<div className="pt-4 ps-4 pb-3"> <h5>Recent orders</h5> </div>
						<div className="pb-2 table-responsive">
							<table className="table-centered text-nowrap  table table-borderless table-hover">
								<thead>
									<tr className="bg-purple">
										<th>Product Name</th>
										<th>Order Date</th>
										<th>Price</th>
										<th>Stock</th>
										<th>Amount</th>
									</tr>
								</thead>
									<tbody>
										{recentOrders.map((order) =>
											order.items.map((item, index) => (
												<tr key={index}>
													<td>{item.product_name}</td>
													<td>{order.created_at}</td>
													<td>${item.price.toFixed(2)}</td>
													<td>{item.stock}</td>
													<td>{item.amount}</td>
												</tr>
											))
										)}
									</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};