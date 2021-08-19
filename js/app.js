import { galleryItems } from "./items";

const galleryRef = document.querySelector('.js-gallery');
const lightboxRef = document.querySelector('.js-lightbox');
const lightboxImgRef = lightboxRef.querySelector('.lightbox__image');

galleryRef.insertAdjacentHTML('beforeend', createGalleryItemsMarkup(galleryItems));
addImgLazyLoading();

galleryRef.addEventListener('click', onFullImageOpenClick);
lightboxRef.addEventListener('click', onFullImageCloseClick);
galleryRef.addEventListener('focusin', onGalleryLinkFocusWithTab);


// 
function createGalleryItemsMarkup(galleryItems) {
    return galleryItems
        .map(
            ({ preview, original, description }) =>
                `   <li class="gallery__item">
                <a
                    class="gallery__link"
                    href="${original}"
                >
                    <img
                        class="gallery__image lazyload"
                        data-src="${preview}"
                        data-source="${original}"
                        alt="${description}"
                        loading="lazy"
                    />
                </a>
                </li>`,
        )
        .join('');
}

function onFullImageOpenClick(event) {
    event.preventDefault();

    const { target } = event;

    if (target.nodeName !== 'IMG') return;

    removeEventListenerOnFullImageOpenWithEnter();
    window.addEventListener('keydown', onEscKeyPress);

    const originalImgUrl = target.dataset.source;
    const imgDesc = target.alt;

    toggleClassOnLightbox();
    replaceAttributeValueOnLightbox(originalImgUrl, imgDesc);
    switchesGalleryWithArrows();
}

function switchesGalleryWithArrows() {
    window.addEventListener('keydown', onLeftArrowPress);
    window.addEventListener('keydown', onRightArrowPress);
}

function removeEventListenersOnArrowsPress() {
    window.removeEventListener('keydown', onRightArrowPress);
    window.removeEventListener('keydown', onLeftArrowPress);
}

function onLeftArrowPress({ code }) {
    const previousImgRef = galleryRef
        .querySelector(`[data-source="${lightboxImgRef.src}"]`)
        .closest('.gallery__item')
        .previousElementSibling?.querySelector('.gallery__image');

    if (code === 'ArrowLeft' && previousImgRef) {
        animationSwitchGalleryImg();
        replaceAttributeValueOnLightbox(previousImgRef.dataset.source, previousImgRef.alt);
    }
}

function onRightArrowPress({ code }) {
    const nextImgRef = galleryRef
        .querySelector(`[data-source="${lightboxImgRef.src}"]`)
        .closest('.gallery__item')
        .nextElementSibling?.querySelector('.gallery__image');

    if (code === 'ArrowRight' && nextImgRef) {
        animationSwitchGalleryImg();
        replaceAttributeValueOnLightbox(nextImgRef.dataset.source, nextImgRef.alt);
    }
}

function toggleClassOnLightbox() {
    lightboxRef.classList.toggle('is-open');
}

function onFullImageCloseClick({ target }) {
    const lightboxBtnCloseRef = document.querySelector('[data-action="close-lightbox"]');
    const lightboxOverlayRef = document.querySelector('.lightbox__overlay');

    if (target === lightboxBtnCloseRef || target === lightboxOverlayRef) {
        toggleClassOnLightbox();
        setTimeout(clearAttributeValueUrl, 250);

        removeEventListenerOnEscKeyPress();
        removeEventListenersOnArrowsPress();
    }
}

function replaceAttributeValueOnLightbox(imgUrl, imgDesc) {
    lightboxImgRef.src = imgUrl;
    lightboxImgRef.alt = imgDesc;
}

function clearAttributeValueUrl() {
    lightboxImgRef.src = '';
}

function onEscKeyPress({ code }) {
    if (code === 'Escape') {
        toggleClassOnLightbox();
        setTimeout(clearAttributeValueUrl, 250);

        removeEventListenerOnEscKeyPress();
        removeEventListenersOnArrowsPress();
    }
}

function removeEventListenerOnEscKeyPress() {
    window.removeEventListener('keydown', onEscKeyPress);
}

function onGalleryLinkFocusWithTab({ currentTarget }) {
    currentTarget.addEventListener('keydown', onFullImageOpenWithEnter);
}

function onFullImageOpenWithEnter({ code, target }) {
    if (lightboxRef.classList.contains('is-open')) return;

    if (code === 'Tab') {
        removeEventListenerOnFullImageOpenWithEnter();
        return;
    }

    const originalImgUrl = target.firstElementChild.dataset.source;
    const imgDesc = target.firstElementChild.alt;

    if (code === 'Enter') {
        window.addEventListener('keydown', onEscKeyPress);
        switchesGalleryWithArrows();

        toggleClassOnLightbox();
        replaceAttributeValueOnLightbox(originalImgUrl, imgDesc);
    }
}

function removeEventListenerOnFullImageOpenWithEnter() {
    galleryRef.removeEventListener('keydown', onFullImageOpenWithEnter);
}

function addImgLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        const lazyImagesRef = document.querySelectorAll('img[loading="lazy"]');
        lazyImagesRef.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        const lazysizesScriptRef = document.createElement('script');
        lazysizesScriptRef.src =
            'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        lazysizesScriptRef.integrity =
            'sha512-q583ppKrCRc7N5O0n2nzUiJ+suUv7Et1JGels4bXOaMFQcamPk9HjdUknZuuFjBNs7tsMuadge5k9RzdmO+1GQ==';
        lazysizesScriptRef.crossorigin = 'anonymous';
        lazysizesScriptRef.referrerpolicy = 'no-referrer';

        document.body.appendChild(lazysizesScriptRef);
    }
}

function onImgLoad() {
    lightboxImgRef.style.cssText =
        'transition: opacity var(--animation-duration) var(--timing-function)';
    lightboxImgRef.classList.replace('hide', 'back');
}

function animationSwitchGalleryImg() {
    if (lightboxImgRef.classList.contains('back')) {
        lightboxImgRef.classList.replace('back', 'hide');
    } else {
        lightboxImgRef.classList.add('hide');
    }

    lightboxImgRef.addEventListener('load', onImgLoad);
    lightboxImgRef.style = '';
}
