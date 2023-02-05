const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');
const util = require('util');

const port = process.env.PORT || 4000;

const dir = path.dirname(fs.realpathSync(__filename));
const svgTemplate = [
  '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="%d" height="%d">',
  '<ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="#%s"></ellipse>',
  '</svg>',
].join('');

http
  .createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET', 'POST');
    res.setHeader('Access-Control-Allow-Headers', '*');

    const pathname = url.parse(req.url).pathname;
    let m;

    if (pathname === '/') {
      console.log('call app');

      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(dir + '/build/index.html').pipe(res);
      return;
    } else if (pathname.includes('/external_be')) {
      const m = pathname.match(/^\/external_be\/([0-9a-fA-F]{6})/);
      const svgTemplate = await new Promise(function (resolve, reject) {
        var req = http.get(
          `${process.env.IMAGE_PATH}/color/${m[1]}`,
          (response) => {
            let data = '';
            response.on('data', (chunk) => {
              data += chunk;
            });

            response.on('end', () => {
              resolve(data);
            });
          }
        );
      });

      res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
      res.write(svgTemplate);
      res.end();
      return;
    } else if ((m = pathname.match(/^\/color\/([0-9a-fA-F]{6})/))) {
      res.writeHead(200, { 'Content-Type': 'image/svg+xml' });

      res.write(
        util.format(
          svgTemplate,
          process.env.TILE_SIZE || 10,
          process.env.TILE_SIZE || 10,
          m[1]
        )
      );
      res.end();
      return;
    } else if ((m = pathname.match(/^\/js\//) || pathname.match(/^\//))) {
      const filename = dir + '/build/' + pathname;
      const stats = fs.existsSync(filename) && fs.statSync(filename);
      if (stats && stats.isFile()) {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        fs.createReadStream(filename).pipe(res);
        return;
      }
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 Not Found\n');
    res.end();
  })
  .listen(port, '0.0.0.0');

console.log('listening on port %d in %s mode', port);
