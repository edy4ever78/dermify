import { useState, useEffect } from 'react';

// Change export syntax to default export
const useProducts = () => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        // Create a map of product names to details
        const productMap = {};
        data.forEach(product => {
          productMap[product.name.toLowerCase()] = {
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            imageUrl: product.imageUrl,
            price: product.price
          };
        });
        
        setProducts(productMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

export default useProducts;
