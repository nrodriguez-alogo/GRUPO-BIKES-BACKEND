import News from "../modelos/modeloNoticias.js";
import { article } from "../ayudas/validacion.js";
import { crud } from "./crud.js";
export default crud(News, article);
