import React, { useState } from 'react';

const HotelDashboard = () => {
  // Sample data - replace with your actual data
  const [dateRange, setDateRange] = useState('17 Apr 2025 - 21 May 2025');
  const stats = [
    { id: 1, title: 'Total Bookings', value: 75, change: '+5% (30 days)', icon: '📋', color: 'bg-green-100' },
    { id: 2, title: 'Total Check-ins', value: 357, change: '+3.5% (30 days)', icon: '🔑', color: 'bg-green-100' },
    { id: 3, title: 'Total Cancelled', value: 65, change: '-2% (30 days)', icon: '❌', color: 'bg-red-100' },
    { id: 4, title: 'Total Revenue', value: '$128', change: '+15% (30 days)', icon: '💰', color: 'bg-green-100' },
  ];

  const reviews = [
    {
      id: 1, 
      name: 'John Smith',
      days: '2 days ago',
      text: 'Amazing food and excellent service. I particularly enjoyed the chef\'s special.',
      rating: 4.5,
      image: '/api/placeholder/100/100'
    },
    {
      id: 2, 
      name: 'Sofia Garcia',
      days: '3 days ago',
      text: 'The dining experience was superb. Beautiful presentation and delicious flavors.',
      rating: 4.0,
      image: '/api/placeholder/100/100'
    },
    {
      id: 3, 
      name: 'Andrew Chen',
      days: '2 days ago',
      text: 'Great atmosphere and exceptional menu. Will definitely come back.',
      rating: 4.5,
      image: '/api/placeholder/100/100'
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Plate2Share</h1>
          <p className="text-sm text-gray-500">Hotel Dashboard</p>
        </div>
        <nav className="mt-6">
          {[
            { name: 'Dashboard', icon: '📊', active: true },
            { name: 'Reservation List', icon: '📝' },
            { name: 'Reservation Detail', icon: '📄' },
            { name: 'Guests', icon: '👥' },
            { name: 'Analytics', icon: '📈' },
            { name: 'Reviews', icon: '⭐' },
            { name: 'Menu', icon: '🍽️' },
            { name: 'Menu Detail', icon: '🥗' },
            { name: 'Guest Detail', icon: '👤' },
            { name: 'Calendar', icon: '📅' },
            { name: 'Chat', icon: '💬' },
            { name: 'Billing', icon: '💳' },
          ].map((item) => (
            <div 
              key={item.name}
              className={`flex items-center px-6 py-3 cursor-pointer ${
                item.active ? 'border-l-4 border-blue-500 bg-blue-50' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className={`${item.active ? 'text-blue-500 font-medium' : 'text-gray-600'}`}>
                {item.name}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-500">Hi, Samantha. Welcome back to Plate2Share Admin!</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search here" 
                className="pl-4 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <span className="absolute right-3 top-2.5">🔍</span>
            </div>
            <div className="flex">
              <span className="relative p-2 bg-blue-50 rounded-full">
                🔔
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-xs text-white rounded-full flex items-center justify-center">
                  3
                </span>
              </span>
              <span className="relative p-2 bg-blue-50 rounded-full ml-2">
                💬
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-xs text-white rounded-full flex items-center justify-center">
                  5
                </span>
              </span>
              <span className="relative p-2 bg-blue-50 rounded-full ml-2">
                🛒
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-xs text-white rounded-full flex items-center justify-center">
                  2
                </span>
              </span>
              <span className="relative p-2 bg-red-50 rounded-full ml-2">
                ⚙️
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-xs text-white rounded-full flex items-center justify-center">
                  1
                </span>
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium">Hello, Samantha</span>
              <span className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                👤
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Date Filter */}
          <div className="flex justify-end mb-6">
            <div className="bg-white rounded-lg shadow p-2 flex items-center">
              <span className="text-blue-500 mr-2">📅</span>
              <span>Filter Period</span>
              <span className="mx-2 text-sm text-gray-500">{dateRange}</span>
              <span className="text-gray-400">▼</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-white rounded-lg shadow p-6 flex items-start">
                <div className={`${stat.color} p-4 rounded-full mr-4`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className={`text-xs ${stat.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Pie Charts */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Key Metrics</h3>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-1" /> Chart
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked className="mr-1" /> Show Value
                  </label>
                  <span>⋮</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#eee"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#ff5a5a"
                        strokeWidth="3"
                        strokeDasharray="81, 100"
                      />
                      <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="#444">
                        81%
                      </text>
                    </svg>
                  </div>
                  <p className="mt-2 text-sm text-center">Total Bookings</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#eee"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#4ade80"
                        strokeWidth="3"
                        strokeDasharray="22, 100"
                      />
                      <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="#444">
                        22%
                      </text>
                    </svg>
                  </div>
                  <p className="mt-2 text-sm text-center">Guest Growth</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#eee"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray="62, 100"
                      />
                      <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="#444">
                        62%
                      </text>
                    </svg>
                  </div>
                  <p className="mt-2 text-sm text-center">Total Revenue</p>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">Booking Trends</h3>
                  <p className="text-xs text-gray-500">Weekly booking patterns</p>
                </div>
                <button className="bg-blue-50 text-blue-500 px-4 py-2 rounded-lg flex items-center">
                  <span className="mr-2">💾</span> Save Report
                </button>
              </div>
              <div className="h-64 w-full">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* X-axis */}
                  <line x1="40" y1="180" x2="380" y2="180" stroke="#e5e7eb" strokeWidth="1" />
                  
                  {/* Y-axis */}
                  <line x1="40" y1="20" x2="40" y2="180" stroke="#e5e7eb" strokeWidth="1" />
                  
                  {/* X-axis labels */}
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
                    <text key={day} x={40 + i * (340/6)} y="195" textAnchor="middle" fontSize="8" fill="#6b7280">
                      {day}
                    </text>
                  ))}
                  
                  {/* Line chart */}
                  <path
                    d="M40,120 C80,100 100,140 140,90 C180,70 220,120 260,110 C300,80 340,90 380,50"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  
                  {/* Area under the line */}
                  <path
                    d="M40,120 C80,100 100,140 140,90 C180,70 220,120 260,110 C300,80 340,90 380,50 L380,180 L40,180 Z"
                    fill="rgba(59, 130, 246, 0.1)"
                  />
                  
                  {/* Dot for highlighted point */}
                  <circle cx="260" cy="110" r="5" fill="#3b82f6" />
                  
                  {/* Tooltip */}
                  <g transform="translate(260, 90)">
                    <rect x="-30" y="-20" width="60" height="20" rx="4" fill="#3b82f6" />
                    <text x="0" y="-5" textAnchor="middle" fontSize="9" fill="white">456 Bookings</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* Revenue Chart & Customer Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Total Revenue</h3>
                <div className="flex space-x-2">
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                    <span className="text-xs">2024</span>
                  </span>
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                    <span className="text-xs">2025</span>
                  </span>
                </div>
              </div>
              <div className="h-64 w-full">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Y-axis labels */}
                  {['$40k', '$30k', '$20k', '$10k', '0'].map((label, i) => (
                    <text key={label} x="35" y={30 + i * 40} textAnchor="end" fontSize="8" fill="#6b7280">
                      {label}
                    </text>
                  ))}
                  
                  {/* X-axis grid lines */}
                  {[0, 1, 2, 3, 4].map((_, i) => (
                    <line 
                      key={i} 
                      x1="40" 
                      y1={30 + i * 40} 
                      x2="380" 
                      y2={30 + i * 40} 
                      stroke="#e5e7eb" 
                      strokeWidth="1" 
                      strokeDasharray="2,2" 
                    />
                  ))}
                  
                  {/* X-axis labels */}
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                    <text key={month} x={40 + i * (340/11)} y="190" textAnchor="middle" fontSize="8" fill="#6b7280">
                      {month}
                    </text>
                  ))}
                  
                  {/* 2024 line */}
                  <path
                    d="M40,150 C60,130 80,120 100,100 C120,80 140,90 160,70 C180,50 200,60 220,80 C240,100 260,110 280,100 C300,90 320,100 340,110 C360,120 380,130 380,130"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  
                  {/* 2025 line */}
                  <path
                    d="M40,130 C60,150 80,160 100,140 C120,120 140,90 160,100 C180,110 200,120 220,100 C240,80 260,60 280,70 C300,80 320,90 340,70 C360,50 380,40 380,40"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  
                  {/* Vertical marker lines */}
                  <line x1="220" y1="30" x2="220" y2="180" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1="340" y1="30" x2="340" y2="180" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,4" />
                  
                  {/* Data points */}
                  <circle cx="220" cy="80" r="4" fill="#3b82f6" />
                  <circle cx="340" cy="70" r="4" fill="#ef4444" />
                  
                  {/* Tooltips */}
                  <g transform="translate(220, 60)">
                    <rect x="-30" y="-15" width="60" height="15" rx="2" fill="#3b82f6" />
                    <text x="0" y="-5" textAnchor="middle" fontSize="7" fill="white">$34,753.00</text>
                  </g>
                  <g transform="translate(340, 50)">
                    <rect x="-30" y="-15" width="60" height="15" rx="2" fill="#ef4444" />
                    <text x="0" y="-5" textAnchor="middle" fontSize="7" fill="white">$18,935.00</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Customer Map */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Guest Distribution</h3>
                <div className="flex items-center">
                  <select className="text-sm border rounded-lg px-2 py-1">
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                  </select>
                  <span className="ml-2">⋮</span>
                </div>
              </div>
              <div className="h-64 w-full flex items-end justify-between">
                {[60, 80, 40, 80, 60, 25, 60].map((height, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div 
                      className={`w-8 rounded-t-sm ${i % 2 === 0 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                      style={{ height: `${height}px` }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-500">Sun</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">Guest Reviews</h3>
                <p className="text-xs text-gray-500">Recent feedback from guests</p>
              </div>
              <div className="flex">
                <button className="text-gray-500 mx-1">←</button>
                <button className="text-gray-500 mx-1">→</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                    <p className="text-sm font-medium mt-2">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.days}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{review.text}</p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-400">
                          {star <= review.rating ? '★' : '☆'}
                        </span>
                      ))}
                      <span className="ml-2 text-sm font-medium">{review.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDashboard;
