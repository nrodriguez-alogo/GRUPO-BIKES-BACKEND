import Brands from "../modelos/modeloMarcas.js";
import { text } from "../ayudas/validacion.js";
import { crud } from "./crud.js";
export default crud(Brands, (b) =>
  Object.fromEntries(
    ["nombre", "paisOrigen", "empresa", "descripcion"].map((k) => [
      k,
      text(b[k], k, k === "descripcion" ? 2000 : 100),
    ]),
  ),
);
