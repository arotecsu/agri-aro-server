import { Request, Response } from "express";
function HomeRoute(req: Request, res: Response) {
  res.json({
    message: "Server is running...",
  });
}

export { HomeRoute };
