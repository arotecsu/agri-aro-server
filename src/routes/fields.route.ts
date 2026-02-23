import { Router } from "express";
import { fieldsController } from "../controllers/fields.controller";

export const fieldsRouter = Router();

fieldsRouter.get("/:fieldId/params", fieldsController.getParams);
fieldsRouter.get("/", fieldsController.getAll);
fieldsRouter.post("/", fieldsController.create);
fieldsRouter.get("/:fieldId", fieldsController.getById);
fieldsRouter.put("/:fieldId", fieldsController.update);
fieldsRouter.delete("/:fieldId", fieldsController.delete);

fieldsRouter.post("/:fieldId/invites", fieldsController.addAssociate);
fieldsRouter.delete(
  "/:fieldId/invites/:email",
  fieldsController.removeAssociate,
);
