'use client';

import { useState, useEffect } from 'react';

export default function IngredientManager() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'all', 'Humectant', 'Retinoid', 'Antioxidant', 'Exfoliant', 'Moisturizer', 
    'Sunscreen', 'Anti-inflammatory', 'Peptide', 'Vitamin', 'Acid', 'Oil'
  ];

  const defaultIngredient = {
    id: '',
    name: '',
    aliases: [],
    category: 'Humectant',
    description: '',
    benefits: [],
    concerns: [],
    skinTypes: [],
    commonProducts: [],
    imageUrl: '',
    images: [],
    safetyRating: 5,
    scientificEvidence: 3
  };

  const [currentIngredient, setCurrentIngredient] = useState(defaultIngredient);
  const [benefitsInput, setBenefitsInput] = useState('');
  const [concernsInput, setConcernsInput] = useState('');
  const [aliasesInput, setAliasesInput] = useState('');
  const [skinTypesInput, setSkinTypesInput] = useState('');
  const [commonProductsInput, setCommonProductsInput] = useState('');

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await fetch('/api/products?searchType=ingredients');
      const data = await response.json();
      setIngredients(data.ingredients || []);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ingredient.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ingredient.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setCurrentIngredient(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const generateId = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const parseArrayInput = (input) => {
    return input.split('\n').map(item => item.trim()).filter(item => item.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const ingredientData = {
      ...currentIngredient,
      id: currentIngredient.id || generateId(currentIngredient.name),
      aliases: parseArrayInput(aliasesInput),
      benefits: parseArrayInput(benefitsInput),
      concerns: parseArrayInput(concernsInput),
      skinTypes: parseArrayInput(skinTypesInput),
      commonProducts: parseArrayInput(commonProductsInput),
      images: currentIngredient.imageUrl ? [currentIngredient.imageUrl] : [],
      safetyRating: parseInt(currentIngredient.safetyRating),
      scientificEvidence: parseInt(currentIngredient.scientificEvidence)
    };

    try {
      const method = editingIngredient ? 'PUT' : 'POST';
      const response = await fetch('/api/dev/ingredients', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingredientData),
      });

      if (response.ok) {
        await fetchIngredients();
        resetForm();
        alert(`Ingredient ${editingIngredient ? 'updated' : 'added'} successfully!`);
      } else {
        alert('Error saving ingredient');
      }
    } catch (error) {
      console.error('Error saving ingredient:', error);
      alert('Error saving ingredient');
    }
  };

  const handleEdit = (ingredient) => {
    setCurrentIngredient(ingredient);
    setEditingIngredient(ingredient.id);
    setBenefitsInput((ingredient.benefits || []).join('\n'));
    setConcernsInput((ingredient.concerns || []).join('\n'));
    setAliasesInput((ingredient.aliases || []).join('\n'));
    setSkinTypesInput((ingredient.skinTypes || []).join('\n'));
    setCommonProductsInput((ingredient.commonProducts || []).join('\n'));
    setShowAddForm(true);
  };

  const handleDelete = async (ingredientId) => {
    // Enhanced confirmation with ingredient details
    const ingredientToDelete = ingredients.find(i => i.id === ingredientId);
    if (!ingredientToDelete) {
      alert('Ingredient not found!');
      return;
    }

    const confirmMessage = `Are you sure you want to delete this ingredient?\n\nIngredient: ${ingredientToDelete.name}\nCategory: ${ingredientToDelete.category}\nID: ${ingredientId}\n\nThis action cannot be undone.`;
    
    if (!confirm(confirmMessage)) return;

    // Show loading state
    const deleteButton = document.querySelector(`[data-ingredient-id="${ingredientId}"] .delete-btn`);
    if (deleteButton) {
      deleteButton.disabled = true;
      deleteButton.textContent = 'Deleting...';
    }

    try {
      console.log('Attempting to delete ingredient:', ingredientId);
      
      const response = await fetch('/api/dev/ingredients', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: ingredientId }),
      });

      console.log('Delete response status:', response.status);
      
      let data;
      try {
        data = await response.json();
        console.log('Delete response data:', data);
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError);
        throw new Error('Invalid response from server');
      }

      if (response.ok) {
        // Success - refresh the ingredients list
        console.log('Ingredient deleted successfully, refreshing list...');
        await fetchIngredients();
        
        // Show success message
        alert(`Ingredient "${ingredientToDelete.name}" has been deleted successfully!`);
        
        // Optional: Show a toast notification instead of alert
        console.log('Ingredient deletion completed successfully');
      } else {
        // Server returned an error
        const errorMessage = data.error || `Server error: ${response.status}`;
        console.error('Server error during deletion:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      
      // Show user-friendly error message
      let errorMessage = 'Failed to delete ingredient. ';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage += 'Please check your internet connection and try again.';
      } else if (error.message.includes('Invalid response')) {
        errorMessage += 'Server returned an invalid response. Please try again.';
      } else {
        errorMessage += error.message || 'Unknown error occurred.';
      }
      
      alert(errorMessage);
    } finally {
      // Reset button state
      if (deleteButton) {
        deleteButton.disabled = false;
        deleteButton.textContent = 'Delete';
      }
    }
  };

  const resetForm = () => {
    setCurrentIngredient(defaultIngredient);
    setEditingIngredient(null);
    setShowAddForm(false);
    setBenefitsInput('');
    setConcernsInput('');
    setAliasesInput('');
    setSkinTypesInput('');
    setCommonProductsInput('');
  };

  if (loading) {
    return <div className="p-6">Loading ingredients...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Ingredients Manager
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Add New Ingredient
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search ingredients..."
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
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Ingredient Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentIngredient.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={currentIngredient.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={currentIngredient.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Safety Rating (1-5)
                  </label>
                  <input
                    type="number"
                    name="safetyRating"
                    value={currentIngredient.safetyRating}
                    onChange={handleInputChange}
                    min="1"
                    max="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Scientific Evidence (1-5)
                  </label>
                  <input
                    type="number"
                    name="scientificEvidence"
                    value={currentIngredient.scientificEvidence}
                    onChange={handleInputChange}
                    min="1"
                    max="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={currentIngredient.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Aliases (one per line)
                  </label>
                  <textarea
                    value={aliasesInput}
                    onChange={(e) => setAliasesInput(e.target.value)}
                    rows="3"
                    placeholder="Sodium Hyaluronate&#10;Hydrolyzed Hyaluronic Acid"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Skin Types (one per line)
                  </label>
                  <textarea
                    value={skinTypesInput}
                    onChange={(e) => setSkinTypesInput(e.target.value)}
                    rows="3"
                    placeholder="Normal&#10;Dry&#10;Sensitive"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Benefits (one per line)
                </label>
                <textarea
                  value={benefitsInput}
                  onChange={(e) => setBenefitsInput(e.target.value)}
                  rows="4"
                  placeholder="Provides deep hydration&#10;Plumps skin and reduces fine lines"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Concerns (one per line)
                </label>
                <textarea
                  value={concernsInput}
                  onChange={(e) => setConcernsInput(e.target.value)}
                  rows="3"
                  placeholder="May cause irritation in sensitive skin&#10;Should be used with sunscreen"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Common Products (one per line)
                </label>
                <textarea
                  value={commonProductsInput}
                  onChange={(e) => setCommonProductsInput(e.target.value)}
                  rows="3"
                  placeholder="Serums&#10;Moisturizers&#10;Sheet Masks"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
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
                  {editingIngredient ? 'Update' : 'Add'} Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ingredients List */}
      <div className="grid gap-4">
        {filteredIngredients.map(ingredient => (
          <div key={ingredient.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4" data-ingredient-id={ingredient.id}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  {ingredient.imageUrl && (
                    <img
                      src={ingredient.imageUrl}
                      alt={ingredient.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {ingredient.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {ingredient.category} • Safety: {ingredient.safetyRating}/5 • Evidence: {ingredient.scientificEvidence}/5
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                  {ingredient.description}
                </p>
                
                {ingredient.aliases && ingredient.aliases.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Also known as: </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {ingredient.aliases.join(', ')}
                    </span>
                  </div>
                )}
                
                {ingredient.benefits && ingredient.benefits.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Benefits: </span>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 ml-4">
                      {ingredient.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index}>• {benefit}</li>
                      ))}
                      {ingredient.benefits.length > 3 && (
                        <li>• ... and {ingredient.benefits.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {(ingredient.skinTypes || []).map((skinType, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded"
                    >
                      {skinType}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(ingredient)}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ingredient.id)}
                  className="delete-btn px-3 py-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredIngredients.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No ingredients found matching your search criteria.
        </div>
      )}
    </div>
  );
}
