import { Bid } from "../models/model.js"
import { Project } from '../models/model.js';

export const placeBid = async (req, res) => {
    try {
        
        const { projectId } = req.params;
        const { freelancerId, amount, proposal } = req.body;

        // Check project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Create bid
        const newBid = new Bid({

            project: projectId,
            freelancer: freelancerId,
            amount,
            proposal,
            status: "pending"

        });
        await newBid.save();

        // Add bid to project's bids array
        project.bids.push(newBid._id);
        await project.save();

        res.status(201).json({ message: "Bid placed successfully", bid: newBid });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getBidsForProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId).populate({
            path: "bids",
            populate: { path: "freelancer", select: "name email skills" }
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ bids: project.bids });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};