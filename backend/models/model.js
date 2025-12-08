import mongoose from 'mongoose';
const { Schema, model } = mongoose;

//  USER SCHEMA
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['client', 'freelancer'],
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: Number,
    },
    otpExpiry: {
        type: Date
    },
    bio: {
        type: String
    },
    skills: {
        type: [String] // array of skills
    },
    profilePic: {
        type: String // URL or filename
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});


//PROJECT SCHEMA
const ProjectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    budget: {
        type: String,
        required: true
    },
    deadline: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'completed'],
        default: 'open'
    },
    category: {
        type: String,
        required:true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // reference to client
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User' // reference to freelancer
    },
    bids: [{
        type: Schema.Types.ObjectId,
        ref: 'Bid'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});


// BID SCHEMA
const BidSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    freelancer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    proposal: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});


//  EXPORT MODELS
const User = model('User', UserSchema);
const Project = model('Project', ProjectSchema);
const Bid = model('Bid', BidSchema);

export { User, Project, Bid };
