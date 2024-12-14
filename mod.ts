/**
  * This module contains the router.
  *
  *
  * # Simpleware
  * 
  * A simple middleware router for use in Deno.
  * 
  * ## Example
  *
  * A simple hello world example with a:
  * - Not found handler
  * - A root handler
  * - A handler with parameters
  * - A logger middleware
  *
  * @example ```ts
  * import { Router } from "jsr:@kenos/simpleware";
  * 
  * const router = new Router(() => {
  *   return new Response(null, { status: 404 });
  * })
  *   .get("/", () => {
  *     return new Response("Hello world!");
  *   })
  *   .get("/:name", (_, __, ___, params) => {
  *     return new Response(`Hello ${params?.pathname.groups["name"]}!`);
  *   })
  *   .add((last, request) => {
  *     console.log(`${last.status} ${request.method} ${request.url}`);
  *     return last;
  *   });
  * Deno.serve(router.handler.bind(router));
  * ```
 */

import Router from "./router.ts"

export { Router }