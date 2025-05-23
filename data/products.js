/**
 * Products data based on Cosmopolitan's best skincare products
 * Source: https://www.cosmopolitan.com/uk/beauty-hair/skincare/g14191580/best-skin-care-products/
 */

const products = [
  {
    id: "cerave-hydrating-cleanser",
    brand: "CeraVe",
    name: "Hydrating Cleanser",
    price: 14.50,
    rank: 4.8,
    description: "A gentle face wash with ceramides and hyaluronic acid that cleanses without disrupting the skin barrier.",
    imageUrl: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1682362310-12667341-1214794015957576.jpg",
    category: "cleansers",
    purchaseUrl: "https://www.notino.ro/cerave/cleansers-emulsie-pentru-curatare-cu-efect-de-hidratare/",
    skinTypes: {
      normal: true,
      dry: true,
      sensitive: true,
      combination: true,
      oily: false
    }
  },
  {
    id: "paula-choice-bha-liquid-exfoliant",
    brand: "Paula's Choice",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    price: 34.00,
    rank: 4.9,
    description: "An exfoliant with salicylic acid that unclogs pores, smooths wrinkles, and brightens skin tone.",
    imageUrl: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1682363927-14217508-6326446d5ef8d446.jpg",
    category: "exfoliants",
    purchaseUrl: "https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid-exfoliant/201.html",
    skinTypes: {
      normal: true,
      dry: false,
      sensitive: false,
      combination: true,
      oily: true
    }
  },
  {
    id: "la-roche-posay-effaclar-duo",
    brand: "La Roche-Posay",
    name: "Effaclar Duo+",
    price: 18.90,
    rank: 4.7,
    description: "A targeted treatment that reduces the appearance of blemishes and unclogs pores.",
    imageUrl: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1692202895-13938507-1644986148945170.jpg?crop=0.577xw:0.721xh;0.220xw,0.279xh&resize=980:*",
    category: "treatments",
    purchaseUrl: "https://www.laroche-posay.ro/effaclar/effaclar-duo",
    skinTypes: {
      normal: false,
      dry: false,
      sensitive: true,
      combination: true,
      oily: true
    }
  },
  {
    id: "drunk-elephant-protini-polypeptide-cream",
    brand: "Drunk Elephant",
    name: "Protini Polypeptide Cream",
    price: 68.00,
    rank: 4.8,
    description: "A protein moisturizer that combines signal peptides, growth factors, amino acids, and pygmy waterlily to improve skin tone and texture.",
    imageUrl: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1571132701-drudru000_drunkelephant_umbratinte_1560x1960_1560x1960-9ibarjpg.jpg?crop=1xw:1.00xh;center,top&resize=980:*",
    category: "moisturizers",
    purchaseUrl: "https://www.sephora.com/product/protini-tm-polypeptide-cream-P427421",
    skinTypes: {
      normal: true,
      dry: true,
      sensitive: true,
      combination: true,
      oily: true
    }
  },
  
  {
    id: "ordinary-niacinamide-10-zinc-1",
    brand: "The Ordinary",
    name: "Niacinamide 10% + Zinc 1%",
    price: 6.00,
    rank: 4.7,
    description: "A high-strength vitamin and mineral formula that reduces the appearance of blemishes and congestion.",
    imageUrl: "https://www.sephora.ro/on/demandware.static/-/Sites-masterCatalog_Sephora/default/dw3572a17d/images/hi-res/all/SKU/502450_swatch.jpg",
    category: "serums",
    purchaseUrl: "https://theordinary.com/en-us/niacinamide-10-zinc-1-serum-100436.html",
    skinTypes: {
      normal: true,
      dry: false,
      sensitive: false,
      combination: true,
      oily: true
    }
  },
  {
    id: "supergoop-unseen-sunscreen",
    brand: "Supergoop!",
    name: "Unseen Sunscreen SPF 30",
    price: 32.00,
    rank: 4.9,
    description: "An invisible, weightless, scentless sunscreen with SPF 30 that leaves a velvety finish.",
    imageUrl: "https://www.sephora.ro/on/demandware.static/-/Sites-masterCatalog_Sephora/default/dwba2a984b/images/hi-res/all/SKU/657785_swatch.jpg",
    category: "sunscreens",
    purchaseUrl: "https://supergoop.com/products/unseen-sunscreen",
    skinTypes: {
      normal: true,
      dry: true,
      sensitive: true,
      combination: true,
      oily: true
    }
  },
  {
    id: "medik8-crystal-retinal",
    brand: "Medik8",
    name: "Crystal Retinal",
    price: 59.00,
    rank: 4.8,
    description: "A stable retinal night serum that delivers visible results up to 11x faster than retinol.",
    imageUrl: "https://glowrious.ro/cdn/shop/files/medik8.retinal6-500x500.jpg?v=1696179784&width=1800.jpg",
    category: "serums",
    purchaseUrl: "https://medik8.com/products/crystal-retinal",
    skinTypes: {
      normal: true,
      dry: true,
      sensitive: false,
      combination: true,
      oily: true
    }
  },
  {
    id: "avene-thermal-spring-water",
    brand: "Avène",
    name: "Thermal Spring Water",
    price: 14.00,
    rank: 4.5,
    description: "A soothing facial mist with mineral-rich spring water that calms sensitive skin.",
    imageUrl: "https://cdn.notinoimg.com/detail_main_hq/avene/3282779003131_01-o/eau-thermale-thermal-spring-water___241206.jpg",
    category: "mists",
    purchaseUrl: "https://www.avene.com/en_us/face/specific-care/thermal-spring-water",
    skinTypes: {
      normal: true,
      dry: true,
      sensitive: true,
      combination: true,
      oily: true
    }
  },
  {
    id: "skinceuticals-ce-ferulic",
    brand: "SkinCeuticals",
    name: "C E Ferulic",
    price: 169.00,
    rank: 4.9,
    description: "A vitamin C serum with pure vitamin C, vitamin E, and ferulic acid to protect against environmental damage.",
    imageUrl: "https://www.skinceuticals.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-acd-skinceuticals-master-catalog/default/dwd20af22a/Products/S17/SKC_CEF_Allure_Packshot.jpg?sw=698&sfrm=jpg&q=70.jpg",
    category: "serums",
    purchaseUrl: "https://www.skinceuticals.com/c-e-ferulic-635494263008.html",
    skinTypes: {
      normal: true,
      dry: true,
      sensitive: false,
      combination: true,
      oily: false
    }
  },
  {
    id: "laneige-lip-sleeping-mask",
    brand: "Laneige",
    name: "Lip Sleeping Mask",
    price: 22.00,
    rank: 4.9,
    description: "An overnight lip treatment with antioxidants, vitamin C, and hyaluronic acid that delivers intense hydration.",
    imageUrl: "https://www.sephora.ro/on/demandware.static/-/Sites-masterCatalog_Sephora/default/dw4b582e04/images/hi-res/all/SKU/615228_swatch.jpg",
    category: "treatments",
    purchaseUrl: "https://www.laneige.com/us/en/best-sellers/lip-sleeping-mask-berry.html",
    skinTypes: {
      normal: true,
      dry: true,
      sensitive: true,
      combination: true,
      oily: true
    }
  },
  {
    id: "dr-jart-ceramidin-cream",
    brand: "Dr. Jart+",
    name: "Ceramidin Cream",
    price: 48.00,
    rank: 4.7,
    description: "A moisturizer enriched with ceramides that strengthens the skin barrier and prevents moisture loss.",
    imageUrl: "https://www.sephora.ro/on/demandware.static/-/Sites-masterCatalog_Sephora/default/dw8bd9e6d1/images/hi-res/all/SKU/447601_swatch.jpg",
    category: "moisturizers",
    purchaseUrl: "https://www.drjart.com/product/29723/92640/moisturizers/ceramidin-cream",
    skinTypes: {
      normal: true,
      dry: true,
      sensitive: true,
      combination: true,
      oily: false
    }
  },
  

  {
    id: "farmacy-green-clean-makeup-removing-cleansing-balm",
    brand: "Farmacy",
    name: "Green Clean Makeup Removing Cleansing Balm",
    price: 36.00,
    rank: 4.8,
    description: "A makeup-removing cleansing balm that dissolves makeup and impurities without stripping skin.",
    imageUrl: "https://media.douglas.ro/ro/thumbnail/2d/87/05/1663967720/818832020109_1280x1280.jpg",
    category: "cleansers",
    purchaseUrl: "https://www.farmacybeauty.com/products/green-clean",
    skinTypes: {
      normal: true,
      dry: true,
      sensitive: true,
      combination: true,
      oily: true
    }
  },

  
  {
    id: "youth-to-the-people-superfood-antioxidant-cleanser",
    brand: "Youth To The People",
    name: "Superfood Antioxidant Cleanser",
    price: 36.00,
    rank: 4.7,
    description: "A face wash with kale, spinach, and green tea that removes makeup and prevents buildup without drying skin.",
    imageUrl: "https://www.sephora.com/productimages/sku/s1887298-main-zoom.jpg?imwidth=1224.jpg",
    category: "cleansers",
    purchaseUrl: "https://www.youthtothepeople.com/products/superfood-cleanser",
    skinTypes: {
      normal: true,
      dry: false,
      sensitive: false,
      combination: true,
      oily: true
    }
  },
  {
    id: "sunday-riley-good-genes-all-in-one-lactic-acid-treatment",
    brand: "Sunday Riley",
    name: "Good Genes All-In-One Lactic Acid Treatment",
    price: 85.00,
    rank: 4.8,
    description: "An exfoliating treatment with purified lactic acid that plumps fine lines and improves skin radiance.",
    imageUrl: "https://www.sephora.com/productimages/sku/s1887298-main-zoom.jpg?imwidth=930.jpg",
    category: "treatments",
    purchaseUrl: "https://sundayriley.com/products/good-genes-lactic-acid-treatment",
    skinTypes: {
      normal: true,
      dry: true,
      sensitive: false,
      combination: true,
      oily: true
    }
  },
  
 
];

// Helper functions to work with the product data
export const getAllProducts = () => products;

export const getProductById = (id) => products.find(product => product.id === id);

export const getProductsByCategory = (category) => products.filter(product => product.category === category);

export const getProductsBySkinType = (skinType) => {
  return products.filter(product => {
    return product.skinTypes && product.skinTypes[skinType.toLowerCase()];
  });
};

export const getProductsByBrand = (brand) => {
  const searchBrand = brand.toLowerCase();
  return products.filter(product => product.brand.toLowerCase() === searchBrand);
};

// New helper function to get product by category and ID
export const getProductByCategoryAndId = (category, id) => {
  if (category && id) {
    return products.find(product => 
      product.id === id && product.category === category
    );
  }
  return getProductById(id);
};

// Helper function to validate and get proper image URL
export const getValidImageUrl = (imageUrl, category, index) => {
  if (!imageUrl || typeof imageUrl !== 'string') {
    // Return a category-based fallback image
    return `/images/products/${category || 'other'}-${(index % 3) + 1}.jpg`;
  }
  
  // For external images, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // For internal images, ensure they have the correct path
  if (!imageUrl.startsWith('/')) {
    return `/${imageUrl}`;
  }
  
  return imageUrl;
};

export default products;

