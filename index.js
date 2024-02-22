const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8080;

//schema
const schemaData = mongoose.Schema(
  {
    name: String,
    email: String,
    mobile: String,
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("user", schemaData);
app.get("/", async (req, res) => {
  const data = await userModel.find({});
  res.json({ success: true, data: data });
});

//create save data in mongodb
app.post("/create", async (req, res) => {
  try {
    await userModel.create(req.body);
    res.status(200).json({ success: true, message: "data save successfuly" });
  } catch (error) {
    res.status(500);
    console.log(error);
  }
});

//update data
app.put("/update", async (req, res) =>{
  const { _id, ...rest } = req.body;
  const data = await userModel.updateOne(
    { _id: _id },
    { 
        $set: {
        name: rest.name,
        email: rest.email,
        mobile: rest.mobile,
      },
    }
  );
  res.send({ success: true, message: "data updated successfully", data: data });
});

//delete api
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const data = await userModel.deleteOne({ _id: id });
  res.send({ success: true, message: "data deleted successfully", data: data });
});

mongoose.connect("mongodb://127.0.0.1:27017")
   .then(() => {
    console.log("connected to db");
    app.listen(PORT, () => console.log("Server is running"));
  })
  .catch((err) => console.log(err));
