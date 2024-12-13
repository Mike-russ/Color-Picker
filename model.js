const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Mike-russ:A8xj5FEQxjlnY1uk@cluster0.okkawyl.mongodb.net/Colors?retryWrites=true&w=majority');

// Define the Color schema
const colorSchema = new mongoose.Schema({
    RedValue: {
        type: Number,
        required: true,
        min: [0, "Red value is too low"],
        max: [255, "Red Value is too high"]
    },
    GreenValue: {
        type: Number,
        required: true,
        min: [0, "Green value is too low"],
        max: [255, "Green value is too high"]
    },
    BlueValue: {
        type: Number,
        required: true,
        min: [0, "Blue value is too low"],
        max: [255, "Blue value is too high"]
    },
    HexValue: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // Regular expression to validate HexValue format
                return /^#[0-9A-Fa-f]{6}$/.test(value);
            },
            message: 'Invalid HexValue format'
        }
    },
    Note: String
});

const Color = new mongoose.model('Color', colorSchema);

module.exports = {
    Color: Color
}