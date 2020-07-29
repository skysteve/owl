import { Response, Request } from "express";

export function getIndex(_req: Request, res: Response): void {
  res.send('Owl Server');
}