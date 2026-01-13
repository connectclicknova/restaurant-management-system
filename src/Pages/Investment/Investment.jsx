import React, { useState, useEffect } from 'react'
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar, Search, Filter, ChevronLeft, ChevronRight, Trash2, Edit } from 'lucide-react'
import { Modal, Button, Form, Spinner } from 'react-bootstrap'
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc, where, limit, startAfter, getCountFromServer } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { toast } from 'react-toastify'
import './Investment.css'

const Investment = () => {
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteData, setDeleteData] = useState(null)

  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Form states
  const [investmentName, setInvestmentName] = useState('')
  const [investmentCategory, setInvestmentCategory] = useState('')
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [investmentDate, setInvestmentDate] = useState(new Date().toISOString().split('T')[0])
  const [investmentStatus, setInvestmentStatus] = useState('Completed')

  // Data states
  const [investments, setInvestments] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastDoc, setLastDoc] = useState(null)
  const itemsPerPage = 42

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('Completed')
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])

  const restaurantCategories = [
    'Kitchen Equipment',
    'Groceries',
    'Interior Renovation',
    'Marketing & Ads',
    'Raw Materials',
    'Staff Training',
    'Furniture',
    'Licensing & Legal',
    'Maintenance',
    'Technology/POS',
    'Other'
  ]

  // Load data from Firebase
  useEffect(() => {
    loadInvestments()
  }, [fromDate, toDate])

  const loadInvestments = async () => {
    setIsLoadingData(true)
    try {
      let q = collection(db, 'investments')
      let constraints = []

      // Apply date filters in Firestore (this doesn't require an index with orderBy on the same field)
      if (fromDate) constraints.push(where('date', '>=', fromDate))
      if (toDate) constraints.push(where('date', '<=', toDate))
      
      constraints.push(orderBy('date', 'desc'))

      const querySnapshot = await getDocs(query(q, ...constraints))
      const investmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setInvestments(investmentsData)
      setCurrentPage(1) // Reset to first page on data reload
    } catch (error) {
      console.error('Error loading investments:', error)
      toast.error('Failed to load investments')
    } finally {
      setIsLoadingData(false)
    }
  }

  // Client-side filtering
  const filteredInvestments = investments.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'All' || inv.category === filterCategory
    const matchesStatus = filterStatus === 'All' || inv.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Client-side pagination
  const totalFilteredCount = filteredInvestments.length
  const totalPages = Math.ceil(totalFilteredCount / itemsPerPage)
  const paginatedInvestments = filteredInvestments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalInvestmentAmount = filteredInvestments.reduce((sum, inv) => sum + inv.amount, 0)

  const handleSaveInvestment = async () => {
    if (!investmentName || !investmentCategory || !investmentAmount || !investmentDate) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      const data = {
        name: investmentName,
        category: investmentCategory,
        amount: parseFloat(investmentAmount),
        date: investmentDate,
        status: investmentStatus,
        updatedAt: new Date().toISOString()
      }

      if (editMode) {
        await updateDoc(doc(db, 'investments', editingId), data)
        toast.success('Investment updated successfully')
      } else {
        data.createdAt = new Date().toISOString()
        await addDoc(collection(db, 'investments'), data)
        toast.success('Investment added successfully')
      }
      closeModal()
      loadInvestments()
    } catch (error) {
      console.error('Error saving investment:', error)
      toast.error('Error saving investment')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteDoc(doc(db, 'investments', deleteData.id))
      toast.success('Investment deleted')
      loadInvestments()
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error('Failed to delete')
    } finally {
      setIsLoading(false)
    }
  }

  const openEdit = (inv) => {
    setEditMode(true)
    setEditingId(inv.id)
    setInvestmentName(inv.name)
    setInvestmentCategory(inv.category)
    setInvestmentAmount(inv.amount.toString())
    setInvestmentDate(inv.date)
    setInvestmentStatus(inv.status)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditMode(false)
    setInvestmentName('')
    setInvestmentCategory('')
    setInvestmentAmount('')
    setInvestmentDate(new Date().toISOString().split('T')[0])
    setInvestmentStatus('Completed')
    setEditingId(null)
  }

  const confirmDelete = (inv) => {
    setDeleteData(inv)
    setShowDeleteModal(true)
  }

  return (
    <div className="investment-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Investment Tracking</h1>
          <p className="page-subtitle">Manage and track your restaurant investments</p>
        </div>
        <button className="primary-btn" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Add Investment
        </button>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <div className="filter-item">
            <label>Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {restaurantCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Planned">Planned</option>
            </select>
          </div>
          
          <div className="filter-item">
            <label>From</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          
          <div className="filter-item">
            <label>To</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="investment-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ec2b2515', color: '#ec2b25' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>₹{totalInvestmentAmount.toLocaleString()}</h3>
            <p>Filtered Total</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#2ecc7115', color: '#2ecc71' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <h3>{totalFilteredCount}</h3>
            <p>Filtered Records</p>
          </div>
        </div>
      </div>

      <div className="investment-table-section">
        {isLoadingData ? (
          <div className="loading-container">
            <Spinner animation="border" variant="danger" />
            <p>Loading investments...</p>
          </div>
        ) : (
          <>
            <div className="investment-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInvestments.map((inv) => (
                    <tr key={inv.id}>
                      <td className="date">{inv.date}</td>
                      <td className="name">{inv.name}</td>
                      <td className="category">{inv.category}</td>
                      <td className="amount">₹{inv.amount.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${inv.status.toLowerCase()}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="icon-btn" onClick={() => openEdit(inv)}>
                            <Edit size={16} />
                          </button>
                          <button className="icon-btn delete" onClick={() => confirmDelete(inv)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredInvestments.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-4">No investments found for the selected filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button 
                  className="pagination-btn" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="pagination-btn" 
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        show={showModal} 
        onHide={closeModal} 
        centered
        backdropClassName="custom-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Investment' : 'Add New Investment'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Investment Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. New Oven"
                value={investmentName}
                onChange={(e) => setInvestmentName(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={investmentCategory}
                onChange={(e) => setInvestmentCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {restaurantCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Amount (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0.00"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={investmentDate}
                    onChange={(e) => setInvestmentDate(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={investmentStatus}
                onChange={(e) => setInvestmentStatus(e.target.value)}
              >
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Planned">Planned</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="danger" onClick={handleSaveInvestment} disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : (editMode ? 'Update' : 'Save')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)} 
        centered
        backdropClassName="custom-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this investment? 
          {deleteData && <strong> {deleteData.name}</strong>}
          <p className="text-danger mt-2"><small>This action cannot be undone.</small></p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Investment
