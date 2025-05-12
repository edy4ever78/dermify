'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { addToRecentlyViewed } from '@/lib/userUtils';

// Extended mock product data with more details
const productsData = {
  cleansers: {
    'gentle-cleanser': {
      name: 'Gentle Foaming Cleanser',
      brand: 'DermiCare',
      price: 24.99,
      rating: 4.5,
      reviewCount: 128,
      imageUrl: '/images/products/cleanser-1.jpg',
      additionalImages: [
        '/images/products/cleanser-1-alt1.jpg',
        '/images/products/cleanser-1-alt2.jpg',
      ],
      description: 'A gentle, pH-balanced foaming cleanser that effectively removes dirt, oil, and makeup without stripping the skin\'s natural moisture. Suitable for all skin types, including sensitive skin.',
      benefits: [
        'Removes impurities without drying skin',
        'pH-balanced formula maintains skin barrier',
        'Fragrance-free and non-comedogenic',
        'Dermatologist tested for sensitive skin'
      ],
      ingredients: [
        { name: 'Water', description: 'Base ingredient' },
        { name: 'Glycerin', description: 'Hydrating ingredient that attracts moisture to the skin' },
        { name: 'Sodium Cocoyl Isethionate', description: 'Gentle surfactant derived from coconut oil' },
        { name: 'Panthenol (Pro-Vitamin B5)', description: 'Soothes and moisturizes the skin' },
        { name: 'Aloe Barbadensis Leaf Juice', description: 'Calms and reduces inflammation' },
      ],
      howToUse: 'Apply to wet face and massage in circular motions. Rinse thoroughly with lukewarm water. Use morning and evening.',
      size: '150ml / 5.07 fl oz',
      skinType: ['All Skin Types', 'Sensitive'],
      concerns: ['Dryness', 'Sensitivity'],
      relatedProducts: ['hydrating-cleanser', 'daily-moisturizer', 'vitamin-c-serum']
    },
    'hydrating-cleanser': {
      name: 'Hydrating Cream Cleanser',
      brand: 'SkinFirst',
      price: 18.99,
      rating: 4.3,
      reviewCount: 95,
      imageUrl: '/images/products/cleanser-2.jpg',
      additionalImages: [
        '/images/products/cleanser-2-alt1.jpg',
        '/images/products/cleanser-2-alt2.jpg',
      ],
      description: 'A rich, creamy cleanser that gently removes makeup and impurities while boosting hydration. Perfect for dry and normal skin types that need extra moisture during cleansing.',
      benefits: [
        'Hydrates while cleansing',
        'Removes makeup without harsh rubbing',
        'Leaves skin soft and smooth',
        'No tight feeling after washing'
      ],
      ingredients: [
        { name: 'Water', description: 'Base ingredient' },
        { name: 'Cetyl Alcohol', description: 'Emollient that softens skin' },
        { name: 'Glycerin', description: 'Hydrating ingredient that attracts moisture to the skin' },
        { name: 'Sodium Hyaluronate', description: 'Hydrating form of hyaluronic acid that holds 1000x its weight in water' },
        { name: 'Ceramide NP', description: 'Supports skin barrier function' },
      ],
      howToUse: 'Apply to dry skin and massage gently. Rinse with lukewarm water or remove with a soft cloth.',
      size: '200ml / 6.76 fl oz',
      skinType: ['Dry', 'Normal', 'Sensitive'],
      concerns: ['Dryness', 'Dehydration'],
      relatedProducts: ['gentle-cleanser', 'intense-hydration', 'hyaluronic-acid-serum']
    },
    'purifying-cleanser': {
      name: 'Purifying Gel Cleanser',
      brand: 'Pure Skin',
      price: 22.50,
      rating: 4.7,
      reviewCount: 114,
      imageUrl: '/images/products/cleanser-3.jpg',
      additionalImages: [
        '/images/products/cleanser-3-alt1.jpg',
        '/images/products/cleanser-3-alt2.jpg',
      ],
      description: 'A refreshing gel cleanser that deeply purifies pores without over-drying. Contains salicylic acid to help control excess oil and prevent breakouts.',
      benefits: [
        'Unclogs and minimizes the appearance of pores',
        'Controls excess oil and shine',
        'Helps prevent breakouts',
        'Refreshing gel formula'
      ],
      ingredients: [
        { name: 'Water', description: 'Base ingredient' },
        { name: 'Salicylic Acid (0.5%)', description: 'BHA that exfoliates inside pores to remove debris', highlight: true },
        { name: 'Tea Tree Oil', description: 'Natural antibacterial ingredient that helps fight acne' },
        { name: 'Niacinamide', description: 'Vitamin B3 that helps reduce sebum and minimize pores' },
        { name: 'Witch Hazel Extract', description: 'Natural astringent with soothing properties' },
      ],
      howToUse: 'Apply to wet face and massage in circular motions, focusing on oily areas. Rinse thoroughly. Use morning and evening.',
      size: '180ml / 6.08 fl oz',
      skinType: ['Oily', 'Combination', 'Acne-Prone'],
      concerns: ['Acne', 'Oiliness', 'Large Pores'],
      relatedProducts: ['oil-free-moisturizer', 'clarifying-toner', 'salicylic-acid-spot-treatment']
    }
  },
  moisturizers: {
    'daily-moisturizer': {
      name: 'Daily Moisture Cream',
      brand: 'DermiCare',
      price: 32.99,
      rating: 4.6,
      reviewCount: 156,
      imageUrl: '/images/products/moisturizer-1.jpg',
      additionalImages: [
        '/images/products/moisturizer-1-alt1.jpg',
        '/images/products/moisturizer-1-alt2.jpg',
      ],
      description: 'A lightweight daily moisturizer that provides 24-hour hydration without feeling heavy or greasy. Formulated with hyaluronic acid and ceramides to strengthen the skin barrier.',
      benefits: [
        '24-hour hydration',
        'Strengthens skin barrier',
        'Absorbs quickly with no greasy residue',
        'Perfect base for makeup'
      ],
      ingredients: [
        { name: 'Water', description: 'Base ingredient' },
        { name: 'Glycerin', description: 'Hydrating ingredient that attracts moisture to the skin' },
        { name: 'Sodium Hyaluronate', description: 'Hydrating form of hyaluronic acid that holds 1000x its weight in water' },
        { name: 'Ceramide Complex', description: 'Helps restore and maintain skin barrier' },
        { name: 'Niacinamide', description: 'Vitamin B3 that helps improve skin texture and tone' },
      ],
      howToUse: 'Apply a small amount to clean face and neck morning and evening. Can be used under makeup.',
      size: '50ml / 1.7 fl oz',
      skinType: ['All Skin Types', 'Normal', 'Combination'],
      concerns: ['Dryness', 'Dehydration'],
      relatedProducts: ['gentle-cleanser', 'vitamin-c-serum', 'daily-spf']
    },
    'intense-hydration': {
      name: 'Intense Hydration Balm',
      brand: 'HydraPlus',
      price: 28.50,
      rating: 4.4,
      reviewCount: 89,
      imageUrl: '/images/products/moisturizer-2.jpg',
      additionalImages: [
        '/images/products/moisturizer-2-alt1.jpg',
        '/images/products/moisturizer-2-alt2.jpg',
      ],
      description: 'A rich, nourishing balm that provides intense hydration for very dry or dehydrated skin. This overnight treatment helps repair the skin barrier and prevent moisture loss.',
      benefits: [
        'Intense hydration for very dry skin',
        'Repairs damaged skin barrier',
        'Prevents moisture loss',
        'Soothes irritation and redness'
      ],
      ingredients: [
        { name: 'Shea Butter', description: 'Rich emollient that softens and protects skin' },
        { name: 'Squalane', description: 'Lightweight oil that mimics skin\'s natural sebum' },
        { name: 'Ceramide NP', description: 'Supports skin barrier function' },
        { name: 'Panthenol (Pro-Vitamin B5)', description: 'Soothes and moisturizes the skin' },
        { name: 'Evening Primrose Oil', description: 'Rich in essential fatty acids that nourish dry skin' },
      ],
      howToUse: 'Apply to clean face and neck as the final step in your evening routine. Can be used as a spot treatment on extra dry areas.',
      size: '50ml / 1.7 fl oz',
      skinType: ['Dry', 'Very Dry', 'Mature'],
      concerns: ['Extreme Dryness', 'Flakiness', 'Irritation'],
      relatedProducts: ['hydrating-cleanser', 'hyaluronic-acid-serum', 'facial-oil']
    },
    'oil-free-moisturizer': {
      name: 'Oil-Free Moisturizer',
      brand: 'Pure Skin',
      price: 26.75,
      rating: 4.2,
      reviewCount: 78,
      imageUrl: '/images/products/moisturizer-3.jpg',
      additionalImages: [
        '/images/products/moisturizer-3-alt1.jpg',
        '/images/products/moisturizer-3-alt2.jpg',
      ],
      description: 'An ultra-lightweight, oil-free gel moisturizer that hydrates while controlling shine. Perfect for oily and acne-prone skin types that need hydration without added oils.',
      benefits: [
        'Oil-free hydration',
        'Reduces shine and controls oil',
        'Won\'t clog pores',
        'Mattifying effect ideal under makeup'
      ],
      ingredients: [
        { name: 'Water', description: 'Base ingredient' },
        { name: 'Glycerin', description: 'Hydrating ingredient that attracts moisture to the skin' },
        { name: 'Niacinamide', description: 'Vitamin B3 that helps reduce sebum and minimize pores' },
        { name: 'Zinc PCA', description: 'Helps control oil production' },
        { name: 'Salicylic Acid (0.2%)', description: 'Gentle exfoliation to prevent clogged pores', highlight: true },
      ],
      howToUse: 'Apply a thin layer to clean face and neck morning and evening. Allow to absorb before applying makeup.',
      size: '60ml / 2.0 fl oz',
      skinType: ['Oily', 'Combination', 'Acne-Prone'],
      concerns: ['Oiliness', 'Acne', 'Large Pores'],
      relatedProducts: ['purifying-cleanser', 'clarifying-toner', 'oil-free-spf']
    }
  },
  serums: {
    'vitamin-c-serum': {
      name: 'Vitamin C Brightening Serum',
      brand: 'GlowBoost',
      price: 45.00,
      rating: 4.8,
      reviewCount: 203,
      imageUrl: '/images/products/serum-1.jpg',
      additionalImages: [
        '/images/products/serum-1-alt1.jpg',
        '/images/products/serum-1-alt2.jpg',
      ],
      description: 'A potent 15% vitamin C serum that brightens skin tone, reduces dark spots, and boosts collagen production for more radiant skin. Formulated with vitamin E and ferulic acid for enhanced stability and effectiveness.',
      benefits: [
        'Brightens and evens skin tone',
        'Reduces hyperpigmentation and dark spots',
        'Boosts collagen production',
        'Provides antioxidant protection against environmental damage'
      ],
      ingredients: [
        { name: 'L-Ascorbic Acid (15%)', description: 'Pure form of vitamin C that brightens skin', highlight: true },
        { name: 'Vitamin E', description: 'Antioxidant that works synergistically with vitamin C' },
        { name: 'Ferulic Acid', description: 'Enhances stability and effectiveness of vitamin C', highlight: true },
        { name: 'Hyaluronic Acid', description: 'Provides lightweight hydration' },
        { name: 'Glycerin', description: 'Hydrating ingredient that attracts moisture to the skin' },
      ],
      howToUse: 'Apply 3-4 drops to clean, dry skin in the morning before moisturizer and sunscreen. Store in a cool, dark place.',
      size: '30ml / 1.0 fl oz',
      skinType: ['All Skin Types'],
      concerns: ['Dullness', 'Hyperpigmentation', 'Fine Lines', 'Uneven Texture'],
      relatedProducts: ['daily-moisturizer', 'daily-spf', 'hyaluronic-acid-serum']
    },
    'hyaluronic-acid-serum': {
      name: 'Hyaluronic Acid Serum',
      brand: 'HydraPlus',
      price: 38.99,
      rating: 4.7,
      reviewCount: 167,
      imageUrl: '/images/products/serum-2.jpg',
      additionalImages: [
        '/images/products/serum-2-alt1.jpg',
        '/images/products/serum-2-alt2.jpg',
      ],
      description: 'A deeply hydrating serum with multiple forms of hyaluronic acid that plumps the skin and reduces the appearance of fine lines. Suitable for all skin types seeking intense hydration.',
      benefits: [
        'Provides intense hydration',
        'Plumps skin and reduces fine lines',
        'Improves skin elasticity',
        'Creates smoother, more supple skin'
      ],
      ingredients: [
        { name: 'Multi-weight Hyaluronic Acid Complex', description: 'Different molecular weights to hydrate all skin layers', highlight: true },
        { name: 'Glycerin', description: 'Hydrating ingredient that attracts moisture to the skin' },
        { name: 'Panthenol (Pro-Vitamin B5)', description: 'Soothes and moisturizes the skin' },
        { name: 'Niacinamide', description: 'Vitamin B3 that helps improve skin texture and tone' },
        { name: 'Ceramide NP', description: 'Supports skin barrier function' },
      ],
      howToUse: 'Apply 1-2 pumps to damp skin after cleansing. Follow with moisturizer to seal in hydration. Can be used morning and evening.',
      size: '30ml / 1.0 fl oz',
      skinType: ['All Skin Types', 'Dry', 'Dehydrated'],
      concerns: ['Dryness', 'Dehydration', 'Fine Lines', 'Dullness'],
      relatedProducts: ['hydrating-cleanser', 'intense-hydration', 'daily-spf']
    },
    'retinol-serum': {
      name: 'Retinol Renewal Serum',
      brand: 'AgeLess',
      price: 52.99,
      rating: 4.5,
      reviewCount: 132,
      imageUrl: '/images/products/serum-3.jpg',
      additionalImages: [
        '/images/products/serum-3-alt1.jpg',
        '/images/products/serum-3-alt2.jpg',
      ],
      description: 'An advanced 0.5% retinol serum that targets signs of aging by increasing cell turnover and stimulating collagen production. Formulated with encapsulated retinol for enhanced stability and reduced irritation.',
      benefits: [
        'Reduces appearance of fine lines and wrinkles',
        'Improves skin texture and tone',
        'Accelerates cell renewal',
        'Stimulates collagen production'
      ],
      ingredients: [
        { name: 'Encapsulated Retinol (0.5%)', description: 'Vitamin A derivative that promotes cell turnover', highlight: true },
        { name: 'Peptide Complex', description: 'Helps boost collagen production' },
        { name: 'Squalane', description: 'Lightweight oil that mimics skin\'s natural sebum' },
        { name: 'Niacinamide', description: 'Vitamin B3 that helps improve skin texture and tone' },
        { name: 'Ceramide Complex', description: 'Helps restore and maintain skin barrier' },
      ],
      howToUse: 'Apply a pea-sized amount to clean, dry skin in the evening. Start using 2-3 times per week and gradually increase frequency. Always use sunscreen during the day.',
      size: '30ml / 1.0 fl oz',
      skinType: ['All Skin Types', 'Mature', 'Normal'],
      concerns: ['Fine Lines', 'Wrinkles', 'Uneven Texture', 'Dullness'],
      relatedProducts: ['gentle-cleanser', 'daily-moisturizer', 'daily-spf']
    }
  },
  sunscreens: {
    'daily-spf': {
      name: 'Daily Defense SPF 50',
      brand: 'SunShield',
      price: 29.99,
      rating: 4.6,
      reviewCount: 142,
      imageUrl: '/images/products/sunscreen-1.jpg',
      additionalImages: [
        '/images/products/sunscreen-1-alt1.jpg',
        '/images/products/sunscreen-1-alt2.jpg',
      ],
      description: 'A lightweight, broad-spectrum sunscreen with SPF 50 that provides high protection against UVA and UVB rays. Blends invisibly into all skin tones with no white cast.',
      benefits: [
        'Broad-spectrum SPF 50 protection',
        'No white cast on any skin tone',
        'Lightweight, non-greasy formula',
        'Contains antioxidants for added protection'
      ],
      ingredients: [
        { name: 'Avobenzone (3%)', description: 'UVA protection' },
        { name: 'Homosalate (10%)', description: 'UVB protection' },
        { name: 'Octisalate (5%)', description: 'UVB protection' },
        { name: 'Octocrylene (10%)', description: 'UVB protection with some UVA protection' },
        { name: 'Vitamin E', description: 'Antioxidant that protects against free radical damage' },
      ],
      howToUse: 'Apply generously to face and neck as the final step in your morning skincare routine. Reapply every 2 hours when exposed to the sun.',
      size: '50ml / 1.7 fl oz',
      skinType: ['All Skin Types'],
      concerns: ['Sun Protection', 'Anti-aging', 'Hyperpigmentation Prevention'],
      relatedProducts: ['daily-moisturizer', 'vitamin-c-serum', 'gentle-cleanser']
    },
    'mineral-sunscreen': {
      name: 'Mineral Sunscreen SPF 30',
      brand: 'Pure Skin',
      price: 24.50,
      rating: 4.3,
      reviewCount: 98,
      imageUrl: '/images/products/sunscreen-2.jpg',
      additionalImages: [
        '/images/products/sunscreen-2-alt1.jpg',
        '/images/products/sunscreen-2-alt2.jpg',
      ],
      description: 'A gentle mineral sunscreen with SPF 30 that uses zinc oxide to provide broad-spectrum protection. Ideal for sensitive skin and safe for use around the eyes.',
      benefits: [
        'Broad-spectrum SPF 30 protection',
        'Gentle mineral formula for sensitive skin',
        'Reef-safe and environmentally friendly',
        'Soothes and calms skin with added bisabolol'
      ],
      ingredients: [
        { name: 'Zinc Oxide (12%)', description: 'Physical sunscreen that reflects UVA and UVB rays', highlight: true },
        { name: 'Titanium Dioxide (2%)', description: 'Physical sunscreen that provides UVB protection', highlight: true },
        { name: 'Bisabolol', description: 'Soothes and calms sensitive skin' },
        { name: 'Vitamin E', description: 'Antioxidant that protects against free radical damage' },
        { name: 'Squalane', description: 'Lightweight oil that mimics skin\'s natural sebum' },
      ],
      howToUse: 'Apply generously to face and neck as the final step in your morning skincare routine. Shake well before use. Reapply every 2 hours when exposed to the sun.',
      size: '50ml / 1.7 fl oz',
      skinType: ['All Skin Types', 'Sensitive', 'Acne-Prone'],
      concerns: ['Sun Protection', 'Sensitivity', 'Redness'],
      relatedProducts: ['gentle-cleanser', 'daily-moisturizer', 'vitamin-c-serum']
    },
    'tinted-sunscreen': {
      name: 'Tinted Sunscreen SPF 40',
      brand: 'DermiCare',
      price: 34.75,
      rating: 4.4,
      reviewCount: 112,
      imageUrl: '/images/products/sunscreen-3.jpg',
      additionalImages: [
        '/images/products/sunscreen-3-alt1.jpg',
        '/images/products/sunscreen-3-alt2.jpg',
      ],
      description: 'A tinted mineral sunscreen with SPF 40 that provides sun protection while evening out skin tone. Available in multiple shades to suit different skin tones.',
      benefits: [
        'Broad-spectrum SPF 40 protection',
        'Evens out skin tone with sheer coverage',
        'Available in multiple adaptable shades',
        'Contains antioxidants and skin-soothing ingredients'
      ],
      ingredients: [
        { name: 'Zinc Oxide (10%)', description: 'Physical sunscreen that reflects UVA and UVB rays', highlight: true },
        { name: 'Iron Oxides', description: 'Provides natural-looking tint' },
        { name: 'Niacinamide', description: 'Vitamin B3 that helps improve skin texture and tone' },
        { name: 'Vitamin E', description: 'Antioxidant that protects against free radical damage' },
        { name: 'Hyaluronic Acid', description: 'Provides lightweight hydration' },
      ],
      howToUse: 'Apply generously to face and neck as the final step in your morning skincare routine. Can be used alone or as a primer under makeup. Reapply every 2 hours when exposed to the sun.',
      size: '40ml / 1.35 fl oz',
      skinType: ['All Skin Types'],
      concerns: ['Sun Protection', 'Uneven Tone', 'Redness'],
      relatedProducts: ['gentle-cleanser', 'daily-moisturizer', 'vitamin-c-serum']
    }
  }
};

