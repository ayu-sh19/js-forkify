import View from './view.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _message = "Recipe uploaded successfully";

  constructor() {
    super();
    this._addHandlerOpen();
    this._addHandlerClose();
  }

  toggleHidden() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerOpen() {
    this._btnOpen.addEventListener('click', this.toggleHidden.bind(this));
  }

  _addHandlerClose() {
    this._btnClose.addEventListener('click', this.toggleHidden.bind(this));
    this._overlay.addEventListener('click', this.toggleHidden.bind(this));
  }

  addHandlerFormSubmit(handler){
    this._parentElement.addEventListener('submit', function(e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)];
      const recipe = Object.fromEntries(dataArray);
      handler(recipe);
    })
  }
}

export default new AddRecipeView();
