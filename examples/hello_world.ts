/**
 * A simple hello world example with a:
 * - Not found handler
 * - A root handler
 * - A handler with parameters
 * - A logger middleware
 */

import Router from "../router.ts";

// Create the router
const router = new Router(() => {
  // This is your default handler (use this for 404 responses for example)
  return new Response(null, { status: 404 });
})
  // This is the root handler (at /). It returns "Hello world!"
  .get("/", () => {
    return new Response("Hello world!");
  })

  // This is a handler with parameters. When you visit /name, the server responds with "Hello name!"
  // Try this with /bob, /alice, or your own name!
  .get("/:name", (_, __, ___, params) => {
    return new Response(`Hello ${params?.pathname.groups["name"]}!`);
  })
  
  // A logger middleware. It is the last middleware of the stack to apply to all the routes defined above.
  .add((last, request) => {
    console.log(`${last.status} ${request.method} ${request.url}`);
    return last;
  });

// Serve the router
Deno.serve(router.handler.bind(router));
