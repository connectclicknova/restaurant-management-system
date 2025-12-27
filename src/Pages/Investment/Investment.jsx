import React, { useState } from 'react'
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import './Investment.css'

const Investment = () => {
  const [investments] = useState([
    { id: 1, category: 'Kitchen Equipment', amount: 15000, date: '2025-12-01', status: 'Completed', roi: '+12%' },
    { id: 2, category: 'Interior Renovation', amount: 25000, date: '2025-11-15', status: 'Completed', roi: '+8%' },
    { id: 3, category: 'Marketing Campaign', amount: 5000, date: '2025-12-10', status: 'Ongoing', roi: 'N/A' },
    { id: 4, category: 'Staff Training', amount: 3000, date: '2025-12-05', status: 'Completed', roi: '+15%' },
    { id: 5, category: 'New Furniture', amount: 8000, date: '2025-11-20', status: 'Completed', roi: '+10%' },
  ])
  
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const completedInvestments = investments.filter(inv => inv.status === 'Completed').length
  
  const categories = [
    { name: 'Kitchen Equipment', amount: 15000, percentage: 28 },
    { name: 'Interior Renovation', amount: 25000, percentage: 45 },
    { name: 'Marketing', amount: 5000, percentage: 9 },
    { name: 'Training', amount: 3000, percentage: 5 },
    { name: 'Furniture', amount: 8000, percentage: 13 },
  ]
  
  return (
    <div className="investment-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Investment Tracking</h1>
          <p className="page-subtitle">Track business investments and returns</p>
        </div>
        <button className="primary-btn">
          <Plus size={20} />
          Add Investment
        </button>
      </div>
      
      <div className="investment-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ec2b2515', color: '#ec2b25' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>₹{totalInvestment.toLocaleString()}</h3>
            <p>Total Investment</p>
          </div>
          <div className="stat-trend up">
            <TrendingUp size={16} />
            +18.5%
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#2ecc7115', color: '#2ecc71' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <h3>{completedInvestments}</h3>
            <p>Completed Projects</p>
          </div>
          <div className="stat-trend up">
            <TrendingUp size={16} />
            +5.2%
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#3498db15', color: '#3498db' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>11.25%</h3>
            <p>Average ROI</p>
          </div>
          <div className="stat-trend up">
            <TrendingUp size={16} />
            +2.1%
          </div>
        </div>
      </div>
      
      <div className="investment-content">
        <div className="investment-table-section">
          <div className="section-header">
            <h2>Recent Investments</h2>
          </div>
          
          <div className="investment-table">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>ROI</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((investment) => (
                  <tr key={investment.id}>
                    <td className="category">{investment.category}</td>
                    <td className="amount">₹{investment.amount.toLocaleString()}</td>
                    <td className="date">{investment.date}</td>
                    <td>
                      <span className={`status-badge ${investment.status.toLowerCase()}`}>
                        {investment.status}
                      </span>
                    </td>
                    <td className={`roi ${investment.roi.includes('+') ? 'positive' : ''}`}>
                      {investment.roi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="investment-breakdown">
          <div className="section-header">
            <h2>Investment Breakdown</h2>
          </div>
          
          <div className="breakdown-list">
            {categories.map((cat, idx) => (
              <div key={idx} className="breakdown-item">
                <div className="breakdown-info">
                  <span className="breakdown-name">{cat.name}</span>
                  <span className="breakdown-amount">₹{cat.amount.toLocaleString()}</span>
                </div>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill" 
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
                <span className="breakdown-percentage">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Investment
