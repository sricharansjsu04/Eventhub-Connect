const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');


const PORT = process.env.PORT || 3500;

app.use(cors());

app.use( express.static(path.join(__dirname,"public")));
app.use(express.json());


app.use("/home", require("./routes/events"));

app.use("/venues", require("./routes/hostEvent"));

function generateTimeSlots(selectedDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
  
    const availableSlots = [];
    for (let i = 0; i < 24; i++) {
      const slotStart = new Date(today);
      slotStart.setHours(i, 0, 0, 0);
        console.log(slotStart);
      const slotEnd = new Date(today);
      slotEnd.setHours(i + 1, 0, 0, 0);
      const isVacant = i % 2 === 0; 
      availableSlots.push({
        startTime: slotStart.toISOString(),
        endTime: slotEnd.toISOString(),
        label: `${slotStart.getHours()}:00 - ${slotEnd.getHours()}:00`,
        vacant: isVacant,
      });
    }
    // console.log(availableSlots);
    return availableSlots;
    }
  
    generateTimeSlots();

app.post("/book-venue", function(req,res){

        const availableSlots = generateTimeSlots();
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



app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`);
});