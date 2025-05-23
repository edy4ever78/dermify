const ingredients = [
  {
    id: "hyaluronic-acid",
    name: "Hyaluronic Acid",
    aliases: ["Sodium Hyaluronate", "Hydrolyzed Hyaluronic Acid"],
    category: "Humectant",
    description: "A powerful humectant that can hold up to 1000 times its weight in water, providing intense hydration to the skin.",
    benefits: [
      "Provides deep hydration",
      "Plumps skin and reduces fine lines",
      "Suitable for all skin types",
      "Non-comedogenic"
    ],
    concerns: [
      "Not effective in very dry environments without additional occlusive ingredients"
    ],
    skinTypes: ["All", "Dry", "Dehydrated", "Mature"],
    commonProducts: ["Serums", "Moisturizers", "Sheet Masks"],
    imageUrl: "https://ethique.co.uk/cdn/shop/articles/hyaluronic_acid.jpg?v=1632455825",
    images: ["https://ethique.co.uk/cdn/shop/articles/hyaluronic_acid.jpg?v=1632455825"],
    safetyRating: 5, // 1-5 scale, 5 being extremely safe
    scientificEvidence: 4 // 1-5 scale, 5 being strongest evidence
  },
  {
    id: "retinol",
    name: "Retinol",
    aliases: ["Vitamin A", "Retinoids"],
    category: "Retinoid",
    description: "A derivative of vitamin A that promotes cell turnover, stimulates collagen production, and helps treat multiple signs of aging.",
    benefits: [
      "Reduces appearance of fine lines and wrinkles",
      "Improves skin texture and tone",
      "Helps with acne and unclogging pores",
      "Fades hyperpigmentation"
    ],
    concerns: [
      "Can cause irritation, redness, and peeling during initial use",
      "Increases sun sensitivity",
      "Not recommended during pregnancy",
      "Should be introduced gradually to build tolerance"
    ],
    skinTypes: ["Normal", "Combination", "Oily", "Mature", "Acne-Prone"],
    commonProducts: ["Serums", "Creams", "Oils"],
    imageUrl: "https://cloudfront-eu-central-1.images.arcpublishing.com/irishtimes/OEIZMJI44JCJHBCWLJ3TGKJHEQ.jpg",
    images: ["https://cloudfront-eu-central-1.images.arcpublishing.com/irishtimes/OEIZMJI44JCJHBCWLJ3TGKJHEQ.jpg"],
    safetyRating: 3,
    scientificEvidence: 5
  },
  {
    id: "vitamin-c",
    name: "Vitamin C",
    aliases: ["Ascorbic Acid", "L-Ascorbic Acid", "Sodium Ascorbyl Phosphate", "Magnesium Ascorbyl Phosphate"],
    category: "Antioxidant",
    description: "A potent antioxidant that brightens skin, protects against environmental damage, and boosts collagen production.",
    benefits: [
      "Brightens complexion and fades dark spots",
      "Protects against free radical damage",
      "Boosts collagen production",
      "Reduces inflammation"
    ],
    concerns: [
      "Can be unstable and oxidize quickly (especially L-ascorbic acid)",
      "May cause irritation in high concentrations",
      "Some forms have lower efficacy"
    ],
    skinTypes: ["All", "Dull", "Hyperpigmented", "Mature"],
    commonProducts: ["Serums", "Moisturizers", "Masks"],
    imageUrl: "https://www.skinandme.com/the-dose/wp-content/uploads/2023/02/VITAMIN-C.jpg",
    images: ["https://www.skinandme.com/the-dose/wp-content/uploads/2023/02/VITAMIN-C.jpg"],
    safetyRating: 5,
    scientificEvidence: 5
  },
  {
    id: "niacinamide",
    name: "Niacinamide",
    aliases: ["Vitamin B3", "Nicotinamide"],
    category: "Vitamin/Antioxidant",
    description: "A versatile form of vitamin B3 that helps improve skin texture, strengthen the skin barrier, and regulate oil production.",
    benefits: [
      "Reduces pore appearance and regulates oil production",
      "Improves skin texture and tone",
      "Strengthens skin barrier",
      "Reduces redness and inflammation",
      "Compatible with most other ingredients"
    ],
    concerns: [
      "High concentrations (>10%) may cause irritation in sensitive skin",
      "May cause flushing in some individuals"
    ],
    skinTypes: ["All", "Oily", "Acne-Prone", "Sensitive"],
    commonProducts: ["Serums", "Moisturizers", "Toners"],
    imageUrl: "https://www.dermalogica.co.nz/cdn/shop/articles/new-year-new-skin_520x500_copy_2e16a123-f2c8-41bf-a10d-389c1ae4c65f_520x297_crop_center.jpg?v=1642468904",
    images: ["https://www.dermalogica.co.nz/cdn/shop/articles/new-year-new-skin_520x500_copy_2e16a123-f2c8-41bf-a10d-389c1ae4c65f_520x297_crop_center.jpg?v=1642468904"],
    safetyRating: 5,
    scientificEvidence: 4
  },
  {
    id: "salicylic-acid",
    name: "Salicylic Acid",
    aliases: ["BHA", "Beta Hydroxy Acid"],
    category: "Chemical Exfoliant",
    description: "An oil-soluble beta hydroxy acid (BHA) that penetrates pores to remove excess sebum and exfoliate dead skin cells.",
    benefits: [
      "Unclogs and minimizes pores",
      "Reduces acne and prevents breakouts",
      "Exfoliates skin surface and inside pores",
      "Reduces inflammation and redness"
    ],
    concerns: [
      "Can be drying if overused",
      "May increase sun sensitivity",
      "Not recommended for very dry or sensitive skin types",
      "Not recommended during pregnancy"
    ],
    skinTypes: ["Oily", "Combination", "Acne-Prone"],
    commonProducts: ["Cleansers", "Toners", "Spot Treatments"],
    imageUrl: "https://www.clinique.ro/media/export/cms/ingredients/salicyclic_overview_pc.jpg",
    images: ["https://www.clinique.ro/media/export/cms/ingredients/salicyclic_overview_pc.jpg"],
    safetyRating: 3,
    scientificEvidence: 5
  },
  {
    id: "glycolic-acid",
    name: "Glycolic Acid",
    aliases: ["AHA", "Alpha Hydroxy Acid"],
    category: "Chemical Exfoliant",
    description: "A water-soluble alpha hydroxy acid (AHA) derived from sugarcane that exfoliates the skin's surface and promotes cell renewal.",
    benefits: [
      "Improves skin texture and tone",
      "Reduces fine lines and wrinkles",
      "Helps with hyperpigmentation",
      "Enhances penetration of other skincare products"
    ],
    concerns: [
      "Increases sun sensitivity",
      "Can cause irritation at higher concentrations",
      "Not ideal for sensitive or very dry skin",
      "May cause temporary redness or peeling"
    ],
    skinTypes: ["Normal", "Combination", "Oily", "Sun-Damaged"],
    commonProducts: ["Toners", "Peels", "Serums"],
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ646tJjZFFRFKNIdRXPE0_BG5H8MxbX2D2ww&s",
    images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ646tJjZFFRFKNIdRXPE0_BG5H8MxbX2D2ww&s"],
    safetyRating: 3,
    scientificEvidence: 5
  },
  {
    id: "peptides",
    name: "Peptides",
    aliases: ["Amino Acids", "Polypeptides"],
    category: "Proteins",
    description: "Short chains of amino acids that act as building blocks for proteins like collagen and elastin, helping skin appear firmer and more youthful.",
    benefits: [
      "Stimulates collagen production",
      "Improves skin elasticity and firmness",
      "Reduces fine lines and wrinkles",
      "Strengthens skin barrier"
    ],
    concerns: [
      "Results are generally gradual and subtle",
      "Different types have varying effectiveness",
      "Stability in formulations can be an issue"
    ],
    skinTypes: ["All", "Mature", "Normal", "Dry"],
    commonProducts: ["Serums", "Eye Creams", "Moisturizers"],
    imageUrl: "https://www.skinandme.com/the-dose/wp-content/uploads/2023/12/231206_INGREDIENT_DEEP_DIVE_RESIZED.jpg",
    images: ["https://www.skinandme.com/the-dose/wp/content/uploads/2023/12/231206_INGREDIENT_DEEP_DIVE_RESIZED.jpg"],
    safetyRating: 5,
    scientificEvidence: 3
  },
  {
    id: "ceramides",
    name: "Ceramides",
    aliases: ["Sphingolipids"],
    category: "Lipids",
    description: "Natural lipids that make up about 50% of the skin's outer layer, helping to maintain the skin barrier and retain moisture.",
    benefits: [
      "Strengthens skin barrier function",
      "Retains moisture and prevents water loss",
      "Protects against environmental damage",
      "Soothes inflammation and irritation"
    ],
    concerns: [
      "Different types have varying effectiveness",
      "Some synthetic ceramides may not be as effective"
    ],
    skinTypes: ["All", "Dry", "Sensitive", "Eczema-Prone"],
    commonProducts: ["Moisturizers", "Serums", "Barrier Repair Creams"],
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6esTUfM5QSkaPgaJhMdL_PbiPOY1fEoccQBLH1FdW30qdzOPee_6RG8z5DRqPgXtIQLw&usqp=CAU",
    images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6esTUfM5QSkaPgaJhMdL_PbiPOY1fEoccQBLH1FdW30qdzOPee_6RG8z5DRqPgXtIQLw&usqp=CAU"],
    safetyRating: 5,
    scientificEvidence: 4
  },
  {
    id: "squalane",
    name: "Squalane",
    aliases: ["Squalene", "Hydrogenated Squalene"],
    category: "Emollient",
    description: "A lightweight oil that mimics sebum, derived from plants like olives or sugarcane (traditionally from shark liver).",
    benefits: [
      "Deeply moisturizes without feeling heavy or greasy",
      "Balances oil production",
      "Improves skin elasticity",
      "Non-comedogenic and suitable for all skin types"
    ],
    concerns: [
      "Source matters - plant-derived is more sustainable than animal-derived"
    ],
    skinTypes: ["All", "Oily", "Acne-Prone", "Sensitive", "Dry"],
    commonProducts: ["Oils", "Moisturizers", "Serums"],
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyBRqslWDOJPP7xZh9iAUarweJFDQrfqNo7M6yyKkjuOsXSOkkFMj_LOgRr6nx1Nzf13w&usqp=CAU",
    images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyBRqslWDOJPP7xZh9iAUarweJFDQrfqNo7M6yyKkjuOsXSOkkFMj_LOgRr6nx1Nzf13w&usqp=CAU"],
    safetyRating: 5,
    scientificEvidence: 3
  },
  {
    id: "centella-asiatica",
    name: "Centella Asiatica",
    aliases: ["Gotu Kola", "Cica", "Tiger Grass"],
    category: "Botanical Extract",
    description: "An herb rich in amino acids, beta-carotene, fatty acids, and phytochemicals that soothes and repairs the skin.",
    benefits: [
      "Soothes inflammation and redness",
      "Accelerates wound healing",
      "Stimulates collagen production",
      "Protects against environmental damage"
    ],
    concerns: [
      "Some products contain only small amounts of the active compounds",
      "Rare allergic reactions possible"
    ],
    skinTypes: ["Sensitive", "Irritated", "Acne-Prone", "All"],
    commonProducts: ["Serums", "Creams", "Balms"],
    imageUrl: "https://www.isclinical.co.uk/cdn/shop/articles/ing_centella-asiatica-620x360.png?v=1702560902",
    images: ["https://www.isclinical.co.uk/cdn/shop/articles/ing_centella-asiatica-620x360.png?v=1702560902"],
    safetyRating: 5,
    scientificEvidence: 3
  },
  {
    id: "zinc-oxide",
    name: "Zinc Oxide",
    aliases: ["Non-nano Zinc Oxide"],
    category: "Mineral/Sunscreen",
    description: "A mineral that provides broad-spectrum protection against UVA and UVB rays by reflecting and scattering sunlight.",
    benefits: [
      "Provides physical sun protection",
      "Anti-inflammatory properties",
      "Non-irritating for sensitive skin",
      "Unlikely to clog pores"
    ],
    concerns: [
      "May leave white cast, especially on deeper skin tones",
      "Can feel thick or heavy in some formulations"
    ],
    skinTypes: ["All", "Sensitive", "Acne-Prone"],
    commonProducts: ["Sunscreens", "BB Creams", "Mineral Makeup"],
    imageUrl: "https://shop96018.sfstatic.io/upload_dir/shop/raavarer/_thumbs/zinkoxid-50g.w1200.jpg",
    images: ["https://shop96018.sfstatic.io/upload_dir/shop/raavarer/_thumbs/zinkoxid-50g.w1200.jpg"],
    safetyRating: 5,
    scientificEvidence: 5
  },
  {
    id: "tea-tree-oil",
    name: "Tea Tree Oil",
    aliases: ["Melaleuca Alternifolia Leaf Oil"],
    category: "Essential Oil",
    description: "An essential oil with antimicrobial and anti-inflammatory properties, commonly used for treating acne and fungal infections.",
    benefits: [
      "Reduces acne-causing bacteria",
      "Decreases inflammation",
      "Helps control oil production",
      "Soothes itchiness and irritation"
    ],
    concerns: [
      "Can be drying and irritating in high concentrations",
      "Should always be diluted before applying to skin",
      "May cause allergic reactions in some individuals"
    ],
    skinTypes: ["Oily", "Acne-Prone", "Fungal Acne-Prone"],
    commonProducts: ["Spot Treatments", "Cleansers", "Toners"],
    imageUrl: "https://lovebeautyandplanet.in/cdn/shop/articles/oil_520-x-373.jpg?v=1700202704",
    images: ["https://lovebeautyandplanet.in/cdn/shop/articles/oil_520-x-373.jpg?v=1700202704"],
    safetyRating: 3,
    scientificEvidence: 3
  }
];

// Helper functions to work with the ingredient data
export const getAllIngredients = () => ingredients;

export const getIngredientById = (id) => ingredients.find(ingredient => ingredient.id === id);

export const getIngredientsByCategory = (category) => 
  ingredients.filter(ingredient => ingredient.category.toLowerCase() === category.toLowerCase());

export const getIngredientsBySkinType = (skinType) => 
  ingredients.filter(ingredient => ingredient.skinTypes.includes(skinType));

export default ingredients;
