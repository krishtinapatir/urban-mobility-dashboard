import React, { useEffect, useState } from 'react';
import { Leaf, Droplet, Wind, TreeDeciduous, Truck } from 'lucide-react';
import { SustainabilityMetric } from '../types';

const Sustainability = () => {
  const [metrics, setMetrics] = useState<SustainabilityMetric[]>([]);

  useEffect(() => {
    // If no metrics are stored, generate some fake data
    const storedMetrics = JSON.parse(localStorage.getItem('sustainabilityMetrics') || '[]');
    
    if (storedMetrics.length === 0) {
      const fakeMetrics = generateFakeMetrics();
      localStorage.setItem('sustainabilityMetrics', JSON.stringify(fakeMetrics));
      setMetrics(fakeMetrics);
    } else {
      // Check if the existing metrics have distance and fuel data
      const updatedMetrics = storedMetrics.map(metric => {
        if (!metric.distanceTraveled || !metric.fuelSaved) {
          // Calculate these values if they don't exist
          const co2SavedNum = parseFloat(metric.co2Saved);
          const fuelSaved = (co2SavedNum / 2.68).toFixed(2);
          const distanceTraveled = Math.round((parseFloat(fuelSaved) / 7) * 100);
          
          return {
            ...metric,
            distanceTraveled: distanceTraveled,
            fuelSaved: parseFloat(fuelSaved)
          };
        }
        return metric;
      });
      
      localStorage.setItem('sustainabilityMetrics', JSON.stringify(updatedMetrics));
      setMetrics(updatedMetrics);
    }
  }, []);

  const totalCO2Saved = metrics.reduce((total, metric) => total + metric.co2Saved, 0).toFixed(2);
  const { treesEquivalent, ecoDeliveries, ecoDeliveryRate } = calculateEcoMetrics(totalCO2Saved);

  return (
    <div className="space-y-6">
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-800 via-purple-700 to-purple-500 text-transparent bg-clip-text font-serif">Sustainability Impact</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* CO₂ Saved & Trees Equivalent */}
        <div className="relative group bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
          <Leaf className="w-10 h-10 text-green-400 mb-2 mx-auto" />
          <h3 className="font-semibold text-white">CO₂ Saved ≈ Trees Equivalent</h3>
          <p className="text-2xl font-bold text-green-400">{totalCO2Saved} kg ≈ {treesEquivalent} 🌳</p>

          {/* Tooltip on Hover */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-sm p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
            <p><span className="font-semibold text-green-400">CO₂ Saved:</span> Reduction in carbon emissions from eco-friendly transport.</p>
            <p><span className="font-semibold text-green-400">Trees Equivalent:</span> The number of trees required to absorb the same amount of CO₂.</p>
          </div>
        </div>

        {/* Eco Deliveries & Eco Delivery Rate */}
        <div className="relative group bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
          <Truck className="w-10 h-10 text-green-400 mb-2 mx-auto" />
          <h3 className="font-semibold text-white">Eco Deliveries ≈ Delivery Rate</h3>
          <p className="text-2xl font-bold text-green-400">{ecoDeliveries} 🚚 ≈72%</p>

          {/* Tooltip on Hover */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-sm p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
            <p><span className="font-semibold text-green-400">Eco Deliveries:</span> The number of deliveries made using sustainable methods.</p>
            <p><span className="font-semibold text-green-400">Eco Delivery Rate:</span> Percentage of total deliveries that were eco-friendly.</p>
          </div>
        </div>

        {/* Energy Efficiency & Green Score with Tooltip */}
        <div className="relative group bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
          <Droplet className="w-8 h-8 text-blue-400 mb-2 mx-auto" />
          <h3 className="font-semibold text-white">Energy Efficiency ≈ Green Score</h3>
          <p className="text-2xl font-bold text-blue-400">
            {metrics.length > 0 
              ? (metrics.reduce((total, metric) => total + metric.energyEfficiency, 0) / metrics.length).toFixed(2) 
              : 0}% 
            ≈  
            <span className="text-purple-400">
              {metrics.length > 0 
                ? (metrics.reduce((total, metric) => total + metric.greenScore, 0) / metrics.length).toFixed(2) 
                : 0}
            </span>
          </p>

          {/* Tooltip on Hover */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-sm p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
            <p><span className="font-semibold text-blue-400">Energy Efficiency:</span> Represents how well energy is utilized without waste.</p>
            <p><span className="font-semibold text-purple-400">Green Score:</span> A broader measure of sustainability, often influenced by energy efficiency.</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-3xl font-semibold mb-4 text-blue-400">Daily Metrics</h2>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">{new Date(metric.date).toLocaleDateString()}</span>
                <span className="text-green-400 font-bold">credit : {metric.greenScore} points</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="text-gray-300">
                  <span className="text-sm">CO₂ Emission :</span>
                  <span className="ml-2 text-green-400">{metric.co2Saved} kg</span>
                </div>
                <div className="text-gray-300">
                  <span className="text-sm">Efficiency:</span>
                  <span className="ml-2 text-blue-400">{metric.energyEfficiency}%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-gray-300">
                  <span className="text-sm">Distance Traveled:</span>
                  <span className="ml-2 text-yellow-400">{metric.distanceTraveled} km</span>
                </div>
                <div className="text-gray-300">
                  <span className="text-sm">Fuel Saved:</span>
                  <span className="ml-2 text-orange-400">{metric.fuelSaved} L</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Function to calculate eco metrics
function calculateEcoMetrics(co2Saved) {
  const treeAbsorptionPerYear = 21.77; // Average CO2 absorption per tree per year
  const co2PerDelivery = 0.3; // Average CO2 saved per eco delivery
  const totalDeliveries = 1600; // Example total deliveries

  return {
    treesEquivalent: Math.round(co2Saved / treeAbsorptionPerYear),
    ecoDeliveries: Math.round(co2Saved / co2PerDelivery),
    ecoDeliveryRate: Math.round((co2Saved / co2PerDelivery / totalDeliveries) * 100),
  };
}

// Function to generate fake metrics data
function generateFakeMetrics() {
  const lastTwoWeeks = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Generate consistent data for the same day
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    
    // Generate specific values to match the screenshot
    const co2Saved = i < 4 ? 5.18 : 4.91;
    const energyEfficiency = 90;
    const greenScore = i < 4 ? 94.82 : 95.09;
    
    // Calculate distance and fuel based on CO2
    const fuelSaved = (co2Saved / 2.68).toFixed(2);
    const distanceTraveled = Math.round((parseFloat(fuelSaved) / 7) * 100);
    
    lastTwoWeeks.push({
      id: date.getTime() + i,  // Adding i to ensure unique IDs
      date: date.toISOString(),
      energyEfficiency: energyEfficiency,
      greenScore: greenScore,
      co2Saved: co2Saved,
      distanceTraveled: distanceTraveled,
      fuelSaved: parseFloat(fuelSaved)
    });
  }
  
  // Add some additional historical data
  for (let i = 1; i <= 9; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate random but realistic values
    const co2Saved = (4.5 + Math.random() * 1.5).toFixed(2);
    const energyEfficiency = 90;
    const greenScore = 94 + Math.random() * 2;
    
    // Calculate distance and fuel data based on CO2 saved
    const co2SavedNum = parseFloat(co2Saved);
    const fuelSaved = (co2SavedNum / 2.68).toFixed(2);
    const distanceTraveled = Math.round((parseFloat(fuelSaved) / 7) * 100);
    
    lastTwoWeeks.push({
      id: date.getTime(),
      date: date.toISOString(),
      energyEfficiency: energyEfficiency,
      greenScore: parseFloat(greenScore.toFixed(2)),
      co2Saved: co2SavedNum,
      distanceTraveled: distanceTraveled,
      fuelSaved: parseFloat(fuelSaved)
    });
  }
  
  return lastTwoWeeks;
}

export default Sustainability;