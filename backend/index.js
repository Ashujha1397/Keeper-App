import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

mongoose.set("strictQuery", true);

mongoose.connect(
  "mongodb+srv://Aman:ramu12@cluster0.uitc2qa.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("db is connected")
);
const keeperSchema = mongoose.Schema({
  title: String,
  description: String,
});

const Keeper = new mongoose.model("keeper", keeperSchema);

app.get("/api/getAll", (req, res) => {
  Keeper.find({}, (err, KeeperList) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(KeeperList);
    }
  });
});

app.post("/api/addNew", (req, res) => {
  const { title, description } = req.body;
  const keeperObj = new Keeper({
    title,
    description,
  });
  keeperObj.save((err) => {
    if (err) {
      console.log(err);
    }

    Keeper.find({}, (err, KeeperList) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(KeeperList);
      }
    });
  });
});

app.post("/api/delete", (req, res) => {
  const { id } = req.body;

  Keeper.deleteOne({ _id: id }, () => {
    Keeper.find({}, (err, keeperList) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(keeperList);
      }
    });
  });
});

app.listen(3002, () => {
  console.log("backend created at port 3002");
});
