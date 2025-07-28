/**
 * Handles search submission by updating the URL
 * @param {string} searchTerm - The search term to use
 * @param {object} router - Next.js router object
 * @param {function} setIsLoading - Optional loading state setter
 */
export function handleSearch(searchTerm, router, setIsLoading) {
  if (!searchTerm.trim()) return;
  
  // Set loading state if provided
  if (setIsLoading) {
    setIsLoading(true);
  }
  
  // Create a query string with the search term using 'q' parameter to match search page
  const queryString = `?q=${encodeURIComponent(searchTerm.trim())}`;
  
  // Navigate to the search results page with the search query
  router.push(`/search${queryString}`);
}

/**
 * Gets the search query from URL search parameters
 * @param {URLSearchParams} searchParams - The URL search parameters
 * @returns {string} The search query or empty string
 */
export function getSearchQuery(searchParams) {
  return searchParams ? (searchParams.get('q') || searchParams.get('search') || '') : '';
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
