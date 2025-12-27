import React, { useState } from 'react'
import { Plus, Search, Download, DollarSign, Calendar } from 'lucide-react'
import './Payroll.css'

const Payroll = () => {
  const [payrolls] = useState([
    { id: 1, name: 'John Doe', role: 'Waiter', salary: 2500, bonus: 150, deductions: 50, total: 2600, status: 'Paid', date: '2025-12-01' },
    { id: 2, name: 'Jane Smith', role: 'Chef', salary: 3500, bonus: 300, deductions: 100, total: 3700, status: 'Paid', date: '2025-12-01' },
    { id: 3, name: 'Mike Johnson', role: 'Waiter', salary: 2500, bonus: 100, deductions: 50, total: 2550, status: 'Pending', date: '2025-12-01' },
    { id: 4, name: 'Sarah Williams', role: 'Manager', salary: 4500, bonus: 500, deductions: 150, total: 4850, status: 'Paid', date: '2025-12-01' },
    { id: 5, name: 'David Brown', role: 'Bartender', salary: 2800, bonus: 200, deductions: 80, total: 2920, status: 'Pending', date: '2025-12-01' },
  ])
  
  const totalPaid = payrolls.reduce((sum, p) => p.status === 'Paid' ? sum + p.total : sum, 0)
  const totalPending = payrolls.reduce((sum, p) => p.status === 'Pending' ? sum + p.total : sum, 0)
  
  return (
    <div className="payroll-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Payroll Management</h1>
          <p className="page-subtitle">Manage staff salaries and payments</p>
        </div>
        <div className="header-actions">
          <button className="secondary-btn">
            <Download size={20} />
            Export
          </button>
          <button className="primary-btn">
            <Plus size={20} />
            New Payroll
          </button>
        </div>
      </div>
      
      <div className="payroll-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#2ecc7115', color: '#2ecc71' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>₹{totalPaid.toFixed(2)}</h3>
            <p>Total Paid</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f39c1215', color: '#f39c12' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>₹{totalPending.toFixed(2)}</h3>
            <p>Pending Payment</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#3498db15', color: '#3498db' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <h3>December 2025</h3>
            <p>Current Period</p>
          </div>
        </div>
      </div>
      
      <div className="payroll-controls">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search payroll records..." />
        </div>
        
        <div className="filter-buttons">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">Paid</button>
          <button className="filter-btn">Pending</button>
        </div>
      </div>
      
      <div className="payroll-table">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Base Salary</th>
              <th>Bonus</th>
              <th>Deductions</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((payroll) => (
              <tr key={payroll.id}>
                <td className="employee-name">{payroll.name}</td>
                <td>{payroll.role}</td>
                <td>₹{payroll.salary.toFixed(2)}</td>
                <td className="bonus">₹{payroll.bonus.toFixed(2)}</td>
                <td className="deduction">-₹{payroll.deductions.toFixed(2)}</td>
                <td className="total-amount">₹{payroll.total.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${payroll.status.toLowerCase()}`}>
                    {payroll.status}
                  </span>
                </td>
                <td className="date">{payroll.date}</td>
                <td>
                  <button className="action-btn">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Payroll