export default function ProductDetail() {
  const params = useParams();
  const { category, id } = params;
  
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Fetch product data based on category and id
  useEffect(() => {
    if (category && id && productsData[category] && productsData[category][id]) {
      const productData = productsData[category][id];
      setProduct(productData);
      
      // Track this product view
      addToRecentlyViewed({
        type: 'product',
        id: id,
        name: productData.name
      });
      
      // Get related products
      const relatedProductsData = [];
      productData.relatedProducts.forEach(relatedId => {
        // Find which category contains this product
        for (const cat in productsData) {
          if (productsData[cat][relatedId]) {
            relatedProductsData.push({
              ...productsData[cat][relatedId],
              id: relatedId,
              category: cat
            });
            break;
          }
        }
      });
      
      setRelatedProducts(relatedProductsData);
      
      // Check if product is saved in favorites
      const savedProducts = JSON.parse(localStorage.getItem('savedProducts') || '[]');
      if (savedProducts.some(item => item.id === id && item.category === category)) {
        setIsSaved(true);
      }
    }
  }, [category, id]);
  
  const handleSaveProduct = () => {
    if (!product) return;
    
    const savedProducts = JSON.parse(localStorage.getItem('savedProducts') || '[]');
    
    if (isSaved) {
      // Remove from saved
      const filtered = savedProducts.filter(item => !(item.id === id && item.category === category));
      localStorage.setItem('savedProducts', JSON.stringify(filtered));
      setIsSaved(false);
    } else {
      // Add to saved
      savedProducts.push({ 
        id, 
        category, 
        name: product.name, 
        brand: product.brand,
        imageUrl: product.imageUrl 
      });
      localStorage.setItem('savedProducts', JSON.stringify(savedProducts));
      setIsSaved(true);
    }
  };
  
  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product not found</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">The product you're looking for doesn't exist or has been removed.</p>
            <Link href="/products">
              <button className="mt-6 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-md hover:from-teal-600 hover:to-blue-600 transition-all duration-300">
                View All Products
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/" className="text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 text-sm transition-colors">
                    Home
                  </Link>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li>
                  <Link href="/products" className="text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 text-sm transition-colors">
                    Products
                  </Link>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li>
                  <Link 
                    href={`/products/${category}`} 
                    className="text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 text-sm transition-colors capitalize"
                  >
                    {category}
                  </Link>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{product.name}</span>
                </li>
              </ol>
            </nav>
          </div>
          
          {/* Product Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div className="p-6">
                <div className="relative h-80 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
                  {/* Main product image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-16 w-16 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                    </svg>
                  </div>
                </div>
                
                {/* Image thumbnails */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedImage(0)}
                    className={`h-16 w-16 rounded-md overflow-hidden flex-shrink-0 ${selectedImage === 0 ? 'ring-2 ring-teal-500' : ''}`}
                  >
                    <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </button>
                  
                  {/* Additional image thumbnails */}
                  {product.additionalImages && product.additionalImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index + 1)}
                      className={`h-16 w-16 rounded-md overflow-hidden flex-shrink-0 ${selectedImage === index + 1 ? 'ring-2 ring-teal-500' : ''}`}
                    >
                      <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-sm text-teal-500 font-medium">{product.brand}</span>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{product.name}</h1>
                </div>
                
                {/* Price and Rating */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-medium text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                  
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{product.rating} ({product.reviewCount} reviews)</span>
                  </div>
                </div>
                
                {/* Product Meta */}
                <div className="mb-6 space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-24">Size:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{product.size}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-24">Skin Type:</span>
                    <div className="flex flex-wrap gap-1">
                      {product.skinType.map(type => (
                        <span key={type} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-24">Concerns:</span>
                    <div className="flex flex-wrap gap-1">
                      {product.concerns.map(concern => (
                        <span key={concern} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
                          {concern}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Short Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                  {product.description}
                </p>
                
                {/* Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button className="px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-md hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-sm flex items-center justify-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={handleSaveProduct}
                    className={`px-4 py-3 ${
                      isSaved 
                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-500 dark:text-teal-400' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    } font-medium rounded-md hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300 flex items-center justify-center`}
                  >
                    {isSaved ? (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                        Saved
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Save
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details Tab Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setSelectedTab('description')}
                  className={`px-6 py-4 text-sm font-medium focus:outline-none ${
                    selectedTab === 'description' 
                      ? 'border-b-2 border-teal-500 text-teal-500' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Description
                </button>
                
                <button
                  onClick={() => setSelectedTab('ingredients')}
                  className={`px-6 py-4 text-sm font-medium focus:outline-none ${
                    selectedTab === 'ingredients' 
                      ? 'border-b-2 border-teal-500 text-teal-500' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Ingredients
                </button>
                
                <button
                  onClick={() => setSelectedTab('howToUse')}
                  className={`px-6 py-4 text-sm font-medium focus:outline-none ${
                    selectedTab === 'howToUse' 
                      ? 'border-b-2 border-teal-500 text-teal-500' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  How to Use
                </button>
              </div>
            </div>
            
            {/* Tab Contents */}
            <div className="p-6">
              {/* Description Tab */}
              {selectedTab === 'description' && (
                <div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{product.description}</p>
                  
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Key Benefits</h3>
                  <ul className="space-y-3">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>  
              )}
              
              {/* Ingredients Tab */}
              {selectedTab === 'ingredients' && (
                <div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ingredient listings are subject to change. Please refer to the product packaging for the most up-to-date ingredient list.
                    </p>
                  </div>
                  
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index} className={`py-4 ${ingredient.highlight ? 'bg-teal-50 dark:bg-teal-900/10 px-3 -mx-3 rounded' : ''}`}>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <h4 className={`font-medium ${ingredient.highlight ? 'text-teal-700 dark:text-teal-400' : 'text-gray-900 dark:text-white'}`}>
                            {ingredient.name}
                            {ingredient.highlight && (
                              <span className="ml-2 text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full">
                                Key Ingredient
                              </span>
                            )}
                          </h4>
                          <p className="mt-1 sm:mt-0 text-sm text-gray-500 dark:text-gray-400">{ingredient.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* How to Use Tab */}
              {selectedTab === 'howToUse' && (
                <div>
                  <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-6 mb-6 border border-blue-100 dark:border-blue-900/20">
                    <h3 className="text-lg font-medium text-blue-800 dark:text-blue-400 mb-3">How to Use</h3>
                    <p className="text-blue-700 dark:text-blue-300">{product.howToUse}</p>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tips for Best Results</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">
                          Allow product to fully absorb before applying the next skincare step.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">
                          For maximum effectiveness, use as directed in a consistent skincare routine.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">
                          Patch test before first use, especially if you have sensitive skin.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You May Also Like</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map(relatedProduct => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.category}/${relatedProduct.id}`}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                      {/* Placeholder for product image */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <svg className="h-12 w-12 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{relatedProduct.brand}</p>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-1">{relatedProduct.name}</h3>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-gray-200">${relatedProduct.price.toFixed(2)}</span>
                        
                        <div className="flex items-center">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">{relatedProduct.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
