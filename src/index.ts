import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { cors } from "hono/cors";
import helloRoute from "./route";
import { openAPIRouteHandler } from "hono-openapi";
import { Scalar } from "@scalar/hono-api-reference";

type Bindings = {
    // You can write your own bindings or env secret here.
};
const app = new Hono<{ Bindings: Bindings }>();
app.use(requestId(), cors());

app.route("/hello", helloRoute);
app.get(
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
app.get("/docs", Scalar({ url: "/openapi.json" }));
export default app;
