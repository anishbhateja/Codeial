const mongoose = require("mongoose");

const resetPasswordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  accessToken: {
    type: String,
    required: true,
  },
  isValid: {
    type: Boolean,
    required: true,
  },
});

const ResetPassword = mongoose.model("ResetPassword", resetPasswordSchema);
module.exports = ResetPassword;
