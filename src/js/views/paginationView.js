import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = +this._data.page;

    //if only 1 page

    if(numPages === 1){
      return '';
    }

    //if on the last page
    if (curPage === numPages) {
      return `<button data-goto = "${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>`;
    }

    //if on the first page and others page
    if (curPage === 1 && numPages > 1) {
      return `<button data-goto = "${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }

    //if in the middle
    if (curPage > 1 && curPage < numPages) {
      return `
      <button data-goto = "${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button><button data-goto = "${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
  }

  addHandlerPagination(handler){
    this._parentElement.addEventListener('click',function(e){

      const btn = e.target.closest('.btn--inline');
      if(!btn){
        return;
      }
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
      console.log(goToPage);
    })
  }
}

export default new PaginationView();
