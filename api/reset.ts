
export const handleClearApolloCache = (apolloClient: any) => {
  apolloClient.resetStore().catch((error: any) => {
    console.error("Error clearing cache", error);
  });
};