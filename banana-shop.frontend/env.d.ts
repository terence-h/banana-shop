/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

declare namespace NodeJS {
    interface ProcessEnv {
        API_URL: string;
    }
}