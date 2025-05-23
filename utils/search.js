/**
 * Handles search submission by updating the URL
 * @param {string} searchTerm - The search term to use
 * @param {object} router - Next.js router object
 */
export function handleSearch(searchTerm, router) {
  if (!searchTerm.trim()) return;
  
  // Create a query string with the search term
  const queryString = `?search=${encodeURIComponent(searchTerm.trim())}`;
  
  // Navigate to the search results page with the search query
  router.push(`/search${queryString}`);
}

/**
 * Gets the search query from URL search parameters
 * @param {URLSearchParams} searchParams - The URL search parameters
 * @returns {string} The search query or empty string
 */
export function getSearchQuery(searchParams) {
  return searchParams ? searchParams.get('search') || '' : '';
}

/**
 * Parses search parameters into a structured object
 * @param {URLSearchParams} searchParams - The URL search parameters
 * @returns {Object} The parsed search parameters
 */
export function parseSearchParams(searchParams) {
  return {
    query: getSearchQuery(searchParams),
    category: searchParams.get('category') || 'all',
    skinType: searchParams.get('skinType') || 'all',
    brand: searchParams.get('brand') || '',
    page: parseInt(searchParams.get('page') || '1', 10)
  };
}
