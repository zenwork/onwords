const components = {};

components['header'] = async () =>
  await import(/* webpackChunkName: "ow-header" */'./site/ow-header.ts')
    .then((scope) => new scope.OwHeader());

components['home'] = async () =>
  await import(/* webpackChunkName: "ow-home" */'./site/ow-home.ts')
    .then((scope) => new scope.OwHome());

components['portfolio'] = async () =>
  await import(/* webpackChunkName: "ow-portfolio" */'./site/ow-portfolio.ts')
    .then((scope) => new scope.OwPortfolio());

components['blog'] = async () =>
  await import(/* webpackChunkName: "ow-blog" */'./site/ow-blog.ts')
    .then((scope) => new scope.OwBlog());

components['elix-subset'] = async () =>
  await import(/* webpackChunkName: "elix-subset" */'./shared/elix-subset.ts')
    .then((scope) => new scope.default());

function load(k, components) {
  console.debug(`loading ${k}`);
  return components[k]().then(() => console.debug(`loaded ${k}`));
}

export const Loader = {
  load: {
    async initial() {
      return Promise.all([load('header', components)]);
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
