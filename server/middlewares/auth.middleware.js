import * as jsonWebtoken from "jsonwebtoken";
import { StatusCode } from "status-code-enum";

export const authMiddleWare = (secret) => (req, res, next) => {
  const isNotProtected = req.url.startsWith("/users");
  if (isNotProtected) {
    return next();
  }
  const { token } = req.cookies;
  if (!token) {
    return res.status(StatusCode.ClientErrorUnauthorized).send("unauthorized");
  }
  try {
    const payload = jsonWebtoken.default.verify(token, secret);
    req.user = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch (e) {
    console.error(e);
    return res.status(StatusCode.ClientErrorUnauthorized).send("unauthorized");
  }
};
