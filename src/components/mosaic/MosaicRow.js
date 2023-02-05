// @flow
export default class MosaicRow {
  row: Array<Promise<*>>;

  canvas: HTMLCanvasElement;

  context: CanvasRenderingContext2D;

  url: string;

  constructor(width: number) {
    this.row = [];
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = width;
    this.canvas.height = process.env.TILE_SIZE;
    this.url = process.env.IMAGE_PATH
      ? `${window.location.protocol}//${window.location.host}/external_be/`
      : `${window.location.protocol}//${window.location.host}/color/`;
  }

  fetch(tiles: Array<{ color: string }>) {
    for (let i = 0; i < tiles.length; i += 1) {
      this.row[i] = new Promise((resolve: (EventTarget) => void) => {
        const img = new Image();
        img.onload = ({ target }: Event) => {
          resolve(target);
        };
        img.src = this.url + tiles[i].color;
      });
    }
  }

  draw(tiles: Array<HTMLImageElement>) {
    for (let i = 0; i < tiles.length; i += 1) {
      const dx = i * process.env.TILE_SIZE;
      this.context.drawImage(tiles[i], dx, 0);
      tiles[i].src = '';
    }
  }
}
