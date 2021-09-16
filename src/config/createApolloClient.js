import { default as ApolloClient } from "apollo-boost";

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_API_URL}`,
  request: (operation) => {
    const network = localStorage.getItem("network") || "bsc";
    operation.setContext({
      headers: {
        network,
      },
    });
  },
});

export default client;
