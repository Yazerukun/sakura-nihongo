import { onRequestGet as __api_tts_ts_onRequestGet } from "/home/ian/Projects/sakura-nihongo/functions/api/tts.ts"

export const routes = [
    {
      routePath: "/api/tts",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_tts_ts_onRequestGet],
    },
  ]