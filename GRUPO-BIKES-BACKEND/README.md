# Grupo Bikes — API

Ejecuta `npm.cmd start` en Windows (`npm start` en otros sistemas). La API escucha en 127.0.0.1:3002 y solo empieza a aceptar peticiones después de conectar MongoDB.

## Configuración

Usa .env.example como referencia y conserva MONGODB de tu .env. JWT_SECRET debe tener al menos 32 caracteres aleatorios. ADMIN_REGISTRATION_CODE es una invitación privada que debe introducirse al registrar una cuenta administradora; no se incluye en Angular. Se generaron ambos valores en el .env local durante la integración. No compartas ese archivo ni incluyas sus valores en capturas.

El envío real de correos requiere SMTP_USER, SMTP_PASS y MAIL_FROM, además de SMTP_HOST/PORT/SECURE (o EMAIL_NODE y PASS_NODE para Gmail). SMTP_PASS debe ser una contraseña de aplicación si el proveedor lo requiere. Reinicia la API después de cambiar .env. Sin estas credenciales, recuperar cuenta responde con un error controlado y no cambia la contraseña. No hay simulación de correo fuera de las pruebas.

## Flujos

- POST /usuarios crea usuario o administrador con invitación válida y devuelve JWT + usuario público. Angular inicia sesión automáticamente y redirige a /home o /administrador.
- POST /login inicia sesión; GET /login/me valida firma, caducidad y estado actual de la cuenta. POST /login/logout revoca las sesiones de esa cuenta. Los tokens duran una hora.
- GET /productos y /noticias son públicos. POST, PUT /:id y DELETE /:id requieren Bearer token de un administrador verificado en MongoDB.
- Las imágenes usan el campo multipart imagen: JPG, PNG o WebP, máximo 5 MB, con verificación de firma y nombre aleatorio. Se validan los campos antes de guardar el archivo.
- POST /usuarios/olvidarContrasena solicita el correo. POST /usuarios/restablecerContrasena recibe correo, codigo y contrasena. La clave tiene 10 caracteres totales, contiene mayúscula/minúscula/número y exactamente dos símbolos de . - $. Solo se guarda su hash; vence en 15 minutos y admite 5 intentos. No cambia la contraseña hasta que el código correcto se canjee. Al cambiarla se revocan los tokens anteriores.

## Datos anteriores

Se detectaron 11 grupos de correos repetidos en la base existente. No se borraron ni fusionaron. El inicio de sesión y la recuperación de un correo ambiguo piden intervención del responsable para evitar elegir una cuenta arbitrariamente. Hay que decidir qué cuenta conservar y qué información trasladar.

Las cuentas nuevas usan emailKey normalizado con índice único disperso. Esto impide carreras entre registros nuevos sin imponer una migración destructiva sobre los duplicados antiguos. Se comprueban también coincidencias por mayúsculas/minúsculas contra cuentas anteriores. Antes de publicar, resuelve los duplicados con copia de seguridad y una política de fusión acordada.

## Pruebas

`npm.cmd test` conecta al servidor MongoDB configurado usando una base exclusiva grupobikes_test_<identificador>. No utiliza las colecciones de la aplicación. Simula SMTP, prueba permisos, inyecciones, campos vacíos, archivos inválidos, CRUD, caducidad, bloqueo y uso único de recuperación, y limpia su base y archivos al terminar. El usuario de MongoDB necesita permisos para crear y borrar esa base temporal. El mensaje Error de servicio durante el caso SMTP es un fallo simulado intencional.

## Producción

Angular usa /api. Configura un proxy inverso que reenvíe /api/ a esta API eliminando ese prefijo, manteniendo el mismo origen y usando HTTPS. El proxy de angular.json solo sirve para desarrollo. La API escucha en loopback; si usas contenedores, adapta la interfaz de escucha de forma explícita al despliegue. Si hay varios procesos de API, sustituye el limitador en memoria por un almacén compartido; sus contadores se reinician al reiniciar el proceso. Mantén los logs y .env fuera del acceso público.

Referencias: [errores asíncronos de Express](https://expressjs.com/en/guide/error-handling/) y [recuperación de cuentas de OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html).
