import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const Address = () => {
    const { store, actions } = useContext(Context);
    
    const [direcciones, setDirecciones] = useState([]);
    const [activeTab, setActiveTab] = useState("list-tab");
    const [direccion, setDireccion] = useState("");
    const [codigoPostal, setCodigoPostal] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [pais, setPais] = useState("");
    const [idDireccionSeleccionada, setIdDireccionSeleccionada] = useState(null);
    const [mensaje, setMensaje] = useState("");

    const obtenerDirecciones = () => {
        fetch(process.env.BACKEND_URL + "/api/Address", { method: "GET" })
            .then((response) => response.json())
            .then((data) => {
                setDirecciones(data);
            })
            .catch((error) => console.log("Error al obtener direcciones: ", error));
    };

    useEffect(() => {
        obtenerDirecciones();
    }, []);

    const crearDireccion = () => {
        fetch(`${process.env.BACKEND_URL}/api/Address`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                direccion,
                codigo_postal: codigoPostal,
                ciudad,
                pais,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Dirección creada:", data);
                setMensaje("Dirección creada exitosamente.");
                reiniciarFormulario();
                obtenerDirecciones();
            })
            .catch((error) => {
                console.error("Error al crear la dirección: ", error);
            });
    };

    const actualizarDireccion = () => {
        fetch(`${process.env.BACKEND_URL}/api/Address/${idDireccionSeleccionada}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                direccion,
                codigo_postal: codigoPostal,
                ciudad,
                pais,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Dirección actualizada:", data);
                setMensaje("Dirección actualizada exitosamente.");
                reiniciarFormulario();
                obtenerDirecciones();
            })
            .catch((error) => {
                console.error("Error al actualizar la dirección: ", error);
            });
    };

    const manejarEnvio = (e) => {
        e.preventDefault();
        if (idDireccionSeleccionada) {
            actualizarDireccion();
        } else {
            crearDireccion();
        }
    };

    const manejarEliminacion = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta dirección?")) {
            fetch(`${process.env.BACKEND_URL}/api/Address/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(() => {
                    setDirecciones((prev) => prev.filter((direccion) => direccion.id !== id));
                    setMensaje("Dirección eliminada exitosamente.");
                })
                .catch((error) => console.log("Error eliminando dirección: ", error));
        }
    };

    const reiniciarFormulario = () => {
        setDireccion("");
        setCodigoPostal("");
        setCiudad("");
        setPais("");
        setIdDireccionSeleccionada(null);
        setActiveTab("create-tab");
        setMensaje("");
    };

    const verDetallesDireccion = (direccion) => {
        setDireccion(direccion.direccion);
        setCodigoPostal(direccion.codigo_postal);
        setCiudad(direccion.ciudad);
        setPais(direccion.pais);
        setIdDireccionSeleccionada(direccion.id);
        setActiveTab("create-tab");
    };

    return (
        <div className="container">
            {mensaje && <div className="alert alert-info">{mensaje}</div>}
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === "list-tab" ? "active" : ""}`}
                        id="list-tab"
                        data-bs-toggle="tab"
                        type="button"
                        role="tab"
                        aria-controls="list-tab-pane"
                        aria-selected={activeTab === "list-tab"}
                        onClick={() => setActiveTab("list-tab")}
                    >
                        Lista
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === "create-tab" ? "active" : ""}`}
                        id="create-tab"
                        data-bs-toggle="tab"
                        type="button"
                        role="tab"
                        aria-controls="create-tab-pane"
                        aria-selected={activeTab === "create-tab"}
                        onClick={reiniciarFormulario}
                    >
                        Crear
                    </button>
                </li>
            </ul>

            <div className="tab-content" id="myTabContent">
                <div
                    className={`tab-pane fade ${activeTab === "list-tab" ? "show active" : ""}`}
                    id="list-tab-pane"
                    role="tabpanel"
                    aria-labelledby="list-tab"
                >
                    <h1>Lista de Direcciones</h1>
                    <ul className="list-group">
                        {direcciones.length > 0 ? (
                            direcciones.map((direccion) => (
                                <li key={direccion.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Dirección:</strong> {direccion.direccion} <br />
                                        <strong>Código Postal:</strong> {direccion.codigo_postal} <br />
                                        <strong>Ciudad:</strong> {direccion.ciudad} <br />
                                        <strong>País:</strong> {direccion.pais} <br />
                                    </div>
                                    <div>
                                        <button className="btn btn-danger btn-sm" onClick={() => manejarEliminacion(direccion.id)}>
                                            Eliminar
                                        </button>
                                        <button className="btn btn-primary btn-sm" onClick={() => verDetallesDireccion(direccion)}>
                                            Detalle
                                        </button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => verDetallesDireccion(direccion)}>
                                            Editar
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item">No hay direcciones disponibles</li>
                        )}
                    </ul>
                </div>

                <div
                    className={`tab-pane fade ${activeTab === "create-tab" ? "show active" : ""}`}
                    id="create-tab-pane"
                    role="tabpanel"
                    aria-labelledby="create-tab"
                >
                    <h1>{idDireccionSeleccionada ? "Modificar Dirección" : "Crear Nueva Dirección"}</h1>
                    <form onSubmit={manejarEnvio}>
                        <div className="mb-3">
                            <label htmlFor="direccion" className="form-label">Dirección</label>
                            <input
                                type="text"
                                className="form-control"
                                id="direccion"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="codigo_postal" className="form-label">Código Postal</label>
                            <input
                                type="text"
                                className="form-control"
                                id="codigo_postal"
                                value={codigoPostal}
                                onChange={(e) => setCodigoPostal(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ciudad" className="form-label">Ciudad</label>
                            <input
                                type="text"
                                className="form-control"
                                id="ciudad"
                                value={ciudad}
                                onChange={(e) => setCiudad(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pais" className="form-label">País</label>
                            <input
                                type="text"
                                className="form-control"
                                id="pais"
                                value={pais}
                                onChange={(e) => setPais(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {idDireccionSeleccionada ? "Actualizar Dirección" : "Crear Dirección"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
