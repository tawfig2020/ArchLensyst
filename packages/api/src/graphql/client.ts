import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

const GRAPHQL_ENDPOINT =
  typeof window !== 'undefined'
    ? (window as Record<string, unknown>).__ARCHLENS_GRAPHQL_ENDPOINT__ as string ??
      import.meta.env.VITE_GRAPHQL_ENDPOINT ??
      'http://localhost:4000/graphql'
    : 'http://localhost:4000/graphql';

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'include',
  headers: {
    'X-Archlens-Client': 'web',
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[ARCHLENS GraphQL Error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${String(path)}`,
      );
    });
  }
  if (networkError) {
    console.error(`[ARCHLENS Network Error]: ${networkError.message}`);
  }
});

const retryLink = new RetryLink({
  delay: { initial: 300, max: 3000, jitter: true },
  attempts: { max: 3, retryIf: (error) => Boolean(error) },
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        codeFiles: {
          merge(_existing, incoming) {
            return incoming;
          },
        },
        analysisResults: {
          keyArgs: ['fileId'],
          merge(existing, incoming) {
            return { ...existing, ...incoming };
          },
        },
      },
    },
    CodeFile: {
      keyFields: ['path'],
    },
    AnalysisResult: {
      keyFields: ['fileId', 'timestamp'],
    },
  },
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, retryLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  connectToDevTools: process.env.NODE_ENV === 'development',
});
