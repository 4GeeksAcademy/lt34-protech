import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";
import { ThreeDotsVertical, Trash, PencilSquare, EyeFill } from 'react-bootstrap-icons';

export const OrderList = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const [orders, setOrders] = useState([])
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;


	const getOrders = () => {
		const token = actions.verifyTokenSeller();

		fetch(`${process.env.BACKEND_URL}/api/seller/orders`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Error fetching order list: " + response.statusText);
			}
			return response.json();
		})
		.then((data) => {
			setOrders(data);
			
		})
		.catch((error) => {
			console.error("Error fetching order list:", error);
		});
	};

	useEffect(() => {
		getOrders();
	}, []);
	
	const filteredData = orders.filter((item) =>
		item.created_at.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Cálculo de la paginación
	const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	const paginatedData = filteredData.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// Función para cambiar la página
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	
	return (
		<div style={{paddingBottom: "100px"}}>
			<div className="row mb-5" >
				<div className="col-12 d-flex">
					<div>
						<h2>Order list</h2>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-12">
					<div className="card-black">
						<div className="pt-4 ps-4 pe-4 pb-3 d-flex justify-content-between">
							<div>
								<input
								style={{width: "320px"}}
								placeholder="Search Orders"
								className="form-control"
								type="search"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
						</div>
						<div className=" table-responsive">
							<table className="table-centered text-nowrap table table-borderless table-hover">
								<thead>
								<tr className="bg-purple">
									<th>Order ID</th>
									<th>Customer</th>
									<th>Date</th>
									<th>Status</th>
									<th>Total Price</th>
									<th></th>
								</tr>
								</thead>
								<tbody>
									{paginatedData.length > 0 ? paginatedData.map((order, index) => (
										<tr key={index}>
											<td>#{order.cart_id}</td>
											<td>{order.comprador.name}</td>
											<td>{order.created_at}</td>
											<td>{order.state}</td>
											<td>${order.total_price}</td>
											<td>
												<a style={{fontSize: "19px", cursor: "pointer"}} 
												onClick={()=> navigate(`/dashboard/order-single/${order.cart_id}`)}
												className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
													<EyeFill/>
												</a>
											</td>
										</tr>
									)):<></>}
								</tbody>
							</table>
						</div>
						<div className="d-flex justify-content-between p-3 pt-2 align-content-center" style={{borderTop: "1px solid rgb(255 255 255 / 34%)"}}>
							<div className="ms-2 align-content-center">
								<span className="footer-table">total of items: {orders.length}</span>
							</div>
							<div className="pt-3 pb-2 pe-2 d-flex align-content-center">
								<div className="pagination d-flex justify-content-center">
									<button
										className="pagination-buttons-notactive me-2"
										onClick={() => handlePageChange(currentPage - 1)}
										disabled={currentPage === 1}
									>
										Previous
									</button>
									{Array.from({ length: totalPages }, (_, i) => (
										<button
										key={i}
										className={` ${
											currentPage === i + 1 ? "pagination-buttons" : "pagination-buttons-notactive"
										} me-2`}
										onClick={() => handlePageChange(i + 1)}
										>
										{i + 1}
										</button>
									))}
									<button
										className="pagination-buttons-notactive"
										onClick={() => handlePageChange(currentPage + 1)}
										disabled={currentPage === totalPages}
									>
										Next
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};