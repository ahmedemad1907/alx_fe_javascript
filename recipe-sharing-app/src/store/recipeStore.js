import { create } from 'zustand';

export const useRecipeStore = create((set) => ({
  recipes: [
    { id: 1, title: 'Pizza', ingredients: ['cheese', 'tomato'], time: 30 },
    { id: 2, title: 'Pasta', ingredients: ['pasta', 'sauce'], time: 20 },
    { id: 3, title: 'Salad', ingredients: ['lettuce', 'cucumber'], time: 10 },
  ],
  searchTerm: '',
  filteredRecipes: [],
  setSearchTerm: (term) =>
    set({ searchTerm: term }, false, 'setSearchTerm'),
  filterRecipes: () =>
    set((state) => ({
      filteredRecipes: state.recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(state.searchTerm.toLowerCase())
      ),
    })),
}));
