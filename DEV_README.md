# Developer Dashboard

This developer dashboard allows authorized users to manage products and ingredients in the Dermify application.

## Access

The dev page is accessible at `/dev` and is protected by authentication. Only users with specific email addresses can access this page:

- `admin@dermify.com`
- `dev@dermify.com`

To add your email to the authorized list, edit the `authorizedDevs` array in:
- `/app/dev/page.js` (for the dev page access)
- `/components/Header.js` (for the navigation link)

## Features

### Products Manager
- **View All Products**: Browse all products with search and filter capabilities
- **Add New Products**: Create new products with all required fields
- **Edit Products**: Modify existing product information
- **Delete Products**: Remove products from the database
- **Search & Filter**: Find products by name, brand, or category

#### Product Fields:
- Brand (required)
- Product Name (required)
- Price
- Rating (0-5)
- Category (required)
- Description
- Image URL
- Purchase URL
- Skin Types (checkboxes for Normal, Dry, Sensitive, Combination, Oily)

### Ingredients Manager
- **View All Ingredients**: Browse all ingredients with search and filter capabilities
- **Add New Ingredients**: Create new ingredients with comprehensive information
- **Edit Ingredients**: Modify existing ingredient data
- **Delete Ingredients**: Remove ingredients from the database
- **Search & Filter**: Find ingredients by name, description, or category

#### Ingredient Fields:
- Ingredient Name (required)
- Category (required)
- Description (required)
- Safety Rating (1-5)
- Scientific Evidence (1-5)
- Image URL
- Aliases (one per line)
- Skin Types (one per line)
- Benefits (one per line)
- Concerns (one per line)
- Common Products (one per line)

## Data Storage

- Products are stored in `/data/products.js`
- Ingredients are stored in `/data/ingredients.js`

## Backup System

The system automatically creates backups before modifying files:
- Backups are stored in `/backups/` directory
- Up to 10 backups are kept per file
- Backups include timestamp in filename

## API Endpoints

### Products API (`/api/dev/products`)
- `GET`: Retrieve all products
- `POST`: Add new product
- `PUT`: Update existing product
- `DELETE`: Remove product

### Ingredients API (`/api/dev/ingredients`)
- `GET`: Retrieve all ingredients
- `POST`: Add new ingredient
- `PUT`: Update existing ingredient
- `DELETE`: Remove ingredient

## Security

- Page access is restricted to authorized email addresses
- Authentication required to access any dev features
- Automatic logout redirect for unauthorized users

## Usage Tips

1. **Adding Products**: Fill out all required fields (marked with *). The ID will be auto-generated from brand and name.

2. **Skin Types**: For products, use checkboxes. For ingredients, list one skin type per line in the text area.

3. **Arrays**: For ingredients, use the text areas to add multiple items (one per line):
   - Aliases: Alternative names for the ingredient
   - Benefits: Positive effects of the ingredient
   - Concerns: Potential issues or warnings
   - Skin Types: Suitable skin types
   - Common Products: Types of products that contain this ingredient

4. **Images**: Use full URLs for images. The system will handle image validation.

5. **Search**: Use the search bars to quickly find specific products or ingredients.

6. **Categories**: Make sure to select appropriate categories for better organization.

## Troubleshooting

- If changes don't appear immediately, try refreshing the page
- Check browser console for any error messages
- Ensure all required fields are filled before submitting
- Contact the development team if you encounter persistent issues
