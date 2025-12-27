import React from 'react'
import { Search, Bell, Settings, User } from 'lucide-react'
import './Header.css'

const Header = ({ sidebarCollapsed, pageTitle = "Dashboard" }) => {
  return (
    <header className={`header ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-left">
        <h1 className="header-title">{pageTitle}</h1>
        <div className="search-bar">
          <Search size={18} color="#666" />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      
      <div className="header-right">
        <button className="header-icon-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <button className="header-icon-btn">
          <Settings size={20} />
        </button>
        
        <div className="user-profile">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Manager</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header