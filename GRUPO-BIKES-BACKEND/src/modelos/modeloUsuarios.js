import { Schema, model } from "mongoose";
const schema = new Schema(
  {
    nombre: { type: String, required: true, trim: true, maxlength: 100 },
    correo: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    emailKey: { type: String, unique: true, sparse: true, select: false },
    imagen: { type: String, default: "usuarios/default-user.svg" },
    contrasena: { type: String, required: true, select: false },
    rol: {
      type: String,
      enum: ["usuario", "administrador"],
      default: "usuario",
    },
    tokenVersion: { type: Number, default: 0, select: false },
    recoveryHash: { type: String, select: false },
    recoveryExpires: { type: Date, select: false },
    recoveryIssuedAt: { type: Date, select: false },
    recoveryAttempts: { type: Number, default: 0, select: false },
  },
  { timestamps: true },
);
export default model("usuarios", schema);
