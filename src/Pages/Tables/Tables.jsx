import React, { useState } from 'react'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import './Tables.css'

const Tables = () => {
  const [tables] = useState([
    { id: 1, number: 'T-01', capacity: 4, status: 'occupied', waiter: 'John Doe', order: '#125' },
    { id: 2, number: 'T-02', capacity: 2, status: 'available', waiter: '-', order: '-' },
    { id: 3, number: 'T-03', capacity: 6, status: 'reserved', waiter: 'Jane Smith', order: '#126' },
    { id: 4, number: 'T-04', capacity: 4, status: 'occupied', waiter: 'Mike Johnson', order: '#127' },
    { id: 5, number: 'T-05', capacity: 2, status: 'available', waiter: '-', order: '-' },
    { id: 6, number: 'T-06', capacity: 8, status: 'occupied', waiter: 'Sarah Williams', order: '#128' },
    { id: 7, number: 'T-07', capacity: 4, status: 'cleaning', waiter: '-', order: '-' },
    { id: 8, number: 'T-08', capacity: 2, status: 'available', waiter: '-', order: '-' },
  ])
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'occupied': return '#ec2b25'
      case 'available': return '#2ecc71'
      case 'reserved': return '#f39c12'
      case 'cleaning': return '#95a5a6'
      default: return '#666'
    }
  }
  
  return (
    <div className="tables-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Table Management</h1>
          <p className="page-subtitle">Manage restaurant tables and seating</p>
        </div>
        <button className="primary-btn">
          <Plus size={20} />
          Add New Table
        </button>
      </div>
      
      <div className="tables-controls">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search tables..." />
        </div>
        
        <div className="filter-buttons">
          <button className="filter-btn active">All Tables</button>
          <button className="filter-btn">Available</button>
          <button className="filter-btn">Occupied</button>
          <button className="filter-btn">Reserved</button>
        </div>
      </div>
      
      <div className="tables-grid">
        {tables.map((table) => (
          <div key={table.id} className="table-card">
            <div className="table-card-header">
              <div className="table-number">{table.number}</div>
              <div className="table-actions">
                <button className="icon-btn">
                  <Edit size={16} />
                </button>
                <button className="icon-btn">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="table-visual">
              <div 
                className="table-circle" 
                style={{ borderColor: getStatusColor(table.status) }}
              >
                <span>{table.capacity}</span>
                <small>seats</small>
              </div>
            </div>
            
            <div className="table-info">
              <div className="info-row">
                <span className="info-label">Status:</span>
                <span 
                  className="status-badge" 
                  style={{ 
                    backgroundColor: `${getStatusColor(table.status)}15`,
                    color: getStatusColor(table.status)
                  }}
                >
                  {table.status}
                </span>
              </div>
              
              {table.waiter !== '-' && (
                <>
                  <div className="info-row">
                    <span className="info-label">Waiter:</span>
                    <span className="info-value">{table.waiter}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Order:</span>
                    <span className="info-value order-link">{table.order}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tables
