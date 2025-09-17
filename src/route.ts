import { z } from "@hono/zod-openapi";
import { Hono } from "hono";
import { validator, resolver, describeRoute } from "hono-openapi";
const route = new Hono();

const inputSchema = z.object({
    name: z.string().min(1).max(100).describe(" Name to be greeted"), // This description is optional, but useful for OpenAPI
});
const outputSchema = z.object({
    hello: z.string(),
});

route.post(
    "/",
    describeRoute({
        responses: {
            200: {
                description: "Successful Response",
                content: {
                    "application/json": { schema: resolver(outputSchema) },
                },
            },
        },
    }),
    validator("json", inputSchema),
    (c) => {
        const query = c.req.valid("json");
        return c.json({ hello: query.name });
    }
);

export default route;
