// *****************************
// Generated code... DO NOT EDIT
// *****************************
const components = {};

// GEN-CODE

function load(k, components) {
  console.debug(`loading ${k}`);
  return components[k]().then(() => console.debug(`loaded ${k}`));
}

export const Loader = {
  load: {
    async initial(names: string[]) {
      const promises = [];
      names.map((name) => promises.push(load(name, components)));
      return Promise.all(promises);
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
