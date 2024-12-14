import type { Middleware, MiddlewareWithPattern } from "./middleware.ts";

/**
 * A router
 */
export default class Router {
  /**
   * The middleware stack of the router
   */
  middlewares: Middleware[];

  /**
   * Creates a router
   */
  constructor(public defaultRoute?: Deno.ServeHandler) {
    this.middlewares = [];
  }

  /**
   * Pushes a middleware function to the stack
   * @param middleware The middleware to use
   * @returns The router for method chaining
   */
  add(middleware: Middleware): this {
    this.middlewares.push(middleware);
    return this;
  }

  /**
   * Creates a HTTP method helper function. Used for `Router.get()`, `Router.post()`, `Router.put()` `Router.delete()`
   * @ignore
   */
  private createMethodHelper(
    method: string,
    pathname: URLPattern | string,
    middleware: MiddlewareWithPattern,
  ): this {
    return this.add((last, request, info) => {
      if (request.method !== method) return last;

      const patternResult = (pathname instanceof URLPattern
        ? pathname
        : new URLPattern({ pathname })).exec(request.url);

      if (!patternResult) {
        return last;
      }

      return middleware(last, request, info, patternResult);
    });
  }

  /**
   * Creates a middleware function using the GET HTTP method
   * @param pathname The path of the middleware
   * @param middleware The middleware function
   */
  get(pathname: URLPattern | string, middleware: MiddlewareWithPattern): this {
    return this.createMethodHelper("GET", pathname, middleware);
  }

  /**
   * Creates a middleware function using the POST HTTP method
   * @param pathname The path of the middleware
   * @param middleware The middleware function
   */
  post(pathname: URLPattern | string, middleware: MiddlewareWithPattern): this {
    return this.createMethodHelper("POST", pathname, middleware);
  }

  /**
   * Creates a middleware function using the PUT HTTP method
   * @param pathname The path of the middleware
   * @param middleware The middleware function
   */
  put(pathname: URLPattern | string, middleware: MiddlewareWithPattern): this {
    return this.createMethodHelper("PUT", pathname, middleware)
  }

  /**
   * Creates a middleware function using the DELETE HTTP method
   * @param pathname The path of the middleware
   * @param middleware The middleware function
   */
  delete(pathname: URLPattern | string, middleware: MiddlewareWithPattern): this {
    return this.createMethodHelper("DELETE", pathname, middleware)
  }

  /**
   * The serve handler of the router
   * @example ```ts
   * const router = new Router();
   *
   * Deno.serve(router.handler.bind(router));
   * ```
   */
  async handler(
    request: Request,
    info: Deno.ServeHandlerInfo,
  ): Promise<Response> {
    let last = this.defaultRoute
      ? await this.defaultRoute(request, info)
      : new Response();

    for (const middleware of this.middlewares) {
      const result = middleware(last, request, info);
      last = result instanceof Promise ? await result : result;
    }

    return last;
  }
}
