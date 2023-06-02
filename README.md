# PokéVault
- Creating a pokedex app using the pokeapi and react native for all your pokemon needs!

# Original Screenshots
<img width="475" alt="Screen Shot 2023-05-15 at 12 56 06 PM" src="https://github.com/escheive/pokedex/assets/115295094/7265093d-6ed9-49ce-abea-263ebec7982c">
<img width="477" alt="Screen Shot 2023-05-15 at 12 56 18 PM" src="https://github.com/escheive/pokedex/assets/115295094/0102320f-e1b8-4bdb-9332-0cc4af69709d">
<img width="485" alt="Screen Shot 2023-05-15 at 12 56 26 PM" src="https://github.com/escheive/pokedex/assets/115295094/0e260262-8e24-4c50-aa97-d9f97ad478fb">
<img width="486" alt="Screen Shot 2023-05-15 at 12 56 34 PM" src="https://github.com/escheive/pokedex/assets/115295094/c844f204-02e6-4322-b46a-2df237feebd9">
<img width="479" alt="Screen Shot 2023-05-15 at 12 56 43 PM" src="https://github.com/escheive/pokedex/assets/115295094/60dd2d1a-fe6d-40e6-aa44-26783f7442d2">
<img width="510" alt="Screen Shot 2023-05-15 at 12 57 15 PM" src="https://github.com/escheive/pokedex/assets/115295094/ffd503fe-c701-4514-acd4-fd4b86bc3cfe">

# Current Screenshots
<img width="392" alt="Screen Shot 2023-06-01 at 7 53 19 PM" src="https://github.com/escheive/pokedex/assets/115295094/134d1c5e-72dc-4e40-8b87-2bc90a90e832">
<img width="393" alt="Screen Shot 2023-06-01 at 7 53 31 PM" src="https://github.com/escheive/pokedex/assets/115295094/a7f127ce-325d-45d9-93c5-790ee1433735">
<img width="399" alt="Screen Shot 2023-06-01 at 7 53 40 PM" src="https://github.com/escheive/pokedex/assets/115295094/d63d3142-0c46-4dae-8636-b421202899ce">
<img width="394" alt="Screen Shot 2023-06-01 at 7 53 50 PM" src="https://github.com/escheive/pokedex/assets/115295094/aebe7638-3af3-4ba5-a909-69ab9f3ccbd5">
<img width="393" alt="Screen Shot 2023-06-01 at 7 54 05 PM" src="https://github.com/escheive/pokedex/assets/115295094/8fe90b8d-4d45-4ef3-bd24-7b8474b66ebd">




# Description
- This app was inspired by my want to learn more about react native. I am comfortable working with React and wanted to dive more into the mobile side of things while incorporating an api.
- I chose to use TypeScript because that is where my expertise lies and I didn't want to take on too many new things at once with this project. Baby steps.
- I am also using async storage to allow data saving for the app. I am new to async so my choice to use it was based on research and curiosity on how well it works.
- Current goals for this project are:
- - Better styling so that the app looks very aesthetic for users.
- - More functionality like being able to set favorites on your profile, being able to access even more info about each pokemon, being able to edit what level the pokemon is to see stat changes.
- - Publish the app on the Google Play Store for others to be able to download and try.
- - If time permits, also post to ios.

# References
- I cited react navigation for how to set up my app navigation, https://reactnavigation.org/docs/tab-based-navigation
- I also cited official react native docs for general react native questions, https://reactnative.dev/
- Lastly, I used chatGPT to help answer certain questions. I found it very helpful. https://chat.openai.com/

# Issues Encountered
- When installing drawer navigatior from react-native-navigation, ran into error saying "failed to create a worklet. Did you forget to add reanimated babel plugin in babel.config.js?"
- - Solution was to clear the cache. I followed the steps from this stackoverflow post, https://stackoverflow.com/questions/67130651/reanimated-2-failed-to-create-a-worklet-maybe-you-forgot-to-add-reanimateds-ba
- - Ran 'npx react-native start --reset-cache'
