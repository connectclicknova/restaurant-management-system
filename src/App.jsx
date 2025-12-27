import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Header from './Components/Header/Header'
import Sidebar from './Components/Sidebar/Sidebar'
import Dashboard from './Pages/Dashboard/Dashboard'
import Tables from './Pages/Tables/Tables'
import Menu from './Pages/Menu/Menu'
import Billing from './Pages/Billing/Billing'
import Staff from './Pages/Staff/Staff'
import Payroll from './Pages/Payroll/Payroll'
import Investment from './Pages/Investment/Investment'
import './App.css'

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  return (
    <Router>
      <div className="app-container">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        
        <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Header sidebarCollapsed={sidebarCollapsed} />
          
          <main className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tables" element={<Tables />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/investment" element={<Investment />} />
            </Routes>
          </main>
        </div>
        
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  )
}

export default App