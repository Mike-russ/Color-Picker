# s24-project1-Mike-russ

# Color Picker

https://s24-project1-mike-russ.onrender.com

## Color Schema
    - RedValue - Number (between 0 and 255)
    - GreenValue - Number (between 0 and 255)
    - BlueValue - Number (between 0 and 255)
    - HexValue - String (In the style of "#******")
    - Note - String (Not required)


## Rest Endpoints

| Rest endpoint | Method    | Path  | Purpose   |
|---------------|-----------|---------|-----------|
| colors        | GET       | /colors    | Displays all data for all colors |
| colors        | POST      | /colors    | Adds a new color to the database |
| id            | PATCH     | /colors/id | lets the user update the Note |
| id            | DELETE    | /colors/id | Deletes the selected color from the database |