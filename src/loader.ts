const components = {};

components['home'] = async () =>
  await import(/* webpackChunkName: "ow-home" */'./site/ow-home.ts')
    .then((scope) => new scope.OwHome());

components['portfolio'] = async () =>
  await import(/* webpackChunkName: "ow-portfolio" */'./site/ow-portfolio.ts')
    .then((scope) => new scope.OwPortfolio());

export const Loader = {
  load: {
    async all() {
      let loading = [];
      Object.keys(components).map((k) => {
        console.debug(`loading ${k}`);
        loading.push(components[k]().then(() => console.debug(`loaded ${k}`)));
      });
      return Promise.all(loading);
    },
  },
};
