import React, { useState } from 'react'
import { Plus, Search, Receipt, Printer, Download } from 'lucide-react'
import './Billing.css'

const Billing = () => {
  const [bills] = useState([
    { id: '#B-001', table: 'T-05', date: '2025-12-27', time: '12:30 PM', items: 3, amount: 45.50, status: 'Paid', method: 'Card' },
    { id: '#B-002', table: 'T-12', date: '2025-12-27', time: '01:15 PM', items: 5, amount: 78.20, status: 'Paid', method: 'Cash' },
    { id: '#B-003', table: 'T-08', date: '2025-12-27', time: '01:45 PM', items: 2, amount: 32.00, status: 'Pending', method: '-' },
    { id: '#B-004', table: 'T-03', date: '2025-12-27', time: '02:00 PM', items: 4, amount: 56.75, status: 'Paid', method: 'Card' },
    { id: '#B-005', table: 'T-15', date: '2025-12-27', time: '02:30 PM', items: 6, amount: 92.40, status: 'Pending', method: '-' },
    { id: '#B-006', table: 'T-07', date: '2025-12-26', time: '11:20 AM', items: 3, amount: 41.50, status: 'Paid', method: 'Card' },
    { id: '#B-007', table: 'T-02', date: '2025-12-26', time: '12:00 PM', items: 2, amount: 28.00, status: 'Paid', method: 'Cash' },
  ])
  
  const totalRevenue = bills.reduce((sum, bill) => bill.status === 'Paid' ? sum + bill.amount : sum, 0)
  const pendingAmount = bills.reduce((sum, bill) => bill.status === 'Pending' ? sum + bill.amount : sum, 0)
  
  return (
    <div className="billing-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Billing & Invoices</h1>
          <p className="page-subtitle">Manage bills and payment records</p>
        </div>
        <button className="primary-btn">
          <Plus size={20} />
          New Bill
        </button>
      </div>
      
      <div className="billing-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#2ecc7115', color: '#2ecc71' }}>
            <Receipt size={24} />
          </div>
          <div className="stat-info">
            <h3>₹{totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f39c1215', color: '#f39c12' }}>
            <Receipt size={24} />
          </div>
          <div className="stat-info">
            <h3>₹{pendingAmount.toFixed(2)}</h3>
            <p>Pending Amount</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#3498db15', color: '#3498db' }}>
            <Receipt size={24} />
          </div>
          <div className="stat-info">
            <h3>{bills.length}</h3>
            <p>Total Bills</p>
          </div>
        </div>
      </div>
      
      <div className="billing-controls">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search bills..." />
        </div>
        
        <div className="filter-buttons">
          <button className="filter-btn active">All Bills</button>
          <button className="filter-btn">Paid</button>
          <button className="filter-btn">Pending</button>
        </div>
      </div>
      
      <div className="billing-table">
        <table>
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Table</th>
              <th>Date</th>
              <th>Time</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td className="bill-id">{bill.id}</td>
                <td>{bill.table}</td>
                <td>{bill.date}</td>
                <td className="time">{bill.time}</td>
                <td>{bill.items}</td>
                <td className="amount">₹{bill.amount.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${bill.status.toLowerCase()}`}>
                    {bill.status}
                  </span>
                </td>
                <td>{bill.method}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn" title="Print">
                      <Printer size={16} />
                    </button>
                    <button className="icon-btn" title="Download">
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Billing
