

// // // // import React, { useState, useEffect } from "react";
// // // // import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
// // // // import axios from "axios";
// // // // import "leaflet/dist/leaflet.css";
// // // // import L from "leaflet";
// // // // import Papa from 'papaparse';
// // // // import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// // // // // Function to create numbered markers
// // // // const createNumberedIcon = (number) => {
// // // //   return L.divIcon({
// // // //     className: "custom-div-icon",
// // // //     html: `<div style="background-color:blue;color:white;width:25px;height:25px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:bold;">${number}</div>`,
// // // //     iconSize: [25, 25],
// // // //   });
// // // // };

// // // // const Shipment = () => {
// // // //   const [warehouse, setWarehouse] = useState("");
// // // //   const [deliveryPoint, setDeliveryPoint] = useState("");
// // // //   const [locations, setLocations] = useState([]);
// // // //   const [optimizedRoute, setOptimizedRoute] = useState(null);
// // // //   const [isLoading, setIsLoading] = useState(false);

// // // //   // Function to get lat/lon from an address
// // // //   const geocodeLocation = async (location) => {
// // // //     try {
// // // //       const response = await axios.get(
// // // //         `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`
// // // //       );
// // // //       if (response.data.length > 0) {
// // // //         const { lat, lon } = response.data[0];
// // // //         return { lat: parseFloat(lat), lon: parseFloat(lon) };
// // // //       } else {
// // // //         alert(`Could not find coordinates for ${location}`);
// // // //         return null;
// // // //       }
// // // //     } catch (error) {
// // // //       console.error("Error fetching coordinates:", error);
// // // //       return null;
// // // //     }
// // // //   };

// // // //   // Set the warehouse position
// // // //   const setStartingPoint = async () => {
// // // //     if (!warehouse) {
// // // //       alert("Please enter a warehouse location!");
// // // //       return;
// // // //     }
// // // //     const coords = await geocodeLocation(warehouse);
// // // //     if (coords) {
// // // //       setLocations([{ name: warehouse, ...coords }]);
// // // //     }
// // // //   };

// // // //   // Add delivery points
// // // //   const addDeliveryPoint = async () => {
// // // //     if (!deliveryPoint) {
// // // //       alert("Please enter a delivery point!");
// // // //       return;
// // // //     }
// // // //     const coords = await geocodeLocation(deliveryPoint);
// // // //     if (coords) {
// // // //       setLocations([...locations, { name: deliveryPoint, ...coords }]);
// // // //       setDeliveryPoint("");
// // // //     }
// // // //   };

// // // //   // Remove a location
// // // //   const removeLocation = (index) => {
// // // //     setLocations(locations.filter((_, i) => i !== index));
// // // //     // Clear optimized route when locations change
// // // //     setOptimizedRoute(null);
// // // //   };

// // // //   // Fetch the optimized route
// // // //   const fetchOptimizedRoute = async () => {
// // // //     if (locations.length < 2) {
// // // //       alert("Please add at least one delivery point!");
// // // //       return;
// // // //     }

// // // //     setIsLoading(true);

// // // //     try {
// // // //       // Convert location objects to [lon, lat] format for the optimizer
// // // //       // Using lon first as x-coordinate and lat as y-coordinate
// // // //       const coordinatesArray = locations.map(loc => [loc.lon, loc.lat]);

// // // //       console.log("Sending coordinates:", coordinatesArray);

// // // //       const response = await axios.post(
// // // //         "http://localhost:5001/optimize-route",
// // // //         { locations: coordinatesArray },
// // // //         { headers: { "Content-Type": "application/json" } }
// // // //       );

// // // //       console.log("API Response:", response.data);

// // // //       if (response.data && response.data.optimized_route) {
// // // //         // Convert indices back to actual coordinates
// // // //         const routeIndices = response.data.optimized_route;
// // // //         const routeCoordinates = routeIndices.map(index => [
// // // //           locations[index].lat,
// // // //           locations[index].lon
// // // //         ]);

// // // //         setOptimizedRoute(routeCoordinates);
// // // //       } else {
// // // //         console.error("Optimized route data not found in response:", response.data);
// // // //         alert("Failed to get optimized route. Check console for details.");
// // // //         setOptimizedRoute(null);
// // // //       }
// // // //     } catch (error) {
// // // //       console.error("Error fetching optimized route:", error);
// // // //       alert(`Error: ${error.response?.data?.error || error.message}`);
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //     }
// // // //   };






// // // //   // Additional state and functions for the form
// // // //   const [data, setData] = useState([]);
// // // //   const [availableLocations, setAvailableLocations] = useState<string[]>([]);
// // // //   const [formOptimizedRoute, setFormOptimizedRoute] = useState<string[]>([]);
// // // //   const [totalTime, setTotalTime] = useState(0);
// // // //   const [timeSaved, setTimeSaved] = useState(0);
// // // //   const [numLocations, setNumLocations] = useState(3);
// // // //   const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
// // // //   const [timeOfDay, setTimeOfDay] = useState('');
// // // //   const [worstRoute, setWorstRoute] = useState<string[]>([]);
// // // //   const [worstTravelTime, setWorstTravelTime] = useState<number | null>(null);

// // // //   useEffect(() => {
// // // //     fetch('/delhi_traffic_data.csv')
// // // //       .then(response => response.text())
// // // //       .then(csvText => {
// // // //         Papa.parse(csvText, {
// // // //           complete: (result) => {
// // // //             setData(result.data);
// // // //             const uniqueLocations = Array.from(new Set(result.data.map((entry: any) => entry.location_start)));
// // // //             setAvailableLocations(uniqueLocations);
// // // //           },
// // // //           header: true,
// // // //         });
// // // //       })
// // // //       .catch(error => {
// // // //         console.error('Error loading CSV:', error);
// // // //       });
// // // //   }, []);

// // // //   const getTravelTime = (start: string, end: string, timeOfDay: string) => {
// // // //     const row = data.find(
// // // //       (entry: any) =>
// // // //         entry.location_start === start &&
// // // //         entry.location_end === end &&
// // // //         entry.time_of_day === timeOfDay
// // // //     );
// // // //     return row ? parseFloat(row.average_travel_time) : Infinity;
// // // //   };

// // // //   const permute = (arr: string[]) => {
// // // //     if (arr.length === 0) return [[]];
// // // //     const first = arr[0];
// // // //     const rest = arr.slice(1);
// // // //     const permutations = permute(rest);
// // // //     const result: string[][] = [];
// // // //     permutations.forEach((perm) => {
// // // //       for (let i = 0; i <= perm.length; i++) {
// // // //         result.push([...perm.slice(0, i), first, ...perm.slice(i)]);
// // // //       }
// // // //     });
// // // //     return result;
// // // //   };

// // // //   const optimizeRoute = () => {
// // // //     if (selectedLocations.length < 2) {
// // // //       alert('At least 2 locations are required.');
// // // //       return;
// // // //     }

// // // //     let bestOrder = null;
// // // //     let minTravelTime = Infinity;
// // // //     let worstOrder = null;
// // // //     let maxTravelTime = -Infinity;

// // // //     // Get the fixed start point and permute the remaining locations
// // // //     const startLocation = selectedLocations[0];
// // // //     const locationsToPermute = selectedLocations.slice(1);

// // // //     const permutations = permute(locationsToPermute);
// // // //     permutations.forEach((perm) => {
// // // //       // Prepend the start location to each permutation
// // // //       const route = [startLocation, ...perm];
// // // //       let totalTime = 0;
// // // //       for (let i = 0; i < route.length - 1; i++) {
// // // //         totalTime += getTravelTime(route[i], route[i + 1], timeOfDay);
// // // //       }
// // // //       if (totalTime < minTravelTime) {
// // // //         minTravelTime = totalTime;
// // // //         bestOrder = route;
// // // //       }
// // // //       if (totalTime > maxTravelTime) {
// // // //         maxTravelTime = totalTime;
// // // //         worstOrder = route;
// // // //       }
// // // //     });

// // // //     let calculatedTimeSaved = Math.max(0, maxTravelTime - minTravelTime);

// // // //     setFormOptimizedRoute(bestOrder || []);
// // // //     setTotalTime(minTravelTime);
// // // //     setWorstRoute(worstOrder || []);
// // // //     setWorstTravelTime(maxTravelTime);
// // // //     setTimeSaved(calculatedTimeSaved);
// // // //   };

// // // //   const chartData = [
// // // //     { name: 'Optimized Route', time: totalTime },
// // // //     { name: 'Worst Route', time: worstTravelTime },
// // // //   ];

// // // //   return (
// // // //     <div style={{ padding: "20px", color: "black", paddingBlock: "20px" }}>
// // // //       <h2 class="text-3xl font-extrabold bg-gradient-to-r from-indigo-800 via-purple-700 to-purple-500 text-transparent bg-clip-text font-serif paddingblock-20px">
// // // //         Delivery Route Optimization
// // // //       </h2>

// // // //       {/* Warehouse Input */}
// // // //       <div style={{ marginBottom: "10px" }}>
// // // //         <input
// // // //           type="text"
// // // //           placeholder="Enter warehouse location"
// // // //           value={warehouse}
// // // //           onChange={(e) => setWarehouse(e.target.value)}
// // // //           style={{ marginRight: "10px", padding: "5px", margin: "10px" }}

// // // //         />
// // // //         <button onClick={setStartingPoint} class="text-black-500 font-bold text-xl" >Set Warehouse</button>
// // // //       </div>

// // // //       {/* Delivery Points Input */}
// // // //       <div style={{ marginBottom: "10px", padding: "5px", margin: "10px" }}>
// // // //         <input
// // // //           type="text"
// // // //           placeholder="Enter delivery point"
// // // //           value={deliveryPoint}
// // // //           onChange={(e) => setDeliveryPoint(e.target.value)}
// // // //           style={{ marginRight: "10px" }}
// // // //         />
// // // //         <button onClick={addDeliveryPoint} class="text-black-500 font-bold text-xl" >Add Delivery Point</button>
// // // //       </div>

// // // //       {/* Show Locations */}
// // // //       <h3>Locations:</h3>
// // // //       <ul style={{ marginBottom: "15px" }}>
// // // //         {locations.map((loc, index) => (
// // // //           <li key={index} style={{ marginBottom: "5px" }}>
// // // //             {index === 0 ? "🏭 " : "📦 "}
// // // //             {loc.name} (Lat: {loc.lat.toFixed(4)}, Lon: {loc.lon.toFixed(4)})
// // // //             <button
// // // //               onClick={() => removeLocation(index)}
// // // //               style={{ marginLeft: "10px" }}
// // // //             >
// // // //               Remove
// // // //             </button>
// // // //           </li>
// // // //         ))}
// // // //       </ul>

// // // //       {/* Fetch Optimized Route */}
// // // //       <button
// // // //         onClick={fetchOptimizedRoute}
// // // //         disabled={isLoading || locations.length < 2}
// // // //         style={{ marginBottom: "15px" }}
// // // //       >
// // // //         {isLoading ? "Calculating..." : "Get Optimized Route"}
// // // //       </button>

