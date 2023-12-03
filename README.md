Drawer navigation => https://dev.to/aaronksaunders/expo-router-drawer-navigation-from-the-docs-231k

I had to import Drawer to the index.tsx file differently though, instead of from "../_layout", import from "expo-router/src/layouts/Drawer". This was so i could enable drawer header on top of stack, with no stack header, then switch when navigating to details page so stack header was visible only