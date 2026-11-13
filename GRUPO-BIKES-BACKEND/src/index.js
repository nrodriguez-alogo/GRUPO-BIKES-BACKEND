import "dotenv/config";
import servidor from "./servidor.js";
import { connectDatabase } from "./conexion.js";
import { jwtSecret } from "./config.js";
try {
  jwtSecret();
  await connectDatabase();
  servidor.listen(Number(process.env.PORT || 3002), "127.0.0.1", () =>
    console.log(
      "API disponible en http://localhost:" + (process.env.PORT || 3002),
    ),
  );
} catch (error) {
  console.error("No se pudo iniciar la API:", error.name);
  process.exitCode = 1;
}
