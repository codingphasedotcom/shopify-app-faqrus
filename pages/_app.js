import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import App from "next/app";
import { AppProvider } from "@shopify/polaris";
import { Provider, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch, getSessionToken } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import axios from "axios";
import {RoutePropagator} from '../components/RoutePropagator';

function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}

function MyProvider(props) {
  const app = useAppBridge();
  
  
  const authAxios = axios.create();

  authAxios.interceptors.request.use((config) => {
    return getSessionToken(app)
    .then((token) => {
      // console.log(token)
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    })
  })

  authAxios.interceptors.response.use((response) => {
    return response
  }, async function (error) {
    const originalRequest = error.config;

    if(error.response.status === 403 && !originalRequest._retry) {
      console.log('HIT ERROR')
      const redirect = Redirect.create(app)
      redirect.dispatch(Redirect.Action.APP, '/auth' || '/auth')
    }
    return Promise.reject(error)
  })

  const client = new ApolloClient({
    fetch: userLoggedInFetch(app),
    fetchOptions: {
      credentials: "include",
    },
  });

  const Component = props.Component;

  return (
    <ApolloProvider client={client}>
      <Component {...props} authAxios={authAxios} />
    </ApolloProvider>
  );
}

class MyApp extends App {
  render() {
    const { Component, pageProps, host } = this.props;
    return (
      <AppProvider i18n={translations}>
        <Provider
          config={{
            apiKey: API_KEY,
            host: host,
            forceRedirect: true,
          }}
        >
          <RoutePropagator />
          <MyProvider Component={Component} {...pageProps} />
        </Provider>
      </AppProvider>
    );
  }
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  return {...appProps, host: appContext.ctx.query.host}
}


// MyApp.getInitialProps = async ({ ctx }) => {
//   return {
//     host: ctx.query.host,
//   };
// };

export default MyApp;


{/* <AppBridgeWithShopify>
  <GraphqlConnection>
    <Component></Component>
  </GraphqlConnection>
</AppBridgeWithShopify> */}
