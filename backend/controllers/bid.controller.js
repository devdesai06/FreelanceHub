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

    const bids = await Bid.find({ project: req.params.projectId }).populate(
      "freelancer",
      "name email profilePic"
    );

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

    // ===================================================
    // SEND EMAIL USING BREVO HTTP API
    // ===================================================
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "FreelanceHub", email: "devdesai8790@gmail.com" },
        to: [{ email: user.email }],
        subject: "Your Bid Has Been Accepted",
        htmlContent: `
  <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" 
      style="max-width:650px; background:white; border-radius:12px; overflow:hidden;">

      <tr>
        <td style="background:#4CAF50; padding:20px; text-align:center; color:white;">
          <h1 style="margin:0;">🎉 Congratulations, ${user.name}!</h1>
        </td>
      </tr>

      <tr>
        <td style="padding:20px; font-size:16px; color:#555;">
          <p>Your bid on the project <b>${project.title}</b> has been</p>
          <h2 style="color:#4CAF50; margin-top:5px;">ACCEPTED!</h2>

          <p style="margin-top:15px;">
            The client will reach out to you soon regarding next steps. 
            Make sure your profile looks professional and updated — this is your moment! 🚀
          </p>

          <div style="margin-top:25px; padding:15px; border-left:4px solid #4CAF50; background:#f9f9f9;">
            <p style="margin:0; font-size:15px; color:#444;">
              💼 <b>Project:</b> ${project.title} <br/>
              👤 <b>Freelancer:</b> ${user.name}
            </p>
          </div>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding:20px; color:#aaa; font-size:12px;">
          <p>FreelanceHub — Empowering freelancers to succeed.</p>
          <p>© ${new Date().getFullYear()} FreelanceHub</p>
        </td>
      </tr>

    </table>
  </div>
`,
      }),
    });

    if (!brevoResponse.ok) {
      const errText = await brevoResponse.text();
      console.error("Brevo Error:", errText);
    }

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
