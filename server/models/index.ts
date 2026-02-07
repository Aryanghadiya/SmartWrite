
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);

const documentSchema = new mongoose.Schema({
    title: { type: String, required: true, default: "Untitled Document" },
    content: { type: String, required: true, default: "" },
    audience: { type: String, default: "general" },
    relationship: { type: String, default: "peer" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    // Use a custom transform to map _id to id
    toJSON: {
        virtuals: true,
        transform: function (doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },
    toObject: {
        virtuals: true,
        transform: function (doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});
// Add a virtual property 'id' that's computed from '_id'
documentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});


export const Document = mongoose.model("Document", documentSchema);

const conversationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
}, {
    toJSON: { virtuals: true, transform: (doc, ret: any) => { ret.id = ret._id; delete ret._id; delete ret.__v; } },
    toObject: { virtuals: true, transform: (doc, ret: any) => { ret.id = ret._id; delete ret._id; delete ret.__v; } }
});
conversationSchema.virtual('id').get(function () { return this._id.toHexString(); });

export const Conversation = mongoose.model("Conversation", conversationSchema);

const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    role: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
}, {
    toJSON: { virtuals: true, transform: (doc, ret: any) => { ret.id = ret._id; delete ret._id; delete ret.__v; } },
    toObject: { virtuals: true, transform: (doc, ret: any) => { ret.id = ret._id; delete ret._id; delete ret.__v; } }
});
messageSchema.virtual('id').get(function () { return this._id.toHexString(); });

export const Message = mongoose.model("Message", messageSchema);

const analysisSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalText: { type: String, required: true },
    result: { type: mongoose.Schema.Types.Mixed, required: true }, // Store JSON result
    createdAt: { type: Date, default: Date.now },
}, {
    toJSON: { virtuals: true, transform: (doc, ret: any) => { ret.id = ret._id; delete ret._id; delete ret.__v; } },
    toObject: { virtuals: true, transform: (doc, ret: any) => { ret.id = ret._id; delete ret._id; delete ret.__v; } }
});
analysisSchema.virtual('id').get(function () { return this._id.toHexString(); });

export const Analysis = mongoose.model("Analysis", analysisSchema);