// // // //       {/* Map Display */}
// // // //       <MapContainer
// // // //         center={locations.length > 0 ? [locations[0].lat, locations[0].lon] : [28.6139, 77.209]}
// // // //         zoom={12}
// // // //         style={{ height: "500px", width: "100%" }}
// // // //       >
// // // //         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

// // // //         {/* Display Markers at Correct Locations */}
// // // //         {locations.map((loc, index) => (
// // // //           <Marker
// // // //             key={index}
// // // //             position={[loc.lat, loc.lon]}
// // // //             icon={createNumberedIcon(index + 1)}
// // // //           >
// // // //             <Popup>{index === 0 ? "Warehouse: " : "Delivery: "}{loc.name}</Popup>
// // // //           </Marker>
// // // //         ))}

// // // //         {/* Display Route */}
// // // //         {optimizedRoute && (
// // // //           <Polyline positions={optimizedRoute} color="red" weight={4} />
// // // //         )}
// // // //       </MapContainer>

// // // //       {/* Form for additional route optimization */}
// // // //       <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8">
// // // //         <header className="bg-blue-900 w-full py-4">
// // // //           <h1 className="text-3xl font-bold text-center text-white">Shipment Route Optimization</h1>
// // // //         </header>
// // // //         <main className="bg-blue-800 p-6 rounded-lg shadow-lg w-full max-w-4xl mt-8">
// // // //           <h2 className="text-2xl font-bold text-center text-white mb-6">Optimize Your Route</h2>

// // // //           {/* Select Number of Locations */}
// // // //           <div className="mb-4">
// // // //             <label className="block text-sm font-medium text-white">Select Number of Locations:</label>
// // // //             <input
// // // //               type="number"
// // // //               value={numLocations}
// // // //               onChange={(e) => setNumLocations(parseInt(e.target.value))}
// // // //               min={2}
// // // //               max={availableLocations.length}
// // // //               className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-semibold"
// // // //             />
// // // //           </div>

// // // //           {/* Location Selection Dropdowns */}
// // // //           {Array.from({ length: numLocations }).map((_, index) => (
// // // //             <div key={index} className="mb-4">
// // // //               <label className="block text-sm font-medium text-white">
// // // //                 {index === 0 ? "Select Source:" : `Select Destination ${index}:`}
// // // //               </label>
// // // //               <select
// // // //                 value={selectedLocations[index] || ''}
// // // //                 onChange={(e) => {
// // // //                   const updatedLocations = [...selectedLocations];
// // // //                   updatedLocations[index] = e.target.value;
// // // //                   setSelectedLocations(updatedLocations);
// // // //                 }}
// // // //                 className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
// // // //               >
// // // //                 <option value="">Select a location</option>
// // // //                 {availableLocations.map((loc) => (
// // // //                   <option key={loc} value={loc}>
// // // //                     {loc}
// // // //                   </option>
// // // //                 ))}
// // // //               </select>
// // // //             </div>
// // // //           ))}

// // // //           {/* Time of Day Selection */}
// // // //           <div className="mb-4">
// // // //             <label className="block text-sm font-medium text-white">Select Time of Day:</label>
// // // //             <select
// // // //               value={timeOfDay}
// // // //               onChange={(e) => setTimeOfDay(e.target.value)}
// // // //               className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
// // // //             >
// // // //               <option value="">Select Time</option>
// // // //               <option value="Morning">Morning</option>
// // // //               <option value="Afternoon">Afternoon</option>
// // // //               <option value="Evening">Evening</option>
// // // //               <option value="Night">Night</option>
// // // //             </select>
// // // //           </div>

// // // //           {/* Optimize Button */}
// // // //           <button
// // // //             onClick={optimizeRoute}
// // // //             className="w-full bg-white text-blue-500 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-200"
// // // //           >
// // // //             Optimize Route
// // // //           </button>

// // // //           {/* Display Optimized Route */}
// // // //           {formOptimizedRoute.length > 0 && (
// // // //             <div className="mt-6">
// // // //               <h3 className="text-xl font-semibold text-white">Optimized Route:</h3>
// // // //               <p className="mt-2 text-lg text-white">{formOptimizedRoute.join(' → ')}</p>
// // // //             </div>
// // // //           )}

// // // //           {/* Display Worst Route */}
// // // //           {worstRoute.length > 0 && (
// // // //             <div className="mt-6">
// // // //               <h3 className="text-xl font-semibold text-white">Worst Route:</h3>
// // // //               <p className="mt-2 text-lg text-white">{worstRoute.join(' → ')}</p>
// // // //             </div>
// // // //           )}

// // // //           {/* Display Total Travel Time */}
// // // //           {totalTime > 0 && (
// // // //             <div className="mt-6">
// // // //               <h3 className="text-lg font-semibold text-white">Total Travel Time:</h3>
// // // //               <p className="mt-2 text-lg text-white">{totalTime.toFixed(2)} minutes</p>
// // // //             </div>
// // // //           )}

// // // //           {/* Display Time Saved */}
// // // //           {timeSaved > 0 && (
// // // //             <div className="mt-4">
// // // //               <h3 className="text-lg font-semibold text-white">Time Saved:</h3>
// // // //               <p className="mt-2 text-lg text-green-300">{timeSaved.toFixed(2)} minutes</p>
// // // //             </div>
// // // //           )}

// // // //           {/* Display Bar Chart */}
// // // //           <div className="mt-6 w-full h-64 bg-white p-4 rounded-lg">
// // // //             <ResponsiveContainer width="100%" height="100%">
// // // //               <BarChart data={chartData}>
// // // //                 <CartesianGrid strokeDasharray="3 3" />
// // // //                 <XAxis dataKey="name" />
// // // //                 <YAxis />
// // // //                 <Tooltip />
// // // //                 <Legend />
// // // //                 <Bar dataKey="time" fill="#8884d8" />
// // // //               </BarChart>
// // // //             </ResponsiveContainer>
// // // //           </div>
// // // //         </main>
// // // //       </div>




      
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Shipment;


// // // // // import React, { useEffect, useState } from "react";
// // // // // import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// // // // // import "leaflet/dist/leaflet.css";
// // // // // import { GoogleMap, LoadScript,  DirectionsRenderer } from "@react-google-maps/api";
// // // // // import { Button } from "@/components/ui/button";

// // // // // // Define the custom pink marker icon
// // // // // const pinkMarkerIcon = new L.Icon({
// // // // //   iconUrl: "https://www.iconpacks.net/icons/4/free-fast-food-delivery-bike-icon-12992-thumb.png", // Example pink pin icon
// // // // //   iconSize: [30, 40], // Size of the icon
// // // // //   iconAnchor: [15, 40], // Anchor point
// // // // //   popupAnchor: [0, -40], // Position of popup
// // // // // });

// // // // // const DeliveryMap = () => {
// // // // //   const [deliveries, setDeliveries] = useState([]);

// // // // //   // Fetch JSON data from backend
// // // // //   useEffect(() => {
// // // // //     fetch("http://localhost:5001/deliveries")
// // // // //       .then((res) => {
// // // // //         if (!res.ok) {
// // // // //           throw new Error(`HTTP error! Status: ${res.status}`);
// // // // //         }
// // // // //         return res.json();
// // // // //       })
// // // // //       .then((data) => {
// // // // //         console.log("Fetched Data:", data);
// // // // //         setDeliveries(data);
// // // // //       })
// // // // //       .catch((error) => console.error("Error fetching data:", error));
// // // // //   }, []);



// // // // //   // Main warehouse location: Chandni Chowk, Idgah Rd, Narain Market, Delhi
// // // // //   const warehouseCoords = [28.6558, 77.2219]; 

// // // // //   return (
// // // // //     <div className="flex h-screen">

  
// // // // // {/* 📌 Shipment Details on Right Side */}
// // // // // <div className="w-1/3 h-screen overflow-y-auto p-4 bg-gray-100">
// // // // //   <h2 className="text-lg font-bold mb-4 text-center text-black ">🚚 Scheduled Deliveries (TODAY)</h2>
  
// // // // //   {deliveries.length > 0 ? (
// // // // //     [...deliveries]
// // // // //       .sort((a, b) => (b.urgentDelivery === "Yes") - (a.urgentDelivery === "Yes")) // Sort urgent deliveries first
// // // // //       .map((delivery) => (
// // // // //         <div key={delivery.id} className="p-4 mb-4 bg-white shadow-md rounded-lg border border-gray-300">
// // // // //           <h3 className="font-semibold text-blue-600">{delivery.customer}</h3>
// // // // //           <p className="text-gray-800 font-medium">{delivery.deliveryPoint}</p>
// // // // //           <p className="text-sm text-gray-700">📦 Items: {delivery.items?.join(", ") || "N/A"}</p>
// // // // //           <p className="text-sm text-gray-600">⚖️ Weight: {delivery.packageWeight} kg</p>
// // // // //           <p className="text-xs text-gray-500">⏰ Time: {new Date(delivery.time).toLocaleString()}</p>
// // // // //           <p className={`text-sm font-bold ${delivery.urgentDelivery === "Yes" ? "text-red-700" : "text-gray-500"}`}>
// // // // //             🚨 Urgent Delivery: {delivery.urgentDelivery}
// // // // //           </p>
// // // // //         </div>
// // // // //       ))
// // // // //   ) : (
// // // // //     <p className="text-center text-gray-500">No deliveries available.</p>
// // // // //   )}
// // // // // </div>





// // // // //  {/* 🗺️ Map Section on Right Side */}
// // // // //  <div className="w-2/3 h-0screen">
     


// // // // // <MapContainer center={warehouseCoords} zoom={12} className="h-full w-full">
// // // // //           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

// // // // //           {/* Warehouse Marker */}
// // // // //           <Marker position={warehouseCoords}>
// // // // //             <Popup>
// // // // //               <strong>Warehouse (Chandni Chowk)</strong>
// // // // //             </Popup>
// // // // //           </Marker>

  
// // // // //           {deliveries.map((delivery) => (
// // // // //   delivery.coordinates && delivery.coordinates.length === 2 ? (
// // // // //     <Marker key={delivery.id} position={delivery.coordinates} icon={pinkMarkerIcon}>
// // // // //       <Popup>
// // // // //         <strong>{delivery.customer}</strong> <br />
// // // // //         {delivery.deliveryPoint}
// // // // //       </Popup>
// // // // //     </Marker>
// // // // //   ) : null
// // // // // ))}

// // // // //         </MapContainer>



// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default DeliveryMap;














































// // // // import React, { useEffect, useState } from "react";
// // // // import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// // // // import "leaflet/dist/leaflet.css";
// // // // import { GoogleMap, LoadScript,  DirectionsRenderer } from "@react-google-maps/api";
// // // // import { Button } from "@/components/ui/button";

