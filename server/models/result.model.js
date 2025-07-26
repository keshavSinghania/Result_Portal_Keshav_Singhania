import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    totalMarks:  {
        type: Number,
        required: true,
    },
    obtainedMarks: {
        type: Number,
        required: true,
    }
});

const sessionalSchema = new mongoose.Schema({
    sessionalNumber: {
        type: Number,
    },
    marks: [marksSchema],
});

const resultSchema = new mongoose.Schema({
    semesterType: {
        type: String,
        enum: ["odd", "even"],
    },
    year: {
        type: Number,
        required: true,
    },
    sessionals: [sessionalSchema],
    semesterExam: [marksSchema],
});


export default resultSchema;