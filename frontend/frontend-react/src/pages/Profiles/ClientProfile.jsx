import React, { useContext } from "react";
import "../../styles/ClientProfile.css";
import { AppContext } from '../../context/Appcontext';

export default function ClientProfile() {
    const {userData}= useContext(AppContext)
    
  return (
    <div>
        <h1>Client Profile</h1>
    </div>
  );
}
