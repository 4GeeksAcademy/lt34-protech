import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";
import { ThreeDotsVertical, Trash, PencilSquare, Newspaper } from 'react-bootstrap-icons';

export const DashboardProducts = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const [products, setProducts] = useState([])
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [articleProduct, setArticleProduct] = useState("");
	const [article, setArticle] = useState({});
	const [imageArticle, setImageArticle] = useState("");
	const itemsPerPage = 5;

	const topics = [
		"Cómo elegir el (producto) perfecto según tus necesidades",
		"Cómo aprovechar al máximo tu (producto) en el día a día",
		"Errores comunes al usar un (producto) y cómo evitarlos",
		"Todo lo que necesitas para mantener tu (producto) en buen estado",
		"Los mejores trucos para sacar el máximo provecho de tu (producto)",
		"Consejos para prolongar la vida útil de tu (producto)",
		"Secretos para obtener el máximo rendimiento de tu (producto)",
		"Los pros y contras de invertir en un (producto)",
		"Qué esperar de un( (producto) de alta calidad",
		"Preguntas que deberías hacer antes de comprar un( (producto)",
		"Características esenciales que debes buscar en un (producto)",
		"Los accesorios imprescindibles para complementar tu (producto)",
		"Cómo cuidar y mantener en buen estado tu (producto)",
	]

	const getProducts = () => {
		const token = actions.verifyTokenSeller();

		if (!token) {
		console.error("No valid token found. User might need to log in.");
		navigate("/login");
		return;
		}

		fetch(process.env.BACKEND_URL + "/api/products/seller", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Error fetching products: " + response.statusText);
				}
				return response.json();
			})
			.then((data) => {
				setProducts(data)
			})
			.catch((error) => {
				console.error("Error fetching cart items:", error);
			});
	};

	useEffect(() => {
		getProducts();
	}, []);
	
	const filteredData = products.filter((item) =>
		item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		item.category.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	const paginatedData = filteredData.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const deleteProduct = (productId)=>{
		fetch(`${process.env.BACKEND_URL}/api/products/${productId}`, { method: "DELETE" })
		.then((response) => {
			if (response.ok) {
			getProducts();
			} else {
			console.error("Error deleting product:", response.statusText);
			}
		})
		.catch((error) => console.error("Network error:", error));
	}

	const editProduct = (productId)=>{
		navigate(`/edit-product/${productId}`);
	}

	const generateArticle = async (productName) => {
		setArticleProduct(productName)
		const topic = topics[Math.floor(Math.random() * topics.length)];
	
		const apiKeyChatGPT = process.env.OPEN_AI_API_KEY;
		const endpointChatGPT = 'https://api.openai.com/v1/chat/completions';
	
		const prompt = `Escribe un artículo de 900 caracteres en formato JSON sobre el siguiente tema: "${topic}". El producto es: "${productName}". El JSON debe tener dos campos:
		  - 'title' para el título del artículo,
		  - 'content' para el cuerpo completo del artículo. 
		Asegúrate de que el JSON esté bien formado, sin ningún formato adicional, sin comillas invertidas o markdown, ni usar saltos de linea como "\n", y que sea válido para ser procesado directamente como JSON.`;
	
		try {
			const response = await fetch(endpointChatGPT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${apiKeyChatGPT}`
				},
				body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: [
					{ role: "system", content: "Eres un asistente que escribe artículos informativos y atractivos sobre productos para un sitio de marketplace." },
					{ role: 'user', content: prompt }
				],
					max_tokens: 400, 
				})
			});
	
			const data = await response.json();
		
			let content = data.choices[0].message.content;
			content = content.replace(/\\n/g, ''); 
			content = content.replace(/`/g, '');
			
			const dataArticle = JSON.parse(content)
			
			setArticle(dataArticle);
	
		} catch (error) {
		  	console.error('Error generando el artículo:', error);
		}
	
		const apiKeySearch = process.env.GOOGLE_API_KEY;
		const cx = process.env.GOOGLE_CX_ID;
		const endpointSearch = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(productName)}&cx=${cx}&searchType=image&key=${apiKeySearch}&num=1&imgType=photo`;
	
		try {
			const response = await fetch(endpointSearch);
			if (!response.ok) throw new Error('Error al obtener la imagen');
			const data = await response.json();
			setImageArticle(data.items[0]?.link || "https://example.com/default-image.jpg"); 
		} catch (error) {
			console.error('Error obteniendo imagen:', error);
			setImageArticle("https://example.com/default-image.jpg")
		}
	}

	const publishArticle = () => {
		
		const raw = {
			title: article.title, 
			image: imageArticle,
			content: article.content
		};
	
		fetch(`${process.env.BACKEND_URL}/api/articles`, {
		  method: "POST",
		  headers: {
				"Content-Type": "application/json",
		  },
		  body: JSON.stringify(raw)  
		})
		.then(response => {
			if (!response.ok) {
				throw new Error("Error al publicar el artículo");
			}
			return response.json();
		})
		.then(() => {
			cleanFieldsArticle();  
		})
		.catch(error => {
			console.error("Error:", error);
		});
	}
	const cleanFieldsArticle = () => {
		setArticle({})
		setImageArticle("")
	}

	return (
		<div style={{paddingBottom: "100px"}}>
			<div className="row mb-5" >
				<div className="col-12 d-flex">
					<div>
						<h2>Products</h2>
					</div>
					<div className="ms-auto mt-5">
						<button className="purple-button" onClick={()=>navigate("/add-product")}>Add product</button>
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
								placeholder="Search Products"
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
								<th>Product Name</th>
								<th>Category</th>
								<th>Price</th>
								<th>Stock</th>
								<th></th>
							</tr>
							</thead>
							<tbody>
								{paginatedData.length > 0 ? paginatedData.map((product, index) => (
									<tr key={index}>
										<td>{product.name}</td>
										<td>{product.category.name}</td>
										<td>${product.price}</td>
										<td>{product.stock}</td>
										<td>
											<a className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
												<ThreeDotsVertical/>
											</a>
											<ul className="dropdown-menu dropdown-menu-end">
												<li onClick={() => deleteProduct(product.id)}><a className="dropdown-item"><Trash/> Delete</a></li>
												<li onClick={() => editProduct(product.id)}><a className="dropdown-item"><PencilSquare/> Edit</a></li>
												<li data-bs-target="#exampleModal" data-bs-toggle="modal" onClick={()=>generateArticle(product.name)}>
												<a className="dropdown-item"><Newspaper/> generate Article</a></li>
											</ul>
										</td>
									</tr>
								)):<></>}
							</tbody>
						</table>
						</div>
						<div className="d-flex justify-content-between p-3 pt-2 align-content-center" style={{borderTop: "1px solid rgb(255 255 255 / 34%)"}}>
							<div className="ms-2 align-content-center">
								<span className="footer-table">total of products: {products.length}</span>
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
			<div className="modal fade" id="exampleModal" tabIndex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                  	<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="exampleModalLabel">Article</h1>
							<button type="button" onClick={() => cleanFieldsArticle()} className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body" style={{padding: "30px"}}>
							<div>
								<div>
									<h2>{article.title}</h2>
								</div>
								<div style={{width: "100%", height: "500px"}}>
									{imageArticle ? (
										<img src={imageArticle} style={{width: "100%", height: "100%", objectFit: "contain"}}/>
									):(
										<div className="d-flex justify-content-center align-items-center h-100">
											<div className="spinner-border text-primary" style={{width: "3rem", height: "3rem"}} role="status">
												<span class="visually-hidden">Loading...</span>
											</div>
										</div>
									)}
								</div>
								<div className="mt-4">
									<p>{article.content}</p>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" onClick={() => cleanFieldsArticle()} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<button type="button" className="purple-button" data-bs-dismiss="modal" 
								onClick={()=> {
									publishArticle() 
									cleanFieldsArticle()
								}}
							>Save</button> 
								
							<button type="button" onClick={() => generateArticle(articleProduct)} className="purple-button">regenerate</button>
						</div>
					</div>
                </div>
			</div>
		</div>
	);
};