// // // // // Define the custom pink marker icon
// // // // const pinkMarkerIcon = new L.Icon({
// // // //   iconUrl: "https://www.iconpacks.net/icons/4/free-fast-food-delivery-bike-icon-12992-thumb.png", // Example pink pin icon
// // // //   iconSize: [30, 40], // Size of the icon
// // // //   iconAnchor: [15, 40], // Anchor point
// // // //   popupAnchor: [0, -40], // Position of popup
// // // // });

// // // // const DeliveryMap = () => {
// // // //   const [deliveries, setDeliveries] = useState([]);

// // // //   // Fetch JSON data from backend
// // // //   useEffect(() => {
// // // //     fetch("http://localhost:5001/deliveries")
// // // //       .then((res) => {
// // // //         if (!res.ok) {
// // // //           throw new Error(`HTTP error! Status: ${res.status}`);
// // // //         }
// // // //         return res.json();
// // // //       })
// // // //       .then((data) => {
// // // //         console.log("Fetched Data:", data);
// // // //         setDeliveries(data);
// // // //       })
// // // //       .catch((error) => console.error("Error fetching data:", error));
// // // //   }, []);



// // // //   // Main warehouse location: Chandni Chowk, Idgah Rd, Narain Market, Delhi
// // // //   const warehouseCoords = [28.6558, 77.2219]; 

// // // //   return (
// // // //     <div className="flex h-screen">

  
// // // // {/* 📌 Shipment Details on Right Side */}
// // // // <div className="w-1/3 h-screen overflow-y-auto p-4 bg-gray-100">
// // // //   <h2 className="text-lg font-bold mb-4 text-center text-black ">🚚 Scheduled Deliveries (TODAY)</h2>
  
// // // //   {deliveries.length > 0 ? (
// // // //     [...deliveries]
// // // //       .sort((a, b) => (b.urgentDelivery === "Yes") - (a.urgentDelivery === "Yes")) // Sort urgent deliveries first
// // // //       .map((delivery) => (
// // // //         <div key={delivery.id} className="p-4 mb-4 bg-white shadow-md rounded-lg border border-gray-300">
// // // //           <h3 className="font-semibold text-blue-600">{delivery.customer}</h3>
// // // //           <p className="text-gray-800 font-medium">{delivery.deliveryPoint}</p>
// // // //           <p className="text-sm text-gray-700">📦 Items: {delivery.items?.join(", ") || "N/A"}</p>
// // // //           <p className="text-sm text-gray-600">⚖️ Weight: {delivery.packageWeight} kg</p>
// // // //           <p className="text-xs text-gray-500">⏰ Time: {new Date(delivery.time).toLocaleString()}</p>
// // // //           <p className={`text-sm font-bold ${delivery.urgentDelivery === "Yes" ? "text-red-700" : "text-gray-500"}`}>
// // // //             🚨 Urgent Delivery: {delivery.urgentDelivery}
// // // //           </p>
// // // //         </div>
// // // //       ))
// // // //   ) : (
// // // //     <p className="text-center text-gray-500">No deliveries available.</p>
// // // //   )}
// // // // </div>





// // // //  {/* 🗺️ Map Section on Right Side */}
// // // //  <div className="w-2/3 h-0screen">
     


// // // // <MapContainer center={warehouseCoords} zoom={12} className="h-full w-full">
// // // //           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

// // // //           {/* Warehouse Marker */}
// // // //           <Marker position={warehouseCoords}>
// // // //             <Popup>
// // // //               <strong>Warehouse (Chandni Chowk)</strong>
// // // //             </Popup>
// // // //           </Marker>

  
// // // //           {deliveries.map((delivery) => (
// // // //   delivery.coordinates && delivery.coordinates.length === 2 ? (
// // // //     <Marker key={delivery.id} position={delivery.coordinates} icon={pinkMarkerIcon}>
// // // //       <Popup>
// // // //         <strong>{delivery.customer}</strong> <br />
// // // //         {delivery.deliveryPoint}
// // // //       </Popup>
// // // //     </Marker>
// // // //   ) : null
// // // // ))}

// // // //         </MapContainer>



// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default DeliveryMap;



// // // // ye Shipment ka code hai 








// // // import React, { useEffect, useState } from "react";
// // // import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
// // // import "leaflet/dist/leaflet.css";
// // // import L from "leaflet";
// // // import axios from "axios";
// // // import Papa from 'papaparse';
// // // import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// // // // Function to create numbered markers
// // // const createNumberedIcon = (number) => {
// // //   return L.divIcon({
// // //     className: "custom-div-icon",
// // //     html: `<div style="background-color:blue;color:white;width:25px;height:25px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:bold;">${number}</div>`,
// // //     iconSize: [25, 25],
// // //   });
// // // };

// // // // Define the custom pink marker icon
// // // const pinkMarkerIcon = new L.Icon({
// // //   iconUrl: "https://www.iconpacks.net/icons/4/free-fast-food-delivery-bike-icon-12992-thumb.png",
// // //   iconSize: [30, 40],
// // //   iconAnchor: [15, 40],
// // //   popupAnchor: [0, -40],
// // // });

// // // const DeliveryMap = () => {
// // //   const [deliveries, setDeliveries] = useState([]);
// // //   const [optimizedRoute, setOptimizedRoute] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [warehouse, setWarehouse] = useState("");
// // //   const [deliveryPoint, setDeliveryPoint] = useState("");
// // //   const [locations, setLocations] = useState([]);
// // //   const [isLoading, setIsLoading] = useState(false);
// // //  const [data, setData] = useState([]);
// // //  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
// // //  const [formOptimizedRoute, setFormOptimizedRoute] = useState<string[]>([]);
// // //  const [totalTime, setTotalTime] = useState(0);
// // //  const [timeSaved, setTimeSaved] = useState(0);
// // //  const [numLocations, setNumLocations] = useState(3);
// // //  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
// // //  const [timeOfDay, setTimeOfDay] = useState('');
// // //  const [worstRoute, setWorstRoute] = useState<string[]>([]);
// // //  const [worstTravelTime, setWorstTravelTime] = useState<number | null>(null);


// // //   // Main warehouse location
// // //   const warehouseCoords = [28.6558, 77.2219];

// // // // this useeffect to call the csv file and parse it
// // //   useEffect(() => {
// // //     fetch('/delhi_traffic_data.csv')
// // //       .then(response => response.text())
// // //       .then(csvText => {
// // //         Papa.parse(csvText, {
// // //           complete: (result) => {
// // //             setData(result.data);
// // //             const uniqueLocations = Array.from(new Set(result.data.map((entry: any) => entry.location_start)));
// // //             setAvailableLocations(uniqueLocations);
// // //           },
// // //           header: true,
// // //         });
// // //       })
// // //       .catch(error => {
// // //         console.error('Error loading CSV:', error);
// // //       });
// // //   }, []);
// // //   const getTravelTime = (start: string, end: string, timeOfDay: string) => {
// // //     const row = data.find(
// // //       (entry: any) =>
// // //         entry.location_start === start &&
// // //         entry.location_end === end &&
// // //         entry.time_of_day === timeOfDay
// // //     );
// // //     return row ? parseFloat(row.average_travel_time) : Infinity;
// // //   };

// // //   const permute = (arr: string[]) => {
// // //     if (arr.length === 0) return [[]];
// // //     const first = arr[0];
// // //     const rest = arr.slice(1);
// // //     const permutations = permute(rest);
// // //     const result: string[][] = [];
// // //     permutations.forEach((perm) => {
// // //       for (let i = 0; i <= perm.length; i++) {
// // //         result.push([...perm.slice(0, i), first, ...perm.slice(i)]);
// // //       }
// // //     });
// // //     return result;
// // //   };


// // //   // thi is calculate chart code data  at bottom
// // //   const optimizeRoutes = () => {
// // //     if (selectedLocations.length < 2) {
// // //       alert('At least 2 locations are required.');
// // //       return;
// // //     }

// // //     let bestOrder = null;
// // //     let minTravelTime = Infinity;
// // //     let worstOrder = null;
// // //     let maxTravelTime = -Infinity;

// // //     // Get the fixed start point and permute the remaining locations
// // //     const startLocation = selectedLocations[0];
// // //     const locationsToPermute = selectedLocations.slice(1);

// // //     const permutations = permute(locationsToPermute);
// // //     permutations.forEach((perm) => {
// // //       // Prepend the start location to each permutation
// // //       const route = [startLocation, ...perm];
// // //       let totalTime = 0;
// // //       for (let i = 0; i < route.length - 1; i++) {
// // //         totalTime += getTravelTime(route[i], route[i + 1], timeOfDay);
// // //       }
// // //       if (totalTime < minTravelTime) {
// // //         minTravelTime = totalTime;
// // //         bestOrder = route;
// // //       }
// // //       if (totalTime > maxTravelTime) {
// // //         maxTravelTime = totalTime;
// // //         worstOrder = route;
// // //       }
// // //     });

// // //     let calculatedTimeSaved = Math.max(0, maxTravelTime - minTravelTime);

// // //     setFormOptimizedRoute(bestOrder || []);
// // //     setTotalTime(minTravelTime);
// // //     setWorstRoute(worstOrder || []);
// // //     setWorstTravelTime(maxTravelTime);
// // //     setTimeSaved(calculatedTimeSaved);
// // //   };

// // //   const chartData = [
// // //     { name: 'Optimized Route', time: totalTime },
// // //     { name: 'Worst Route', time: worstTravelTime },
// // //   ];


// // // // this is fetch delivery cordinate and shown on map 
// // //   useEffect(() => {
// // //     const fetchDeliveries = async () => {
// // //       try {
// // //         setLoading(true); // Ensure loading is set to true before fetching
  
// // //         const response = await fetch("http://localhost:5002/deliveries");
// // //         if (!response.ok) throw new Error(`Server Error: ${response.status}`);
  
// // //         const data = await response.json();
// // //         console.log("Fetched Deliveries:", data);
  
// // //         // Ensure coordinates are correctly structured before updating state
// // //         const validDeliveries = data
// // //           .filter(delivery => delivery.coordinates && delivery.coordinates.length === 2)
// // //           .map(delivery => ({
// // //             ...delivery,
// // //             coordinates: [parseFloat(delivery.coordinates[0]), parseFloat(delivery.coordinates[1])]
// // //           }));
  
// // //         setDeliveries(validDeliveries);
// // //         setLoading(false); // Ensure loading is set to false after fetching
// // //       } catch (error) {
// // //         console.error("Error fetching deliveries:", error);
// // //         setLoading(false); // Even on error, set loading to false to avoid infinite loading state
// // //       }
// // //     };
  
// // //     fetchDeliveries();
// // //   }, []);
  

// // //   const optimizeRoute = async () => {
// // //     const source = `${warehouseCoords[1]},${warehouseCoords[0]}`;
// // //     const destination = `${warehouseCoords[1]},${warehouseCoords[0]}`;
    
// // //     const waypoints = deliveries
// // //       .map((delivery) => delivery.coordinates)
// // //       .filter(Boolean)
// // //       .map(([lat, lng]) => `${lng},${lat}`)
// // //       .join(";");
  
