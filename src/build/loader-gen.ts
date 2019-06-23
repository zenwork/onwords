import { parse, ParserOptions } from "@babel/parser"
import { File } from "@babel/types"
import * as fs from "fs";

const recursive = require("recursive-readdir");

const template = fs.readFileSync('./src/build/template.ts', 'utf8');
const header = template.substr(0, template.indexOf('// GEN-CODE'));
const footer = template.substr(template.indexOf('// GEN-CODE') + 12);
const path = './src/';
const options: ParserOptions = {
  sourceType: "module",
  plugins: [
    "typescript",
    "asyncGenerators",
    "classProperties",
    "decorators-legacy",
    "dynamicImport",
    "classPrivateMethods",
    "classPrivateProperties"
  ]
};

recursive(path, function (err, files) {
  const promises = [];
  processFiles(files, promises);
  waitFor(promises);
});

function processFiles(files, promises) {
  files
    .filter(f => {
      if (f.indexOf('.ts') > 0) return f
    })
    .map(f => {
      const data = fs.readFileSync(f, 'utf8');

      promises.push(new Promise<string>((resolve) => resolve(analyze(data, f))));
    });
}

function waitFor(promises) {
  Promise
    .all(promises)
    .then((loaderChunks: Array<Promise<string>>) => {
      console.log('finished');
      let file = header;
      loaderChunks.sort((chunkA, chunkB) => chunkA.toString().localeCompare(chunkB.toString())).map(chunk => file = file + chunk);
      file = file + footer;
      fs.writeFileSync('src/loader.ts', file, {encoding: 'utf8'});
    })
    .catch((reason) => console.log(reason))
}



function analyze(data, f): string {
  let result = '';
  let file: File = parse(data, options);
  file.program.body.filter(s => {
    // console.log(s.type);
    switch (s.type) {
      // case 'ExportSpecifier':
      case 'ExportNamedDeclaration':
      case 'ExportDefaultDeclaration':
        // case 'ExportAllDeclaration':
        let declaration = s.declaration;
        // console.log(declaration.type);
        if (declaration && declaration.type === 'ClassDeclaration') {
          if (declaration.id.name === 'ElixSubset' || (declaration.superClass && (declaration.superClass.name === 'LitElement' || declaration.superClass.name === 'HTMLElement'))) {
            result = createLoader(f, declaration);
          }
        }
        break;
    }
  });
  return result;
}

function createLoader(f, declaration): string {
  const fullPath = './' + f.substr(f.indexOf('src/') + 4);
  let name = f.substr(f.lastIndexOf('/') + 1);
  const chunkName = name.substr(0, name.indexOf('.'));
  const className = declaration.id.name;
  if (className !== 'OwShell') {
    console.log(`created:${chunkName}`);
    return `components['${className}'] = async () =>
  await import(/* webpackChunkName: "${chunkName}" */'${fullPath}')
    .then((scope) => new scope.${className}());

`;

  }
  return '';
}





