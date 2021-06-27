import { LitElement } from 'lit-element';

/**
 * Action Interface
 */
export type RouteAction = (router: Router, parent?: LitElement | null) => void;

/**
 * Simple Router that provides a basic mapping of a route(string) to an action(function)
 *
 * <p>It supports sub-routes defined as <code>'a/b/c'</code> where the <code>/</code> is the sub-path delimiter.
 * For example if you provide a route for <code>'a'</code> and <code>'a/b'</code> and then the route
 * <code>'#a/b'</code> is requested either through {@link Router.goto('a/b')} or with
 * {@link https://myhost/apath#a/b} then actions registered for <code>'a'</code> and for
 * <code>'a/b'</code> will be called in that order.
 *
 * <p>If a non-existent route is called nothing happens.
 */
export class Router {
  private isDebugOn: boolean = false;
  private routes: Map<string, RouteAction> = new Map();
  private lastHash: string | null = null;
  private readonly parent: LitElement | null;

  constructor(private baseFn: RouteAction = () => Object, parent: LitElement | null = null) {
    this.parent = parent;
    window.onhashchange = (event: HashChangeEvent) => {
      const url = event.newURL;
      const tokens = url.split('#');
      const hash = tokens[1];
      this.log(`hash has changed to: ${hash}`);
      this.goto(hash);
    };

  }

  /**
   * Get the current urls hash (exluding the '#'). Return '' if current url contains a '#' with nothing after or
   * no '#' at all
   */
  static currentHash() {
    return this.browserHashToHash(window.location.hash);
  }

  static currentRoute() {
    return this.toRoute(Router.currentHash());
  }

  private static toRoute(hash: string) {
    return hash.replace(/#/g, '').replace(/_/g, ' ');
  }

  private static toHash(route: string) {
    return route.replace(/ /g, '_');
  }

  private static browserHashToHash(hash: string) {
    if (hash) {
      return hash.replace(/#/g, '');
    } else {
      return '';
    }
  }

  /**
   * Add a route
   * @param {string} route corresponding to route. Supports sub-paths.
   * @param {RouteAction} action function called when route called
   */
  add(route: string, action: RouteAction): Router {
    this.routes.set(route, action);
    return this;
  }

  /**
   * Go to a routeOrHash
   * @param {string} routeOrHash routeOrHash to go to. `#` will be stripped if provided.
   */
  goto(routeOrHash: string | null) {
    if (routeOrHash === null) routeOrHash = '';

    const hash = Router.toHash(routeOrHash);
    const route = Router.toRoute(routeOrHash);

    if (route != null && route != '' && !this.routes.get(route)) throw Error('route not found');

    if (hash !== this.lastHash) {
      if (route) {
        this.log('updating route');
        window.location.hash = hash;
        document.title = `${document.title.split(' - ')[0]} - ${route}`;
        if (route.indexOf('/') > 0) {
          this.log('sub-route');
          const subroutes = route.split('/');
          let routeFragment = '';
          subroutes.map(sr => {
            routeFragment = routeFragment ? `${routeFragment}/${sr}` : sr;
            this.dispatch(routeFragment, this.parent);
          });
        } else {
          this.log('main-route');
          this.dispatch(route, this.parent);
        }
      } else {
        //if(this.isDebugOn)console.log('DEBUG-ROUTER: updating from hash');
        window.location.hash = hash;
        document.title = `${document.title.split(' - ')[0]}`;
        this.baseFn(this, this.parent);
      }
      this.lastHash = hash;
    }
  }

  debug() {
    this.isDebugOn = true;
    return this;
  }

  goHome() {
    this.goto('');
  }

  private log(message: string) {
    if (this.isDebugOn) console.log(`DEBUG-ROUTER: ${message}`);
  }

  private dispatch(route: string, parent: LitElement | null) {

    const fn = this.routes.get(route);
    if (fn) {
      this.log(`dispatching to ${route}`);
      fn(this, parent);
    }
  }
}
