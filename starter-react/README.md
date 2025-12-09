# Momentum Design React Starter Kit

This starter repository includes a basic React app setup using [Momentum Design Web Components](https://momentum-design.github.io/momentum-design/en/components/) & [Vite](https://vite.dev/).

- Github repo: <https://github.com/momentum-design/momentum-design>
- NPM Package: <https://www.npmjs.com/package/@momentum-design/components>

## Caveats

This repository is a Starter Kit only - it is not optimised for production and should not be used for production purposes without adjustments to the build tooling & code.
Vite is bundling all assets like icons, brand-visuals, animations etc as part of the dist without analyzing the exact usage
and which assets are actually required. This has to be fixed as part of making it production ready.

## Current Limitations

Vite is not setup yet to support Lottie JSON files, therefore the "Animation component" is currently not available.
This might get fixed in the future or can be fixed once consuming.

## Notes

### React

This package is built with React 19 and imports React components from Momentum Design directly (from the `/dist/react` distributable). Web Components in Momentum Design are wrapped with [@lit/react](https://lit.dev/docs/frameworks/react/) and reexported in that subfolder.
In React 19 Web Components get better supported and can be used in React directly as well, though the way of importing showcased in this repo is in aligment with older React versions as well.
Both importing React components and using Web Components directly (when using React 19) in a React app are supported by Momentum.

### Imports & Typescript

In this package components are imported from `@momentum-design/components/react`. In Typescript versions older than 4.7 this way of importing is not supported, instead `@momentum-design/components/dist/react` has to be used.
