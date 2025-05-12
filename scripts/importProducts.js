/**
 * Script to import products from a CSV file to the products.js data module
 * Run with: node scripts/importProducts.js
 */

const fs = require('fs');
const path = require('path');

// Path configurations
const CSV_FILE_PATH = path.join(__dirname, '../cosmetic_p.csv');
const OUTPUT_FILE_PATH = path.join(__dirname, '../data/products.js');

// Function to convert a string to kebab-case for IDs
function toKebabCase(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Function to parse boolean values from CSV
function parseBoolean(value) {
  if (typeof value === 'string') {
    value = value.trim().toLowerCase();
    return value === 'true' || value === 'yes' || value === '1';
  }
  return !!value;
}

// Helper function to parse CSV directly (since we can't import from csvUtils.js in a Node.js script)
function parseCSV(csvString) {
  // Split the CSV into rows
  const rows = csvString.trim().split(/\r?\n/);
  if (rows.length === 0) return [];
  
  // Get headers from first row
  const headers = rows[0].split(',').map(header => header.trim());
  const result = [];
  
  // Process data rows
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].trim();
    if (!row) continue; // Skip empty rows
    
    // Handle quoted values with commas inside them
    let values = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let j = 0; j < row.length; j++) {
      const char = row[j];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    values.push(currentValue);
    
    // Create object using headers
    const obj = {};
    headers.forEach((header, index) => {
      if (index < values.length) {
        let value = values[index].trim().replace(/^"|"$/g, ''); // Remove wrapping quotes
        obj[header] = value;
      }
    });
    
    result.push(obj);
  }
  
  return result;
}

// Main function to import products
async function importProducts() {
  console.log('Starting import process...');
  
  try {
    // Check if CSV file exists
    if (!fs.existsSync(CSV_FILE_PATH)) {
      console.error(`CSV file not found: ${CSV_FILE_PATH}`);
      process.exit(1);
    }
    
    // Read the CSV file
    const csvData = fs.readFileSync(CSV_FILE_PATH, 'utf8');
    console.log(`CSV file loaded: ${CSV_FILE_PATH}`);
    
    // Parse the CSV data
    const productsData = parseCSV(csvData);
    
    console.log(`Found ${productsData.length} products in the CSV file.`);
    
    // Transform CSV data to the format needed for our application
    const formattedProducts = productsData.map((row, index) => {
      // Generate an ID if not present
      const id = toKebabCase(row.brand) + '-' + toKebabCase(row.name) || `product-${index}`;
      
      // Determine the category based on the label or use a default
      let category = 'other';
      const label = (row.label || '').toLowerCase();
      
      if (label.includes('cleanser') || label.includes('wash')) {
        category = 'cleansers';
      } else if (label.includes('moisturizer') || label.includes('cream') || label.includes('lotion')) {
        category = 'moisturizers';
      } else if (label.includes('serum') || label.includes('essence') || label.includes('ampoule')) {
        category = 'serums';
      } else if (label.includes('sunscreen') || label.includes('spf')) {
        category = 'sunscreens';
      } else if (label.includes('mask')) {
        category = 'masks';
      } else if (label.includes('toner')) {
        category = 'toners';
      }
      
      // Create the product object
      return {
        id: id,
        label: row.label || '',
        brand: row.brand || '',
        name: row.name || '',
        price: parseFloat(row.price) || 0,
        rank: parseFloat(row.rank) || 0,
        ingredients: row.ingredients || '',
        skinTypes: {
          combination: parseBoolean(row.Combination),
          dry: parseBoolean(row.Dry),
          normal: parseBoolean(row.Normal),
          oily: parseBoolean(row.Oily),
          sensitive: parseBoolean(row.Sensitive)
        },
        imageUrl: row.imageUrl || `/images/products/${category}-${(index % 3) + 1}.jpg`,
        category: category
      };
    });
    
    // Generate the JavaScript module content
    const moduleContent = `/**
 * Products data imported from CSV
 * Generated on ${new Date().toISOString()}
 */

const products = ${JSON.stringify(formattedProducts, null, 2)};

// Helper functions to work with the product data
export const getAllProducts = () => products;

export const getProductById = (id) => products.find(product => product.id === id);

export const getProductsByCategory = (category) => products.filter(product => product.category === category);

export const getProductsByBrand = (brand) => products.filter(product => product.brand === brand);

export const getProductsBySkinType = (skinType) => {
  return products.filter(product => {
    return product.skinTypes && product.skinTypes[skinType.toLowerCase()];
  });
};

export default products;
`;
    
    // Create the output directory if it doesn't exist
    const outputDir = path.dirname(OUTPUT_FILE_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write to the output file
    fs.writeFileSync(OUTPUT_FILE_PATH, moduleContent, 'utf8');
    console.log(`Successfully imported ${formattedProducts.length} products to ${OUTPUT_FILE_PATH}`);
    
  } catch (error) {
    console.error('Error importing products:', error);
    process.exit(1);
  }
}

// Run the import function
importProducts();