// // //     if (!waypoints) {
// // //       console.error("No delivery locations available for optimization.");
// // //       return;
// // //     }
  
// // //     try {
// // //       const response = await fetch(
// // //         `http://localhost:5002/optimize-route?source=${source}&destination=${destination}&waypoints=${waypoints}`
// // //       );
  
// // //       if (!response.ok) throw new Error(`API Error: ${response.status}`);
  
// // //       const data = await response.json();
  
// // //       if (data.routes && data.routes.length > 0) {
// // //         const optimizedCoords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
// // //         setOptimizedRoute(optimizedCoords);
// // //       } else {
// // //         console.error("No optimized route found");
// // //       }
// // //     } catch (error) {
// // //       console.error("Error fetching optimized route:", error);
// // //     }
// // //   };
  





// // //   return (
// // //     // <div className="flex h-screen">
// // //     <div className="flex flex-col h-screen">
// // //   {/* Top Section - Deliveries and Map */}
// // //   <div className="flex flex-1">
// // //       {/* Sidebar with delivery details */}
// // //       <div className="w-1/3 h-screen overflow-y-auto p-4 bg-gray-100">
// // //         <h2 className="text-lg font-bold mb-4 text-center text-black">🚚 Scheduled Deliveries (TODAY)</h2>
// // //         <button className="w-full mb-4 bg-blue-500 text-white p-2 rounded" onClick={optimizeRoute}>
// // //           Optimize Route
// // //         </button>

// // //         {loading ? (
// // //           <p className="text-center text-gray-500">Loading deliveries...</p>
// // //         ) : deliveries.length > 0 ? (
// // //           [...deliveries]
// // //             .sort((a, b) => (b.urgentDelivery === "Yes") - (a.urgentDelivery === "Yes"))
// // //             .map((delivery) => (
// // //               <div key={delivery.id} className="p-4 mb-4 bg-white shadow-md rounded-lg border border-gray-300">
// // //                 <h3 className="font-semibold text-blue-600">{delivery.customer}</h3>
// // //                 <p className="text-gray-800 font-medium">{delivery.deliveryPoint}</p>
// // //                 <p className="text-sm text-gray-700">📦 Items: {delivery.items?.join(", ") || "N/A"}</p>
// // //                 <p className="text-sm text-gray-600">⚖️ Weight: {delivery.packageWeight} kg</p>
// // //                 <p className="text-xs text-gray-500">⏰ Time: {new Date(delivery.time).toLocaleString()}</p>
// // //                 <p className={`text-sm font-bold ${delivery.urgentDelivery === "Yes" ? "text-red-700" : "text-gray-500"}`}>
// // //                   🚨 Urgent Delivery: {delivery.urgentDelivery}
// // //                 </p>
// // //               </div>
// // //             ))
// // //         ) : (
// // //           <p className="text-center text-gray-500">No deliveries available.</p>
// // //         )}
// // //       </div>

// // //       {/* Map Section */}
// // //       <div className="w-2/3 h-screen">
// // //         <MapContainer center={warehouseCoords} zoom={12} className="h-full w-full">
// // //           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

// // //           {/* Warehouse Marker */}
// // //           <Marker position={warehouseCoords}>
// // //             <Popup>
// // //               <strong>Warehouse (Chandni Chowk)</strong>
// // //             </Popup>
// // //           </Marker>

// // //           {/* Delivery Markers */}
// // //           {deliveries.map((delivery) =>
// // //             delivery.coordinates && delivery.coordinates.length === 2 ? (
// // //               <Marker key={delivery.id} position={delivery.coordinates} icon={pinkMarkerIcon}>
// // //                 <Popup>
// // //                   <strong>{delivery.customer}</strong> <br />
// // //                   {delivery.deliveryPoint}
// // //                 </Popup>
// // //               </Marker>
// // //             ) : null
// // //           )}

// // //           {/* Optimized Route Line */}
// // //           {optimizedRoute.length > 0 && (
// // //             <Polyline positions={optimizedRoute} color="blue" weight={4} opacity={0.8} />
// // //           )}
// // //         </MapContainer>
// // //       </div>
// // //       </div>


// // // {/* this for  display static  fetch optmized route  */}
     
// // //       {/* Form for additional route optimization */}
// // //       {/* <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8"> */}
// // //       <div className="w-full bg-gray-100 margin-top-8 flex flex-col items-center justify-center py-8 border-t">
// // //         <header className="bg-blue-900 w-full py-4">
// // //           <h1 className="text-3xl font-bold text-center text-white">Shipment Route Optimization</h1>
// // //         </header>
// // //         <main className="bg-blue-800 p-6 rounded-lg shadow-lg w-full max-w-4xl mt-8">
// // //           <h2 className="text-2xl font-bold text-center text-white mb-6">Optimize Your Route</h2>

// // //           {/* Select Number of Locations */}
// // //           <div className="mb-4">
// // //             <label className="block text-sm font-medium text-white">Select Number of Locations:</label>
// // //             <input
// // //               type="number"
// // //               value={numLocations}
// // //               onChange={(e) => setNumLocations(parseInt(e.target.value))}
// // //               min={2}
// // //               max={availableLocations.length}
// // //               className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-semibold"
// // //             />
// // //           </div>

// // //           {/* Location Selection Dropdowns */}
// // //           {Array.from({ length: numLocations }).map((_, index) => (
// // //             <div key={index} className="mb-4">
// // //               <label className="block text-sm font-medium text-white">
// // //                 {index === 0 ? "Select Source:" : `Select Destination ${index}:`}
// // //               </label>
// // //               <select
// // //                 value={selectedLocations[index] || ''}
// // //                 onChange={(e) => {
// // //                   const updatedLocations = [...selectedLocations];
// // //                   updatedLocations[index] = e.target.value;
// // //                   setSelectedLocations(updatedLocations);
// // //                 }}
// // //                 className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
// // //               >
// // //                 <option value="">Select a location</option>
// // //                 {availableLocations.map((loc) => (
// // //                   <option key={loc} value={loc}>
// // //                     {loc}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>
// // //           ))}

// // //           {/* Time of Day Selection */}
// // //           <div className="mb-4">
// // //             <label className="block text-sm font-medium text-white">Select Time of Day:</label>
// // //             <select
// // //               value={timeOfDay}
// // //               onChange={(e) => setTimeOfDay(e.target.value)}
// // //               className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
// // //             >
// // //               <option value="">Select Time</option>
// // //               <option value="Morning">Morning</option>
// // //               <option value="Afternoon">Afternoon</option>
// // //               <option value="Evening">Evening</option>
// // //               <option value="Night">Night</option>
// // //             </select>
// // //           </div>

// // //           {/* Optimize Button */}
// // //           <button
// // //             onClick={optimizeRoutes}
// // //             className="w-full bg-white text-blue-500 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-200"
// // //           >
// // //             Optimize Route
// // //           </button>

// // //           {/* Display Optimized Route */}
// // //           {formOptimizedRoute.length > 0 && (
// // //             <div className="mt-6">
// // //               <h3 className="text-xl font-semibold text-white">Optimized Route:</h3>
// // //               <p className="mt-2 text-lg text-white">{formOptimizedRoute.join(' → ')}</p>
// // //             </div>
// // //           )}

// // //           {/* Display Worst Route */}
// // //           {worstRoute.length > 0 && (
// // //             <div className="mt-6">
// // //               <h3 className="text-xl font-semibold text-white">Worst Route:</h3>
// // //               <p className="mt-2 text-lg text-white">{worstRoute.join(' → ')}</p>
// // //             </div>
// // //           )}

// // //           {/* Display Total Travel Time */}
// // //           {totalTime > 0 && (
// // //             <div className="mt-6">
// // //               <h3 className="text-lg font-semibold text-white">Total Travel Time:</h3>
// // //               <p className="mt-2 text-lg text-white">{totalTime.toFixed(2)} minutes</p>
// // //             </div>
// // //           )}

// // //           {/* Display Time Saved */}
// // //           {timeSaved > 0 && (
// // //             <div className="mt-4">
// // //               <h3 className="text-lg font-semibold text-white">Time Saved:</h3>
// // //               <p className="mt-2 text-lg text-green-300">{timeSaved.toFixed(2)} minutes</p>
// // //             </div>
// // //           )}

// // //           {/* Display Bar Chart */}
// // //           <div className="mt-6 w-full h-64 bg-white p-4 rounded-lg">
// // //             <ResponsiveContainer width="100%" height="100%">
// // //               <BarChart data={chartData}>
// // //                 <CartesianGrid strokeDasharray="3 3" />
// // //                 <XAxis dataKey="name" />
// // //                 <YAxis />
// // //                 <Tooltip />
// // //                 <Legend />
// // //                 <Bar dataKey="time" fill="#8884d8" />
// // //               </BarChart>
// // //             </ResponsiveContainer>
// // //           </div>
// // //         </main>
// // //       </div>





// // //     </div>
// // //   );
// // // };

// // // export default DeliveryMap;





// // import React, { useEffect, useState } from "react";
// // import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
// // import "leaflet/dist/leaflet.css";
// // import L from "leaflet";
// // import axios from "axios";
// // import Papa from 'papaparse';
// // import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



// // // Function to create numbered markers
// // const createNumberedIcon = (number) => {
// //   return L.divIcon({
// //     className: "custom-div-icon",
// //     html: `<div style="background-color:blue;color:white;width:25px;height:25px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:bold;">${number}</div>`,
// //     iconSize: [25, 25],
// //   });
// // };

// // // Define the custom pink marker icon
// // const pinkMarkerIcon = new L.Icon({
// //   iconUrl: "https://www.iconpacks.net/icons/4/free-fast-food-delivery-bike-icon-12992-thumb.png",
// //   iconSize: [30, 40],
// //   iconAnchor: [15, 40],
// //   popupAnchor: [0, -40],
// // });

// // const DeliveryMap = () => {
// //   const [deliveries, setDeliveries] = useState([]);
// //   const [optimizedRoute, setOptimizedRoute] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [warehouse, setWarehouse] = useState("");
// //   const [deliveryPoint, setDeliveryPoint] = useState("");
// //   const [locations, setLocations] = useState([]);
// //   const [isLoading, setIsLoading] = useState(false);
// //  const [data, setData] = useState([]);
// //  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
// //  const [formOptimizedRoute, setFormOptimizedRoute] = useState<string[]>([]);
// //  const [totalTime, setTotalTime] = useState(0);
// //  const [timeSaved, setTimeSaved] = useState(0);
// //  const [numLocations, setNumLocations] = useState(3);
// //  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
// //  const [timeOfDay, setTimeOfDay] = useState('');
// //  const [worstRoute, setWorstRoute] = useState<string[]>([]);
// //  const [worstTravelTime, setWorstTravelTime] = useState<number | null>(null);


// //   // Main warehouse location
// //   const warehouseCoords = [28.6558, 77.2219];

