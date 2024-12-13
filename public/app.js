Vue.createApp({

    data: 
        function () {
        return {
            //Information
            edit: false,
            updatedNote: "",
            Note: "",
            RedValue: 100,
            GreenValue: 100,
            BlueValue: 100,
            HexValue: "#646464",
            colors: []
        };
    },

    watch: {
        RedValue: function(newValue) {
            if (isNaN(newValue) || newValue < 0 || newValue > 255) {
                // If the value is outside the valid range, reset it to the nearest boundary
                this.RedValue = Math.min(Math.max(newValue, 0), 255);
            }
            this.HexValue = this.rgbToHex(Number(newValue), Number(this.GreenValue), Number(this.BlueValue));
        },
        GreenValue: function(newValue) {
            if (newValue < 0 || newValue > 255) {
                this.GreenValue = Math.min(Math.max(newValue, 0), 255);
            }
            this.HexValue = this.rgbToHex(Number(this.RedValue), Number(newValue), Number(this.BlueValue));
        },
        BlueValue: function(newValue) {
            if (newValue < 0 || newValue > 255) {
                this.BlueValue = Math.min(Math.max(newValue, 0), 255);
            }
            this.HexValue = this.rgbToHex(Number(this.RedValue), Number(this.GreenValue), Number(newValue));
        }
    },

    methods: {
        //methods
        toggleEdit(Color) {
            // Toggle editing property
            Color.editing = !Color.editing;
            // Reset the updatedNote field if not editing
            if (!Color.editing) {
                Color.updatedNote = '';
            }
        },

        calculateLuminance(color) {
            let r = parseInt(color.slice(1, 3), 16) / 255;
            let g = parseInt(color.slice(3, 5), 16) / 255;
            let b = parseInt(color.slice(5, 7), 16) / 255;
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
          },
          // Function to determine text color based on background color
          getContrastColor(background) {
            const luminance = this.calculateLuminance(background);
            return luminance > 0.5 ? '#000000' : '#ffffff';
          },

        addColor: function () {
            var data = "RedValue=" + encodeURIComponent(this.RedValue);
            data += "&GreenValue=" + encodeURIComponent(this.GreenValue);
            data += "&BlueValue=" + encodeURIComponent(this.BlueValue);
            data += "&HexValue=" + encodeURIComponent(this.HexValue);
            data += "&Note=" + encodeURIComponent(this.Note);
            console.log("Data is " + data)
            fetch('https://s24-project1-mike-russ.onrender.com/colors/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: data
            }).then((response) =>{
                console.log(response);
                this.loadColors();
                this.Note = ""
                if(response.status == 201){
                    confirm("Color Added!");
                }
            });
        },

        deleteColor: function (colorId) {
            fetch('https://s24-project1-mike-russ.onrender.com/colors/' + colorId, {
                method: "DELETE"
            }).then(response => {
                if (response.status == 200) {
                    alert("Successfully deleted");
                    this.loadColors();
                } else {
                    // If the response status is not in the 200 range, it's an error
                    throw new Error("Failed to delete color");
                }
            })
            .catch(error => {
                console.error("Error deleting color:", error);
                // Handle the error
                alert("Failed to delete color. Please try again later." + colorId);
            });
        },

        submitChanges: function (colorId) {
            var data = "Note=" + encodeURIComponent(this.updatedNote)
        
            fetch('https://s24-project1-mike-russ.onrender.com/colors/' + colorId, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: data
            }).then(response => {
                if (response.ok) {
                    alert("Successfully updated");
                    this.loadColors();
                    this.updatedNote = ""
                    this.edit = false;
                } else {
                    throw new Error('Failed to update');
                }
            }).catch(error => {
                console.error('Error updating Note:', error);
                alert("Failed to update. Please try again.");
            });
        },

        validateHexValue() {
            // Regular expression to match a hexadecimal color code with exactly 6 digits after '#'
            const hexRegex = /^#[A-Fa-f0-9]{6}$/;
        
            // Check if the HexValue matches
            if (!hexRegex.test(this.HexValue)) {
                this.errorMessage = 'Enter valid 6 digits hex "#..."';
                // If it doesn't match, reset it to a default value
                this.HexValue = '#000000';
            } else {
                this.errorMessage = '';
            }
        },

        hexToRgb(hex) {
            // Remove the leading '#'
            hex = hex.replace(/^#/, '');
        
            // Parse the hex value into RGB components
            const red = parseInt(hex.substring(0, 2), 16);
            const green = parseInt(hex.substring(2, 4), 16);
            const blue = parseInt(hex.substring(4, 6), 16);
        
            // Return the RGB components as an object
            return { red, green, blue };
        },

        cancel: function () {
            this.edit = false;
        },

        updateColorsHex() {
              const rgbColor = this.hexToRgb(this.HexValue);
              this.RedValue = rgbColor.red;
              this.GreenValue = rgbColor.green;
              this.BlueValue = rgbColor.blue;
        },

        buttonClickHandler: function () {
            this.addColor();
        },

        deleteAllButton: function () {
            console.log("Button clicked")
            this.deleteColors();
        },

        rgbToHex(red, green, blue) {
            // Convert each RGB component to hexadecimal
            const redHex = red.toString(16).padStart(2, '0');
            const greenHex = green.toString(16).padStart(2, '0');
            const blueHex = blue.toString(16).padStart(2, '0');
      
            // Concatenate the hexadecimal values
            return `#${redHex}${greenHex}${blueHex}`;
        },

        updateColorsRgb() {
            this.HexValue = this.rgbToHex(this.RedValue, this.GreenValue, this.BlueValue);
        },

        loadColors: function () {
            fetch("https://s24-project1-mike-russ.onrender.com/colors").then((response) => {
                if(response.status == 200) {
                    response.json().then((colorsFromServer) => {
                        console.log("received colors from API:", colorsFromServer);
                        this.colors = colorsFromServer;
                    })
                }
            })
        }
    },

    created: function () {
        console.log("Hello, Vue.");
        this.loadColors();
    }
}).mount("#app");