import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, DollarSign, Smile } from 'lucide-react'
import { Modal, Button, Form, Spinner } from 'react-bootstrap'
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { toast } from 'react-toastify'
import './Menu.css'

const Menu = () => {
  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showItemModal, setShowItemModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  
  // Edit mode states
  const [editMode, setEditMode] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteType, setDeleteType] = useState('') // 'category' or 'item'
  const [deleteData, setDeleteData] = useState(null)
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  
  // Category form states
  const [categoryName, setCategoryName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  
  // Item form states
  const [itemShortCode, setItemShortCode] = useState('')
  const [itemName, setItemName] = useState('')
  const [itemEmoji, setItemEmoji] = useState('🍕')
  const [itemPrice, setItemPrice] = useState('')
  const [itemCategory, setItemCategory] = useState('')
  
  // Data states
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const foodEmojis = [
    '🍕', '🍔', '🍟', '🌭', '🍿', '🧂', '🥓', '🥚', '🍳', '🧇', '🥞', '🧈', '🍞', '🥐', '🥨', '🥯', '🥖', '🧀', '🥗', '🥙', '🥪', '🌮', '🌯', '🍖', '🍗', '🥩', '🥟', '🥠', '🥡', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🍵', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', '🍽️', '🥣', '🥡', '🥢'
  ]

  // Load data from Firebase
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoadingData(true)
    await Promise.all([loadCategories(), loadMenuItems()])
    setIsLoadingData(false)
  }

  const loadCategories = async () => {
    try {
      const q = query(collection(db, 'categories'), orderBy('name'))
      const querySnapshot = await getDocs(q)
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    }
  }

  const loadMenuItems = async () => {
    try {
      const q = query(collection(db, 'menuItems'), orderBy('name'))
      const querySnapshot = await getDocs(q)
      const itemsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setMenuItems(itemsData)
    } catch (error) {
      console.error('Error loading menu items:', error)
      toast.error('Failed to load menu items')
    }
  }

  // Handle Category Name change to auto-generate ID
  const handleCategoryNameChange = (name) => {
    setCategoryName(name)
    if (!editMode) {
      const generatedId = name.toLowerCase().trim().replace(/\s+/g, '-')
      setCategoryId(generatedId)
    }
  }

  // Handle Add/Edit Category
  const handleSaveCategory = async () => {
    if (!categoryName || !categoryId) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      if (editMode) {
        await updateDoc(doc(db, 'categories', editingId), {
          name: categoryName,
          updatedAt: new Date().toISOString()
        })
        toast.success('Category updated successfully')
      } else {
        // Check if ID is unique
        const q = query(collection(db, 'categories'), where('categoryId', '==', categoryId))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          toast.error('Category ID already exists')
          setIsLoading(false)
          return
        }

        await addDoc(collection(db, 'categories'), {
          categoryId,
          name: categoryName,
          createdAt: new Date().toISOString()
        })
        toast.success('Category added successfully')
      }
      closeCategoryModal()
      loadCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Error saving category')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Add/Edit Item
  const handleSaveItem = async () => {
    if (!itemShortCode || !itemName || !itemEmoji || !itemPrice || !itemCategory) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      const itemData = {
        shortCode: itemShortCode,
        name: itemName,
        emoji: itemEmoji,
        price: parseFloat(itemPrice),
        category: itemCategory,
        updatedAt: new Date().toISOString()
      }

      if (editMode) {
        await updateDoc(doc(db, 'menuItems', editingId), itemData)
        toast.success('Item updated successfully')
      } else {
        itemData.createdAt = new Date().toISOString()
        await addDoc(collection(db, 'menuItems'), itemData)
        toast.success('Item added successfully')
      }
      closeItemModal()
      loadMenuItems()
    } catch (error) {
      console.error('Error saving item:', error)
      toast.error('Error saving item')
    } finally {
      setIsLoading(false)
    }
  }

  // Delete handlers
  const confirmDelete = (type, data) => {
    setDeleteType(type)
    setDeleteData(data)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      if (deleteType === 'category') {
        // Check if category has items
        const q = query(collection(db, 'menuItems'), where('category', '==', deleteData.name))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          toast.error('Cannot delete category with existing items')
          setIsLoading(false)
          setShowDeleteModal(false)
          return
        }
        await deleteDoc(doc(db, 'categories', deleteData.id))
        toast.success('Category deleted')
        loadCategories()
      } else {
        await deleteDoc(doc(db, 'menuItems', deleteData.id))
        toast.success('Item deleted')
        loadMenuItems()
      }
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error('Failed to delete')
    } finally {
      setIsLoading(false)
    }
  }

  // Edit openers
  const openEditCategory = (cat) => {
    setEditMode(true)
    setEditingId(cat.id)
    setCategoryName(cat.name)
    setCategoryId(cat.categoryId)
    setShowCategoryModal(true)
  }

  const openEditItem = (item) => {
    setEditMode(true)
    setEditingId(item.id)
    setItemShortCode(item.shortCode)
    setItemName(item.name)
    setItemEmoji(item.emoji)
    setItemPrice(item.price.toString())
    setItemCategory(item.category)
    setShowItemModal(true)
  }

  // Modal closers
  const closeCategoryModal = () => {
    setShowCategoryModal(false)
    setEditMode(false)
    setCategoryName('')
    setCategoryId('')
    setEditingId(null)
  }

  const closeItemModal = () => {
    setShowItemModal(false)
    setEditMode(false)
    setItemShortCode('')
    setItemName('')
    setItemEmoji('🍕')
    setItemPrice('')
    setItemCategory('')
    setEditingId(null)
    setShowEmojiPicker(false)
  }

  // Filter items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="menu-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Menu Management</h1>
          <p className="page-subtitle">Manage your restaurant categories and menu items</p>
        </div>
        <div className="header-actions">
          <button className="secondary-btn" onClick={() => setShowCategoryModal(true)}>
            <Plus size={20} />
            Add Category
          </button>
          <button className="primary-btn" onClick={() => setShowItemModal(true)}>
            <Plus size={20} />
            Add Menu Item
          </button>
        </div>
      </div>
      
      {isLoadingData ? (
        <div className="loading-container">
          <Spinner animation="border" variant="danger" />
          <p>Loading menu data...</p>
        </div>
      ) : (
        <>
          {/* Categories Section */}
          <div className="section-container">
            <h2 className="section-title">Categories</h2>
            <div className="categories-grid">
              {categories.map((cat) => (
                <div key={cat.id} className="category-card">
                  <div className="category-header">
                    <span className="category-id">{cat.categoryId}</span>
                    <div className="card-actions">
                      <button className="icon-btn" onClick={() => openEditCategory(cat)}>
                        <Edit size={16} />
                      </button>
                      <button className="icon-btn delete" onClick={() => confirmDelete('category', cat)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-stats">
                    {menuItems.filter(i => i.category === cat.name).length} Items
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Items Section */}
          <div className="section-container">
            <div className="section-header-flex">
              <h2 className="section-title">Menu Items</h2>
              <div className="search-box">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name or code..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-tabs">
              <button 
                className={`filter-tab ${activeCategory === 'All' ? 'active' : ''}`}
                onClick={() => setActiveCategory('All')}
              >
                All
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  className={`filter-tab ${activeCategory === cat.name ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="menu-grid">
              {filteredItems.map((item) => (
                <div key={item.id} className="menu-card">
                  <div className="menu-card-header">
                    <div className="menu-icon">{item.emoji}</div>
                    <div className="menu-actions">
                      <button className="icon-btn" onClick={() => openEditItem(item)}>
                        <Edit size={16} />
                      </button>
                      <button className="icon-btn delete" onClick={() => confirmDelete('item', item)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="menu-body">
                    <div className="item-code">{item.shortCode}</div>
                    <h3 className="menu-name">{item.name}</h3>
                    <p className="menu-category">{item.category}</p>
                    
                    <div className="menu-footer">
                      <div className="menu-price">
                        ₹{item.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div className="no-results">
                  <p>No items found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Category Modal */}
      <Modal 
        show={showCategoryModal} 
        onHide={closeCategoryModal} 
        centered
        backdropClassName="custom-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Category' : 'Add New Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Main Course"
                value={categoryName}
                onChange={(e) => handleCategoryNameChange(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category ID (Auto-generated)</Form.Label>
              <Form.Control
                type="text"
                value={categoryId}
                readOnly
                className="bg-light"
              />
              <Form.Text className="text-muted">
                This ID is unique and used for internal referencing.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCategoryModal}>Cancel</Button>
          <Button variant="danger" onClick={handleSaveCategory} disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : (editMode ? 'Update' : 'Save')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Item Modal */}
      <Modal 
        show={showItemModal} 
        onHide={closeItemModal} 
        centered
        backdropClassName="custom-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Menu Item' : 'Add New Menu Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Short Code (ID)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. MC-001"
                    value={itemShortCode}
                    onChange={(e) => setItemShortCode(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Emoji</Form.Label>
                  <div className="emoji-selector-wrapper">
                    <button 
                      type="button"
                      className="emoji-trigger-btn"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <span className="selected-emoji">{itemEmoji}</span>
                      <Smile size={18} />
                    </button>
                    {showEmojiPicker && (
                      <div className="emoji-picker-dropdown">
                        <div className="emoji-grid">
                          {foodEmojis.map((emoji, index) => (
                            <button
                              key={index}
                              type="button"
                              className="emoji-item"
                              onClick={() => {
                                setItemEmoji(emoji)
                                setShowEmojiPicker(false)
                              }}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Form.Group>
              </div>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Margherita Pizza"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control
                type="number"
                placeholder="0.00"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeItemModal}>Cancel</Button>
          <Button variant="danger" onClick={handleSaveItem} disabled={isLoading}>
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
          Are you sure you want to delete this {deleteType}? 
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

export default Menu