import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeViews.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

// if(module.hot){
//   module.hot.accept();
// }

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) {
      return;
    }

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    bookmarkView.update(model.state.bookmarks);

    await model.loadRecipe(id);
    const { recipe } = model.state;

    // Rendering The Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // console.log(err);
    recipeView.renderError();
  }
};

// controlRecipes();

// ['hashChange','load'].forEach(ev => window.addEventListener(ev, showRecipe));

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) {
      return;
    }
    await model.searchRecipe(`${query}`);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (data) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(data);
    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    //Render Bookmark
    bookmarkView.render(model.state.bookmarks);

    //Change id in Url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleHidden();
    }, 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerFormSubmit(controlAddRecipe);
};

init();
