const Project = require("../models/Project");

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const body = {
      ...req.body,
      images: req.body.images || (req.body.image ? [req.body.image] : []),
      documents: Array.isArray(req.body.documents) ? req.body.documents : req.body.documents || [],
    };
    const project = await Project.create(body);
    res.status(201).json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.location = req.body.location || project.location;
    project.category = req.body.category || project.category;
    project.status = req.body.status || project.status;
    project.image = req.body.image || project.image;
    project.coverImage = req.body.coverImage || project.coverImage;
    project.images = req.body.images || project.images;
    project.documents = req.body.documents || project.documents;
    project.client = req.body.client || project.client;
    project.startDate = req.body.startDate || project.startDate;
    project.completionDate = req.body.completionDate || project.completionDate;
    project.area = req.body.area || project.area;
    await project.save();
    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};