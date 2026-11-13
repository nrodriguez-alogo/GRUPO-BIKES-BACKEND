import { storeImage, removeImage } from "../middlewares/resources.js";
import { fail } from "../ayudas/validacion.js";
export function crud(Model, validate) {
  return {
    async list(req, res) {
      const filter = {};
      if (
        Model.modelName === "productos" &&
        req.query.categoria !== undefined
      ) {
        if (
          typeof req.query.categoria !== "string" ||
          !["Nuevas", "Usadas"].includes(req.query.categoria)
        )
          fail(400, "Categoría inválida.");
        filter.categoria = req.query.categoria;
      }
      res.json({
        datos: await Model.find(filter).sort({ _id: -1 }).limit(200),
      });
    },
    async get(req, res) {
      const item = await Model.findById(req.params.id);
      if (!item) fail(404, "Publicación no encontrada.");
      res.json({ datos: item });
    },
    async create(req, res) {
      const data = validate(req.body || {});
      data.imagen = await storeImage(req);
      const item = await Model.create(data);
      res.status(201).json({ mensaje: "Publicación creada.", datos: item });
    },
    async update(req, res) {
      const data = validate(req.body || {});
      const old = await Model.findById(req.params.id);
      if (!old) fail(404, "Publicación no encontrada.");
      if (req.file) data.imagen = await storeImage(req);
      const item = await Model.findByIdAndUpdate(
        req.params.id,
        { $set: data },
        { returnDocument: "after", runValidators: true },
      );
      if (!item) fail(404, "Publicación no encontrada.");
      if (data.imagen) await removeImage(old.imagen);
      res.json({ mensaje: "Publicación actualizada.", datos: item });
    },
    async remove(req, res) {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) fail(404, "Publicación no encontrada.");
      await removeImage(item.imagen);
      res.json({ mensaje: "Publicación eliminada." });
    },
  };
}