// // // this useeffect to call the csv file and parse it
// //   useEffect(() => {
// //     fetch('/delhi_traffic_data.csv')
// //       .then(response => response.text())
// //       .then(csvText => {
// //         Papa.parse(csvText, {
// //           complete: (result) => {
// //             setData(result.data);
// //             const uniqueLocations = Array.from(new Set(result.data.map((entry: any) => entry.location_start)));
// //             setAvailableLocations(uniqueLocations);
// //           },
// //           header: true,
// //         });
// //       })
// //       .catch(error => {
// //         console.error('Error loading CSV:', error);
// //       });
// //   }, []);
// //   const getTravelTime = (start: string, end: string, timeOfDay: string) => {
// //     const row = data.find(
// //       (entry: any) =>
// //         entry.location_start === start &&
// //         entry.location_end === end &&
// //         entry.time_of_day === timeOfDay
// //     );
// //     return row ? parseFloat(row.average_travel_time) : Infinity;
// //   };

// //   const permute = (arr: string[]) => {
// //     if (arr.length === 0) return [[]];
// //     const first = arr[0];
// //     const rest = arr.slice(1);
// //     const permutations = permute(rest);
// //     const result: string[][] = [];
// //     permutations.forEach((perm) => {
// //       for (let i = 0; i <= perm.length; i++) {
// //         result.push([...perm.slice(0, i), first, ...perm.slice(i)]);
// //       }
// //     });
// //     return result;
// //   };


// //   // thi is calculate chart code data  at bottom
// //   const optimizeRoutes = () => {
// //     if (selectedLocations.length < 2) {
// //       alert('At least 2 locations are required.');
// //       return;
// //     }

// //     let bestOrder = null;
// //     let minTravelTime = Infinity;
// //     let worstOrder = null;
// //     let maxTravelTime = -Infinity;

// //     // Get the fixed start point and permute the remaining locations
// //     const startLocation = selectedLocations[0];
// //     const locationsToPermute = selectedLocations.slice(1);

// //     const permutations = permute(locationsToPermute);
// //     permutations.forEach((perm) => {
// //       // Prepend the start location to each permutation
// //       const route = [startLocation, ...perm];
// //       let totalTime = 0;
// //       for (let i = 0; i < route.length - 1; i++) {
// //         totalTime += getTravelTime(route[i], route[i + 1], timeOfDay);
// //       }
// //       if (totalTime < minTravelTime) {
// //         minTravelTime = totalTime;
// //         bestOrder = route;
// //       }
// //       if (totalTime > maxTravelTime) {
// //         maxTravelTime = totalTime;
// //         worstOrder = route;
// //       }
// //     });

// //     let calculatedTimeSaved = Math.max(0, maxTravelTime - minTravelTime);

// //     setFormOptimizedRoute(bestOrder || []);
// //     setTotalTime(minTravelTime);
// //     setWorstRoute(worstOrder || []);
// //     setWorstTravelTime(maxTravelTime);
// //     setTimeSaved(calculatedTimeSaved);
// //   };

// //   const chartData = [
// //     { name: 'Optimized Route', time: totalTime },
// //     { name: 'Worst Route', time: worstTravelTime },
// //   ];


// // // this is fetch delivery cordinate and shown on map 
// //   useEffect(() => {
// //     const fetchDeliveries = async () => {
// //       try {
// //         setLoading(true); // Ensure loading is set to true before fetching
  
// //         const response = await fetch("http://localhost:5002/deliveries");
// //         if (!response.ok) throw new Error(`Server Error: ${response.status}`);
  
// //         const data = await response.json();
// //         console.log("Fetched Deliveries:", data);
  
// //         // Ensure coordinates are correctly structured before updating state
// //         const validDeliveries = data
// //           .filter(delivery => delivery.coordinates && delivery.coordinates.length === 2)
// //           .map(delivery => ({
// //             ...delivery,
// //             coordinates: [parseFloat(delivery.coordinates[0]), parseFloat(delivery.coordinates[1])]
// //           }));
  
// //         setDeliveries(validDeliveries);
// //         setLoading(false); // Ensure loading is set to false after fetching
// //       } catch (error) {
// //         console.error("Error fetching deliveries:", error);
// //         setLoading(false); // Even on error, set loading to false to avoid infinite loading state
// //       }
// //     };
  
// //     fetchDeliveries();
// //   }, []);
  

// //   const optimizeRoute = async () => {
// //     const source = `${warehouseCoords[1]},${warehouseCoords[0]}`;
// //     const destination = `${warehouseCoords[1]},${warehouseCoords[0]}`;
    
// //     const waypoints = deliveries
// //       .map((delivery) => delivery.coordinates)
// //       .filter(Boolean)
// //       .map(([lat, lng]) => `${lng},${lat}`)
// //       .join(";");
  
// //     if (!waypoints) {
// //       console.error("No delivery locations available for optimization.");
// //       return;
// //     }
  
// //     try {
// //       const response = await fetch(
// //         `http://localhost:5002/optimize-route?source=${source}&destination=${destination}&waypoints=${waypoints}`
// //       );
  
// //       if (!response.ok) throw new Error(`API Error: ${response.status}`);
  
// //       const data = await response.json();
  
// //       if (data.routes && data.routes.length > 0) {
// //         const optimizedCoords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
// //         setOptimizedRoute(optimizedCoords);
// //       } else {
// //         console.error("No optimized route found");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching optimized route:", error);
// //     }
// //   };
  





// //   return (
// //     // <div className="flex h-screen">
// //     <div className="flex flex-col h-screen">
// //   {/* Top Section - Deliveries and Map */}
// //   <div className="flex flex-1">
// //       {/* Sidebar with delivery details */}
// //       <div className="w-1/3 h-screen overflow-y-auto p-4 bg-gray-100">
// //         <h2 className="text-lg font-bold mb-4 text-center text-black">🚚 Scheduled Deliveries (TODAY)</h2>
// //         <button className="w-full mb-4 bg-blue-500 text-white p-2 rounded" onClick={optimizeRoute}>
// //           Optimize Route
// //         </button>

// //         {loading ? (
// //           <p className="text-center text-gray-500">Loading deliveries...</p>
// //         ) : deliveries.length > 0 ? (
// //           [...deliveries]
// //             .sort((a, b) => (b.urgentDelivery === "Yes") - (a.urgentDelivery === "Yes"))
// //             .map((delivery) => (
// //               <div key={delivery.id} className="p-4 mb-4 bg-white shadow-md rounded-lg border border-gray-300">
// //                 <h3 className="font-semibold text-blue-600">{delivery.customer}</h3>
// //                 <p className="text-gray-800 font-medium">{delivery.deliveryPoint}</p>
// //                 <p className="text-sm text-gray-700">📦 Items: {delivery.items?.join(", ") || "N/A"}</p>
// //                 <p className="text-sm text-gray-600">⚖️ Weight: {delivery.packageWeight} kg</p>
// //                 <p className="text-xs text-gray-500">⏰ Time: {new Date(delivery.time).toLocaleString()}</p>
// //                 <p className={`text-sm font-bold ${delivery.urgentDelivery === "Yes" ? "text-red-700" : "text-gray-500"}`}>
// //                   🚨 Urgent Delivery: {delivery.urgentDelivery}
// //                 </p>
// //               </div>
// //             ))
// //         ) : (
// //           <p className="text-center text-gray-500">No deliveries available.</p>
// //         )}
// //       </div>

// //       {/* Map Section */}
// //       <div className="w-2/3 h-screen">
// //         <MapContainer center={warehouseCoords} zoom={12} className="h-full w-full">
// //           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

// //           {/* Warehouse Marker */}
// //           <Marker position={warehouseCoords}>
// //             <Popup>
// //               <strong>Warehouse (Chandni Chowk)</strong>
// //             </Popup>
// //           </Marker>

// //           {/* Delivery Markers */}
// //           {deliveries.map((delivery) =>
// //             delivery.coordinates && delivery.coordinates.length === 2 ? (
// //               <Marker key={delivery.id} position={delivery.coordinates} icon={pinkMarkerIcon}>
// //                 <Popup>
// //                   <strong>{delivery.customer}</strong> <br />
// //                   {delivery.deliveryPoint}
// //                 </Popup>
// //               </Marker>
// //             ) : null
// //           )}

// //           {/* Optimized Route Line */}
// //           {optimizedRoute.length > 0 && (
// //             <Polyline positions={optimizedRoute} color="blue" weight={4} opacity={0.8} />
// //           )}
// //         </MapContainer>
// //       </div>
// //       </div>


// // {/* this for  display static  fetch optmized route  */}
     
// //       {/* Form for additional route optimization */}
// //       {/* <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8"> */}
// //       <div className="w-full bg-gray-100 margin-top-8 flex flex-col items-center justify-center py-8 border-t">
// //         <header className="bg-blue-900 w-full py-4">
// //           <h1 className="text-3xl font-bold text-center text-white">Shipment Route Optimization</h1>
// //         </header>
// //         <main className="bg-blue-800 p-6 rounded-lg shadow-lg w-full max-w-4xl mt-8">
// //           <h2 className="text-2xl font-bold text-center text-white mb-6">Optimize Your Route</h2>

// //           {/* Select Number of Locations */}
// //           <div className="mb-4">
// //             <label className="block text-sm font-medium text-white">Select Number of Locations:</label>
// //             <input
// //               type="number"
// //               value={numLocations}
// //               onChange={(e) => setNumLocations(parseInt(e.target.value))}
// //               min={2}
// //               max={availableLocations.length}
// //               className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-semibold"
// //             />
// //           </div>

// //           {/* Location Selection Dropdowns */}
// //           {Array.from({ length: numLocations }).map((_, index) => (
// //             <div key={index} className="mb-4">
// //               <label className="block text-sm font-medium text-white">
// //                 {index === 0 ? "Select Source:" : `Select Destination ${index}:`}
// //               </label>
// //               <select
// //                 value={selectedLocations[index] || ''}
// //                 onChange={(e) => {
// //                   const updatedLocations = [...selectedLocations];
// //                   updatedLocations[index] = e.target.value;
// //                   setSelectedLocations(updatedLocations);
// //                 }}
// //                 className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
// //               >
// //                 <option value="">Select a location</option>
// //                 {availableLocations.map((loc) => (
// //                   <option key={loc} value={loc}>
// //                     {loc}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           ))}

// //           {/* Time of Day Selection */}
// //           <div className="mb-4">
// //             <label className="block text-sm font-medium text-white">Select Time of Day:</label>
// //             <select
// //               value={timeOfDay}
// //               onChange={(e) => setTimeOfDay(e.target.value)}
// //               className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
// //             >
// //               <option value="">Select Time</option>
// //               <option value="Morning">Morning</option>
// //               <option value="Afternoon">Afternoon</option>
// //               <option value="Evening">Evening</option>
// //               <option value="Night">Night</option>
// //             </select>
// //           </div>

