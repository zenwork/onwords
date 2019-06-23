// import { parse, ParserOptions } from "@babel/parser"
// import { File } from "@babel/types"
// import * as fs from "fs";
const fs = require('fs');

const Parser = require('@babel/parser');

const recursive = require("recursive-readdir-synchronous");

const template = fs.readFileSync('./src/build/template.ts', 'utf8');
const header = template.substr(0, template.indexOf('// GEN-CODE'));
const footer = template.substr(template.indexOf('// GEN-CODE') + 12);
const path = './src/';
const options= {
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

module.exports = (function () {

  const files = recursive(path);

  const promises = [];
  processFiles(files, promises);
  return waitFor(promises);
})();

function processFiles(files, promises) {
  files
    .filter(f => {
      if (f.indexOf('.ts') > 0) return f
    })
    .map(f => {
      const data = fs.readFileSync(f, 'utf8');

      promises.push(analyze(data, f));
    });
}

function waitFor(promises) {
  console.log('finished');
  let file = header;
  promises.sort((chunkA, chunkB) => chunkA.toString().localeCompare(chunkB.toString())).map(chunk => file = file + chunk);
  file = file + footer;
  // fs.writeFileSync('src/loader.ts', file, {encoding: 'utf8'});
  return file;
}


function analyze(data, f) {
  let result = '';
  let file = Parser.parse(data, options);
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

function createLoader(f, declaration){
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




