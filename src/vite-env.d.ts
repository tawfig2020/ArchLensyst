/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_API_KEY: string;
  readonly VITE_PAYPAL_CLIENT_ID: string;
  readonly MONGODB_DATA_API_KEY: string;
  readonly MONGODB_URL: string;
  readonly MONGODB_CLUSTER: string;
  readonly MONGODB_DATABASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
