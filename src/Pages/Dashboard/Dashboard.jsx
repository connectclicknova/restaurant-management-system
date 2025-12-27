import React from 'react'
import { TrendingUp, TrendingDown, Users, DollarSign, Receipt, UtensilsCrossed } from 'lucide-react'
import './Dashboard.css'

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '₹12,450',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: '#ec2b25'
    },
    {
      title: 'Orders Today',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: Receipt,
      color: '#2ecc71'
    },
    {
      title: 'Active Tables',
      value: '12/25',
      change: '-2.4%',
      trend: 'down',
      icon: UtensilsCrossed,
      color: '#3498db'
    },
    {
      title: 'Staff Online',
      value: '18/24',
      change: '+5.1%',
      trend: 'up',
      icon: Users,
      color: '#f39c12'
    }
  ]
  
  const recentOrders = [
    { id: '#001', table: 'Table 5', items: 3, amount: '₹45.50', status: 'Preparing', time: '5 min ago' },
    { id: '#002', table: 'Table 12', items: 5, amount: '₹78.20', status: 'Served', time: '12 min ago' },
    { id: '#003', table: 'Table 8', items: 2, amount: '₹32.00', status: 'Completed', time: '18 min ago' },
    { id: '#004', table: 'Table 3', items: 4, amount: '₹56.75', status: 'Preparing', time: '22 min ago' },
    { id: '#005', table: 'Table 15', items: 6, amount: '₹92.40', status: 'Served', time: '28 min ago' }
  ]
  
  const popularItems = [
    { name: 'Margherita Pizza', orders: 45, revenue: '₹450' },
    { name: 'Caesar Salad', orders: 38, revenue: '₹304' },
    { name: 'Grilled Chicken', orders: 35, revenue: '₹525' },
    { name: 'Pasta Carbonara', orders: 32, revenue: '₹384' },
    { name: 'Chocolate Cake', orders: 28, revenue: '₹196' }
  ]
  
  return (
    <div className="dashboard">
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div className={`stat-change ${stat.trend}`}>
                {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {stat.change}
              </div>
            </div>
            <div className="stat-body">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card recent-orders">
          <div className="card-header">
            <h2>Recent Orders</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Table</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td>{order.table}</td>
                    <td>{order.items}</td>
                    <td className="amount">{order.amount}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="time">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="dashboard-card popular-items">
          <div className="card-header">
            <h2>Popular Items</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="popular-list">
            {popularItems.map((item, idx) => (
              <div key={idx} className="popular-item">
                <div className="item-rank">{idx + 1}</div>
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>{item.orders} orders</p>
                </div>
                <div className="item-revenue">{item.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
