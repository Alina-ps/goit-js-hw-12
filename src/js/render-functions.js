function createImageMarkup(image) {
  return `<li>
    <a href="${image.largeImageURL}">
      <img
        src="${image.webformatURL}" 
        alt="${image.tags}"
      />
    </a>
    <div class='info'>
      <p><span>Likes</span> ${image.likes}</p>
      <p><span>Views</span> ${image.views}</p>
      <p><span>Comments</span> ${image.comments}</p>
      <p><span>Downloads</span> ${image.downloads}</p>
    </div>
  </li>`;
}

export function createImagesMarkup(arr) {
  return arr.map(createImageMarkup).join('');
}
