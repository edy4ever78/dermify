/**
 * Adds a product or other item to recently viewed list in localStorage
 * @param {Object} item - The item to add with shape {type: 'product|ingredient|routine', id: 'item-id', name: 'Item Name'}
 */
export function addToRecentlyViewed(item) {
  try {
    // Get existing recently viewed items
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    // Remove the item if it already exists (to avoid duplicates)
    const filteredItems = recentlyViewed.filter(existing => 
      !(existing.type === item.type && existing.id === item.id)
    );
    
    // Add the new item to the beginning of the array
    const updatedItems = [
      {
        ...item,
        viewedAt: new Date().toISOString()
      },
      ...filteredItems
    ];
    
    // Limit to most recent 10 items
    const limitedItems = updatedItems.slice(0, 10);
    
    // Save back to localStorage
    localStorage.setItem('recentlyViewed', JSON.stringify(limitedItems));
    
    return limitedItems;
  } catch (error) {
    console.error('Error adding item to recently viewed:', error);
    return [];
  }
}

/**
 * Gets recently viewed items from localStorage
 * @param {number} limit - Maximum number of items to return
 * @return {Array} Array of recently viewed items
 */
export function getRecentlyViewed(limit = 5) {
  try {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    return recentlyViewed.slice(0, limit);
  } catch (error) {
    console.error('Error getting recently viewed items:', error);
    return [];
  }
}
