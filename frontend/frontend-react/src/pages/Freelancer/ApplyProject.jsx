import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/Appcontext";
import "../../styles/ApplyProject.css";
import { toast } from 'react-toastify'

export default function ApplyProject() {
    const navigate = useNavigate()
    const [project, setProject] = useState('')
    const { backendUrl, userData } = useContext(AppContext)
    const { projectId } = useParams();
    const fetchDetails = async () => {
        try {
            const ProjectData = await axios.get(`${backendUrl}/api/project/getProjectById/${projectId}`)
            setProject(ProjectData.data)

        }
        catch (err) {
            console.error("Error fetching project:", err);
        }
    }
    useEffect(() => {
        fetchDetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId])

    const [proposal, setProposal] = useState("");
    const [amount, setAmount] = useState("");
    console.log("User data:", userData)
    const freelancerId = userData?.id

    const handleSubmitBid = async () => {
        try {
            if (!freelancerId) {
                toast.error("Please login to place a bid!");
                return;
            }

            if (!amount || !proposal.trim()) {
                toast.error("Please fill both fields!");
                return;
            }

            await axios.post(`${backendUrl}/api/bid/placeBid/${projectId}`, {
                freelancerId,
                amount,
                proposal,
            });
            toast.success("Bid submitted successfully!");
            setAmount('')
            setProposal('')
            navigate('/browseProjects')
        }
        catch (err) {
            console.error(err);
            toast.error("Cannot submit Bid!");
        }
    }
    return (
        <>

            <Navbar />
            <div className="apply-wrapper">
                <br />
                <div className="apply-card">
                    <h1 className="apply-title">Apply for: {project?.title}</h1>

                    <p className="apply-field"><strong>Category:</strong> {project?.category}</p>
                    <p className="apply-field"><strong>Description:</strong> {project?.description}</p>
                    <p className="apply-field"><strong>Budget:</strong> ₹{project?.budget}</p>

                    <h2 className="section-heading">Your Proposal</h2>
                    <textarea className="proposal-box" value={proposal} onChange={(e) => setProposal(e.target.value)} placeholder="Write your proposal..." />

                    <h3 className="section-heading">Your Bid Amount</h3>
                    <input type="number" className="amount-input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter your bid amount" />

                    <button className="submit-btn" onClick={handleSubmitBid}>Submit Bid</button>
                </div>
            </div>
        </>
    );
}


