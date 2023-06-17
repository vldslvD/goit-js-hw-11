import { getPictures } from './pixaAPI';

const refs = {
  searchForm: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryBox: document.querySelector('.gallery')
};

refs.searchForm.addEventListener('submit', onSearchBtnClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
let pageCount = 1;
async function onSearchBtnClick(e) {
  e.preventDefault();
  pageCount = 1;
  try {
    const pictureData = await getPictures(
      refs.searchForm.searchQuery.value,
      pageCount
    );
    console.log(pictureData.data.hits);

    pictureData.data.hits.map(picture => {
      const markup = `
      <div class="photo-card">
        <img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes${picture.likes}</b>
          </p>
          <p class="info-item">
            <b>Views${picture.views}</b>
          </p>
          <p class="info-item">
            <b>Comments${picture.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads${picture.downloads}</b>
          </p>
        </div>
      </div>`;
      refs.galleryBox.insertAdjacentHTML('beforeend', markup);
    });
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreBtnClick() {
  pageCount++;
  try {
    const pictureData = await getPictures(
      refs.searchForm.searchQuery.value,
      pageCount
    );
    console.log(pictureData);
  } catch (error) {
    console.log(error);
  }
}
