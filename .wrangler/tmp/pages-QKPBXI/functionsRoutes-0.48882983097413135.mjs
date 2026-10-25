import { onRequest as __api_tts_ts_onRequest } from "/home/ian/Projects/sakura-nihongo/functions/api/tts.ts"

export const routes = [
    {
      routePath: "/api/tts",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_tts_ts_onRequest],
    },
  ]