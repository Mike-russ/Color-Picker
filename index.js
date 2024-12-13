const cors = require('cors')
const express = require('express')
const model = require('./model')
const app = express()
app.use(express.static("public"))

app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.get("/colors", function (request, response) {
    model.Color.find().then((colors) => {
        response.set("Access-Control-Allow-Origin", "*")
        response.json(colors);
    })
})

app.delete("/colors/:id", function(request, response) {
    const colorId = request.params.id;
    console.log(colorId)

    model.Color.findByIdAndDelete(colorId)
        .then(deletedColor => {
            if(!deletedColor) {
                return response.status(404).send("Color not found.")
            }
            response.send("Color deleted");
    })
    .catch(err => {
        console.error("Error deleting color:", err);
        response.status(500).send("Error deleting color.");
    });
});


app.post("/colors", function (request, response) {
    console.log("request body:", request.body);

    const newColor = new model.Color({
        RedValue: request.body.RedValue,
        GreenValue: request.body.GreenValue,
        BlueValue: request.body.BlueValue,
        HexValue: request.body.HexValue,
        Note: request.body.Note
    })
    newColor.save().then(() => {
        response.set("Access-Control-Allow-Origin", "*")
        response.status(201).send("created")
    }).catch(error => {
        if (error.name === 'ValidationError') {
            // Send the errors back to the client
            const validationErrors = Object.values(error.errors).map(err => err.message);
            response.status(400).json({ errors: validationErrors });
        } else {
            // Handle other types of errors
            console.error('Error creating color:', error);
            response.status(500).send("Internal server error");
        }
    });
})

app.patch('/colors/:id', function(request, response) {
    const colorId = request.params.id;
    const updatedNote = request.body.Note;
  
    model.Color.findByIdAndUpdate(colorId, { Note: updatedNote }, { new: true })
        .then(updatedColor => {
            if (!updatedColor) {
                return response.status(404).json({ error: 'Color not found' });
            }
            // Respond with the updated color
            response.json(updatedColor);
        })
        .catch(error => {
            console.error('Error updating color:', error);
            response.status(500).json({ error: 'Internal server error' });
        });
});


app.listen(8080, function () {
    console.log("Server is running...");
})