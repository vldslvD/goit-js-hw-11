import { getPictures } from './pixaAPI';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryUl: document.querySelector('.gallery'),
  galleryBox: document.querySelector('.gallery-box'),
};

refs.searchForm.addEventListener('submit', onSearchBtnClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

let pageCount = 1;
const modalBox = new SimpleLightbox('.gallery li .thumb a', {
  captionsData: 'alt',
  captionDelay: 250,
  disableScroll: false,
});

async function onSearchBtnClick(e) {
  e.preventDefault();
  refs.loadMoreBtn.classList.add('hidden');
  pageCount = 1;
  refs.galleryUl.innerHTML = '';
  try {
    const pictureData = await getPictures(
      refs.searchForm.searchQuery.value,
      pageCount
    );

    if (pictureData.data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notify.success(`Hooray! We found ${pictureData.data.total} images.`);

    renderAllCards(pictureData.data.hits);
    refs.loadMoreBtn.classList.remove('hidden');
  } catch (error) {
    Notify.failure('Sorry, please try again.');
  }
}

async function onLoadMoreBtnClick() {
  pageCount++;
  try {
    const pictureData = await getPictures(
      refs.searchForm.searchQuery.value,
      pageCount
    );
    renderAllCards(pictureData.data.hits);
    smoothScroll();
    if (pictureData.data.hits.length < 40) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.classList.add('hidden');
    }
  } catch (error1) {
    Notify.failure('Sorry, please try again.');
    console.log(error1);
  }
}

function renderAllCards(pictures) {
  pictures.map(picture => {
    const markup = `
      <li class="photo-card">
        <div class="thumb">
          <a href="${picture.largeImageURL}">
          <img class="photo" src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" />
          </a>
        </div>
        <ul class="info">
          <li class="info-item">
            <b>Likes</b>
            <p class="info-item-amount">${picture.likes}</p>
          </li>
          <li class="info-item">
            <b>Views</b>
            <p class="info-item-amount">${picture.views}</p>
          </li>
          <li class="info-item">
            <b>Comments</b>
            <p class="info-item-amount">${picture.comments}</p>
          </li>
          <li class="info-item">
            <b>Downloads</b>
            <p class="info-item-amount">${picture.downloads}</p>
          </li>
        </ul>
      </li>`;
    refs.galleryUl.insertAdjacentHTML('beforeend', markup);
    modalBox.refresh();
  });
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({ top: cardHeight * 1.5, behavior: 'smooth' });
}
