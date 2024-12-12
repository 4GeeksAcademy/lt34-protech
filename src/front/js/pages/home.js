import { useState, useEffect, useContext } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Categorias } from "./categoria";
import "../../styles/home.css";
import { CardProduct } from "../component/cardproduct";

export const Home = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    
    useEffect(() => {
        setFilteredProducts(filterProducts(store.search));
    }, [store.search, products]);

    useEffect(() => {
        actions.setSearch("")
        getProducts();
        getCategories();
    }, []);

    const getProducts = () => {
        fetch(process.env.BACKEND_URL + "/api/products", { method: "GET" })
            .then((response) => response.json())
            .then((data) => {
                setProducts(Array.isArray(data) ? data : []);
                setFilteredProducts(Array.isArray(data) ? data : []);
            });
    };

    const getCategories = () => {
        fetch(`${process.env.BACKEND_URL}/api/categorias`)
            .then((response) => response.json())
            .then((data) => setCategorias(data))
            .catch((error) => console.error("Error fetching categorias:", error));
    };


    const filterProducts = (searchTerm) => {
        if (!searchTerm) return products;
        return products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedData = Array.isArray(filteredProducts)
    ? filteredProducts.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
      )
    : [];

    const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

    return (
    	<div className="container">
            <section className={store.search.trim() == "" ? (""):("d-none")}>
                <div id="carouselExampleDark" className="carousel slide mt-4 rounded mb-5"  data-bs-ride="carousel" data-bs-pause="false">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    </div>
                    <div className="carousel-inner rounded-3">
                        <div className="carousel-item active">
                            <img src="https://images.pexels.com/photos/8721342/pexels-photo-8721342.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="d-block" alt="..."/>
                            <div className="caption-carousel d-none d-md-block">
                                <h1>Your trusted technology store</h1>
                                <p>Connect with trusted sellers and find quality products.</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="https://images.pexels.com/photos/1038916/pexels-photo-1038916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="d-block" alt="..."/>
                            <div className="caption-carousel d-none d-md-block">
                                <h1>Create the setup of your dreams</h1>
                                <p>Some representative placeholder content for the first slide.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={store.search.trim() == "" ? (""):("d-none")}>
                <div className="row">
                    <div className="mb-3 mb-lg-0 col-md-6 col-12">
                        <div className="card-shop" style={{backgroundImage:"url(https://img.freepik.com/premium-photo/illuminated-keyboard-neon-keyboard-mechanical-gaming-keyboard-gaming-keyboard_569725-17090.jpg)"}}>
                            <div>
                                <h3 className="fw-bold mb-4 text-white">Get a new keyboard</h3>
                                <span></span>
                                <div className="mt-2">
                                    <button onClick={()=>actions.setSearch("keyboard")} className="purple-button">Shop Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-3 mb-lg-0 col-md-6 col-12">
                        <div className="card-shop" style={{backgroundImage:"url(https://res.cloudinary.com/dqs1ls601/image/upload/v1732314552/snn2dhmpcuvjqdd1zmmf.png)"}}>
                            <div>
                                <h3 className="fw-bold mb-4">Want to start selling?</h3>
                                <div className="mt-2">
                                   <Link to="/seller/signup"><button className="purple-button">Click here</button></Link> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={store.search.trim() == "" ? (""):("mt-5")}>
                <div className="row mt-5 mb-3">
                    <div className="mb-6 col-12">
                        <h3 className="mb-0 text-white">{store.search.trim() == "" ? ("Products"):(`Search for "${store.search.trim()}"`)}</h3>
                    </div>
                </div>
                <div className="g-4 row row-cols-lg-4 row-cols-xl-5 row-cols-md-3 row-cols-2">
                    {paginatedData.length > 0 ? (paginatedData.map((product)=> (
                        <div key={product.id} className="col">
                            <CardProduct
                                image= {product.image}
                                category={product.category.name}
                                title={product.name}
                                price={product.price}
                                link={`/detail/${product.id}`}
                                onAddToCart={()=>actions.addToCart(product.id)}
                            />
                        </div>
                    ))):(<></>)}
                </div>
                <div className="pt-3 pb-2 pe-2 d-flex align-content-center w-100">
                    <div className="pagination d-flex justify-content-end w-100">
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
            </section>
		</div>
	);
};