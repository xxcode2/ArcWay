/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CIRCLE_KIT_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
