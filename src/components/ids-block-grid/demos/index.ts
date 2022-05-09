// Supporting components
import '../ids-block-grid';
import placeHolderImg from '../../../assets/images/placeholder-200x200.png';

// Images
const images = document.querySelectorAll('img');
images.forEach((img) => {
  img.src = placeHolderImg;
});
