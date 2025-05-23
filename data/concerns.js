const concerns = {
  'acne': {
    id: 'Acne',
    image: '/images/concerns/acne.jpg',
    overview: `Acne is a common skin condition that occurs when hair follicles become clogged with oil and dead skin cells. It often causes whiteheads, blackheads or pimples, and usually appears on the face, forehead, chest, upper back and shoulders. Acne is most common among teenagers, though it affects people of all ages. 
    
Acne can range from mild to severe and may result in scarring or dark spots if not managed properly. Factors such as hormonal fluctuations, stress, diet, and genetics can all play a role in the development and persistence of acne. While it can be frustrating, a consistent skincare routine and targeted treatments can significantly improve the appearance of acne-prone skin. Early intervention and gentle care are key to minimizing breakouts and preventing long-term skin damage. If over-the-counter treatments are not effective, consulting a dermatologist is recommended for personalized care.

Acne is not just a cosmetic issue—it can have a significant impact on self-esteem and emotional well-being. The psychological effects of acne, especially in adolescents and young adults, can include anxiety, social withdrawal, and even depression. Understanding that acne is a medical condition and not a result of poor hygiene is important for reducing stigma and shame. Treatment options have evolved, and there are now many effective therapies available, from topical and oral medications to light-based therapies and chemical peels. It's also important to recognize that acne can be influenced by lifestyle factors such as sleep, diet, and stress management. Keeping a diary of breakouts and potential triggers can help identify patterns and inform treatment choices. Remember, improvement takes time—most treatments require several weeks to show results, and patience is essential. Avoiding harsh scrubbing, picking, or using too many products at once can prevent further irritation and support the skin's natural healing process. For persistent or severe cases, professional guidance ensures the best outcomes and minimizes the risk of scarring.`,
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
    relatedConcerns: ['hyperpigmentation', 'redness', 'sensitivity']
  },
  'aging': {
    id: 'Aging',
    image: '/images/concerns/aging.jpg',
    overview: `Aging skin is a natural process characterized by fine lines, wrinkles, loss of elasticity, and changes in texture. While aging is inevitable, several factors can accelerate it, including sun exposure, pollution, lifestyle habits, and genetics. Many skincare approaches can help minimize visible signs of aging and maintain healthier, more youthful-looking skin.

As we age, the skin's ability to repair itself slows down, leading to a gradual breakdown of collagen and elastin fibers. This results in sagging, dullness, and the formation of age spots or uneven pigmentation. Environmental stressors, such as UV rays and pollution, can further speed up the aging process. Adopting a proactive skincare regimen that includes sun protection, antioxidants, and retinoids can help preserve skin vitality. In addition, healthy lifestyle choices like balanced nutrition, regular exercise, and adequate sleep contribute to overall skin health and resilience.

The aging process is influenced by both intrinsic (genetic) and extrinsic (environmental) factors. Intrinsic aging is a slow, natural process that begins in our mid-20s, while extrinsic aging is largely preventable and results from external factors like sun exposure, smoking, and pollution. Signs of aging can include not only wrinkles and fine lines, but also thinning skin, enlarged pores, dryness, and a loss of radiance. Prevention is key—daily use of sunscreen is the most effective way to slow visible aging. Antioxidants such as vitamin C and E help neutralize free radicals, while peptides and growth factors can stimulate collagen production. Professional treatments like microneedling, laser resurfacing, and injectables offer additional options for those seeking more dramatic results. It's important to set realistic expectations and understand that while skincare can improve and maintain skin quality, it cannot stop the aging process entirely. Embracing aging as a natural part of life, while caring for your skin, can foster confidence and a positive self-image at any age.`,
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
    relatedConcerns: ['dryness', 'hyperpigmentation', 'sensitivity']
  },
  'dryness': {
    id: 'Dryness',
    image: '/images/concerns/dryness.jpg',
    overview: `Dry skin occurs when your skin doesn't have enough moisture and natural oils. It can feel tight, rough, and may show visible flaking. Dry skin can be a temporary condition or a lifelong concern, affecting any part of the body but commonly appearing on the hands, arms, and legs. With proper care and hydrating products, dry skin can be managed effectively.

Dryness can be caused by environmental factors such as cold weather, low humidity, or excessive exposure to water and harsh soaps. It may also be linked to aging, genetics, or underlying skin conditions like eczema. Symptoms can include itching, redness, and even cracking in severe cases. To combat dryness, it's important to use gentle cleansers, rich moisturizers, and avoid long, hot showers. Incorporating hydrating serums and protecting the skin barrier can restore comfort and suppleness. Regular care and attention can help prevent flare-ups and maintain healthy, hydrated skin.

Chronic dryness can lead to complications such as eczema, increased sensitivity, and a compromised skin barrier, making the skin more susceptible to irritation and infection. The skin's natural barrier is composed of lipids and proteins that help retain moisture and protect against environmental aggressors. When this barrier is disrupted, water loss increases and irritants can penetrate more easily. Choosing products with ingredients like ceramides, hyaluronic acid, and squalane can help repair and reinforce the barrier. Lifestyle adjustments, such as using a humidifier, wearing gloves in cold weather, and avoiding harsh detergents, can also make a significant difference. It's important to tailor your skincare routine to the seasons and your skin's changing needs. For persistent or severe dryness, especially if accompanied by redness, swelling, or pain, consult a dermatologist to rule out underlying conditions and receive targeted treatment. Remember, healthy skin is comfortable, resilient, and able to protect itself from daily stressors.`,
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
    relatedConcerns: ['sensitivity', 'aging', 'redness']
  },
  'redness': {
    id: 'redness',
    image: '/images/concerns/redness.jpg',
    overview: `Facial redness is a common skin concern characterized by flushing, visible blood vessels, and sometimes persistent redness across the cheeks, nose, forehead, or chin. It can be triggered by various factors and may be associated with conditions like rosacea or sensitive skin. With careful management and the right skincare approach, redness can often be reduced.

Redness may be temporary or chronic, and can be exacerbated by environmental triggers, spicy foods, alcohol, or emotional stress. For some, it is a sign of underlying skin sensitivity or inflammatory conditions. Managing redness involves identifying and avoiding triggers, using soothing and anti-inflammatory ingredients, and protecting the skin from sun and harsh weather. In persistent or severe cases, professional evaluation may be necessary to rule out medical conditions and receive targeted treatments.

Redness can also be a symptom of underlying vascular conditions, allergies, or reactions to skincare products. It is important to distinguish between occasional flushing and chronic redness, as the latter may require medical intervention. Common triggers include temperature extremes, wind, hot beverages, and certain medications. Building a gentle skincare routine that avoids alcohol, fragrance, and harsh exfoliants is essential. Ingredients like centella asiatica, niacinamide, and green tea extract can help calm inflammation and strengthen the skin barrier. In addition to topical care, lifestyle modifications such as stress management, dietary adjustments, and sun avoidance can help control symptoms. For those with rosacea or persistent redness, prescription treatments and laser therapy may be recommended. Keeping a symptom diary and working with a dermatologist can help identify patterns and develop an effective management plan. Remember, everyone's skin is unique, and what works for one person may not work for another—patience and persistence are key.`,
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
    relatedConcerns: ['sensitivity', 'acne', 'dryness']
  },
  'hyperpigmentation': {
    id: 'Hyperpigmentation',
    image: '/images/concerns/hyperpigmentation.jpg',
    overview: `Hyperpigmentation refers to patches of skin that become darker than the surrounding areas due to excess melanin production. It can appear as sun spots, melasma, post-inflammatory hyperpigmentation from acne, or other forms of discoloration. While not harmful, many people seek treatments to achieve a more even skin tone.

This condition can affect all skin types and is often triggered by sun exposure, hormonal changes, or skin injuries. Hyperpigmentation can be stubborn and may take months to fade, especially if not addressed early. Preventing further darkening with diligent sun protection is crucial. Brightening ingredients, chemical exfoliants, and professional treatments can help lighten existing spots and promote a more uniform complexion. Consistency and patience are essential, as results develop gradually over time.

There are several types of hyperpigmentation, including melasma (often hormone-related), sun-induced lentigines (age spots), and post-inflammatory hyperpigmentation (PIH) that follows acne or injury. Each type may respond differently to treatment, and a tailored approach is often necessary. Sun protection is the cornerstone of prevention and treatment—UV exposure not only triggers new pigmentation but also darkens existing spots. Ingredients like vitamin C, niacinamide, and alpha arbutin can help inhibit melanin production, while exfoliants like glycolic acid promote cell turnover. For stubborn cases, dermatologists may recommend prescription creams, chemical peels, or laser therapy. It's important to avoid aggressive treatments that can irritate the skin and worsen pigmentation, especially for those with deeper skin tones. Emotional support and realistic expectations are important, as hyperpigmentation can affect self-confidence and may take time to improve. Celebrate small progress and stay consistent with your routine for the best results.`,
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
    relatedConcerns: ['acne', 'aging', 'sensitivity']
  },
  'sensitivity': {
    id: 'Sensitivity',
    image: '/images/concerns/sensitivity.jpg',
    overview: `Sensitive skin is characterized by reactions such as redness, itching, burning, and stinging in response to skincare products, environmental factors, or other triggers. People with sensitive skin require gentle, soothing products and a minimalist approach to skincare. Understanding your specific triggers is key to managing sensitive skin effectively.

Sensitivity can be caused by a weakened skin barrier, genetic factors, or underlying conditions like eczema or rosacea. Environmental stressors, harsh ingredients, and over-exfoliation can worsen symptoms. Those with sensitive skin should prioritize barrier-repairing and calming ingredients, avoid unnecessary additives, and introduce new products slowly. Keeping a skincare diary can help identify patterns and triggers. With the right care, sensitive skin can become more resilient and comfortable over time.

Sensitive skin is not a medical diagnosis but rather a description of symptoms that can vary from person to person. It may be temporary or chronic, and can be triggered by weather changes, pollution, stress, or hormonal fluctuations. The skin barrier plays a crucial role in protecting against irritants and retaining moisture—when compromised, it leads to increased reactivity. Choosing fragrance-free, hypoallergenic products and avoiding known irritants is essential. Patch testing new products before full application can prevent widespread reactions. In some cases, sensitivity may be a sign of underlying conditions such as contact dermatitis, allergies, or autoimmune disorders, and professional evaluation is warranted. Building a simple, consistent routine and giving your skin time to adjust to new products can help restore balance. Remember, sensitive skin requires patience and gentle care—less is often more when it comes to product selection and application.`,
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
    relatedConcerns: ['redness', 'dryness', 'acne']
  }
};

export function getConcernById(id) {
  return concerns[id];
}

export function getAllConcerns() {
  return Object.values(concerns);
}

export default concerns;
