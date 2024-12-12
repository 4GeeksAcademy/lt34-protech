import React, { useRef, useState, useEffect, useContext } from "react";
import { LoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Context } from "../store/appContext";
import "../../styles/address.css";
const libraries = ["places"];
const defaultCenter = { lat: 4.570868, lng: -74.297333 };

export const SellerAddress = () => {
    const { store, actions } = useContext(Context);
    const [map, setMap] = useState(null);
    const inputRef = useRef(null);
    const [currentAddress, setCurrentAddress] = useState("");
    const markerRef = useRef(null);
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    const [sellerAddress, setSellerAddress] = useState({
        address: "",
        lat: 0,
        lon: 0,
    });

    useEffect(() => {
        getCurrentAddress();
    }, []);

    useEffect(() => {
        if (map) {
            initAutocomplete();
        }
    }, [map]);

    const getCurrentAddress = () => {
        const token = actions.verifyTokenSeller()
        fetch(process.env.BACKEND_URL + "/api/address/seller", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setCurrentAddress(data);
                setMarkerPosition({
                    lat: parseFloat(data.lat),
                    lng: parseFloat(data.lon),
                })
            });
    };

    const updateSellerAddress = () => {
        const token = actions.verifyTokenSeller()
        
        if (sellerAddress.address) {
            
            const raw = JSON.stringify({
                name: name,
                description: description,
                address: sellerAddress.address,
                lat: sellerAddress.lat,
                lon: sellerAddress.lon,
            });

            fetch(`${process.env.BACKEND_URL}/api/address/seller`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: raw,
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    getCurrentAddress(); 
                    setName("")
                    setDescription("")
                    setSellerAddress({
                      address: "",
                      lat: 0,
                      lon: 0,
                    })
                })
                .catch((error) => console.error("Error:", error));
        }
    };

    const initAutocomplete = () => {
        const input = inputRef.current;

        const options = {
            fields: ["formatted_address", "geometry", "name"],
            strictBounds: false,
        };

        const autocomplete = new window.google.maps.places.Autocomplete(input, options);
        autocomplete.bindTo("bounds", map);

        const marker = new window.google.maps.Marker({
            map,
            anchorPoint: new window.google.maps.Point(0, -29),
        });
        markerRef.current = marker;

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                alert("No details available for input: '" + place.name + "'");
                return;
            }

            const location = place.geometry.location;
            setMarkerPosition(location);

            setSellerAddress({
                address: place.formatted_address,
                lat: parseFloat(location.lat()),
                lon: parseFloat(location.lng()),
            });

            map.panTo(location);
            marker.setPosition(location);
            marker.setVisible(true);
            setSelectedPlace(place);
        });

        map.addListener("click", (event) => {
            const clickedLocation = event.latLng;
            setMarkerPosition(clickedLocation);
            marker.setPosition(clickedLocation);
            marker.setVisible(true);
            setSelectedPlace(null);

            fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${clickedLocation.lat()},${clickedLocation.lng()}&key=${process.env.GOOGLE_API_KEY}`
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "OK" && data.results[0]) {
                        const newAddress = data.results[0].formatted_address;
                        
                        setSellerAddress({
                            address: newAddress,
                            lat: parseFloat(clickedLocation.lat()),
                            lon: parseFloat(clickedLocation.lng()),
                        })

                        setSelectedPlace({
                            name: "Selected Location",
                            formatted_address: newAddress,
                            geometry: { location: clickedLocation },
                        });
                    } else {
                        console.error("Geocoding failed: " + data.status);
                    }
                })
                .catch((error) => console.error("Error fetching geocode:", error));
        });
    };

    return (
      <div className="container address">
        <div className="row d-flex justify-content-center mt-5">
          <div className="col-7">
            <div className="row mb-4">
              <div className="col-12">
                <h2 className="">Update Address</h2>
              </div>
            </div>
    
            <div className="row mb-4">
              <div className="col-12">
                <div className="card-black body-card">
                  <h5 className="mb-2 px-0">Current Address:</h5>
                  <p>Name: {currentAddress.name}</p>
                  <p>Address: {currentAddress.address}</p>
                  <p>Description: {currentAddress.description}</p>
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-6">
                <input
                  type="text"
                  placeholder="Name of address"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="address-input"
                />
              </div>
    
              <div className="col-6">
                <input
                  id="pac-input"
                  ref={inputRef}
                  type="text"
                  placeholder="Enter a location"
                  className="address-input"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <textarea 
                  className="form-control mb-3"
                  style={{maxHeight: "70px", resize: "none"}} 
                  placeholder="Type here (maximum 200 characters)"
                  value={description}
                  onChange={(e)=> setDescription(e.target.value)}
                  rows="3" maxLength={900}
                ></textarea>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <button 
                  className="purple-button" 
                  onClick={updateSellerAddress}
                >
                  Update Address
                </button>
              </div>
            </div>
    
            <div className="row">
              <div className="col-12">
                <LoadScript googleMapsApiKey={process.env.GOOGLE_API_KEY} libraries={libraries}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <GoogleMap
                      id="map"
                      mapContainerClassName="map-container"
                      center={markerPosition}
                      zoom={13}
                      onLoad={(mapInstance) => setMap(mapInstance)}
                    >
                      <Marker position={markerPosition} />
    
                      {selectedPlace && (
                        <InfoWindow
                          position={markerPosition}
                          onCloseClick={() => setSelectedPlace(null)}
                        >
                          <div>
                            <h2>{selectedPlace.name}</h2>
                            <p>{selectedPlace.formatted_address}</p>
                          </div>
                        </InfoWindow>
                      )}
                    </GoogleMap>
                  </div>
                </LoadScript>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    
}      