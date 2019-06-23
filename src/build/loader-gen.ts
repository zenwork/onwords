import { parse, ParserOptions } from "@babel/parser"
import { File } from "@babel/types"
import * as fs from "fs";

const recursive = require("recursive-readdir");

const header = 'const components = {};\n\n';

// language=JavaScript 1.7
const footer =
    `
  function load(k, components) {
    console.debug(\`loading \${k}\`);
    return components[k]().then(() => console.debug(\`loaded \${k}\`));
  }

  export const Loader = {
    load: {
      async initial() {
        return Promise.all([load('OwHeader', components)]);
      },
      async all() {
        let loading = [];
        Object.keys(components).map((k) => {
          loading.push(load(k, components));
        });
        return Promise.all(loading);
      },
    },
  };
`;

let path = './src/';
let options: ParserOptions = {
  // parse in strict mode and allow module declarations
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

function createLoader(f, declaration): string {
  const fullPath = './' + f.substr(f.indexOf('src/') + 4);
  let name = f.substr(f.lastIndexOf('/') + 1);
  const chunkName = name.substr(0, name.indexOf('.'));
  const className = declaration.id.name;
  if (className !== 'OwShell') {
    console.log(`created:${chunkName}`);
    return `components['${className}'] = async () =>\n  await import(/* webpackChunkName: "${chunkName}" */'${fullPath}')\n    .then((scope) => new scope.${className}());\n\n`;

  }
  return '';
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

recursive(path, function (err, files) {
  const promises = [];
  files
    .filter(f => {
      if (f.indexOf('.ts') > 0) return f
    })
    .map(f => {
      const data = fs.readFileSync(f, 'utf8');

      promises.push(new Promise<string>((resolve) => resolve(analyze(data, f))));
    });

  Promise
    .all(promises)
    .then((loaderChunks: Array<Promise<string>>) => {
      console.log('finished');
      let file = header;
      loaderChunks.map(chunk => file = file + chunk);
      file = file + footer;
      fs.writeFileSync('src/loader.ts', file, {encoding: 'utf8'});
    })
    .catch((reason) => console.log(reason))


})
;



