import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createBackup } from '@/lib/backup';
import { getAllIngredients } from '@/data/ingredients';

const INGREDIENTS_FILE_PATH = path.join(process.cwd(), 'data', 'ingredients.js');

// Helper function to read the current ingredients file
function readIngredientsFile() {
  try {
    // Use the existing getAllIngredients function for reading
    return getAllIngredients();
  } catch (error) {
    console.error('Error reading ingredients file:', error);
    return [];
  }
}

// Helper function to write ingredients to file
function writeIngredientsFile(ingredients) {
  try {
    // Create backup before modifying
    createBackup(INGREDIENTS_FILE_PATH);
    
    const fileContent = `const ingredients = ${JSON.stringify(ingredients, null, 2)};

export { ingredients };
export const getAllIngredients = () => ingredients;
export const getIngredientById = (id) => ingredients.find(i => i.id === id);
export const getIngredientsByCategory = (category) => ingredients.filter(i => i.category === category);
export const searchIngredients = (query) => {
  const searchLower = query.toLowerCase();
  return ingredients.filter(ingredient => 
    ingredient.name.toLowerCase().includes(searchLower) ||
    ingredient.description?.toLowerCase().includes(searchLower) ||
    ingredient.aliases?.some(alias => alias.toLowerCase().includes(searchLower))
  );
};`;

    fs.writeFileSync(INGREDIENTS_FILE_PATH, fileContent, 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing ingredients file:', error);
    return false;
  }
}

// GET - Get all ingredients (for the dev interface)
export async function GET() {
  try {
    const ingredients = readIngredientsFile();
    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return NextResponse.json({ error: 'Failed to fetch ingredients' }, { status: 500 });
  }
}

// POST - Add new ingredient
export async function POST(request) {
  try {
    const newIngredient = await request.json();
    const ingredients = [...readIngredientsFile()]; // Create a copy of the array
    
    // Check if ingredient with same ID already exists
    if (ingredients.find(i => i.id === newIngredient.id)) {
      return NextResponse.json({ error: 'Ingredient with this ID already exists' }, { status: 400 });
    }
    
    // Add the new ingredient
    ingredients.push(newIngredient);
    
    // Write back to file
    const success = writeIngredientsFile(ingredients);
    if (!success) {
      return NextResponse.json({ error: 'Failed to save ingredient' }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Ingredient added successfully', ingredient: newIngredient });
  } catch (error) {
    console.error('Error adding ingredient:', error);
    return NextResponse.json({ error: 'Failed to add ingredient' }, { status: 500 });
  }
}

// PUT - Update existing ingredient
export async function PUT(request) {
  try {
    const updatedIngredient = await request.json();
    const ingredients = [...readIngredientsFile()]; // Create a copy of the array
    
    // Find the ingredient index
    const ingredientIndex = ingredients.findIndex(i => i.id === updatedIngredient.id);
    if (ingredientIndex === -1) {
      return NextResponse.json({ error: 'Ingredient not found' }, { status: 404 });
    }
    
    // Update the ingredient
    ingredients[ingredientIndex] = updatedIngredient;
    
    // Write back to file
    const success = writeIngredientsFile(ingredients);
    if (!success) {
      return NextResponse.json({ error: 'Failed to update ingredient' }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Ingredient updated successfully', ingredient: updatedIngredient });
  } catch (error) {
    console.error('Error updating ingredient:', error);
    return NextResponse.json({ error: 'Failed to update ingredient' }, { status: 500 });
  }
}

// DELETE - Remove ingredient
export async function DELETE(request) {
  try {
    console.log('DELETE request received for ingredients');
    
    // Parse request body
    let requestData;
    try {
      requestData = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { id } = requestData;
    
    // Validate input
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.error('Invalid or missing ingredient ID:', id);
      return NextResponse.json({ error: 'Valid ingredient ID is required' }, { status: 400 });
    }

    console.log('Attempting to delete ingredient with ID:', id);
    
    // Read current ingredients
    let ingredients;
    try {
      ingredients = [...readIngredientsFile()]; // Create a copy of the array
    } catch (readError) {
      console.error('Failed to read ingredients file:', readError);
      return NextResponse.json({ error: 'Failed to read ingredients data' }, { status: 500 });
    }

    console.log(`Found ${ingredients.length} ingredients in database`);
    
    // Find the ingredient index
    const ingredientIndex = ingredients.findIndex(i => i.id === id);
    if (ingredientIndex === -1) {
      console.error('Ingredient not found with ID:', id);
      return NextResponse.json({ error: `Ingredient with ID '${id}' not found` }, { status: 404 });
    }

    console.log(`Found ingredient at index ${ingredientIndex}:`, ingredients[ingredientIndex].name);
    
    // Remove the ingredient
    const removedIngredient = ingredients.splice(ingredientIndex, 1)[0];
    console.log('Ingredient removed from array, new count:', ingredients.length);
    
    // Write back to file
    let success;
    try {
      success = writeIngredientsFile(ingredients);
    } catch (writeError) {
      console.error('Failed to write ingredients file:', writeError);
      return NextResponse.json({ error: 'Failed to save changes to file' }, { status: 500 });
    }

    if (!success) {
      console.error('writeIngredientsFile returned false');
      return NextResponse.json({ error: 'Failed to delete ingredient from file' }, { status: 500 });
    }
    
    console.log('Ingredient deleted successfully:', removedIngredient.name);
    return NextResponse.json({ 
      message: 'Ingredient deleted successfully', 
      ingredient: removedIngredient,
      remainingCount: ingredients.length
    });
  } catch (error) {
    console.error('Unexpected error in DELETE handler:', error);
    return NextResponse.json({ 
      error: 'Internal server error occurred while deleting ingredient',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
