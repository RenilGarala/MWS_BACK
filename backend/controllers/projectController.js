import Project from "../models/Project.js";
import SubItem from "../models/SubItem.js";

export const createProject = async (req, res) => {
  try {
    const { projectId, projectName, numberOfItems, description } = req.body;
    const project = new Project({
      projectId,
      projectName,
      numberOfItems,
      description,
      totalItems: 0,
      status: "current",
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.log("Error creating project:", error);
    next(error);
  }
};

export const addParts = async (req, res) => {
  try {
    const { id } = req.params;
    const { parts } = req.body;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (parts.length > project.numberOfItems) {
      return res.status(400).json({
        error: `Cannot add more than ${project.numberOfItems} parts.`,
      });
    }

    let totalQuantity = 0;
    const savedParts = [];

    for (let part of parts) {
      const subItem = new SubItem({
        ...part,
        projectId: project._id,
      });
      await subItem.save();
      savedParts.push(subItem);
      // Let's assume totalItems is the total order quantity or total parts?
      // "totalItems = sum of all part quantities", "numberOfItems = No of Parts entered initially"
      totalQuantity += parseInt(part.orderQuantity || 0, 10);
    }

    project.totalItems = totalQuantity;
    await project.save();

    res.status(200).json({ project, parts: savedParts });
  } catch (error) {
    console.log("Error adding parts:", error);
    next(error);
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.log("Error fetching projects:", error);
    next(error);
  }
};

export const getCurrentProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "current" });
    res.status(200).json(projects);
  } catch (error) {
    console.log("Error fetching current projects:", error);
    next(error);
  }
};

export const getCompletedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "completed" });
    res.status(200).json(projects);
  } catch (error) {
    console.log("Error fetching completed projects:", error);
    next(error);
  }
};

export const completeProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(
      id,
      { status: "completed" },
      { new: true },
    );
    res.status(200).json(project);
  } catch (error) {
    console.log("Error completing project:", error);
    next(error);
  }
};

// Route to get all unique parts logic for Autocomplete / Suggestions
export const getPartSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(200).json([]);

    // Find matching part codes or names
    const parts = await SubItem.find({
      $or: [
        { partCode: { $regex: query, $options: "i" } },
        { partName: { $regex: query, $options: "i" } },
      ],
    }).limit(10);

    // De-duplicate in memory for suggestion list
    const uniqueMap = {};
    parts.forEach((p) => {
      uniqueMap[p.partCode] = { partCode: p.partCode, partName: p.partName };
    });

    res.status(200).json(Object.values(uniqueMap));
  } catch (error) {
    console.log("Error fetching part suggestions:", error);
    next(error);
  }
};
