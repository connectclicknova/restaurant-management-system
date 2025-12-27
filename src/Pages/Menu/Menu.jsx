import React, { useState } from 'react'
import { Plus, Search, Edit, Trash2, DollarSign } from 'lucide-react'
import './Menu.css'

const Menu = () => {
  const [menuItems] = useState([
    { id: 1, name: 'Margherita Pizza', category: 'Main Course', price: 12.99, stock: 'In Stock', image: '🍕' },
    { id: 2, name: 'Caesar Salad', category: 'Appetizer', price: 8.99, stock: 'In Stock', image: '🥗' },
    { id: 3, name: 'Grilled Chicken', category: 'Main Course', price: 15.99, stock: 'In Stock', image: '🍗' },
    { id: 4, name: 'Pasta Carbonara', category: 'Main Course', price: 13.50, stock: 'Low Stock', image: '🍝' },
    { id: 5, name: 'Chocolate Cake', category: 'Dessert', price: 6.99, stock: 'In Stock', image: '🍰' },
    { id: 6, name: 'Lemonade', category: 'Beverage', price: 3.99, stock: 'In Stock', image: '🍋' },
    { id: 7, name: 'Beef Burger', category: 'Main Course', price: 11.99, stock: 'In Stock', image: '🍔' },
    { id: 8, name: 'Greek Salad', category: 'Appetizer', price: 9.50, stock: 'Out of Stock', image: '🥙' },
  ])
  
  const categories = ['All', 'Appetizer', 'Main Course', 'Dessert', 'Beverage']
  
  return (
    <div className="menu-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Menu Management</h1>
          <p className="page-subtitle">Manage your restaurant menu items</p>
        </div>
        <button className="primary-btn">
          <Plus size={20} />
          Add Menu Item
        </button>
      </div>
      
      <div className="menu-controls">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search menu items..." />
        </div>
        
        <div className="filter-buttons">
          {categories.map((cat, idx) => (
            <button key={idx} className={`filter-btn ${idx === 0 ? 'active' : ''}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <div className="menu-grid">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-card">
            <div className="menu-card-header">
              <div className="menu-icon">{item.image}</div>
              <div className="menu-actions">
                <button className="icon-btn">
                  <Edit size={16} />
                </button>
                <button className="icon-btn">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="menu-body">
              <h3 className="menu-name">{item.name}</h3>
              <p className="menu-category">{item.category}</p>
              
              <div className="menu-footer">
                <div className="menu-price">
                  ₹{item.price}
                </div>
                <span 
                  className={`stock-badge ${item.stock === 'Out of Stock' ? 'out' : item.stock === 'Low Stock' ? 'low' : ''}`}
                >
                  {item.stock}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu