const minify = require('minify');
const fs = require('fs');

const srcPath = 'src';

const options = {
  html: {
      removeAttributeQuotes: false,
      removeOptionalTags: false
  },
};

const exploreFolder = (path) => {
  fs.readdir(path, (err, files) => {
    if (err) {
      console.error(err);
    }

    files.forEach(file => {
      const filePath = `${path}/${file}`;
      const distPath = filePath.replace('src', 'dist');
      const isDirectory = fs.lstatSync(filePath).isDirectory();

      if (isDirectory) {
        fs.mkdir(distPath, { recursive: true }, (err) => {
          if (err) {
            console.error(err);
          };
        });
        exploreFolder(filePath)
      } else {
        minify(filePath, options)
          .then((data) => {
            fs.writeFile(distPath, data, 'utf8', (err) => {
              if (err) {
                console.error(err);
              };
            });
          })
          .catch((error) => {
            console.error(error);
            fs.copyFile(filePath, distPath, (err) => {
              if (err) {
                console.log(err);
              }
            });
          })
      }
    })
  });
}

exploreFolder(srcPath);
