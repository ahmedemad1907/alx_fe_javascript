import React, { useEffect } from 'react';
import SearchBar from './components/SearchBar';
import RecipeList from './components/RecipeList';
import { useRecipeStore } from './components/recipeStore';

function App() {
  const filterRecipes = useRecipeStore((state) => state.filterRecipes);

  // Initial filter on load
  useEffect(() => {
    filterRecipes();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Recipe Sharing App</h1>
      <SearchBar />
      <RecipeList />
    </div>
  );
}

export default App;
