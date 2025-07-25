'use client';

import { useState, useEffect } from 'react';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'all', 'cleansers', 'moisturizers', 'serums', 'sunscreens', 
    'exfoliants', 'treatments', 'toners', 'masks'
  ];

  const defaultProduct = {
    id: '',
    brand: '',
    name: '',
    price: 0,
    rank: 0,
    description: '',
    imageUrl: '',
    category: 'cleansers',
    purchaseUrl: '',
    skinTypes: {
      normal: false,
      dry: false,
      sensitive: false,
      combination: false,
      oily: false
    }
  };

  const [currentProduct, setCurrentProduct] = useState(defaultProduct);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/dev/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('skinTypes.')) {
      const skinType = name.split('.')[1];
      setCurrentProduct(prev => ({
        ...prev,
        skinTypes: {
          ...prev.skinTypes,
          [skinType]: checked
        }
      }));
    } else {
      setCurrentProduct(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const generateId = (brand, name) => {
    return `${brand.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...currentProduct,
      id: currentProduct.id || generateId(currentProduct.brand, currentProduct.name),
      price: parseFloat(currentProduct.price),
      rank: parseFloat(currentProduct.rank)
    };

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const response = await fetch('/api/dev/products', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        await fetchProducts();
        resetForm();
        alert(`Product ${editingProduct ? 'updated' : 'added'} successfully!`);
      } else {
        alert('Error saving product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setEditingProduct(product.id);
    setShowAddForm(true);
  };

  const deleteProduct = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      alert('Product not found!');
      return;
    }
    
    // Show custom confirmation modal
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      // Set loading state
      setDeletingProduct(productToDelete.id);
      setShowDeleteConfirm(false);

      // Make the DELETE request
      const response = await fetch('/api/dev/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productToDelete.id }),
      });

      const result = await response.json();

      if (response.ok) {
        // Success - refresh products
        await fetchProducts();
        alert('Product deleted successfully!');
      } else {
        alert(`Error: ${result.error || 'Failed to delete product'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting product. Please try again.');
    } finally {
      // Clear loading state
      setDeletingProduct(null);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const resetForm = () => {
    setCurrentProduct(defaultProduct);
    setEditingProduct(null);
    setShowAddForm(false);
  };

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Products Manager
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Add New Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Brand *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={currentProduct.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentProduct.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={currentProduct.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rank"
                    value={currentProduct.rank}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={currentProduct.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={currentProduct.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={currentProduct.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Purchase URL
                </label>
                <input
                  type="url"
                  name="purchaseUrl"
                  value={currentProduct.purchaseUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Suitable Skin Types
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.keys(currentProduct.skinTypes).map(skinType => (
                    <label key={skinType} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name={`skinTypes.${skinType}`}
                        checked={currentProduct.skinTypes[skinType]}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {skinType.charAt(0).toUpperCase() + skinType.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border-4 border-gray-300 dark:border-gray-600 p-6 w-full max-w-md transform transition-all">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-50 dark:bg-red-900/20 rounded-full border-4 border-red-300 dark:border-red-700">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-center mb-3 text-gray-900 dark:text-white">
              Delete Product
            </h3>
            
            <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete this product?
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-gray-300 dark:border-gray-500 p-4 mb-6">
              <div className="flex items-center space-x-3">
                {productToDelete.imageUrl && (
                  <img
                    src={productToDelete.imageUrl}
                    alt={productToDelete.name}
                    className="w-12 h-12 object-cover rounded border-2 border-gray-300 dark:border-gray-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {productToDelete.brand} - {productToDelete.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {productToDelete.category} • ${productToDelete.price} • ⭐ {productToDelete.rank}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-3 mb-6">
              <p className="text-center text-sm text-red-700 dark:text-red-300 font-medium">
                ⚠️ This action cannot be undone
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border-2 border-gray-400 dark:border-gray-500 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md border-2 border-red-700 hover:border-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="grid gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4" data-product-id={product.id}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {product.brand} - {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {product.category} • ${product.price} • ⭐ {product.rank}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(product.skinTypes || {})
                    .filter(([_, suitable]) => suitable)
                    .map(([skinType, _]) => (
                      <span
                        key={skinType}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                      >
                        {skinType}
                      </span>
                    ))}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(product)}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  disabled={deletingProduct === product.id}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
                >
                  {deletingProduct === product.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No products found matching your search criteria.
        </div>
      )}
    </div>
  );
}
