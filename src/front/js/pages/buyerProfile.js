import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

import "../../styles/profile.css";


export const BuyerProfile = () => {
    const { store, actions } = useContext(Context);
    const [selectedFile, setSelectedFile] = useState(null);
    const [buyerProfile, setBuyerProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const cloudName = "dqs1ls601";
    const presetName = "Protech";

    const getBuyerProfile = () => {
        const token = actions.verifyTokenBuyer();

        if (!token) {
            console.error("No valid token found. User might need to log in.");
            navigate("/login");
            return;
        }

        fetch(`${process.env.BACKEND_URL}/api/buyer/profile`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch buyer profile");
                return response.json();
            })
            .then((data) => {
                setBuyerProfile(data);
                setEditData({
                    name: data.name || "",
                    email: data.email || "",
                    telefono: data.telefono || "",
                });
            })
            .catch((error) => console.error("Error:", error));
    };

    const handleImageUpload = async (file) => {
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", presetName);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            const imageUrl = data.secure_url;

            await updateProfileImage(imageUrl);
        } catch (error) {
            console.error("Image upload failed:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
            setSelectedFile(null);
        }
    };

    const updateProfileImage = async (imageUrl) => {
        const token = actions.verifyTokenBuyer();

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/buyer/profile/image`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image: imageUrl }),
            });

            if (!response.ok) throw new Error("Failed to update profile image");

            setBuyerProfile((prevProfile) => ({ ...prevProfile, image: imageUrl }));
            getBuyerProfile();
        } catch (error) {
            console.error("Error updating profile image:", error);
            alert("Failed to update profile image. Please try again.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            handleImageUpload(file);
        }
    };

    const handleProfileUpdate = () => {
        const token = actions.verifyTokenBuyer();

        fetch(`${process.env.BACKEND_URL}/api/buyer/profile/edit`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editData),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to update profile");
                setIsEditing(false);
                getBuyerProfile();
            })
            .catch((error) => console.error("Error updating profile:", error));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        getBuyerProfile();
    }, []);

    return (
        <div className="container profile py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card-black body-card">
                    <div className="row">
                            <div className="col-12">
                                <h3 className="mb-0 t">Profile</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="btn-group w-100 mb-4">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className={`btn ${!isEditing ? "btn-purple" : "btn-none"}`}
                                >
                                    View Profile
                                </button>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className={`btn ${isEditing ? "btn-purple" : "btn-none"}`}
                                >
                                    Edit Profile
                                </button>
                            </div>

                            {isEditing ? (
                                <form onSubmit={(e) => e.preventDefault()} className="mt-4">
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={editData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={editData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Phone</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone"
                                            value={editData.telefono}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="purple-button w-100"
                                        onClick={handleProfileUpdate}
                                    >
                                        Save Changes
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center">
                                    {buyerProfile ? (
                                        <>
                                            <div className="position-relative d-inline-block mb-4">
                                                <img
                                                    src={
                                                        buyerProfile.image ||
                                                        "https://via.placeholder.com/150"
                                                    }
                                                    alt={buyerProfile.name}
                                                    className="rounded-circle border"
                                                    style={{
                                                        width: "150px",
                                                        height: "150px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                                <div className="position-absolute bottom-0 end-0">
                                                    <input
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        accept="image/*"
                                                        className="d-none"
                                                        id="imageInput"
                                                        disabled={isUploading}
                                                    />
                                                    <label
                                                        htmlFor="imageInput"
                                                        className={`btn ${
                                                            isUploading
                                                                ? "btn-secondary"
                                                                : "btn-light"
                                                        } btn-sm rounded-circle`}
                                                        style={{
                                                            width: "32px",
                                                            height: "32px",
                                                            cursor: isUploading
                                                                ? "wait"
                                                                : "pointer",
                                                        }}
                                                    >
                                                        {isUploading ? "⌛" : "📷"}
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="text-start mt-4">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h4>{buyerProfile.name}</h4>
                                                        <p>
                                                            Email: {buyerProfile.email}
                                                        </p>
                                                        <p>
                                                            Phone: {buyerProfile.telefono}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
