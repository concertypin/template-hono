import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { cors } from "hono/cors";
import helloRoute from "./route";
import { openAPIRouteHandler } from "hono-openapi";
import { Scalar } from "@scalar/hono-api-reference";

type Bindings = {
    // You can write your own bindings or env secret here.
};

let app = new Hono<{ Bindings: Bindings }>();
app = app.use(
    requestId(),
    cors({
        origin: (origin, ctx) => {
            // All origins are allowed in this example
            if (import.meta.env.DEV) return origin;
            else
                throw new Error(
                    "CORS is too permissive for production. Please restrict the origin."
                );
        },
        credentials: true,
    })
);

app = app.route("/hello", helloRoute);
app = app.get(
    "/openapi.json",
    openAPIRouteHandler(app, {
        includeEmptyPaths: true,
        documentation: {
            info: {
                title: "Hono",
                version: "1.0.0",
                description: "API for greeting users",
            },
        },
        exclude: ["/openapi.json", "/docs"],
    })
);
app = app.get("/docs", Scalar({ url: "/openapi.json" }));
export default app;
