import React, { useState } from 'react';
import { Trophy, Star, Award, TrendingUp, Leaf, Coins } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const leaderboard = [
  { id: 1, name: 'Pradeep Bhaskar', points: 2500, badge: 'Eco Warrior' },
  { id: 2, name: 'Mohit', points: 2100, badge: 'Route Master' },
  { id: 3, name: 'Daksh Mehr', points: 1800, badge: 'Early Adopter' },
  { id: 4, name: 'Rajput', points: 1750, badge: 'Route Master' }
];

// Enhanced data with carbon credits
const data = [
  { day: 'Sunday', hour: 'Distance Travelled: 20 km', co2Emission: 320, carbonCredits: 42 },
  { day: 'Monday', hour: 'Distance Travelled: 10 km', co2Emission: 200, carbonCredits: 60 },
  { day: 'Tuesday', hour: 'Distance Travelled: 18 km', co2Emission: 580, carbonCredits: 28 },
  { day: 'Wednesday', hour: 'Distance Travelled: 15 km', co2Emission: 890, carbonCredits: 15 },
  { day: 'Thursday', hour: 'Distance Travelled: 11 km', co2Emission: 760, carbonCredits: 20 },
  { day: 'Friday', hour: 'Distance Travelled: 19 km', co2Emission: 850, carbonCredits: 18 },
  { day: 'Saturday', hour: 'Distance Travelled: 12 km', co2Emission: 920, carbonCredits: 14 },
];

// Carbon credit monthly summary
const monthlyCarbonData = [
  { month: 'Jan', carbonCredits: 180, value: 540 },
  { month: 'Feb', carbonCredits: 220, value: 660 },
  { month: 'Mar', carbonCredits: 197, value: 591 },
  { month: 'Apr', carbonCredits: 240, value: 720 },
  { month: 'May', carbonCredits: 278, value: 834 },
  { month: 'Jun', carbonCredits: 310, value: 930 },
  { month: 'Jul', carbonCredits: 350, value: 1050 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-white">
        <p className="text-blue-400 font-semibold">{payload[0].payload.hour}</p>
        <p>CO2 Emission: {payload[0].value} g</p>
        <p className="text-green-400">Carbon Credits: {payload[0].payload.carbonCredits}</p>
      </div>
    );
  }
  return null;
};

const CreditTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-white">
        <p className="text-green-400 font-semibold">{payload[0].payload.month}</p>
        <p>Carbon Credits: {payload[0].payload.carbonCredits}</p>
        <p>Value: ${payload[0].payload.value}</p>
      </div>
    );
  }
  return null;
};

export default function Gamification() {
  const [activeTab, setActiveTab] = useState('emissions');
  
  return (
    <div className="space-y-6">
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-800 via-purple-700 to-purple-500 text-transparent bg-clip-text font-serif">
        Rewards & Achievements
      </h1>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-blue-400">
          <Trophy className="w-8 h-8 text-yellow-200 mb-2" />
          <h3 className="font-semibold text-white">Your Points</h3>
          <p className="text-2xl font-bold text-yellow-400">1,250</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-blue-400">
          <Star className="w-8 h-8 text-blue-500 mb-2" />
          <h3 className="font-semibold text-white">Current Level</h3>
          <p className="text-2xl font-bold text-blue-600">15</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-blue-400">
          <Award className="w-8 h-8 text-purple-700 mb-2" />
          <h3 className="font-semibold text-white">Badges Earned</h3>
          <p className="text-2xl font-bold text-purple-700">8</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-4xl font-semibold mb-4 text-blue-400 font-serif">Employee Leaderboard</h2>
        <div className="space-y-4">
          {leaderboard.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-400">#{user.id}</span>
                <div>
                  <h3 className="font-semibold text-white">{user.name}</h3>
                  <span className="text-sm text-gray-400">{user.badge}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="font-bold text-green-400">{user.points}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Section */}
      <div className="text-5xl font-extrabold bg-gradient-to-r from-indigo-800 via-purple-700 to-purple-500 text-transparent bg-clip-text font-serif">
        <h1>Analytics</h1>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-4">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'emissions' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('emissions')}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>CO2 Emissions</span>
          </div>
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'credits' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('credits')}
        >
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            <span>Carbon Credits</span>
          </div>
        </button>
      </div>
      
      {/* CO2 Emissions Chart */}
      {activeTab === 'emissions' && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-400">CO2 Emission Distribution</h2>
            <div className="flex items-center gap-2 text-green-400">
              <Leaf className="w-5 h-5" />
              <span className="font-medium">Total Carbon Credits: 197</span>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="co2Emission" fill="#60A5FA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {/* Carbon Credits Chart */}
      {activeTab === 'credits' && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-green-400">Carbon Credits Earned</h2>
            <div className="flex items-center gap-2 text-yellow-400">
              <Coins className="w-5 h-5" />
              <span className="font-medium">Total Value: $5,325</span>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyCarbonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CreditTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="carbonCredits" stroke="#34D399" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-gray-300 font-medium">YTD Credits</h3>
              <p className="text-2xl font-bold text-green-400">1,775</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-gray-300 font-medium">Market Value</h3>
              <p className="text-2xl font-bold text-yellow-400">$5,325</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-gray-300 font-medium">CO2 Offset</h3>
              <p className="text-2xl font-bold text-blue-400">5.32 tons</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}