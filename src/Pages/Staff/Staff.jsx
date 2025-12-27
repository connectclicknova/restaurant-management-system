import React, { useState } from 'react'
import { Plus, Search, Mail, Phone, Edit, Trash2, UserCheck } from 'lucide-react'
import './Staff.css'

const Staff = () => {
  const [staff] = useState([
    { id: 1, name: 'John Doe', role: 'Waiter', phone: '+1 234-567-8901', email: 'john@restaurant.com', status: 'Active', shift: 'Morning' },
    { id: 2, name: 'Jane Smith', role: 'Chef', phone: '+1 234-567-8902', email: 'jane@restaurant.com', status: 'Active', shift: 'Morning' },
    { id: 3, name: 'Mike Johnson', role: 'Waiter', phone: '+1 234-567-8903', email: 'mike@restaurant.com', status: 'Active', shift: 'Evening' },
    { id: 4, name: 'Sarah Williams', role: 'Manager', phone: '+1 234-567-8904', email: 'sarah@restaurant.com', status: 'Active', shift: 'Full Day' },
    { id: 5, name: 'David Brown', role: 'Bartender', phone: '+1 234-567-8905', email: 'david@restaurant.com', status: 'On Leave', shift: 'Evening' },
    { id: 6, name: 'Emily Davis', role: 'Waiter', phone: '+1 234-567-8906', email: 'emily@restaurant.com', status: 'Active', shift: 'Morning' },
  ])
  
  const roles = ['All', 'Waiter', 'Chef', 'Manager', 'Bartender']
  
  return (
    <div className="staff-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Staff Management</h1>
          <p className="page-subtitle">Manage restaurant staff and employees</p>
        </div>
        <button className="primary-btn">
          <Plus size={20} />
          Add Staff Member
        </button>
      </div>
      
      <div className="staff-stats">
        <div className="stat-box">
          <div className="stat-icon" style={{ backgroundColor: '#2ecc7115', color: '#2ecc71' }}>
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <h3>{staff.filter(s => s.status === 'Active').length}</h3>
            <p>Active Staff</p>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon" style={{ backgroundColor: '#f39c1215', color: '#f39c12' }}>
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <h3>{staff.filter(s => s.status === 'On Leave').length}</h3>
            <p>On Leave</p>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon" style={{ backgroundColor: '#3498db15', color: '#3498db' }}>
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <h3>{staff.length}</h3>
            <p>Total Staff</p>
          </div>
        </div>
      </div>
      
      <div className="staff-controls">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search staff..." />
        </div>
        
        <div className="filter-buttons">
          {roles.map((role, idx) => (
            <button key={idx} className={`filter-btn ${idx === 0 ? 'active' : ''}`}>
              {role}
            </button>
          ))}
        </div>
      </div>
      
      <div className="staff-grid">
        {staff.map((member) => (
          <div key={member.id} className="staff-card">
            <div className="staff-card-header">
              <div className="staff-avatar">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="staff-actions">
                <button className="icon-btn">
                  <Edit size={16} />
                </button>
                <button className="icon-btn">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="staff-info">
              <h3 className="staff-name">{member.name}</h3>
              <p className="staff-role">{member.role}</p>
              
              <div className="staff-details">
                <div className="detail-row">
                  <Phone size={14} />
                  <span>{member.phone}</span>
                </div>
                <div className="detail-row">
                  <Mail size={14} />
                  <span>{member.email}</span>
                </div>
              </div>
              
              <div className="staff-footer">
                <span className="shift-badge">{member.shift}</span>
                <span className={`status-badge ${member.status === 'Active' ? 'active' : 'leave'}`}>
                  {member.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Staff
