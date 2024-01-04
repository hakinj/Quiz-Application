import express from "express";
import mongoose from "mongoose";
const port = 3000;
const app = express();

connectDb();

const quizSchema = new mongoose.Schema({
    question: {
        required: true,
        type: String,
        unique: true
    },
    options: {
        required: true,
        type: Array
    }
});

const QuizModel = mongoose.model("quiz", quizSchema);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
// app.use()

app.get("/", (req, res) => {
    res.status(200).render("home");
});

app.get("/start-quiz", (req, res) => {
    res.status(200).render("start");
});

app.get("/create-quiz", (req, res) => {
    res.status(200).render("create");
});
app.get("/get-quiz", async (req, res) => {
    try {
        const quizzes = await QuizModel.find();
        console.log(quizzes);
        res.status(200).json({success: true, message: "data fetch successful", quizzes});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "error fetching data"});
    }
})

app.post("/submit-quiz", async (req, res) => {
    console.log(req.body);
    const { question, answer, option1, option2, option3 } = req.body;
    const newQuiz = new QuizModel({
        question,
        options: [answer, option1, option2, option3]
    });
    try {
        const savedquiz = await newQuiz.save();
        console.log("new document saved!");
        res.status(201).render("decision", { success: true, message: "document saved successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).render("decision", { success: false, message: "document not saved" });
    };
});


async function connectDb() {
    try {
        await mongoose.connect("mongodb://localhost/quizApp");
        console.log("connected to database");
        app.listen(port, () => console.log(`Server is running on local host: ${port}`));
    }
    catch (err) {
        console.log(err);
    }
}