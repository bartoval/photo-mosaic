[![Build Status](https://travis-ci.org/bayesianforce/photomosaic.svg?branch=master)](https://travis-ci.org/bayesianforce/photomosaic)
[![MIT](https://img.shields.io/npm/l/gccx.svg)](https://github.com/bayesianforce/photomosaic/blob/master/README.md)

<div align="center">
<h1>Photomosaic Filter</h1>

<a href="https://www.emojione.com/emoji/1f410">
<img height="80" width="80" alt="goat" src="https://raw.githubusercontent.com/kentcdodds/react-testing-library/master/other/goat.png" />
</a>

<p>Simple filter to convert an Image in Mosaic using a dedicated worker to process high computational calculations.</p>
</div>

Photo-mosaic turn an image to mosaic downloading SVG from server. You just need to load your image and wait for the result.
A dedicated worker is used to avoid UI freeze.

## Installation

- npm install

## build + server run

- npm run start

check the app on <http://localhost:4000>

## env variables
PORT= < number >  // used by server
TILE_SIZE= < number >  . The default value is 10, both client and server // used by server and client
IMAGE_PATH=< your server address > // the client uses an other server to get the tiles

example: TILE_SIZE=15 IMAGE_PATH=<https://yourdomain.com> yarn start // used by client
