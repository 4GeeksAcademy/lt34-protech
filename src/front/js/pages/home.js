import { useState, useEffect, useContext } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Categorias } from "./categoria";
import "/workspaces/lt34-protech/src/front/styles/home.css";

export const Home = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [amounts, setAmounts] = useState({});
    const [categorias, setCategorias] = useState([]);

    const logOut = () => {
        localStorage.removeItem("jwt-token-seller");
        localStorage.removeItem("jwt-token-buyer");
        actions.changeAuthenticatedBuyer(false);
        actions.changeAuthenticatedSeller(false);
        navigate("/buyer/login");
    };
    
    
    useEffect(() => {
        getProducts();
        getCategorias();
    }, []);

    const getProducts = () => {
        fetch(process.env.BACKEND_URL + "/api/products", { method: "GET" })
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
                const initialAmounts = {};
                data.forEach(product => {
                    initialAmounts[product.id] = 1;
                });
                setAmounts(initialAmounts);
            });
    };

    const getCategorias = () => {
        fetch(`${process.env.BACKEND_URL}/api/categorias`)
            .then((response) => response.json())
            .then((data) => setCategorias(data))
            .catch((error) => console.error("Error fetching categorias:", error));
    };

    

    const filtering = (e) => {
        setFilter(e.target.value);
    };

    let results = [];
    if (!filter && minPrice === "" && maxPrice === "") {
        results = products;
    } else {
        results = products.filter((product) => {
            const matchesName = product.name && product.name.toLowerCase().includes(filter.toLowerCase());
            const matchesCategory = product.category && product.category.name.toLowerCase().includes(filter.toLowerCase());
            const price = product.price;
            const inPriceRange =
                (minPrice === "" || price >= parseFloat(minPrice)) &&
                (maxPrice === "" || price <= parseFloat(maxPrice));
            return (matchesName || matchesCategory) && inPriceRange;
        });
    }

    return (
        
    <div className="wrapper">
  <main className="main-content">
  <div className="border-bottom">
                <div className="bg-light py-4">
                    <div className="container">
                        <div className="row align-items-center">
                            
                            <div className="col-md-3">
                                <Link to="/">
                                    <span className="navbar-brand h1 text-primary fs-3">Pro Tech</span>
                                </Link>
                            </div>

                   
                            <div className="col-md-6">
                                <div className="input-group">
                                    <input
                                        value={filter}
                                        onChange={filtering}
                                        type="text"
                                        placeholder="Search products..."
                                        className="form-control"
                                    />
                                    <button className="btn btn-outline-primary">
                                        Search
                                    </button>
                                </div>
                            </div>

                         
                            <div className="col-md-3 text-end">
                                {store.authenticatedBuyer || store.authenticatedSeller ? (
                                    <button className="btn btn-danger" onClick={logOut}>
                                        Log Out
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn-primary me-2"
                                            onClick={() => navigate("/buyer/login")}
                                        >
                                            Log In
                                        </button>
                                        {!store.authenticatedSeller && (
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() => navigate("/seller/login")}
                                            >
                                                Start Selling
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                      
                        {(store.authenticatedBuyer || store.authenticatedSeller) && (
                            <div className="row mt-3">
                                <div className="col-12">
                                    <div className="d-flex gap-2 flex-wrap">
                                        {store.authenticatedBuyer && (
                                            <>
                                                <Link to="/buyer/profile" className="btn btn-outline-primary btn-sm">
                                                    Profile
                                                </Link>
                                                <Link to="/cartview" className="btn btn-outline-primary btn-sm">
                                                    Cart
                                                </Link>
                                                <Link to="/productsbuyers" className="btn btn-outline-primary btn-sm">
                                                    Products
                                                </Link>
                                                <Link to="/ordersplaced" className="btn btn-outline-primary btn-sm">
                                                    Orders
                                                </Link>
                                                <Link to="/buyeraddress" className="btn btn-outline-primary btn-sm">
                                                    Address
                                                </Link>
                                            </>
                                        )}

                                        {store.authenticatedSeller && (
                                            <>
                                                <Link to="/orders" className="btn btn-outline-primary btn-sm">
                                                    Orders
                                                </Link>
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => navigate("/selleraddress")}
                                                >
                                                    Address
                                                </button>
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => navigate("/product/seller")}
                                                >
                                                    My Products
                                                </button>
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => navigate("/dashboard")}
                                                >
                                                    Dashboard
                                                </button>
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => navigate("/profile/seller")}
                                                >
                                                    Profile
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

          
            <div className="carousel slide mb-4" id="carouselExampleCaptions" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="https://via.placeholder.com/1920x400" className="d-block w-100" alt="Slide 1" />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Slide 1 Title</h5>
                            <p>Some description for slide 1.</p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="https://via.placeholder.com/1920x400" className="d-block w-100" alt="Slide 2" />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Slide 2 Title</h5>
                            <p>Some description for slide 2.</p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="https://via.placeholder.com/1920x400" className="d-block w-100" alt="Slide 3" />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Slide 3 Title</h5>
                            <p>Some description for slide 3.</p>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            <h3 class="mb-4">Featured Categories</h3>
<div className="container py-4">
  <div className="row g-4">
    {categorias.map((categoria) => (
      <div key={categoria.id} className="col-md-3">
        <div className="card h-100">
          <img
            src={categoria.id || "/api/placeholder/300/200"}
            className="card-img-top"
            alt={categoria.name}
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h5 className="card-title">{categoria.name}</h5>
            <p className="card-text text-truncate">{categoria.description}</p>
            <button
              className="btn btn-primary w-100 mt-3"
              onClick={() => navigate(`/categoria/${categoria.id}`)}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

<div className="container my-5">
  <div className="row">
   
    <div className="mb-3 mb-lg-0 col-md-6 col-12">
      <div className="card-banner card-banner-1">
        <div>
          <h3 className="fw-bold mb-1 text-white">Fruits &amp; Vegetables</h3>
          <p className="mb-4 text-white">
            Get Upto <span className="fw-bold">30%</span> Off
          </p>
          <a role="button" href="#!" className="btn btn-blue">
            Shop Now
          </a>
        </div>
      </div>
    </div>

   
    <div className="mb-3 mb-lg-0 col-md-6 col-12">
      <div className="card-banner card-banner-2">
        <div>
          <h3 className="fw-bold mb-1 text-white">Freshly Baked Buns</h3>
          <p className="mb-4 text-white">
            Get Upto <span className="fw-bold">25%</span> Off
          </p>
          <a role="button" href="#!" className="btn btn-blue">
            Shop Now
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<div className="my-5">
  <h3 className="mb-4">Popular Products</h3>
  <div className="container py-4">
    <div className="row g-4">
      {results.map((product) => (
        <div key={product.id} className="col-md-3">
          <div className="card h-100">
            <img
              src={product.image} 
              className="card-img-top card-img"
              alt={product.name}
            />
            <div className="card-body">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text text-truncate">{product.description}</p>
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="card-price">${product.price}</h6>
                <span className="text-muted card-stock">Stock: {product.stock}</span>
              </div>
              <button
                className="btn btn-primary w-100 mt-3"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

<h3 className="mb-4">Best Products</h3>

<div className="table-responsive-xl pb-6">
  <div className="row g-4">
    {/* Banner Card */}
    <div className="col">
      <div className="card-banner card-banner-3">
        <div>
          <h3 className="fw-bold text-white">100% Pro Tech</h3>
          <p className="text-white">Get the best deal before close.</p>
          <a className="btn btn-primary" href="">
            Shop Now
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ms-1">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </div>

    
    {results.map((product) => (
      <div key={product.id} className="col-md-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="position-relative">
            <img
              src={product.image || '/api/placeholder/300/200'}
              className="card-img-top card-img card-img-top-rounded"
              alt={product.name}
            />
            {product.discount && (
              <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                {product.discount}% Off
              </span>
            )}
          </div>
          <div className="card-body">
            <h5 className="card-title text-truncate">{product.name}</h5>
            <p className="card-text text-truncate small">{product.description}</p>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold text-primary">${product.price}</span>
              <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Rating Section */}
            <div className="d-flex align-items-center">
              <div className="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`bi bi-star${product.rating >= star ? '-fill' : ''}`}></span>
                ))}
              </div>
              <span className="ms-2 text-muted">({product.rating} / 5)</span>
            </div>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

  </main>
  
  <footer className="footer">
  <div className="container">
    <div className="row py-4">
      {/* Columna de categorías */}
      <div className="col-lg-4 col-md-12 col-12">
        <h6 className="mb-4">Categories</h6>
        <div className="row">
          <div className="col-6">
            <div className="flex-column nav">
              <a href="#" className="nav-link mb-2" tabIndex="0">Vegetables &amp; Fruits</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Breakfast &amp; instant food</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Bakery &amp; Biscuits</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Atta, rice &amp; dal</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Sauces &amp; spreads</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Organic &amp; gourmet</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Baby care</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Cleaning essentials</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Personal care</a>
            </div>
          </div>
          <div className="col-6">
            <div className="flex-column nav">
              <a href="#" className="nav-link mb-2" tabIndex="0">Dairy, bread &amp; eggs</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Cold drinks &amp; juices</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Tea, coffee &amp; drinks</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Masala, oil &amp; more</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Chicken, meat &amp; fish</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Paan corner</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Pharma &amp; wellness</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Home &amp; office</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Pet care</a>
            </div>
          </div>
        </div>
      </div>

      {/* Columna de información adicional */}
      <div className="col-lg-8 col-md-12 col-12">
        <div className="row">
          <div className="col-md-3 col-sm-6 col-6">
            <h6 className="mb-4">Get to know us</h6>
            <div className="flex-column nav">
              <a href="#" className="nav-link mb-2" tabIndex="0">Company</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">About</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Blog</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Help Center</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Our Value</a>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 col-6">
            <h6 className="mb-4">For Consumers</h6>
            <div className="flex-column nav">
              <a href="#" className="nav-link mb-2" tabIndex="0">Payments</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Shipping</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Product Returns</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">FAQ</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Shop Checkout</a>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 col-6">
            <h6 className="mb-4">Become a Shopper</h6>
            <div className="flex-column nav">
              <a href="#" className="nav-link mb-2" tabIndex="0">Shopper Opportunities</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Become a Shopper</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Earnings</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Ideas &amp; Guides</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">New Retailers</a>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 col-6">
            <h6 className="mb-4">Freshcart programs</h6>
            <div className="flex-column nav">
              <a href="#" className="nav-link mb-2" tabIndex="0">Freshcart programs</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Gift Cards</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Promos &amp; Coupons</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Freshcart Ads</a>
              <a href="#" className="nav-link mb-2" tabIndex="0">Sell on Freshcart</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

 
  <div className="footer__bottom ">
    <div className="container pt-3">
      <div className="text-center">
        <p>© 2024 Freshcart. All Rights Reserved.</p>
        <div className="pt-1 social-icons">
          <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon">Facebook</a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon">Instagram</a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon">Twitter</a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon">YouTube</a>
        </div>
      </div>
    </div>
  </div>
</footer>


</div>
        
    );
};
