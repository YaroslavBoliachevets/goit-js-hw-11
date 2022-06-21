// const axios = require('axios');
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import LoadMoreBtn from './js/loadMoreBtn';
import SearchEngine from './js/searchEngine';

const refs = {
  form: document.querySelector('.search-form'),
  btn: document.querySelector('button'),
  btnLoadMore: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

const searchEngine = new SearchEngine();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

refs.form.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);

function onSearch(e) {
  searchEngine.query = e.currentTarget.elements.searchQuery.value;

  if (searchEngine.query == '') {
    return clearRender();
  }

  loadMoreBtn.hide();
  e.preventDefault();
  clearRender();

  // Новый запрос - отрисовка с первой страницы
  searchEngine.resetPage();

  searchEngine
    .fetchResult()
    .then(responce => {
      // Уведомление - ничего не нашли
      if (responce.data.total == '0') {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      // Уведомление о кол-ве доступных картинок
      Notify.success(`${responce.data.total} matches found`);

      // Если найденных больше чем отрисованных, то создаем кнопку "загрузить еще"
      if (responce.data.hits.length < responce.data.total) {
        // console.log('Появится кнопка');
        loadMoreBtn.show();
      }

      // Отрисовываем разметку найденных картинок
      return refs.gallery.insertAdjacentHTML(
        'beforeend',
        responce.data.hits.map(makeMurkup).join('')
      );
    })
    .then(data => searchEngine.incrementPage());

  // Очистка строки поиска
  e.currentTarget.elements.searchQuery.value = '';
}

function makeMurkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
	<img src=${webformatURL} width='200px' alt=${tags} loading="lazy" />
	<div class="info">
	  <p class="info-item">
		<b>Likes:</b> <br> ${likes}
	  </p>
	  <p class="info-item">
		<b>Views:</b> <br> ${views}
	  </p>
	  <p class="info-item">
		<b>Comments:</b> <br> ${comments}
	  </p>
	  <p class="info-item">
		<b>Downloads: </b><br> ${downloads}
	  </p>
	</div>
	</div>`;
}

function clearRender() {
  refs.gallery.innerHTML = '';
}

async function onLoadMore(e) {
  e.preventDefault();
  searchEngine
    .fetchResult()
    .then(responce => {
      // В случает когда количество найденных ответов будет кратно кол-ву на странице (40) - прячем кнопку, или 
      // Если кол-во оставшихся для подзагрузки картинок меньше чем мы должны вместить на страницу (40) - прячем кнопку
      console.log('responce.data.hits.length * searchEngine.page == responce.data.total', (responce.data.hits.length * searchEngine.page) ==
      responce.data.total);

      console.log('responce.data.hits.length * searchEngine.page < searchEngine.perPage', responce.data.hits.length * searchEngine.page < searchEngine.perPage);

      console.log('responce.data.hits.length', responce.data.hits.length, 'searchEngine.page', searchEngine.page);
      console.log('responce.data.total', responce.data.total);
      console.log('searchEngine.perPage', searchEngine.perPage);
      
      
      
      
        if (
          responce.data.hits.length * searchEngine.page ==
            responce.data.total ||
          responce.data.hits.length < searchEngine.perPage
        ) {
          Notify.failure('Thats all');
          // console.log('Спрятать кнопку');
          loadMoreBtn.hide();
        }

      return refs.gallery.insertAdjacentHTML(
        'beforeend',
        responce.data.hits.map(makeMurkup).join('')
      );
    })
    .then(data => searchEngine.incrementPage());
}
