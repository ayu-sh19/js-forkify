import { API_URL, API_KEY } from '../js/config.js';
import { AJAX } from './helpers.js';
import { RES_PER_PAGE } from '../js/config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createObject = function (data) {
  const { recipe } = data.data;

  const recipeObject = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    ...(recipe.key && { key: recipe.key }),
  };

  return recipeObject;
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = createObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    // console.log(`${err} ☠️`);
    throw err;
  }
};

export const searchRecipe = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    console.log(data);
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    // console.log(state.search.results);
    state.search.page = 1;
  } catch (err) {
    // console.log(`${err} ☠️`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add Bookmark
  state.bookmarks.push(recipe);

  // Mark as Bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  persistBookmarks();
};
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(e => e.id === id);
  state.bookmarks.splice(index, 1);

  if (state.recipe.id === id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingredientArray = ing[1].replaceAll(' ', '').split(',');
        if (ingredientArray.length !== 3) {
          throw new Error('Wrong input format !!');
        }
        [quantity, unit, description] = ingredientArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    console.log(newRecipe);

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: newRecipe.servings,
      cooking_time: newRecipe.cookingTime,
      ingredients: ingredients,
      publisher: newRecipe.publisher,
    };
    console.log(recipe);

    const response = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createObject(response);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
