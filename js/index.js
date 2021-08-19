import { galleryItems } from './items.js'

const galleryContainer = document.querySelector('.js-gallery');
const lightBox = document.querySelector('.js-lightbox');
const imageLightBox = lightBox.querySelector('.lightbox__image');
const overlay = document.querySelector('.lightbox__overlay');

galleryContainer.addEventListener('click', onImageClick);
galleryContainer.insertAdjacentHTML('beforeend', createGalleryElements(galleryItems));


let url = imageLightBox.dataset.source; 

function createGalleryElements(galleryItems) {
  return galleryItems.map(({ preview, original, description }) => {
    return `
    <li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>`;
  })
    .join('');
};



function onEscKeyPress(event) {
  // event.preventDefault();
  const ESC_KEY_CODE = 'Escape';
  const isEscKey = event.code === ESC_KEY_CODE;

  if (isEscKey) {
    onCloseModal();
  };
}

function onImageClick(e) {
  e.preventDefault();

  if (e.target.nodeName !== 'IMG') {
    return;
  }

  const srcElem = e.target.dataset.source;

  onOpenModal();
  imageLightBox.src = srcElem;
}
 
function onOpenModal(event) {
  lightBox.classList.add('is-open');
  
  const btnClose = document.querySelector('.lightbox__button');

  btnClose.addEventListener('click', onCloseModal);
  window.addEventListener('keydown', onEscKeyPress);
  window.addEventListener('keydown', onKeyPress);
}

function onCloseModal(el) {
  console.log(el);
  lightBox.classList.remove('is-open');

  window.removeEventListener('keydown', onEscKeyPress);
  imageLightBox.removeAttribute('src');

}

overlay.addEventListener('click', event => {
  if (event.currentTarget === event.target) {
    onCloseModal();
  }
})

function onKeyPress(event) {
  const el = event.target.firstElementChild;
  const items = galleryContainer.querySelectorAll('.gallery__image');

  items.forEach((el, index) => el.setAttribute('index', index));
 
  const indexImage = el.getAttribute('index');
  let currentIndex = Number(indexImage) + 1;
  
  if (event.code === 'ArrowRight') {
    items.forEach((el, index, arr) => {
      if (el.dataset.source === url) {
        currentIndex = index;
      }
    });

    currentIndex = currentIndex === items.length - 1 ? currentIndex = -1 : currentIndex;
    url = items[currentIndex + 1].dataset.source;
   
  }

  if (event.code ==='ArrowLeft') {
    items.forEach((el, index, arr) => {
      if (el.dataset.source === url) {
         if (index === 0) {
            index = arr.length;
        }
        currentIndex = index;
      }
    });
    url = items[currentIndex - 1].dataset.source;
  }

  imageLightBox.setAttribute('src', url);
}

