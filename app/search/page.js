'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const searchType = searchParams.get('searchType') || 'products';
  const [results, setResults] = useState({ products: [], ingredients: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState('');

  useEffect(() => {
    // Only fetch if query has changed to prevent infinite loops
    if (query && query !== lastQuery) {
      const fetchResults = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/products?search=${encodeURIComponent(query)}&searchType=${searchType}`,
            { cache: 'no-store' } // Disable caching to prevent stale results
          );

          if (!response.ok) {
            throw new Error('Failed to fetch results');
          }

          const data = await response.json();
          setResults(data);
          setLastQuery(query); // Update last query after successful fetch
        } catch (err) {
          setError(err.message);
          console.error('Error fetching search results:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    }
  }, [query, searchType]);

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (loading && !results.products.length && !results.ingredients.length) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Search Results for "{query}"</h1>

        {results.products.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.category}/${product.id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square relative mb-4">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-cover rounded-md w-full h-full"
                      />
                    )}
                  </div>
                  <h3 className="font-medium text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{product.brand}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {results.ingredients.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.ingredients.map((ingredient) => (
                <Link
                  key={ingredient.id}
                  href={`/ingredients/${ingredient.id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-medium text-lg mb-2">{ingredient.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                    {ingredient.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {results.products.length === 0 && results.ingredients.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No results found for your search.
          </p>
        )}
      </div>
    </div>
  );
}
