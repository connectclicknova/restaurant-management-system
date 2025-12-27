import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Users, 
  DollarSign, 
  Receipt, 
  Wallet,
  Table2,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react'
import './Sidebar.css'

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation()
  
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/billing', icon: Receipt, label: 'Billing' },
    { path: '/menu', icon: UtensilsCrossed, label: 'Menu' },
    { path: '/tables', icon: Table2, label: 'Tables' },
    { path: '/investment', icon: Wallet, label: 'Investment' },
    { path: '/payroll', icon: DollarSign, label: 'Payroll' },
    { path: '/staff', icon: Users, label: 'Staff' }
  ]
  
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">R</div>
          <span className="logo-text">RestaurantPro</span>
        </div>
        <button 
          className="toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list p-0">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon className="nav-icon" size={20} />
              <span className="nav-text">{item.label}</span>
            </Link>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button className="sidebar-footer-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar