# poke_vault
- Creating a pokedex app using the pokeapi and react native for all your pokemon needs!

# Screenshots
![Screenshot 2024-04-12 at 4 46 53 PM](https://github.com/escheive/pokedex/assets/115295094/d02abb14-604d-45ef-a4fc-00e5a94e8a08)
![Screenshot 2024-04-12 at 4 48 48 PM](https://github.com/escheive/pokedex/assets/115295094/83c0eedd-8212-4253-8ca5-4f51daab197d)

![Screenshot 2024-04-12 at 4 47 08 PM](https://github.com/escheive/pokedex/assets/115295094/7b2bf172-0200-4a5e-b6f2-d4d93a4878e6)
![Screenshot 2024-04-12 at 4 47 21 PM](https://github.com/escheive/pokedex/assets/115295094/e21280d0-79d5-423a-8767-3931886fddee)

![Screenshot 2024-04-12 at 4 47 34 PM](https://github.com/escheive/pokedex/assets/115295094/0c7b87cf-8a09-4ba1-b358-6c7c9901d3c7)
![Screenshot 2024-04-12 at 4 48 32 PM](https://github.com/escheive/pokedex/assets/115295094/42caae69-317f-4b74-a2ca-17cc0e48f943)


- When I first set out to develop this app, I wanted to better learn react-native and mobile development. I chose to NOT use Expo initially because I wanted to dive deep into the fundamentals. I would STRONGLY advise against doing this unless you have a specific reason your app doesn't need Expo. I later rebuilt my app with Expo and it was significantly easier. The functionality that Expo provides is well worth using.


# Description
- This app was inspired by my want to learn more about react native. I am comfortable working with React and wanted to dive more into the mobile side of things while incorporating an api.
- I am using apollo and graphql to manage my cache as well as my api calls
- Current goals for this project are:
- - Better styling so that the app looks very aesthetic for users.
- - More functionality, being able to access even more pokemon info, being able to edit what level the pokemon is to see stat changes.
- - Publish to ios and web.

# References
- React navigation for how to set up my app navigation, https://reactnavigation.org/docs/tab-based-navigation
- Official react native docs for general react native questions, https://reactnative.dev/
- For using Expo, https://docs.expo.dev/
- For using apollo, https://www.apollographql.com/


# Issues Encountered
- When installing drawer navigatior from react-native-navigation, ran into error saying "failed to create a worklet. Did you forget to add reanimated babel plugin in babel.config.js?"
- - Solution was to clear the cache. I followed the steps from this stackoverflow post, https://stackoverflow.com/questions/67130651/reanimated-2-failed-to-create-a-worklet-maybe-you-forgot-to-add-reanimateds-ba
- - Ran 'npx react-native start --reset-cache'


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

# Original Screenshots
<img width="475" alt="Screen Shot 2023-05-15 at 12 56 06 PM" src="https://github.com/escheive/pokedex/assets/115295094/7265093d-6ed9-49ce-abea-263ebec7982c">
<img width="477" alt="Screen Shot 2023-05-15 at 12 56 18 PM" src="https://github.com/escheive/pokedex/assets/115295094/0102320f-e1b8-4bdb-9332-0cc4af69709d">
<img width="485" alt="Screen Shot 2023-05-15 at 12 56 26 PM" src="https://github.com/escheive/pokedex/assets/115295094/0e260262-8e24-4c50-aa97-d9f97ad478fb">
<img width="486" alt="Screen Shot 2023-05-15 at 12 56 34 PM" src="https://github.com/escheive/pokedex/assets/115295094/c844f204-02e6-4322-b46a-2df237feebd9">
<img width="479" alt="Screen Shot 2023-05-15 at 12 56 43 PM" src="https://github.com/escheive/pokedex/assets/115295094/60dd2d1a-fe6d-40e6-aa44-26783f7442d2">
<img width="510" alt="Screen Shot 2023-05-15 at 12 57 15 PM" src="https://github.com/escheive/pokedex/assets/115295094/ffd503fe-c701-4514-acd4-fd4b86bc3cfe">

# Gen 2 Screenshots
<img width="392" alt="Screen Shot 2023-06-01 at 7 53 19 PM" src="https://github.com/escheive/pokedex/assets/115295094/134d1c5e-72dc-4e40-8b87-2bc90a90e832">
<img width="393" alt="Screen Shot 2023-06-01 at 7 53 31 PM" src="https://github.com/escheive/pokedex/assets/115295094/a7f127ce-325d-45d9-93c5-790ee1433735">
<img width="399" alt="Screen Shot 2023-06-01 at 7 53 40 PM" src="https://github.com/escheive/pokedex/assets/115295094/d63d3142-0c46-4dae-8636-b421202899ce">
<img width="394" alt="Screen Shot 2023-06-01 at 7 53 50 PM" src="https://github.com/escheive/pokedex/assets/115295094/aebe7638-3af3-4ba5-a909-69ab9f3ccbd5">
<img width="393" alt="Screen Shot 2023-06-01 at 7 54 05 PM" src="https://github.com/escheive/pokedex/assets/115295094/8fe90b8d-4d45-4ef3-bd24-7b8474b66ebd">
