import { Router } from "express";
import {
  createProject,
  addParts,
  completeProject,
  getCompletedProjects,
  getCurrentProjects,
  getPartSuggestions,
  getProjects,
  updateProject,
  updatePart
} from "../controllers/projectController.js";

const router = Router();
router.get("/suggestions", getPartSuggestions);
router.post("/", createProject);
router.get("/", getProjects);
router.get("/current", getCurrentProjects);
router.get("/completed", getCompletedProjects);
router.post("/:id/parts", addParts);
router.post("/:id/complete", completeProject);
router.put("/part/:partId", updatePart);
router.put("/:id", updateProject);

export default router;
