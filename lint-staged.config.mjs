/**
 * @type {import("lint-staged").Configuration}
 */
export default {
    "src/**/*.{js,json,md}": "prettier --write",
    "src/**/*.ts":
        "cross-env NODE_OPTIONS=--experimental-strip-types prettier --write",
};
