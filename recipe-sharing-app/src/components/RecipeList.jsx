import React from 'react';
import { useRecipeStore } from '../store/recipeStore';

const RecipeList = () => {
  const filteredRecipes = useRecipeStore((state) => state.filteredRecipes);

  return (
    <div style={{ padding: '20px' }}>
      {filteredRecipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '8px',
            }}
          >
            <h3>{recipe.title}</h3>
            <p>
              <strong>Ingredients:</strong> {recipe.ingredients.join(', ')}
            </p>
            <p>
              <strong>Time:</strong> {recipe.time} mins
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default RecipeList;
