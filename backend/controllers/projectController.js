const Project = require('../models/Project');
const SubItem = require('../models/SubItem');

exports.createProject = async (req, res) => {
  try {
    const { projectId, projectName, numberOfItems, description } = req.body;
    const project = new Project({
      projectId,
      projectName,
      numberOfItems,
      description,
      totalItems: 0,
      status: 'current'
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addParts = async (req, res) => {
  try {
    const { id } = req.params;
    const { parts } = req.body;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (parts.length > project.numberOfItems) {
      return res.status(400).json({ error: `Cannot add more than ${project.numberOfItems} parts.` });
    }

    let totalQuantity = 0;
    const savedParts = [];

    for (let part of parts) {
      const subItem = new SubItem({
        ...part,
        projectId: project._id
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
    res.status(500).json({ error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCurrentProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'current' });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompletedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'completed' });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.completeProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, { status: 'completed' }, { new: true });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Route to get all unique parts logic for Autocomplete / Suggestions
exports.getPartSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(200).json([]);
    
    // Find matching part codes or names
    const parts = await SubItem.find({
      $or: [
        { partCode: { $regex: query, $options: 'i' } },
        { partName: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);
    
    // De-duplicate in memory for suggestion list
    const uniqueMap = {};
    parts.forEach(p => {
      uniqueMap[p.partCode] = { partCode: p.partCode, partName: p.partName };
    });
    
    res.status(200).json(Object.values(uniqueMap));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
