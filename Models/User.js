    import mongoose from "mongoose";

    const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["Admin", "Customer"], default: "Customer" },
    });

    const User = mongoose.model("User", UserSchema);
    export default User;
