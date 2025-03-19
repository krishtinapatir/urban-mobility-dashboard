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
    // Remove previous layers
    map.eachLayer((layer) => {
      if (layer._timeWindow || layer._routeLine || layer._routeMarker) {
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
          color = '#FF0000';  // Red - less than 1 hour remaining
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
        radius: 600, // Radius in meters
      }).addTo(map);
      
      // Mark this circle as a time window visualization
      circle._timeWindow = true;
      
      // Add a bright red marker at the coordinate location for better visibility
      const redMarker = L.circleMarker(delivery.coordinates, {
        radius: 8,
        color: '#FF0000',
        fillColor: '#FF0000',
        fillOpacity: 1.0,
        weight: 2
      }).addTo(map);
      
      redMarker._routeMarker = true;
    });
    
    // Add red indicators along routes between deliveries
    if (deliveries.length > 1) {
      for (let i = 0; i < deliveries.length - 1; i++) {
        if (!deliveries[i].coordinates || !deliveries[i+1].coordinates) continue;
        
        // Create a line between consecutive delivery points
        const routeLine = L.polyline(
          [deliveries[i].coordinates, deliveries[i+1].coordinates], 
          { 
            color: '#FF0000',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10' // Creates a dashed line
          }
        ).addTo(map);
        
        routeLine._routeLine = true;
        
        // Add red markers along the route
        const midPoint = [
          (deliveries[i].coordinates[0] + deliveries[i+1].coordinates[0]) / 2,
          (deliveries[i].coordinates[1] + deliveries[i+1].coordinates[1]) / 2
        ];
        
        const midMarker = L.circleMarker(midPoint, {
          radius: 6,
          color: '#FF0000',
          fillColor: '#FF0000',
          fillOpacity: 1.0,
          weight: 2
        }).addTo(map);
        
        midMarker._routeMarker = true;
        
        // Add indicators at the sides of routes
        const quarter1 = [
          (deliveries[i].coordinates[0] * 0.75) + (deliveries[i+1].coordinates[0] * 0.25),
          (deliveries[i].coordinates[1] * 0.75) + (deliveries[i+1].coordinates[1] * 0.25)
        ];
        
        const quarter3 = [
          (deliveries[i].coordinates[0] * 0.25) + (deliveries[i+1].coordinates[0] * 0.75),
          (deliveries[i].coordinates[1] * 0.25) + (deliveries[i+1].coordinates[1] * 0.75)
        ];
        
        const marker1 = L.circleMarker(quarter1, {
          radius: 5,
          color: '#FF0000',
          fillColor: '#FF0000',
          fillOpacity: 1.0,
          weight: 2
        }).addTo(map);
        
        const marker3 = L.circleMarker(quarter3, {
          radius: 5,
          color: '#FF0000',
          fillColor: '#FF0000',
          fillOpacity: 1.0,
          weight: 2
        }).addTo(map);
        
        marker1._routeMarker = true;
        marker3._routeMarker = true;
      }
    }
    
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
    <div className="grid grid-rows-1  gap-4  p-1 bg-gray-200">
        
    {/* View Mode Selector */}
<div className="bg-gray-800 p-2 h-24 rounded-lg shadow flex justify-center items-center mb-4">
  <div className="inline-flex rounded-lg shadow-md" role="group">
    <button
      type="button"
      className={`px-12 py-5 text-lg font-semibold transition-all duration-300 ${
        viewMode === 'map' 
          ? 'bg-blue-600 text-white shadow-lg scale-105' 
          : 'bg-white text-gray-900 hover:bg-gray-200'
      } border border-gray-300 rounded-l-lg`}
      onClick={() => setViewMode('map')}
    >
      🗺️ Map View
    </button>
    <button
      type="button"
      className={`px-12 py-3 text-lg font-semibold transition-all duration-300 ${
        viewMode === 'analytics' 
          ? 'bg-blue-600 text-white shadow-lg scale-105' 
          : 'bg-white text-gray-900 hover:bg-gray-200'
      } border border-gray-300 rounded-r-lg`}
      onClick={() => setViewMode('analytics')}
    >
      📊 Analytics
    </button>
  </div>
</div>

      
      {/* First Half: Map & Delivery Data or Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 h-full gap-4 p-4 bg-gray-200 bg-gray-300 hover:bg-pink-200">
        
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
              {/* <h2 className="text-xl font-bold text-blue-800 mb-2">Optimized Delivery Route</h2>
              <div> <button>Start Delivery </button> </div> */}
<div className="flex justify-between items-center mb-4">
  <h2 className="text-3xl font-bold text-blue-800">Optimized Delivery Route</h2>
  <button className="px-2 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
    Start Delivery
  </button>
</div>

              <div className="bg-blue-400 p-2 rounded mb-2 text-black text-sm">
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
                      className={`bg-white p-2 border-blue-900  text-black rounded-lg border ${isCompleted ? 'opacity-80 border-green-800' : `border-${statusColor}-800`}`}
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
                            <p className="text-xs text-red-600 truncate max-w-xs">{delivery.deliveryPoint}</p>
                          </div>
                          <span className="text-black-400 text-xs ml-2">{expandedDeliveryId === delivery.id ? '▲' : '▼'}</span>
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
                              <div className="font-semibold">📞 Customer Phone:</div>
                              <div>{delivery.customerPhone || '+91 93734836282'}</div>
                            </div>
                            <div className=" bg-yellow-300 font-semibold" >
                              <div className=" font-semibold">📦 Package Weight:</div>
                              <div>{delivery.packageWeight ? `${delivery.packageWeight} kg` : 'N/A'}</div>
                            </div>
                            <div>
                              <div className="text-2l font-semibold">🚚 Delivery Type:</div>
                              <div>{delivery.deliveryType || 'Standard'}</div>
                            </div>
                            <div>
                              <div className="font-semibold"> ⏰ Expected Time:</div>
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
              <div className="mt-4 text-black bg-red-100 p-2 rounded-lg border border-red-300 text-sm">
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
                        <span className=" bg-gray-500 text-xs">Active: {deliveries.filter(d => getDeliveryStatus(d) === 'active').length}</span>
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



