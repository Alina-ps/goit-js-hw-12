import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { searchImages } from './js/pixabay-api';
import { createImagesMarkup } from './js/render-functions';

const form = document.querySelector('.search-form');
const loader = document.querySelector('.loader');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');

let currentPage = 1;
let userValue = '';
let totalHits = 0;
let loadedHits = 0;

const lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', async event => {
  event.preventDefault();

  userValue = event.target.elements.query.value.trim();

  if (userValue === '') {
    iziToast.show({
      title: 'Error',
      titleColor: '#d5cae4',
      message: 'Please enter a search query!',
      messageColor: '#d5cae4',
      backgroundColor: '#EF4040',
      progressBarColor: '#d5cae4',
      close: true,
      class: 'custom-iziToast',
    });
    return;
  }

  currentPage = 1;
  totalHits = 0;
  loadedHits = 0;
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';
  loader.style.display = 'block';

  try {
    const data = await searchImages(userValue, currentPage, 15);
    loader.style.display = 'none';

    if (data.hits.length === 0) {
      iziToast.show({
        title: 'No Results',
        titleColor: '#d5cae4',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        messageColor: '#d5cae4',
        backgroundColor: '#EF4040',
        progressBarColor: '#d5cae4',
        close: true,
        class: 'custom-iziToast',
      });
      return;
    }

    totalHits = data.totalHits;
    loadedHits = data.hits.length;

    iziToast.show({
      title: 'Congrats',
      titleColor: '#d5cae4',
      message: `We found ${totalHits} images`,
      messageColor: '#d5cae4',
      backgroundColor: '#e1854c',
      progressBarColor: '#d5cae4',
      position: 'topRight',
      close: true,
      class: 'custom-iziToast',
    });

    const markup = createImagesMarkup(data.hits);
    gallery.innerHTML = markup;
    lightbox.refresh();

    if (loadedHits < totalHits) {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    loader.style.display = 'none';

    iziToast.show({
      title: 'Error',
      titleColor: '#d5cae4',
      message: 'Sorry, something went wrong. Please try again later!',
      messageColor: '#d5cae4',
      backgroundColor: '#EF4040',
      progressBarColor: '#d5cae4',
      close: true,
      class: 'custom-iziToast',
    });
  }

  form.reset();
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  loadMoreBtn.style.display = 'none';
  loader.style.display = 'block';

  try {
    const data = await searchImages(userValue, currentPage, 15);
    loader.style.display = 'none';

    loadedHits += 15;

    const markup = createImagesMarkup(data.hits);
    gallery.insertAdjacentHTML('beforeend', markup);

    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    lightbox.refresh();

    if (loadedHits < totalHits) {
      loadMoreBtn.style.display = 'block';
    } else {
      iziToast.show({
        title: 'End of Results',
        titleColor: '#d5cae4',
        message: "We're sorry, but you've reached the end of search results.",
        messageColor: '#d5cae4',
        backgroundColor: '#EF4040',
        progressBarColor: '#d5cae4',
        close: true,
        class: 'custom-iziToast',
      });
    }
  } catch (error) {
    loader.style.display = 'none';

    iziToast.show({
      title: 'Error',
      titleColor: '#d5cae4',
      message: 'Sorry, something went wrong. Please try again later!',
      messageColor: '#d5cae4',
      backgroundColor: '#EF4040',
      progressBarColor: '#d5cae4',
      close: true,
      class: 'custom-iziToast',
    });
  }
});
