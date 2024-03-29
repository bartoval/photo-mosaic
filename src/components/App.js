// @flow
import Mosaic from './mosaic/Mosaic';

const loadImage = (file: File) => {
  const fileReader = () => new Promise((resolve: (ProgressEvent) => void) => {
    const reader = new FileReader();
    reader.onload = resolve;
    reader.readAsDataURL(file);
  });

  const isValidImageSize = (img) => img.width >= process.env.TILE_SIZE && img.height >= process.env.TILE_SIZE;
  const resizeImage = ($img: HTMLImageElement, widthContainer: number) => {
    const $imgResized = $img;
    const ratio = $img.height / $img.width;

    if ($img.width > widthContainer) {
      // resize image to fit with the screen
      $imgResized.width = widthContainer;
      $imgResized.height = Math.floor(widthContainer * ratio);
    }
    return $imgResized;
  };
  Promise.resolve()
    .then(() => fileReader())
    .then((e: ProgressEvent) => {
      const fileRead = e.target;

      if (
        fileRead instanceof FileReader
        && typeof fileRead.result === 'string'
      ) {
        const $img: HTMLImageElement = new Image();

        $img.onload = () => {
          const $container = document.querySelector('#mosaic-box');
          const $canvas = document.createElement('CANVAS');

          if (
            $container
            && $canvas instanceof HTMLCanvasElement
            && isValidImageSize($img)
          ) {
            $container.appendChild($canvas);
            new Mosaic($canvas).create(
              resizeImage($img, $container.offsetWidth),
            );
            $img.src = '';
          }
        };
        $img.src = fileRead.result;
      }
    });
};

export default loadImage;
