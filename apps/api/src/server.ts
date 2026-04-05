import { env } from "./config/env.js";
import { createApp } from "./app.js";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`API de chales rodando em http://localhost:${env.PORT}`);
  console.log("Credencial demo: admin@serra.local / admin123");
});
