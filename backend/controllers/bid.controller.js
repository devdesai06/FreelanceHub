import { Bid } from "../models/model.js";
import { Project } from "../models/model.js";
import { User } from "../models/model.js";
import mongoose from "mongoose";
import fetch from "node-fetch";

// ===================================================
// PLACE BID
// ===================================================
export const placeBid = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { freelancerId, amount, proposal } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const newBid = new Bid({
      project: projectId,
      freelancer: freelancerId,
      amount,
      proposal,
      status: "pending",
    });

    await newBid.save();

    project.bids.push(newBid._id);
    await project.save();

    res.status(201).json({
      success: true,
      message: "Bid placed successfully",
      bid: newBid,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===================================================
// GET BIDS
// ===================================================
export const getBids = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    const bids = await Bid.find({ project: req.params.projectId })
      .populate("freelancer", "name email profilePic");

    res.json({
      success: true,
      bids,
      assignedTo: project?.assignedTo || null,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===================================================
// ACCEPT BID AND SEND EMAIL
// ===================================================
export const acceptBid = async (req, res) => {
  const bidId = req.params.bidId;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bid = await Bid.findById(bidId).session(session);
    if (!bid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Bid not found" });
    }

    if (bid.status === "accepted") {
      await session.commitTransaction();
      session.endSession();
      return res.json({ success: true, message: "Bid already accepted." });
    }

    bid.status = "accepted";
    await bid.save({ session });

    await Bid.updateMany(
      { project: bid.project, _id: { $ne: bid._id } },
      { $set: { status: "rejected" } },
      { session }
    );

    const project = await Project.findById(bid.project).session(session);
    if (!project) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.assignedTo) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "A freelancer has already been assigned to this project.",
      });
    }

    await Project.updateOne(
      { _id: project._id },
      {
        $set: {
          assignedTo: bid.freelancer,
          status: "in-progress",
        },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const updatedBids = await Bid.find({ project: bid.project }).populate(
      "freelancer",
      "name email profilePic rating"
    );

    const user = await User.findById(bid.freelancer);

    // Send email using Brevo HTTP API
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "FreelanceHub", email: "no-reply@freelancehub.com" },
        to: [{ email: user.email }],
        subject: "Your Bid Has Been Accepted",
        htmlContent: `
          <div>
            <h2>Hello ${user.name},</h2>
            <p>Your bid on the project <strong>${project.title}</strong> has been accepted.</p>
            <p>The client will reach out to you soon.</p>
            <p>Regards,<br/>FreelanceHub Team</p>
          </div>
        `,
      }),
    });

    return res.json({
      success: true,
      message: "Bid accepted and others rejected",
      bids: updatedBids,
      project: {
        id: project._id,
        status: project.status,
        assignedTo: project.assignedTo,
      },
    });
  } catch (err) {
    console.error("acceptBid error:", err);
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ success: false, message: err.message });
  }
};
