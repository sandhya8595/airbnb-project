// ===== Favourite Model =====
// Stores which homes a user has favourited.
// Same schema as the original project — just homeId for now.

const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {
    homeId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Favourite = mongoose.model("Favourite", favouriteSchema);

module.exports = Favourite;
