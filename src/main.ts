/* eslint-disable import/prefer-default-export */
import RootApp from './app';
import store from './store';
import router from './router';
import components from './components';
import dialog from './utils/dialog';

export const extendRootApp = (App: typeof RootApp) => {
  App.use(store).use(router).use(components)
    .use(dialog);
};

extendRootApp(RootApp);


async function main() {
  RootApp.mount('#app');
}
main();
