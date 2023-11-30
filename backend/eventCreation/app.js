const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);


const PORT = process.env.PORT || 3500;

app.use(cors());

app.use( express.static(path.join(__dirname,"public")));
app.use(express.json());


app.use("/home", require("./routes/events"));

app.use("/venues", require("./routes/hostEvent"));



app.post("/book-venue", function(req,res){

        // console.log(availableSlots);
        res.json(availableSlots);

    })

app.post("/hostEvent", function(req,res){
    console.log("Hi");
    console.log(req.body)
    // const availableSlots = generateTimeSlots();
    // console.log(availableSlots);
    // res.json(availableSlots);

})


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});