// //           {/* Optimize Button */}
// //           <button
// //             onClick={optimizeRoutes}
// //             className="w-full bg-white text-blue-500 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-200"
// //           >
// //             Optimize Route
// //           </button>

// //           {/* Display Optimized Route */}
// //           {formOptimizedRoute.length > 0 && (
// //             <div className="mt-6">
// //               <h3 className="text-xl font-semibold text-white">Optimized Route:</h3>
// //               <p className="mt-2 text-lg text-white">{formOptimizedRoute.join(' → ')}</p>
// //             </div>
// //           )}

// //           {/* Display Worst Route */}
// //           {worstRoute.length > 0 && (
// //             <div className="mt-6">
// //               <h3 className="text-xl font-semibold text-white">Worst Route:</h3>
// //               <p className="mt-2 text-lg text-white">{worstRoute.join(' → ')}</p>
// //             </div>
// //           )}

// //           {/* Display Total Travel Time */}
// //           {totalTime > 0 && (
// //             <div className="mt-6">
// //               <h3 className="text-lg font-semibold text-white">Total Travel Time:</h3>
// //               <p className="mt-2 text-lg text-white">{totalTime.toFixed(2)} minutes</p>
// //             </div>
// //           )}

// //           {/* Display Time Saved */}
// //           {timeSaved > 0 && (
// //             <div className="mt-4">
// //               <h3 className="text-lg font-semibold text-white">Time Saved:</h3>
// //               <p className="mt-2 text-lg text-green-300">{timeSaved.toFixed(2)} minutes</p>
// //             </div>
// //           )}

// //           {/* Display Bar Chart */}
// //           <div className="mt-6 w-full h-64 bg-white p-4 rounded-lg">
// //             <ResponsiveContainer width="100%" height="100%">
// //               <BarChart data={chartData}>
// //                 <CartesianGrid strokeDasharray="3 3" />
// //                 <XAxis dataKey="name" />
// //                 <YAxis />
// //                 <Tooltip />
// //                 <Legend />
// //                 <Bar dataKey="time" fill="#8884d8" />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </div>
// //         </main>
// //       </div>





// //     </div>
// //   );
// // };

// // export default DeliveryMap;





// export default function RouteOptimizationUI() {
//   return (
//     <div className="grid grid-rows-2 h-screen gap-4 p-4 bg-gray-200">
      
//       {/* First Half: Map & Delivery Data */}
//       <div className="grid grid-cols-3 gap-4 h-full">
//         {/* Map Container */}
//         <div className="col-span-2 bg-gray-100 relative">
//           {isLoading && (
//             <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
//               <div className="text-lg font-semibold">Calculating optimal route...</div>
//             </div>
//           )}
//           <MapContainer center={warehouseCoords} zoom={11} className="h-full w-full">
//             <TileLayer 
//               attribution='&copy; OpenStreetMap contributors'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//             <FitBoundsToMarkers points={allPoints} />
//             {optimizedWaypoints.length > 1 && <RoadRouting waypoints={optimizedWaypoints} />}
//             <Marker position={warehouseCoords} icon={warehouseMarkerIcon}>
//               <Popup>
//                 <strong>Warehouse (Chandni Chowk)</strong><br />
//                 Starting point
//               </Popup>
//             </Marker>
//             {deliveries.map((delivery) => (
//               !completedDeliveries.has(delivery.id) && delivery.coordinates?.length === 2 && (
//                 <Marker key={delivery.id} position={delivery.coordinates} icon={deliveryMarkerIcon}>
//                   <Popup>
//                     <strong>{delivery.customer}</strong><br />
//                     {delivery.deliveryPoint}
//                   </Popup>
//                 </Marker>
//               )
//             ))}
//           </MapContainer>
//         </div>

//         {/* Delivery Data */}
//         <div className="bg-white p-4 overflow-y-auto rounded-lg shadow">
//           <h2 className="text-xl font-bold text-blue-800 mb-4">Optimized Delivery Route</h2>
//           {sortedOptimizedOrder.map((point, index) => {
//             const delivery = deliveries.find(d => d.id === point.id);
//             if (!delivery) return null;
//             return (
//               <div key={point.id} className={`bg-white p-4 rounded-lg shadow ${completedDeliveries.has(delivery.id) ? 'opacity-50' : ''}`}>
//                 <div className="flex items-center mb-2">
//                   <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">{index + 1}</div>
//                   <strong className="text-lg text-black">{delivery.customer}</strong>
//                 </div>
//                 <p className="ml-11 text-gray-600"><strong>Address:</strong> {delivery.deliveryPoint}</p>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Second Half: Shipment Route Optimization */}
//       <div className="bg-gray-100 p-8 rounded-lg shadow flex flex-col items-center">
//         <header className="bg-blue-900 w-full py-4 text-center text-white font-bold text-3xl rounded">Shipment Route Optimization</header>
//         <main className="bg-blue-800 p-6 rounded-lg shadow-lg w-full max-w-4xl mt-8 text-white">
//           <h2 className="text-2xl font-bold text-center mb-6">Optimize Your Route</h2>
//           <button className="w-full bg-white text-blue-500 py-2 px-4 rounded-md hover:bg-gray-200 transition">Optimize Route</button>
//         </main>
//       </div>
//     </div>
//   );
// }




















import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle  , ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Function to create a custom marker icon
const createMarkerIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
};

// Custom marker icons
const warehouseMarkerIcon = createMarkerIcon('red');
const deliveryMarkerIcon = createMarkerIcon('blue');
const urgentDeliveryMarkerIcon = createMarkerIcon('blue');
const completedDeliveryMarkerIcon = createMarkerIcon('#008000');

const numberMarkerIcon = (number, isUrgent) => {
  return L.divIcon({
    className: 'custom-number-icon',
    html: `<div style="background-color:${isUrgent ? '#FF1493' : '#4169E1'}; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; border:2px solid white;">${number}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Fix for Leaflet default icon path issues
const fixLeafletIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR04a9rmYuwrdOY-wd9R196xmBzJPWY6ERP6w&s',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Component to fit bounds to all markers
const FitBoundsToMarkers = ({ points }) => {
  const map = useMap();
  
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(point => point.coordinates));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, points, /* Add only once when component mounts */]);
  
  return null;
};

// Component to add road routing between points
const RoadRouting = ({ waypoints, color = '#4169E1' }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map || waypoints.length < 2) return;
    
    // Clear previous routing instances
    map.eachLayer((layer) => {
      if (layer._routing) {
        map.removeLayer(layer);
      }
    });
    
    // Convert waypoints to Leaflet waypoints format
    const routingWaypoints = waypoints.map(coords => L.latLng(coords[0], coords[1]));
    
    // Create routing control with road-based directions
    const routingControl = L.Routing.control({
      waypoints: routingWaypoints,
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: false,
      show: false, // Don't show the routing panel
      lineOptions: {
        styles: [
          { color, opacity: 0.8, weight: 5 },
          { color: 'white', opacity: 0.3, weight: 8 }
        ]
      },
      createMarker: function() {
        return null; // Don't create markers by the routing machine
      }
    }).addTo(map);
    
    // Attach a property to identify this layer for cleanup later
    routingControl._container._routing = true;
    
    // Clean up on component unmount
    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, waypoints, color]);
  
  return null;
};

// Weather information component
const WeatherInfo = ({ coordinates, weatherData, setWeatherData }) => {
  const map = useMap();
  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using OpenWeatherMap API
        const apiKey = 'b888b420ac5d65cd219fc2c9896cefec'; // Consider using environment variables for this
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=${apiKey}&units=metric`,
          { timeout: 5000 } // Add timeout
        );
        
        if (response.data) {
          console.log('Weather data received:', response.data);
          setWeatherData(response.data);
        } else {
          throw new Error('No data received from weather API');
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        // Use mock data with more specific error handling
        setWeatherData({
          main: { temp: 28, humidity: 65 },
          weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
          wind: { speed: 3.6 },
          name: 'Delhi'
        });
      }
    };

    fetchWeather();
  }, [coordinates, setWeatherData]);

  return null;
};




// Time window visualization component
const TimeWindowVisualizer = ({ deliveries, currentTime }) => {
  const map = useMap();
  
  useEffect(() => {
    // Remove previous circles
    map.eachLayer((layer) => {
      if (layer._timeWindow) {
        map.removeLayer(layer);
      }
    });
    
    // Add time window circles
    deliveries.forEach(delivery => {
      if (!delivery.timeWindow) return;
      
      const [startTime, endTime] = delivery.timeWindow;
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      const now = new Date(currentTime);
      
      // Calculate time remaining (in hours)
      const hoursRemaining = (endDate - now) / (1000 * 60 * 60);
      
      // Determine color based on time remaining
      let color;
      let opacity;
      
      if (now < startDate) {
        // Delivery window hasn't started yet
        color = '#6495ED';  // Cornflower blue
        opacity = 0.3;
      } else if (now > endDate) {
        // Delivery is late
        color = '#FF0000';  // Red
        opacity = 0.5;
      } else {
        // Delivery is within window
        if (hoursRemaining < 1) {
          color = '#FFA500';  // Orange - less than 1 hour remaining
          opacity = 0.7;
        } else {
          color = '#32CD32';  // Lime green - more than 1 hour remaining
          opacity = 0.5;
        }
      }
      
      // Create a circle to represent the time window
      const circle = L.circle(delivery.coordinates, {
        color: color,
        fillColor: color,
        fillOpacity: opacity,
        radius: 100, // Radius in meters
      }).addTo(map);
      
      // Mark this circle as a time window visualization
      circle._timeWindow = true;
    });
    
  }, [map, deliveries, currentTime]);
  
  return null;
};

