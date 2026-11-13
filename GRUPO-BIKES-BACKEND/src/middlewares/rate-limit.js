export function rateLimit({ max = 10, windowMs = 15 * 60 * 1000 } = {}) {
  const buckets = new Map();
  let sweep = 0;
  return (req, res, next) => {
    const now = Date.now();
    if (now - sweep > 60000) {
      for (const [key, b] of buckets) if (b.until <= now) buckets.delete(key);
      sweep = now;
    }
    const key = req.ip;
    let b = buckets.get(key);
    if (!b || b.until <= now) {
      if (buckets.size >= 10000)
        return res
          .status(429)
          .json({ mensaje: "Demasiadas solicitudes. Intenta más tarde." });
      b = { count: 0, until: now + windowMs };
      buckets.set(key, b);
    }
    if (++b.count > max) {
      res.set("Retry-After", String(Math.ceil((b.until - now) / 1000)));
      return res
        .status(429)
        .json({ mensaje: "Demasiados intentos. Espera unos minutos." });
    }
    next();
  };
}
