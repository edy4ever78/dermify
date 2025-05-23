/**
 * Filters products based on a search term
 * @param {string} searchTerm - The search term to filter products by
 * @param {Object[]} products - Array of product objects to filter
 * @returns {Object[]} - Filtered array of products
 */
export function filterProductsBySearchTerm(searchTerm, products) {
  if (!searchTerm || searchTerm.trim() === '') {
    return products;
  }
  
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  
  return products.filter(product => {
    const nameMatch = product.name && product.name.toLowerCase().includes(normalizedSearchTerm);
    const brandMatch = product.brand && product.brand.toLowerCase().includes(normalizedSearchTerm);
    const descriptionMatch = product.description && product.description.toLowerCase().includes(normalizedSearchTerm);
    const ingredientsMatch = product.ingredients && 
      product.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(normalizedSearchTerm)
      );
    
    return nameMatch || brandMatch || descriptionMatch || ingredientsMatch;
  });
}

/**
 * Checks if a product matches the search term
 * @param {Object} product - Product to check
 * @param {string} searchTerm - Search term to match against
 * @returns {boolean} - Whether the product matches the search term
 */
export function productMatchesSearch(product, searchTerm) {
  if (!searchTerm || searchTerm.trim() === '') {
    return true;
  }
  
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  
  const nameMatch = product.name && product.name.toLowerCase().includes(normalizedSearchTerm);
  const brandMatch = product.brand && product.brand.toLowerCase().includes(normalizedSearchTerm);
  const descriptionMatch = product.description && product.description.toLowerCase().includes(normalizedSearchTerm);
  const ingredientsMatch = product.ingredients && 
    product.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(normalizedSearchTerm)
    );
  
  return nameMatch || brandMatch || descriptionMatch || ingredientsMatch;
}
