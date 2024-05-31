import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { searchImages } from './js/pixabay-api';
import { imagesInfo } from './js/render-functions';

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
      message: 'Please enter a search query!',
      backgroundColor: '#EF4040',
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
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        backgroundColor: '#EF4040',
      });
      return;
    }

    totalHits = data.totalHits;
    loadedHits = data.hits.length;

    const markup = imagesInfo(data.hits);
    gallery.innerHTML = markup;
    lightbox.refresh();

    if (loadedHits < totalHits) {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    loader.style.display = 'none';

    iziToast.show({
      title: 'Error',
      message: 'Sorry, something went wrong. Please try again later!',
      backgroundColor: '#EF4040',
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

    const markup = imagesInfo(data.hits);
    gallery.insertAdjacentHTML('beforeend', markup);

    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
    });

    lightbox.refresh();

    if (loadedHits < totalHits) {
      loadMoreBtn.style.display = 'block';
    } else {
      iziToast.show({
        title: 'End of Results',
        message: "We're sorry, but you've reached the end of search results.",
        backgroundColor: '#EF4040',
      });
    }
  } catch (error) {
    loader.style.display = 'none';

    iziToast.show({
      title: 'Error',
      message: 'Sorry, something went wrong. Please try again later!',
      backgroundColor: '#EF4040',
    });
  }
});
