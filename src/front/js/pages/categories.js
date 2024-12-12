import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";
import { ThreeDotsVertical, Trash, PencilSquare } from 'react-bootstrap-icons';

export const Categories = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const [categories, setCategories] = useState([])
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	const getCategories = () => {

		fetch(`${process.env.BACKEND_URL}/api/categorias`)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Error fetching products: " + response.statusText);
				}
				return response.json();
			})
			.then((data) => {
				setCategories(data)
                
			})
			.catch((error) => {
				console.error("Error fetching cart items:", error);
			});
	};

	useEffect(() => {
		getCategories();
	}, []);
	
	const filteredData = categories.filter((item) =>
		item.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	const paginatedData = filteredData.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const deleteCategory = (categoryId)=>{
		fetch(`${process.env.BACKEND_URL}/api/categorias/${categoryId}`, { method: "DELETE" })
		.then((response) => {
			if (response.ok) {
			getCategories();
			} else {
			console.error("Error deleting category:", response.statusText);
			}
		})
		.catch((error) => console.error("Network error:", error));
	}

	const editCategory = (categoryId)=>{
		navigate(`/edit-category/${categoryId}`);
	}

	return (
		<div style={{paddingBottom: "100px"}}>
			<div className="row mb-5" >
				<div className="col-12 d-flex">
					<div>
						<h2>Categories</h2>
					</div>
					<div className="ms-auto mt-5">
						<button className="purple-button" onClick={()=>navigate("/add-category")}>Add Category</button>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-12">
					<div className="card-black">
						<div className="pt-4 ps-4 pe-4 pb-3 d-flex justify-content-between">
							<div>
								<input
								placeholder="Search Categories"
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
								<th>Category Name</th>
								<th>Quantity Products</th>
								<th></th>
							</tr>
							</thead>
							<tbody>
								{paginatedData.length > 0 ? paginatedData.map((category, index) => (
									<tr key={index}>
										<td>{category.name}</td>
										<td>{category.product_count}</td>
										<td>
											<a className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
												<ThreeDotsVertical/>
											</a>
											<ul className="dropdown-menu dropdown-menu-end">
												<li onClick={() => deleteCategory(category.id)}><a className="dropdown-item"><Trash/> Delete</a></li>
												<li onClick={() => editCategory(category.id)}><a className="dropdown-item"><PencilSquare/> Edit</a></li>
											</ul>
										</td>
									</tr>
								)):<></>}
							</tbody>
						</table>
						</div>
						<div className="d-flex justify-content-between p-3 pt-2 align-content-center" style={{borderTop: "1px solid rgb(255 255 255 / 34%)"}}>
							<div className="ms-2 align-content-center">
								<span className="footer-table">total of items: {categories.length}</span>
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