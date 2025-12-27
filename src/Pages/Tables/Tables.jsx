import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { Modal, Button, Form, Spinner } from 'react-bootstrap'
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { toast } from 'react-toastify'
import './Tables.css'

const Tables = () => {
  // Modal states
  const [showFloorModal, setShowFloorModal] = useState(false)
  const [showTableModal, setShowTableModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Edit mode states
  const [editMode, setEditMode] = useState(false)
  const [editingFloorId, setEditingFloorId] = useState(null)
  const [editingTableId, setEditingTableId] = useState(null)
  
  // Delete confirmation states
  const [deleteType, setDeleteType] = useState('') // 'floor' or 'table'
  const [deleteId, setDeleteId] = useState(null)
  const [deleteName, setDeleteName] = useState('')
  
  // Loading states
  const [isLoadingFloor, setIsLoadingFloor] = useState(false)
  const [isLoadingTable, setIsLoadingTable] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  
  // Floor form states
  const [floorId, setFloorId] = useState('')
  const [floorName, setFloorName] = useState('')
  
  // Table form states
  const [selectedFloor, setSelectedFloor] = useState('')
  const [tableId, setTableId] = useState('')
  const [numberOfSeats, setNumberOfSeats] = useState('')
  
  // Floors and tables data from Firebase
  const [floors, setFloors] = useState([])
  const [firebaseTables, setFirebaseTables] = useState([])
  
  // Load floors and tables from Firebase
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    setIsLoadingData(true)
    await loadFloors()
    await loadTables()
    setIsLoadingData(false)
  }
  
  const loadFloors = async () => {
    try {
      const floorsQuery = query(collection(db, 'floors'), orderBy('floorId'))
      const querySnapshot = await getDocs(floorsQuery)
      const floorsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setFloors(floorsData)
    } catch (error) {
      console.error('Error loading floors:', error)
    }
  }
  
  const loadTables = async () => {
    try {
      const tablesQuery = query(collection(db, 'tables'), orderBy('tableId'))
      const querySnapshot = await getDocs(tablesQuery)
      const tablesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setFirebaseTables(tablesData)
    } catch (error) {
      console.error('Error loading tables:', error)
    }
  }
  
  // Handle Add/Edit Floor
  const handleAddFloor = async () => {
    if (!floorId || !floorName) {
      toast.error('Please fill in all fields')
      return
    }
    
    setIsLoadingFloor(true)
    try {
      if (editMode && editingFloorId) {
        // Update existing floor
        await updateDoc(doc(db, 'floors', editingFloorId), {
          floorId: floorId,
          floorName: floorName,
          updatedAt: new Date().toISOString()
        })
        toast.success('Floor updated successfully!')
      } else {
        // Add new floor
        await addDoc(collection(db, 'floors'), {
          floorId: floorId,
          floorName: floorName,
          createdAt: new Date().toISOString()
        })
        toast.success('Floor added successfully!')
      }
      
      closeFloorModal()
      await loadFloors()
    } catch (error) {
      console.error('Error saving floor:', error)
      toast.error('Error saving floor: ' + error.message)
    } finally {
      setIsLoadingFloor(false)
    }
  }
  
  // Handle Add/Edit Table
  const handleAddTable = async () => {
    if (!selectedFloor || !tableId || !numberOfSeats) {
      toast.error('Please fill in all fields')
      return
    }
    
    setIsLoadingTable(true)
    try {
      if (editMode && editingTableId) {
        // Update existing table
        await updateDoc(doc(db, 'tables', editingTableId), {
          floorId: selectedFloor,
          tableId: tableId,
          numberOfSeats: parseInt(numberOfSeats),
          updatedAt: new Date().toISOString()
        })
        toast.success('Table updated successfully!')
      } else {
        // Add new table
        await addDoc(collection(db, 'tables'), {
          floorId: selectedFloor,
          tableId: tableId,
          numberOfSeats: parseInt(numberOfSeats),
          status: 'available',
          createdAt: new Date().toISOString()
        })
        toast.success('Table added successfully!')
      }
      
      closeTableModal()
      await loadTables()
    } catch (error) {
      console.error('Error saving table:', error)
      toast.error('Error saving table: ' + error.message)
    } finally {
      setIsLoadingTable(false)
    }
  }
  
  // Open Edit Floor Modal
  const handleEditFloor = (floor) => {
    setEditMode(true)
    setEditingFloorId(floor.id)
    setFloorId(floor.floorId)
    setFloorName(floor.floorName)
    setShowFloorModal(true)
  }
  
  // Open Edit Table Modal
  const handleEditTable = (table) => {
    setEditMode(true)
    setEditingTableId(table.id)
    setSelectedFloor(table.floorId)
    setTableId(table.tableId)
    setNumberOfSeats(table.numberOfSeats.toString())
    setShowTableModal(true)
  }
  
  // Open Delete Confirmation
  const handleDeleteConfirmation = (type, id, name) => {
    setDeleteType(type)
    setDeleteId(id)
    setDeleteName(name)
    setShowDeleteModal(true)
  }
  
  // Handle Delete
  const handleDelete = async () => {
    try {
      if (deleteType === 'floor') {
        // Check if floor has tables
        const tablesInFloor = firebaseTables.filter(t => t.floorId === floors.find(f => f.id === deleteId)?.floorId)
        if (tablesInFloor.length > 0) {
          toast.error(`Cannot delete floor. It has ${tablesInFloor.length} table(s) assigned.`)
          setShowDeleteModal(false)
          return
        }
        
        await deleteDoc(doc(db, 'floors', deleteId))
        toast.success('Floor deleted successfully!')
        await loadFloors()
      } else if (deleteType === 'table') {
        await deleteDoc(doc(db, 'tables', deleteId))
        toast.success('Table deleted successfully!')
        await loadTables()
      }
      
      setShowDeleteModal(false)
      setDeleteType('')
      setDeleteId(null)
      setDeleteName('')
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error('Error deleting: ' + error.message)
    }
  }
  
  // Close modals and reset
  const closeFloorModal = () => {
    setShowFloorModal(false)
    setEditMode(false)
    setEditingFloorId(null)
    setFloorId('')
    setFloorName('')
  }
  
  const closeTableModal = () => {
    setShowTableModal(false)
    setEditMode(false)
    setEditingTableId(null)
    setSelectedFloor('')
    setTableId('')
    setNumberOfSeats('')
  }
  
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
        <div className="header-actions">
          <button className="secondary-btn" onClick={() => setShowFloorModal(true)}>
            <Plus size={20} />
            Add Floor
          </button>
          <button className="primary-btn" onClick={() => setShowTableModal(true)}>
            <Plus size={20} />
            Add Table
          </button>
        </div>
      </div>
      
      {/* Floors List Section */}
      {isLoadingData ? (
        <div className="loading-container">
          <Spinner animation="border" variant="danger" />
          <p>Loading data...</p>
        </div>
      ) : (
        <>
          {floors.length > 0 && (
            <div className="floors-section">
              <h2 className="section-title">Floors</h2>
              <div className="floors-grid">
                {floors.map((floor) => (
                  <div key={floor.id} className="floor-card">
                    <div className="floor-header">
                      <div className="floor-badge">{floor.floorId}</div>
                      <div className="floor-actions">
                        <button className="icon-btn" onClick={() => handleEditFloor(floor)}>
                          <Edit size={16} />
                        </button>
                        <button className="icon-btn" onClick={() => handleDeleteConfirmation('floor', floor.id, floor.floorName)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h3 className="floor-name">{floor.floorName}</h3>
                    <p className="floor-info">
                      {firebaseTables.filter(t => t.floorId === floor.floorId).length} tables
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Tables List Section */}
          {firebaseTables.length > 0 && (
            <div className="firebase-tables-section">
              <h2 className="section-title">Tables</h2>
              <div className="tables-grid">
                {firebaseTables.map((table) => (
                  <div key={table.id} className="table-card">
                    <div className="table-card-header">
                      <div className="table-number">{table.tableId}</div>
                      <div className="table-actions">
                        <button className="icon-btn" onClick={() => handleEditTable(table)}>
                          <Edit size={16} />
                        </button>
                        <button className="icon-btn" onClick={() => handleDeleteConfirmation('table', table.id, table.tableId)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="table-visual">
                      <div 
                        className="table-circle" 
                        style={{ borderColor: getStatusColor(table.status) }}
                      >
                        <span>{table.numberOfSeats}</span>
                        <small>seats</small>
                      </div>
                    </div>
                    
                    <div className="table-info">
                      <div className="info-row">
                        <span className="info-label">Floor:</span>
                        <span className="info-value">{table.floorId}</span>
                      </div>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Add/Edit Floor Modal */}
      <Modal 
        show={showFloorModal} 
        onHide={closeFloorModal} 
        centered
        backdropClassName="custom-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Floor' : 'Add New Floor'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Floor ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter floor ID (e.g., F-01)"
                value={floorId}
                onChange={(e) => setFloorId(e.target.value)}
                disabled={isLoadingFloor}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Floor Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter floor name (e.g., Ground Floor)"
                value={floorName}
                onChange={(e) => setFloorName(e.target.value)}
                disabled={isLoadingFloor}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={closeFloorModal}
            disabled={isLoadingFloor}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleAddFloor}
            disabled={isLoadingFloor}
          >
            {isLoadingFloor ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                {editMode ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              editMode ? 'Update Floor' : 'Save Floor'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Add/Edit Table Modal */}
      <Modal 
        show={showTableModal} 
        onHide={closeTableModal} 
        centered
        backdropClassName="custom-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Table' : 'Add New Table'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Floor</Form.Label>
              <Form.Select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                disabled={isLoadingTable}
              >
                <option value="">Choose a floor...</option>
                {floors.map((floor) => (
                  <option key={floor.id} value={floor.floorId}>
                    {floor.floorName} ({floor.floorId})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Table ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter table ID (e.g., T-01)"
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                disabled={isLoadingTable}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Number of Seats</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of seats"
                value={numberOfSeats}
                onChange={(e) => setNumberOfSeats(e.target.value)}
                min="1"
                disabled={isLoadingTable}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={closeTableModal}
            disabled={isLoadingTable}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleAddTable}
            disabled={isLoadingTable}
          >
            {isLoadingTable ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                {editMode ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              editMode ? 'Update Table' : 'Save Table'
            )}
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
          <p>Are you sure you want to delete <strong>{deleteName}</strong>?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Tables
