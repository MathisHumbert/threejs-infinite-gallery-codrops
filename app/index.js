import imagesLoaded from 'imagesloaded';

import Demo1 from './demo-1/App';
import Demo2 from './demo-2/App';

const demos = [Demo1, Demo2];
const demo = document.body.getAttribute('data-id');

const preloadImages = () => {
  return new Promise((resolve) => {
    imagesLoaded(document.querySelectorAll('img'), resolve);
  });
};

preloadImages().then(() => {
  new demos[demo]();
});
