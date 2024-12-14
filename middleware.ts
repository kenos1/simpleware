/**
 * A middleware function
 */
export type Middleware = (last: Response, request: Request, info: Deno.ServeHandlerInfo) => Response | Promise<Response>

/**
 * A middleware function with `URLPattern`
 */
export type MiddlewareWithPattern = (last: Response, request: Request, info: Deno.ServeHandlerInfo, params?: URLPatternResult) => Response | Promise<Response>