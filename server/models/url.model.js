const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
    },
    shorterUrl: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const urlModel = mongoose.model("Url", urlSchema);

module.exports = urlModel;