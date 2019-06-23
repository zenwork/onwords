// *****************************
// Generated code... DO NOT EDIT
// *****************************
const components = {};

components['ElixSubset'] = async () =>
  await import(/* webpackChunkName: "elix-subset" */'./shared/elix-subset.ts')
    .then((scope) => new scope.ElixSubset());

components['OwBlog'] = async () =>
  await import(/* webpackChunkName: "ow-blog" */'./site/ow-blog.ts')
    .then((scope) => new scope.OwBlog());

components['OwHeader'] = async () =>
  await import(/* webpackChunkName: "ow-header" */'./site/ow-header.ts')
    .then((scope) => new scope.OwHeader());

components['OwHome'] = async () =>
  await import(/* webpackChunkName: "ow-home" */'./site/ow-home.ts')
    .then((scope) => new scope.OwHome());

components['OwPortfolio'] = async () =>
  await import(/* webpackChunkName: "ow-portfolio" */'./site/ow-portfolio.ts')
    .then((scope) => new scope.OwPortfolio());


function load(k, components) {
  console.debug(`loading ${k}`);
  return components[k]().then(() => console.debug(`loaded ${k}`));
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
