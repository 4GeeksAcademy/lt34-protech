import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/addproduct.css";

export const EditCategory = () => {
	const { store, actions } = useContext(Context);
	const [name,setName] = useState("")
	const navigate = useNavigate();
    const { categoryId } = useParams()

    useEffect(() => {
        getToEdit()
	}, []);
    const getToEdit = () => {
        const token = actions.verifyTokenSeller()

        fetch(`${process.env.BACKEND_URL}/api/categorias/${categoryId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error fetching cart items: " + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            setName(data.name);
        })
        .catch((error) => {
            console.error("Error fetching cart items:", error);
        });
    };

	const editCategory = (e) =>{
		e.preventDefault();

		const raw = JSON.stringify({
			name: name
		});

		const token = actions.verifyTokenSeller();

		fetch(`${process.env.BACKEND_URL}/api/categorias/${categoryId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
			body: raw
		})
		.then(() => {
			setName("")
			navigate("/dashboard/categories")
		})
		.catch((error) => console.error("Error creating product:", error));
	}

	return (
		<div >
			<div className="row mb-5" >
				<div className="col-12 d-flex">
					<div>
						<h2>Add New Category</h2>
					</div>
					<div className="ms-auto mt-5">
						<button className="purple-button" onClick={() => navigate("/dashboard/categories")}>Back to categories</button>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-12">
					<div className="card-black body-card">
						<h5 className="mb-4">Category Name</h5>
						<form onSubmit={(e)=>editCategory(e)}>
							<div className="row mb-3">
								<div className="col-12">
									<label htmlFor="name">Title</label>
									<input id="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Category name" className="form-control" type="text" required></input>
								</div>
							</div>
                            <div className="row">
								<div className="col-12 d-flex">
									<div className="mb-3 ms-auto">
										<button className="purple-button" type="submit">Create</button>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};