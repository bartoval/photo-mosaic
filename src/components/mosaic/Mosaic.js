// @flow
import MosaicRow from './MosaicRow';

type PostMessageDataType = {
  colNum: number,
  rowNum: number,
  pixelNum: number,
  dataCtx: ?Uint8ClampedArray,
  TILE_SIZE: number,
};

export default class Mosaic {
  messageResponse: Array<Array<{ color: string }>>;

  width: number;

  height: number;

  numRow: number;

  indexRow: number;

  canvas: HTMLCanvasElement;

  context: CanvasRenderingContext2D;

  dataCtx: ?Uint8ClampedArray;

  postMessage: (message: {
    data: PostMessageDataType | '',
    type: string,
  }) => void;

  constructor($canvas: HTMLCanvasElement) {
    this.messageResponse = [];
    this.numRow = 0;
    this.indexRow = 0;
    this.canvas = $canvas;
    if (this.canvas && this.canvas instanceof HTMLCanvasElement) {
      this.context = this.canvas.getContext('2d');
    }
    this.dataCtx = null;
  }

  create(img: HTMLImageElement) {
    const w = new Worker('worker.min.js');
    // set dimension
    this.numRow = img.height / process.env.TILE_SIZE;
    this.canvas.width = img.width;
    this.canvas.height = img.height;

    // get pixel info from image and clean the rect
    this.context.drawImage(img, 0, 0, img.width, img.height);
    this.dataCtx = this.context.getImageData(0, 0, img.width, img.height).data;
    this.context.clearRect(0, 0, img.width, img.height);

    const msgCloseWorker = () => ({
      data: '',
      type: 'MSG_STOP',
    });

    w.postMessage({
      data: {
        colNum: Math.floor(img.width / process.env.TILE_SIZE),
        rowNum: Math.floor(img.height / process.env.TILE_SIZE),
        pixelNum: process.env.TILE_SIZE * img.width * 4,
        dataCtx: this.dataCtx,
        TILE_HEIGHT: process.env.TILE_SIZE,
        TILE_WIDTH: process.env.TILE_SIZE,
      },
      type: 'MSG_START',
    });

    w.onmessage = (e: { data: any }) => {
      const { data, type } = e.data;

      if (type === 'MSG_COMPOSE_READY' && data) {
        this.messageResponse = data;
        this.render();
      } else {
        this.postMessage(msgCloseWorker());
      }
    };

    w.onerror = (err: Event) => {
      // eslint-disable-next-line no-console
      console.log(err);
      msgCloseWorker();
    };
  }

  draw(canvas: HTMLCanvasElement) {
    const startColumn = 0;
    const startRow = this.indexRow * process.env.TILE_SIZE;

    this.context.drawImage(canvas, startColumn, startRow);
  }

  render() {
    const newRow = new MosaicRow(this.canvas.width);
    newRow.fetch(this.messageResponse[this.indexRow]);

    Promise.all(newRow.row)
      .then((tilesLoaded: Array<HTMLImageElement>) => {
        if (this.indexRow < this.numRow - 1) {
          this.indexRow += 1;
          this.render();
        }
        newRow.draw(tilesLoaded);
        this.draw(newRow.canvas);
        newRow.context.clearRect(
          0,
          0,
          this.canvas.width,
          process.env.TILE_SIZE
        );
      })
      .catch((err: string) => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }
}
