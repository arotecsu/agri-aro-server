import { Request } from "express";

function getTokenHeader(req: Request) {
  const _authHeader = req.headers.authorization;

  if (!_authHeader || !_authHeader.startsWith("Bearer")) {
    return null;
  }
  const splits = _authHeader.split(" ");

  if (splits.length == 2) {
    return splits[1];
  }

  return null;
}

export { getTokenHeader };
