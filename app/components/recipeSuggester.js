'use client';

import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase'

export default function RecipeSuggester() {
  const [recipes, setRecipes] = useState(''); // State to store the recipe suggestions
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false); // State to handle loading

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const snapshot = collection(firestore, 'inventory');
        const docs = await getDocs(snapshot)
        const inventoryList = []
        docs.forEach((doc) => {
        //this is what gets pushed to the inventory list, name, and associated data
        inventoryList.push({
            name: doc.id,
            ...doc.data(),
        })
        })
        setIngredients(inventoryList);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };
    fetchIngredients();
}, []);

  const getRecipes = async () => {
    setLoading(true); // Set loading to true when fetching
    try {
      const response = await fetch('/api/generateRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }), // Example ingredients
      });

      if (response.ok) {
        const textResponse = await response.text(); // Get the plain text response
        setRecipes(textResponse); // Update the 'recipes' state with the response text
      } else {
        setRecipes('Failed to get recipes');
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes('An error occurred while fetching recipes');
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={getRecipes} disabled={loading}>
        {loading ? 'Generating...' : 'Get Recipes'}
      </Button>
      <Typography variant="body1" component="pre" sx={{
        marginTop: 2,
        overflowY: 'auto', 
        maxHeight: '400px',
        whiteSpace: 'pre-wrap', // Preserve whitespace and wrap text
        wordWrap: 'break-word', }}>
        {recipes || "No recipes yet"}
      </Typography>
    </div>
  );
}