const DeliveryRouteMap = () => {
  // Fix Leaflet icon issues
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  // Example warehouse coordinates (Chandni Chowk, Delhi)
  const warehouseCoords = [28.6506, 77.2310];
  
  const [deliveries, setDeliveries] = useState([]);
  const [optimizedOrder, setOptimizedOrder] = useState([]);
  const [optimizedWaypoints, setOptimizedWaypoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedDeliveries, setCompletedDeliveries] = useState(new Set());
  const [expandedDeliveryId, setExpandedDeliveryId] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toISOString());
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'analytics'
  const [timeWindowsEnabled, setTimeWindowsEnabled] = useState(true);
  const [timeSliderValue, setTimeSliderValue] = useState(0);

  // Add this function to toggle expansion
  const toggleExpand = (id) => {
    if (expandedDeliveryId === id) {
      setExpandedDeliveryId(null);
    } else {
      setExpandedDeliveryId(id);
    }
  };
 
  // Fetch deliveries data from the provided URL
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await fetch('http://localhost:5002/deliveries');
        const data = await response.json();
        
        // Add mock time windows for demonstration
        const deliveriesWithTimeWindows = data.map(delivery => {
          const deliveryDate = new Date(delivery.time);
          const startTime = new Date(deliveryDate);
          startTime.setHours(startTime.getHours() - 1); // 1 hour before delivery time
          
          const endTime = new Date(deliveryDate);
          endTime.setHours(endTime.getHours() + 1); // 1 hour after delivery time
          
          return {
            ...delivery,
            timeWindow: [startTime.toISOString(), endTime.toISOString()]
          };
        });
        
        setDeliveries(deliveriesWithTimeWindows);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchDeliveries();
  }, []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (point1, point2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in kilometers
    
    const dLat = toRad(point2[0] - point1[0]);
    const dLon = toRad(point2[1] - point1[1]);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(point1[0])) * Math.cos(toRad(point2[0])) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Implementation of nearest neighbor algorithm for the Traveling Salesman Problem
  const calculateOptimizedRoute = () => {
    setIsLoading(true);
    
    // Add warehouse to the points list
    const allPoints = [{ id: 0, coordinates: warehouseCoords }, ...deliveries];
    
    // Create a distance matrix
    const distanceMatrix = [];
    for (let i = 0; i < allPoints.length; i++) {
      distanceMatrix[i] = [];
      for (let j = 0; j < allPoints.length; j++) {
        if (i === j) {
          distanceMatrix[i][j] = 0;
        } else {
          distanceMatrix[i][j] = calculateDistance(
            allPoints[i].coordinates, 
            allPoints[j].coordinates
          );
        }
      }
    }

    // Start with the warehouse (index 0)
    const visited = new Set([0]);
    const path = [0];
    let current = 0;

    // Nearest neighbor algorithm
    while (visited.size < allPoints.length) {
      let minDistance = Infinity;
      let nextPoint = -1;
      
      for (let i = 0; i < allPoints.length; i++) {
        if (!visited.has(i) && distanceMatrix[current][i] < minDistance) {
          minDistance = distanceMatrix[current][i];
          nextPoint = i;
        }
      }
      
      if (nextPoint !== -1) {
        visited.add(nextPoint);
        path.push(nextPoint);
        current = nextPoint;
      }
    }
    
    // Return to warehouse to complete the route
    path.push(0);
    
    // Create the ordered waypoints for routing
    const waypoints = path.map(index => allPoints[index].coordinates);
    
    // Create the optimized delivery order
    const order = path.slice(1, -1).map(index => {
      return {
        ...allPoints[index],
        order: path.indexOf(index)
      };
    });
    
    setOptimizedWaypoints(waypoints);
    setOptimizedOrder(order);
    setIsLoading(false);
  };

  // Calculate the route when deliveries data is fetched
  useEffect(() => {
    if (deliveries.length > 0) {
      calculateOptimizedRoute();
    }
  }, [deliveries]);

  // Get all points for bounds calculation
  const allPoints = [
    { coordinates: warehouseCoords },
    ...deliveries
  ];

  const toggleDeliveryStatus = (id) => {
    setCompletedDeliveries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Sort optimizedOrder based on completion status
  const sortedOptimizedOrder = [...optimizedOrder].sort((a, b) => {
    const deliveryA = deliveries.find(d => d.id === a.id);
    const deliveryB = deliveries.find(d => d.id === b.id);
    const isCompletedA = completedDeliveries.has(deliveryA?.id);
    const isCompletedB = completedDeliveries.has(deliveryB?.id);
    return isCompletedA - isCompletedB;
  });

  // New function to select a delivery for detailed view
  const handleSelectDelivery = (delivery) => {
    setSelectedDelivery(delivery);
  };



  // Update current time based on slider value
  useEffect(() => {
    if (deliveries.length === 0) return;
    
    // Find the earliest and latest delivery times
    let earliestTime = new Date();
    let latestTime = new Date();
    
    deliveries.forEach(delivery => {
      if (delivery.timeWindow) {
        const [startTime, endTime] = delivery.timeWindow;
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        
        if (startDate < earliestTime) earliestTime = startDate;
        if (endDate > latestTime) latestTime = endDate;
      }
    });
    
    // Calculate total time span in milliseconds
    const timeSpan = latestTime.getTime() - earliestTime.getTime();
    
    // Calculate current time based on slider value
    const simulatedTime = new Date(earliestTime.getTime() + (timeSpan * (timeSliderValue / 100)));
    setCurrentTime(simulatedTime.toISOString());
    
  }, [timeSliderValue, deliveries]);

  // Calculate delivery status based on current time
  const getDeliveryStatus = (delivery) => {
    if (completedDeliveries.has(delivery.id)) return 'completed';
    if (!delivery.timeWindow) return 'pending';
    
    const [startTime, endTime] = delivery.timeWindow;
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const now = new Date(currentTime);
    
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'overdue';
    return 'active';
  };

  // Calculate analytics data for the chart
  const getAnalyticsData = () => {
    const statuses = ['completed', 'active', 'upcoming', 'overdue'];
    const data = statuses.map(status => {
      return {
        name: status.charAt(0).toUpperCase() + status.slice(1),
        count: deliveries.filter(d => getDeliveryStatus(d) === status).length
      };
    });
    
    return data;
  };

  return ( 
    <div className="grid grid-rows-1  gap-8 p-4 bg-gray-200">
        
      {/* View Mode Selector */}
      <div className="bg-gray-800 p-4 h-20 rounded-lg shadow flex justify-center mb-2">
        <div className=" inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2  text-sm font-medium ${viewMode === 'map' ? 'bg-blue-600 text-black' : 'bg-white text-gray-900 hover:bg-gray-100'} border border-gray-200 rounded-l-lg`}
            onClick={() => setViewMode('map')}
          >
            Map View
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${viewMode === 'analytics' ? 'bg-blue-600 text-black' : 'bg-white text-gray-900 hover:bg-gray-100'} border border-gray-200 rounded-r-lg`}
            onClick={() => setViewMode('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>
      
      {/* First Half: Map & Delivery Data or Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 h-full gap-4 p-4 bg-gray-200 hover:bg-pink-200">
        
        {viewMode === 'map' ? (
          <>
            {/* Map Container - Takes 2/3 on large screens */}
            <div className="lg:col-span-2 bg-gray-100 relative h-full">
  {isLoading && (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
      <div className="text-lg font-semibold">Calculating optimal route...</div>
    </div>
  )}
  
            

              {/* Weather Display */}
              {weatherData && (
                <div className="absolute bg-blue-200 w-40 text-black top-4 left-7 bg-white p-2 rounded-lg shadow-md z-20">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} 
                      alt={weatherData.weather[0].description}
                      className="w-10 h-10"
                    />
                    <div>
                      <div className="font-bold text-lg">{weatherData.main.temp}°C</div>
                      <div className="text-xs text-gray-600">{weatherData.weather[0].description}</div>
                    </div>
                  </div>
                  <div className="text-xs mt-1">
                    <div>Humidity: {weatherData.main.humidity}%</div>
                    <div>Wind: {weatherData.wind.speed} m/s</div>
                  </div>
                </div>
              )}

<MapContainer 
    center={warehouseCoords} 
    zoom={11} 
    className="h-full w-full z-0" 
    style={{ height: '100%', width: '100%', minHeight: '800px' }}
    scrollWheelZoom={true}
    doubleClickZoom={true}
    dragging={true}
    zoomControl={false} // Remove default zoom control
  >
               <TileLayer 
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    
    <ZoomControl position="bottomright" /> {/* Add zoom control in a better position */}
    

              
                
                {/* Road-based routing displayed on the map */}
                {optimizedWaypoints.length > 1 && (
                  <RoadRouting waypoints={optimizedWaypoints} />
                )}
                
                {/* Weather information fetch */}
                <WeatherInfo 
                  coordinates={warehouseCoords} 
                  weatherData={weatherData} 
                  setWeatherData={setWeatherData} 
                />
                
                {/* Time window visualization */}
                {timeWindowsEnabled && (
                  <TimeWindowVisualizer 
                    deliveries={deliveries.filter(d => !completedDeliveries.has(d.id))} 
                    currentTime={currentTime} 
                  />
                )}
                
                {/* Warehouse Marker */}
                <Marker position={warehouseCoords} icon={warehouseMarkerIcon}>
                  <Popup>
                    <strong>Warehouse (Chandni Chowk)</strong>
                    <br />
                    Starting point
                  </Popup>
                </Marker>
                
                {/* Delivery Markers */}
                {deliveries.map((delivery) => {
                  if (completedDeliveries.has(delivery.id)) return null;
                  const orderInfo = optimizedOrder.find(item => item.id === delivery.id);
                  const visitOrder = orderInfo ? orderInfo.order : null;
                  const isUrgent = delivery.urgentDelivery === 'Yes';
                  
                  return delivery.coordinates && delivery.coordinates.length === 2 ? (
                    <Marker 
                      key={delivery.id} 
                      position={delivery.coordinates} 
                      icon={isUrgent ? urgentDeliveryMarkerIcon : deliveryMarkerIcon}
                      eventHandlers={{
                        click: () => handleSelectDelivery(delivery)
                      }}
                    >
                      <Popup>
                        <strong>{delivery.customer}</strong>
                        <br />
                        {delivery.deliveryPoint}
                        {visitOrder !== null && (
                          <div><strong>Visit Order: {visitOrder}</strong></div>
                        )}
                        {delivery.timeWindow && (
                          <div>
                            <strong>Delivery Window:</strong>
                            <br />
                            {new Date(delivery.timeWindow[0]).toLocaleTimeString()} - {new Date(delivery.timeWindow[1]).toLocaleTimeString()}
                          </div>
                        )}
                        {isUrgent && (
                          <div className="font-bold text-red-600">URGENT DELIVERY</div>
                        )}
                      </Popup>
                    </Marker>
                  ) : null;
                })}
                
                {/* Order Number Markers */}
                {sortedOptimizedOrder.map((point, index) => {
                  const delivery = deliveries.find(d => d.id === point.id);
                  if (!delivery || completedDeliveries.has(delivery.id)) return null;
                  const isUrgent = delivery.urgentDelivery === 'Yes';
                  return (
                    <Marker 
                      key={`order-${index}`} 
                      position={delivery.coordinates} 
                      icon={numberMarkerIcon(index + 1, isUrgent)}
                      zIndexOffset={1000} // Make sure numbers appear on top
                      tap={false}  
                      />
                  );
                })}
              </MapContainer>
            </div>

            <div className="bg-white p-2 overflow-y-auto rounded-lg shadow">
              <h2 className="text-lg font-bold text-blue-800 mb-2">Optimized Delivery Route</h2>
              <div className="bg-blue-500 p-2 rounded mb-2 text-black text-sm">
                <strong>Starting point:</strong> Warehouse (Chandni Chowk)
              </div>
              
              {/* Summary of delivery weights */}
              <div className="mb-3 p-2 bg-gray-50 rounded-lg text-black text-sm">
                <div className="flex justify-between mb-1">
                  <span>Remaining deliveries weight:</span>
                  <span className="font-bold">
                    {deliveries
                      .filter(delivery => !completedDeliveries.has(delivery.id))
                      .reduce((sum, delivery) => sum + parseFloat(delivery.packageWeight || 0), 0)
                      .toFixed(2)} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Completed deliveries weight:</span>
                  <span className="font-bold">
                    {deliveries
                      .filter(delivery => completedDeliveries.has(delivery.id))
                      .reduce((sum, delivery) => sum + parseFloat(delivery.packageWeight || 0), 0)
                      .toFixed(2)} kg
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                {sortedOptimizedOrder.map((point, index) => {
                  const delivery = deliveries.find(d => d.id === point.id);
                  if (!delivery) return null;
                  const isCompleted = completedDeliveries.has(delivery.id);
                  const deliveryStatus = getDeliveryStatus(delivery);
                  
                  let statusColor;
                  switch(deliveryStatus) {
                    case 'completed': statusColor = 'green'; break;
                    case 'active': statusColor = 'blue'; break;
                    case 'upcoming': statusColor = 'gray'; break;
                    case 'overdue': statusColor = 'red'; break;
                    default: statusColor = 'gray';
                  }
                  
                  return (
                    <div 
                      key={point.id} 
                      className={`bg-white p-2  text-black rounded-lg border ${isCompleted ? 'opacity-50 border-green-300' : `border-${statusColor}-600`}`}
                      onClick={() => handleSelectDelivery(delivery)}
                    >
                      {/* Header - Always visible */}
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex items-center cursor-pointer flex-grow"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(delivery.id);
                          }}
                        >
                          <div className={`inline-block ${isCompleted ? 'bg-green-500' : `bg-${statusColor}-500`} text-white rounded-full w-6 h-6 text-center text-sm mr-2 flex items-center justify-center`}>
                            {index + 1}
                          </div>
                          <div>
                            <strong className="text-sm text-black">{delivery.customer}</strong>
                            <p className="text-xs text-gray-600 truncate max-w-xs">{delivery.deliveryPoint}</p>
                          </div>
                          <span className="text-gray-400 text-xs ml-2">{expandedDeliveryId === delivery.id ? '▲' : '▼'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* Time window status indicator */}
                          {timeWindowsEnabled && delivery.timeWindow && (
                            <div className={`text-xs px-1 py-0.5 rounded bg-${statusColor}-100 text-${statusColor}-600`}>
                              {deliveryStatus.toUpperCase()}
                            </div>
                          )}
                          
                          {delivery.urgentDelivery === 'Yes' && (
                            <div className="text-xs px-1 py-0.5 rounded bg-purple-100 text-purple-600 font-bold">
                              URGENT
                            </div>
                          )}
                          <button
                            className={`px-2 py-1 text-xs rounded ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDeliveryStatus(delivery.id);
                            }}
                          >
                            {isCompleted ? 'Completed' : 'Mark Done'}
                          </button>
                        </div>
                      </div>
                      
                      {/* Expanded Content */}
                      {expandedDeliveryId === delivery.id && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="font-semibold">Customer Phone:</div>
                              <div>{delivery.customerPhone || 'N/A'}</div>
                            </div>
                            <div>
                              <div className="font-semibold">Package Weight:</div>
                              <div>{delivery.packageWeight ? `${delivery.packageWeight} kg` : 'N/A'}</div>
                            </div>
                            <div>
                              <div className="font-semibold">Delivery Type:</div>
                              <div>{delivery.deliveryType || 'Standard'}</div>
                            </div>
                            <div>
                              <div className="font-semibold">Expected Time:</div>
                              <div>{new Date(delivery.time).toLocaleTimeString()}</div>
                            </div>
                            {delivery.notes && (
                              <div className="col-span-2">
                                <div className="font-semibold">Notes:</div>
                                <div className="text-xs italic">{delivery.notes}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Return to warehouse */}
              <div className="mt-4 bg-red-100 p-2 rounded-lg border border-red-300 text-sm">
                <div className="flex items-center">
                  <div className="inline-block bg-red-500 text-white rounded-full w-6 h-6 text-center text-sm mr-2 flex items-center justify-center">
                    <span>⬅</span>
                  </div>
                  <div>
                    <strong>Return to Warehouse</strong>
                    <p className="text-xs text-gray-600">Chandni Chowk, Delhi</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Analytics View */}
            <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Delivery Analytics</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Delivery Status Chart */}
                <div className="text-black bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Delivery Status</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getAnalyticsData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Delivery Metrics */}
                <div className="bg-gray-50 text-black  p-4 rounded-lg">
                  <h3 className=" text-lg font-semibold mb-3">Delivery Metrics</h3>
                  <div className=" text-black grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg shadow">
                      <div className="text-sm text-gray-500">Total Deliveries</div>
                      <div className="text-2xl font-bold">{deliveries.length}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow">
                      <div className="text-sm text-gray-500">Completed</div>
                      <div className="text-2xl font-bold">{completedDeliveries.size}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow">
                      <div className="text-sm text-gray-500">Pending</div>
                      <div className="text-2xl font-bold">{deliveries.length - completedDeliveries.size}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow">
                      <div className="text-sm text-gray-500">Urgent Deliveries</div>
                      <div className="text-2xl font-bold">{deliveries.filter(d => d.urgentDelivery === 'Yes').length}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-white p-3 rounded-lg shadow">
                    <h4 className="font-semibold mb-2">Time Window Status</h4>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                        <span className="text-xs">Active: {deliveries.filter(d => getDeliveryStatus(d) === 'active').length}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-500 rounded-full mr-1"></div>
                        <span className="text-xs">Upcoming: {deliveries.filter(d => getDeliveryStatus(d) === 'upcoming').length}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                        <span className="text-xs">Overdue: {deliveries.filter(d => getDeliveryStatus(d) === 'overdue').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Second Half: Delivery Details */}
      <div className="bg-blue-200 text-black p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Delivery Details</h2>
        
        {selectedDelivery ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-semibold mb-2">{selectedDelivery.customer}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-semibold">Delivery Address</div>
                  <div className="text-sm">{selectedDelivery.deliveryPoint}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold">Contact</div>
                  <div className="text-sm"> {selectedDelivery.customerPhone || `+91 8475837499`}</div>
                </div>
            


                <div>
                  <div className="text-sm font-semibold">Package Weight</div>
                  <div className="text-sm">{selectedDelivery.packageWeight ? `${selectedDelivery.packageWeight} kg` : 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold">Delivery Type</div>
                  <div className="text-sm">
                    {selectedDelivery.urgentDelivery === 'Yes' ? (
                      <span className="text-purple-600 font-bold">URGENT</span>
                    ) : (
                      'Standard'
                    )}
                  </div>
                </div>
              </div>
              
              {selectedDelivery.notes && (
                <div className="mb-4">
                  <div className="text-sm font-semibold">Delivery Notes</div>
                  <div className="text-sm p-2 bg-gray-50 rounded">{selectedDelivery.notes}</div>
                </div>
              )}
              
              <div className="mb-4">
                <div className="text-sm font-semibold">Delivery Window</div>
                <div className="text-sm">
                  {selectedDelivery.timeWindow ? (
                    <>
                      {new Date(selectedDelivery.timeWindow[0]).toLocaleTimeString()} - {new Date(selectedDelivery.timeWindow[1]).toLocaleTimeString()}
                    </>
                  ) : 'No specific time window'}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  className={`px-4 py-2 rounded text-black ${completedDeliveries.has(selectedDelivery.id) ? 'bg-green-500' : 'bg-blue-500'}`}
                  onClick={() => toggleDeliveryStatus(selectedDelivery.id)}
                >
                  {completedDeliveries.has(selectedDelivery.id) ? 'Completed ✓' : 'Mark as Completed'}
                </button>
                <button 
                  className="px-4 py-2 rounded bg-gray-300 text-gray-700"
                  onClick={() => setSelectedDelivery(null)}
                >
                  Close Details
                </button>
              </div>
            </div>
            
            <div className=" text-black bg-gray-50 p-4 rounded-lg">
              <h3 className="text-black text-md font-semibold mb-2">Delivery Status</h3>
              <div className="text-black flex items-center mb-4">
                <div className={` text-black w-4 h-4 rounded-full mr-2 ${
                  getDeliveryStatus(selectedDelivery) === 'completed' ? 'bg-green-500' : 
                  getDeliveryStatus(selectedDelivery) === 'active' ? 'bg-blue-500' : 
                  getDeliveryStatus(selectedDelivery) === 'upcoming' ? 'bg-gray-500' : 'bg-red-500'
                }`}></div>
                <div className="text-sm font-semibold">
                  {getDeliveryStatus(selectedDelivery).toUpperCase()}
                </div>
              </div>
              
              {getDeliveryStatus(selectedDelivery) === 'active' && selectedDelivery.timeWindow && (
                <div className="mb-4">
                  <div className="text-sm font-semibold">Time Remaining</div>
                  <div className="text-lg font-bold">
                    {(() => {
                      const now = new Date(currentTime);
                      const endTime = new Date(selectedDelivery.timeWindow[1]);
                      const diff = endTime - now;
                      const hours = Math.floor(diff / (1000 * 60 * 60));
                      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                      return `${hours}h ${minutes}m`;
                    })()}
                  </div>
                </div>
              )}
              
              {getDeliveryStatus(selectedDelivery) === 'upcoming' && selectedDelivery.timeWindow && (
                <div className="mb-4">
                  <div className="text-sm font-semibold">Starts In</div>
                  <div className="text-lg font-bold">
                    {(() => {
                      const now = new Date(currentTime);
                      const startTime = new Date(selectedDelivery.timeWindow[0]);
                      const diff = startTime - now;
                      const hours = Math.floor(diff / (1000 * 60 * 60));
                      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                      return `${hours}h ${minutes}m`;
                    })()}
                  </div>
                </div>
              )}
              
              {getDeliveryStatus(selectedDelivery) === 'overdue' && selectedDelivery.timeWindow && (
                <div className="mb-4">
                  <div className="text-sm font-semibold">Overdue By</div>
                  <div className="text-lg font-bold text-red-600">
                    {(() => {
                      const now = new Date(currentTime);
                      const endTime = new Date(selectedDelivery.timeWindow[1]);
                      const diff = now - endTime;
                      const hours = Math.floor(diff / (1000 * 60 * 60));
                      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                      return `${hours}h ${minutes}m`;
                    })()}
                  </div>
                </div>
              )}
              
              <h3 className="text-md font-semibold mb-2 mt-4">Weather at Delivery Location</h3>
              {weatherData && (
                <div className="flex items-center p-2 bg-white rounded-lg shadow">
                  <img 
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} 
                    alt={weatherData.weather[0].description}
                    className="w-12 h-12"
                  />
                  <div>
                    <div className="font-bold text-lg">{weatherData.main.temp}°C</div>
                    <div className="text-sm text-gray-600">{weatherData.weather[0].description}</div>
                    <div className="text-xs text-gray-400">
                      Humidity: {weatherData.main.humidity}% | Wind: {weatherData.wind.speed} m/s
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No Delivery Selected</h3>
            <p className="text-gray-600">Click on a delivery from the list or map to view detailed information.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryRouteMap;





