Drawer navigation => https://dev.to/aaronksaunders/expo-router-drawer-navigation-from-the-docs-231k

I had to import Drawer to the index.tsx file differently though, instead of from "../_layout", import from "expo-router/src/layouts/Drawer". This was so i could enable drawer header on top of stack, with no stack header, then switch when navigating to details page so stack header was visible only

////////////////

Issue with expo/metro and graphql node_modules

Web Bundling failed 6902ms
Unable to resolve "graphql" from "node_modules/graphql-tag/lib/index.js"
Web node_modules/expo-router/node/render.js ▓▓▓░░░░░░░░░░░░░ 23.3% (273/570)
Metro error: Metro has encountered an error: While trying to resolve module `graphql` from file `/Users/erikscheive/Desktop/Coding/projects/PokeVault/node_modules/graphql-tag/lib/index.js`, the package `/Users/erikscheive/Desktop/Coding/projects/PokeVault/node_modules/graphql/package.json` was successfully found. However, this package itself specifies a `main` module field that could not be resolved (`/Users/erikscheive/Desktop/Coding/projects/PokeVault/node_modules/graphql/index.mjs`. Indeed, none of these files exist:

  * /Users/erikscheive/Desktop/Coding/projects/PokeVault/node_modules/graphql/index.mjs(.web.ts|.ts|.web.tsx|.tsx|.web.js|.js|.web.jsx|.jsx|.web.json|.json|.web.cjs|.cjs|.web.scss|.scss|.web.sass|.sass|.web.css|.css)
  * /Users/erikscheive/Desktop/Coding/projects/PokeVault/node_modules/graphql/index.mjs/index(.web.ts|.ts|.web.tsx|.tsx|.web.js|.js|.web.jsx|.jsx|.web.json|.json|.web.cjs|.cjs|.web.scss|.scss|.web.sass|.sass|.web.css|.css): /Users/erikscheive/Desktop/Coding/projects/PokeVault/node_modules/metro/src/node-haste/DependencyGraph.js (289:17)

  287 |         }
  288 |         if (error instanceof InvalidPackageError) {
> 289 |           throw new PackageResolutionError({
      |                 ^
  290 |             packageError: error,
  291 |             originModulePath: from,
  292 |             targetModuleName: to,

  150 |             // }
  151 |             // The Metro logger already showed this error.
> 152 |             throw new Error(data.message);
      |                   ^
  153 |         }
  154 |         throw new Error("Invalid resources returned from the Metro serializer. Expected array, found: " + data);
  155 |     }

Call Stack
  MetroBundlerDevServer.getStaticResourcesAsync (node_modules/@expo/cli/build/src/start/server/metro/MetroBundlerDevServer.js:152:19)
  process.processTicksAndRejections (node:internal/process/task_queues)
  async MetroBundlerDevServer.getStaticPageAsync (node_modules/@expo/cli/build/src/start/server/metro/MetroBundlerDevServer.js:179:41)
  async (node_modules/@expo/cli/build/src/start/server/metro/MetroBundlerDevServer.js:291:46)

solution => https://github.com/facebook/metro/issues/1003#issuecomment-1626398738

//////////////////

For Apollo Persist, setting debug to true allowed me to realize my data was being purged when too much was attempting to be persisted. Adding maxSize 'false' solved the issue


Ran into an issue where i tried to set an item using react state in the bottom sheet component and it would take place after snapping the bottomsheet to an index or opening it. This caused a bug where on app start it would take two taps to get bottom sheet working, and after that it would work on each tap. To fix this, i changed bottom sheet to conditionally render everything inside of it only if item was not null that way the bottom sheet would still render, it would just be empty and then when item was set it could populate the rendered bottom sheet




upgrading to expo sdk 50, i an into a cannot resolve missing dependency error that i solved using this forum, https://github.com/getredash/redash/issues/5269

involved babel-plugin-module-resolver



updating to expo sdk 50 and expo router v3 broke the app because i was importing Drawer from import Drawer from "expo-router/src/layouts/Drawer";

To fix i started importing it like this: import { Drawer } from 'expo-router/drawer';