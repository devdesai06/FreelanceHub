import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/Appcontext";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
import "../../styles/seeProject.css";

export default function ViewBids() {
  const { backendUrl } = useContext(AppContext);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignedTo, setAssignedTo] = useState(null); // store the accepted freelancer
  const [accepting, setAccepting] = useState(null);

  const { projectId } = useParams();
  const navigate = useNavigate();

  // Fetch bids + project assignedTo
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/bid/getBid/${projectId}`);
        setBids(res.data.bids);
        setAssignedTo(res.data.assignedTo || null);
      } catch (err) {
        toast.error("Failed to load bids");
      }
      setLoading(false);
    };
    fetchBids();
  }, [projectId, backendUrl]);

  // Accept Bid
  const acceptBid = async (bidId, freelancerId) => {
    if (assignedTo) {
      return toast.info("A bid has already been accepted.");
    }

    try {
      setAccepting(bidId);

      await axios.post(
        `${backendUrl}/api/bid/accept/${bidId}`,
        {},
        { withCredentials: true }
      );

      toast.success("Bid Accepted!");

      // Update UI instantly
      setAssignedTo(freelancerId);

      setBids(prev =>
        prev.map(b =>
          b._id === bidId ? { ...b, status: "accepted" } : { ...b, status: "rejected" }
        )
      );

    } catch (err) {
      toast.error("Error accepting bid");
    }

    setAccepting(null);
  };

  return (
    <div className="view-bids-page">
      <Navbar />
      <br />

      <div className="bids-header">
        <br />
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1>Project Bids</h1>
        {!loading && <p className="subtitle">{bids.length} freelancers have applied</p>}
      </div>

      <div className="bids-container">
        {loading && <p className="loading">Loading bids...</p>}

        {!loading && bids.length === 0 && (
          <div className="no-bids">
            <img src="/icons/empty-box.png" alt="No bids" />
            <h2>No Bids Yet</h2>
            <p>Freelancers haven’t applied for this project yet.</p>
          </div>
        )}

        {bids.map((bid) => {
          const isAccepted = assignedTo === bid.freelancer?._id;

          return (
            <div key={bid._id} className="bid-card">
              <div className="freelancer-info">
                <img
                  src={bid.freelancer?.profilePic || "/icons/user.png"}
                  alt="Freelancer"
                  className="freelancer-image"
                />
                <div>
                  <h3 className="freelancer-name">{bid.freelancer?.name}</h3>
                </div>
              </div>

              <p className="proposal-text">{bid.proposal}</p>

              <div className="bid-footer">
                <span className="bid-amount">₹{bid.amount}</span>

                {/* ACCEPT BUTTON LOGIC */}
                {assignedTo ? (
                  isAccepted ? (
                    <button className="accepted-btn" disabled>
                      ✔ Accepted
                    </button>
                  ) : (
                    <button className="reject-btn" disabled>
                      Rejected
                    </button>
                  )
                ) : (
                  <button
                    className="accept-btn"
                    onClick={() => acceptBid(bid._id, bid.freelancer?._id)}
                    disabled={accepting === bid._id}
                  >
                    {accepting === bid._id ? "Accepting..." : "Accept Bid"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
