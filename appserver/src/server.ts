import { buildApp } from "./app";
const app = buildApp();

const PORT = Number(process.env.PORT ?? 7070);
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
