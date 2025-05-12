const concerns = {
  'acne': {
    id: 'acne',
    image: '/images/concerns/acne.jpg',
    overview: `Acne is a common skin condition that occurs when hair follicles become clogged with oil and dead skin cells. It often causes whiteheads, blackheads or pimples, and usually appears on the face, forehead, chest, upper back and shoulders. Acne is most common among teenagers, though it affects people of all ages.`,
    causes: [
      'Excess oil (sebum) production',
      'Hair follicles clogged by oil and dead skin cells',
      'Bacteria (Propionibacterium acnes)',
      'Inflammation',
      'Hormonal changes',
      'Certain medications',
      'Diet high in refined sugars or dairy',
      'Stress'
    ],
    treatments: [
      'Regular cleansing with gentle, non-comedogenic cleansers',
      'Topical treatments containing salicylic acid, benzoyl peroxide, or retinoids',
      'Oral medications for severe cases (antibiotics, hormonal treatments, isotretinoin)',
      'Avoiding picking or popping pimples',
      'Consistent skincare routine morning and night'
    ],
    recommendedIngredients: [
      {
        name: 'Salicylic Acid',
        description: 'A beta hydroxy acid (BHA) that penetrates pores and exfoliates from within'
      },
      {
        name: 'Benzoyl Peroxide',
        description: 'Kills acne-causing bacteria and helps remove excess oil and dead skin cells'
      },
      {
        name: 'Niacinamide',
        description: 'Reduces inflammation and regulates oil production'
      },
      {
        name: 'Tea Tree Oil',
        description: 'Natural antibacterial agent that helps fight acne-causing bacteria'
      },
      {
        name: 'Retinoids',
        description: 'Prevent clogged pores and accelerate cell turnover'
      }
    ],
    recommendedProducts: [
      'purifying-cleanser',
      'oil-free-moisturizer',
      'salicylic-acid-serum'
    ],
    tips: [
      'Wash your face twice daily with a gentle cleanser',
      'Avoid touching your face throughout the day',
      'Change pillowcases regularly',
      'Maintain a balanced diet low in refined sugars',
      'Stay hydrated',
      'Manage stress through exercise, meditation, or other relaxation techniques'
    ],
    relatedConcerns: ['oiliness', 'redness', 'scarring']
  },
  'aging': {
    id: 'aging',
    image: '/images/concerns/aging.jpg',
    overview: `Aging skin is a natural process characterized by fine lines, wrinkles, loss of elasticity, and changes in texture. While aging is inevitable, several factors can accelerate it, including sun exposure, pollution, lifestyle habits, and genetics. Many skincare approaches can help minimize visible signs of aging and maintain healthier, more youthful-looking skin.`,
    causes: [
      'Sun exposure and UV damage (photoaging)',
      'Free radical damage',
      'Decreased collagen and elastin production',
      'Loss of facial fat and bone density',
      'Decreased cell turnover',
      'Genetics',
      'Smoking and alcohol consumption',
      'Poor nutrition and dehydration'
    ],
    treatments: [
      'Consistent use of broad-spectrum sunscreen',
      'Topical retinoids to stimulate collagen production',
      'Antioxidant serums (vitamin C, E, etc.)',
      'Peptide-containing products',
      'Hydrating ingredients like hyaluronic acid',
      'Professional treatments (chemical peels, microdermabrasion, laser therapy)'
    ],
    recommendedIngredients: [
      {
        name: 'Retinol',
        description: 'Stimulates collagen production and accelerates cell turnover'
      },
      {
        name: 'Vitamin C',
        description: 'Potent antioxidant that brightens skin and boosts collagen production'
      },
      {
        name: 'Peptides',
        description: 'Signal skin to produce more collagen and improve elasticity'
      },
      {
        name: 'Hyaluronic Acid',
        description: 'Hydrates skin and plumps to reduce the appearance of fine lines'
      },
      {
        name: 'Niacinamide',
        description: 'Improves skin elasticity, reduces fine lines and discoloration'
      }
    ],
    recommendedProducts: [
      'retinol-serum',
      'vitamin-c-serum',
      'hyaluronic-acid-serum'
    ],
    tips: [
      'Use sunscreen daily, even on cloudy days',
      'Stay hydrated by drinking plenty of water',
      'Eat a diet rich in antioxidants (fruits, vegetables)',
      'Get adequate sleep to allow skin repair',
      'Avoid smoking and limit alcohol consumption',
      'Use gentle, non-stripping skincare products'
    ],
    relatedConcerns: ['dryness', 'hyperpigmentation', 'loss-of-firmness']
  },
  'dryness': {
    id: 'dryness',
    image: '/images/concerns/dryness.jpg',
    overview: `Dry skin occurs when your skin doesn't have enough moisture and natural oils. It can feel tight, rough, and may show visible flaking. Dry skin can be a temporary condition or a lifelong concern, affecting any part of the body but commonly appearing on the hands, arms, and legs. With proper care and hydrating products, dry skin can be managed effectively.`,
    causes: [
      'Weather conditions (cold, dry air, low humidity)',
      'Hot baths and showers',
      'Harsh soaps and cleansers',
      'Age (skin naturally becomes drier)',
      'Certain medical conditions (eczema, psoriasis)',
      'Dehydration',
      'Indoor heating or air conditioning',
      'Genetic predisposition'
    ],
    treatments: [
      'Gentle, non-foaming cleansers',
      'Rich moisturizers containing humectants, emollients, and occlusives',
      'Hydrating serums with hyaluronic acid',
      'Using a humidifier in dry environments',
      'Avoiding very hot water when bathing',
      'Regular exfoliation (but not excessive)'
    ],
    recommendedIngredients: [
      {
        name: 'Hyaluronic Acid',
        description: 'Attracts and holds water in the skin'
      },
      {
        name: 'Glycerin',
        description: 'Humectant that draws moisture into the skin'
      },
      {
        name: 'Ceramides',
        description: 'Helps restore the skin barrier and prevent moisture loss'
      },
      {
        name: 'Squalane',
        description: 'Lightweight oil that mimics natural skin oils'
      },
      {
        name: 'Shea Butter',
        description: 'Rich emollient that softens and conditions dry skin'
      }
    ],
    recommendedProducts: [
      'hydrating-cleanser',
      'intense-hydration',
      'hyaluronic-acid-serum'
    ],
    tips: [
      'Apply moisturizer immediately after bathing while skin is still damp',
      'Limit shower time to 5-10 minutes and use lukewarm water',
      'Layer skincare products from thinnest to thickest consistency',
      'Consider sleeping with a humidifier in your bedroom',
      'Drink plenty of water throughout the day',
      'Avoid skincare products containing alcohol or fragrances'
    ],
    relatedConcerns: ['sensitivity', 'flakiness', 'dehydration']
  },
  'redness': {
    id: 'redness',
    image: '/images/concerns/redness.jpg',
    overview: `Facial redness is a common skin concern characterized by flushing, visible blood vessels, and sometimes persistent redness across the cheeks, nose, forehead, or chin. It can be triggered by various factors and may be associated with conditions like rosacea or sensitive skin. With careful management and the right skincare approach, redness can often be reduced.`,
    causes: [
      'Rosacea',
      'Sensitive or reactive skin',
      'Sun exposure',
      'Extreme temperatures (hot or cold)',
      'Spicy foods or hot beverages',
      'Alcohol consumption',
      'Certain skincare ingredients (alcohol, fragrance, strong acids)',
      'Stress or emotion-triggered flushing'
    ],
    treatments: [
      'Gentle, fragrance-free skincare products',
      'Soothing ingredients like aloe, centella asiatica, and chamomile',
      'Sun protection to prevent flare-ups',
      'Color-correcting makeup (green tints)',
      'Avoiding known triggers',
      'Cool compresses for temporary relief',
      'Prescription treatments for rosacea if needed'
    ],
    recommendedIngredients: [
      {
        name: 'Centella Asiatica (Cica)',
        description: 'Reduces inflammation and promotes healing'
      },
      {
        name: 'Aloe Vera',
        description: 'Soothes irritated skin and reduces redness'
      },
      {
        name: 'Green Tea Extract',
        description: 'Antioxidant with anti-inflammatory properties'
      },
      {
        name: 'Niacinamide',
        description: 'Strengthens skin barrier and reduces redness'
      },
      {
        name: 'Azelaic Acid',
        description: 'Reduces inflammation and redness, particularly for rosacea'
      }
    ],
    recommendedProducts: [
      'gentle-cleanser',
      'soothing-serum',
      'calming-moisturizer'
    ],
    tips: [
      'Always patch test new products before applying to the entire face',
      'Use lukewarm (never hot) water when cleansing',
      'Apply sunscreen daily, preferably mineral-based formulas',
      'Avoid rubbing or scrubbing the face',
      'Keep a diary to identify personal redness triggers',
      'Consider using a jade roller (kept in the refrigerator) to soothe redness'
    ],
    relatedConcerns: ['sensitivity', 'inflammation', 'rosacea']
  },
  'hyperpigmentation': {
    id: 'hyperpigmentation',
    image: '/images/concerns/hyperpigmentation.jpg',
    overview: `Hyperpigmentation refers to patches of skin that become darker than the surrounding areas due to excess melanin production. It can appear as sun spots, melasma, post-inflammatory hyperpigmentation from acne, or other forms of discoloration. While not harmful, many people seek treatments to achieve a more even skin tone.`,
    causes: [
      'Sun exposure (UV damage)',
      'Hormonal changes (pregnancy, birth control)',
      'Post-inflammatory response (after acne, injury, or inflammation)',
      'Aging',
      'Certain medications',
      'Genetics',
      'Endocrine disorders'
    ],
    treatments: [
      'Consistent sun protection',
      'Brightening ingredients (vitamin C, niacinamide, etc.)',
      'Chemical exfoliation with AHAs/BHAs',
      'Targeted treatments with ingredients like hydroquinone, kojic acid, or arbutin',
      'Professional treatments (chemical peels, microdermabrasion, laser therapy)'
    ],
    recommendedIngredients: [
      {
        name: 'Vitamin C',
        description: 'Brightens skin, prevents melanin production, and provides antioxidant protection'
      },
      {
        name: 'Alpha Arbutin',
        description: 'Inhibits melanin production without irritation'
      },
      {
        name: 'Tranexamic Acid',
        description: 'Addresses stubborn pigmentation, especially melasma'
      },
      {
        name: 'Glycolic Acid',
        description: 'Exfoliates to remove darkened skin cells and reveal brighter skin'
      },
      {
        name: 'Niacinamide',
        description: 'Inhibits melanin transfer to skin cells and has anti-inflammatory properties'
      }
    ],
    recommendedProducts: [
      'vitamin-c-serum',
      'dark-spot-corrector',
      'glycolic-acid-toner'
    ],
    tips: [
      'Apply broad-spectrum sunscreen with at least SPF 30 daily',
      'Reapply sunscreen every two hours when outdoors',
      'Be patient—hyperpigmentation treatments take time to show results (8-12 weeks minimum)',
      'Avoid picking at acne to prevent post-inflammatory hyperpigmentation',
      'Use wide-brimmed hats and seek shade when outdoors',
      'Be consistent with your brightening skincare routine'
    ],
    relatedConcerns: ['sun-damage', 'melasma', 'post-inflammatory-hyperpigmentation']
  },
  'sensitivity': {
    id: 'sensitivity',
    image: '/images/concerns/sensitivity.jpg',
    overview: `Sensitive skin is characterized by reactions such as redness, itching, burning, and stinging in response to skincare products, environmental factors, or other triggers. People with sensitive skin require gentle, soothing products and a minimalist approach to skincare. Understanding your specific triggers is key to managing sensitive skin effectively.`,
    causes: [
      'Thinner skin barrier',
      'Genetic predisposition',
      'Environmental factors (pollution, weather changes)',
      'Allergies or skin conditions (eczema, rosacea)',
      'Certain skincare ingredients (fragrances, alcohols, strong acids)',
      'Over-exfoliation',
      'Stress',
      'Hormonal fluctuations'
    ],
    treatments: [
      'Minimal, fragrance-free skincare routine',
      'Products designed specifically for sensitive skin',
      'Soothing and barrier-repairing ingredients',
      'Patch testing new products',
      'Avoiding known irritants',
      'Gentle cleansing methods'
    ],
    recommendedIngredients: [
      {
        name: 'Ceramides',
        description: 'Strengthen the skin barrier to reduce sensitivity'
      },
      {
        name: 'Colloidal Oatmeal',
        description: 'Soothes irritation and has anti-inflammatory properties'
      },
      {
        name: 'Centella Asiatica',
        description: 'Calms inflammation and promotes healing'
      },
      {
        name: 'Allantoin',
        description: 'Soothes, protects, and promotes cell regeneration'
      },
      {
        name: 'Glycerin',
        description: 'Hydrates without irritation'
      }
    ],
    recommendedProducts: [
      'gentle-cleanser',
      'soothing-serum',
      'barrier-repair-cream'
    ],
    tips: [
      'Always patch test new products before full-face application',
      'Use lukewarm water (never hot) when cleansing',
      'Introduce new products one at a time, waiting at least a week between additions',
      'Consider using mineral sunscreens instead of chemical ones',
      'Remove makeup with gentle cleansers or micellar water, not wipes',
      'Simplify your routine during flare-ups',
      'Keep a diary to identify potential triggers'
    ],
    relatedConcerns: ['redness', 'inflammation', 'dryness']
  }
};

export function getConcernById(id) {
  return concerns[id];
}

export function getAllConcerns() {
  return Object.values(concerns);
}

export default concerns;
