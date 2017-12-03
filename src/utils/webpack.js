export const CSS = /.css$/;
export const JS = /.js$/;

export const getChunkFiles = (publicPath, chunks) => { // eslint-disable-line
  return chunks.reduce((files, chunk) => {
    const chunkFiles = chunk.files.map(chunkFile => publicPath + chunkFile);

    const cssFiles = chunkFiles.filter(chunkFile => CSS.test(chunkFile));
    const jsFiles = chunkFiles.filter(chunkFile => JS.test(chunkFile));

    files.css = files.css.concat(cssFiles);
    files.js = files.js.concat(jsFiles);

    return files;
  }, { js: [], css: [] });
};

export function getChunksFromManifest(clientPublicPath, manifest) {
  return Object.values(manifest).reduce((files, chunk) => {
    const filePath = clientPublicPath + chunk;

    if (CSS.test(filePath)) {
      files.css.push(filePath);
    } else if (JS.test(filePath)) {
      files.js.push(filePath);
    }

    return files;
  }, { js: [], css: [] });
}

export const resolveConfig = (config, file) => (
  config ||
  require(file).default || // eslint-disable-line
  require(file) //eslint-disable-line
);

