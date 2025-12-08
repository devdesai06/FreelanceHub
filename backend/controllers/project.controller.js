import { Project } from '../models/model.js';

export const createProject = async (req, res) => {
    try {
        const { title, description, budget, deadline, category } = req.body;
        const userId = req.user?._id;
        if (!title || !description || !budget || !userId) {
            return res.status(400).json({ success: false, message: "Project data not found" });
        }
        const newProject = new Project({
            title,
            description,
            budget,
            deadline,
            createdBy: userId,
            category,
        });
        await newProject.save();
        res.status(201).json({ success: true, message: 'Project added successfully' });

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }

}

export const searchProjects = async (req, res) => {
    try {
        const query = req.query.q;

        // If no query → return empty results or all (your choice)
        if (!query || query.trim() === "") {
            return res.json([]);   // safest
        }

        const projects = await Project.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } }
            ]
        });

        res.json(projects);

    } catch (err) {
        res.status(500).json({
            message: "Error searching projects",
            error: err.message
        });
    }
};

export const getProjects = async (req, res) => {
    try {
        const { category } = req.query;
        let filter = {}
       
        if (category) {
            if (Array.isArray(category)) {
                filter.category = { $in: category }
            }
            else {
                filter.category = category
            }
        }
        const projects = await Project.find(filter)
        res.json(projects);

    }
    catch (err) {
        res.status(404).json({ err: err.message });
    }

}


export const getProjectByUser = async (req, res) => {
    try {
        const userId = req.user?._id;
        const projects = await Project.find({ createdBy: userId });
        res.status(200).json({ success: true, projects });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }

}

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("createdBy", "name email")
            .populate("assignedTo", "name email");

        if (!project) {
            return res.status(400).json({ success: false, message: "Project not found" });
        }

        res.status(200).json({ success: true, project });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};


export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { title, description, status },
            { new: true } // return updated document
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project updated successfully", project: updatedProject });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAssignedProjects = async (req, res) => {
  try {
    const freelancerId = req.params.freelancerId;

    const projects = await Project.find({ assignedTo: freelancerId })
      .populate( "createdBy","name email")
      .select("title description budget status assignedTo createdAt createdBy");

    res.json({ success: true, projects });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


