import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
});

app.get("/", async (req, res) => {
    res.status(200).send({
        "Hello World!" : "Welcome to the OpenAI API"
    });
});

app.post("/summary", async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log("Inside summary");
        console.log(prompt);
        const response = await openai.chat.completions.create({
            model: "gpt-4-1106-preview",
            messages: [
                {
                    "role": "system",
                    "content": "Summarize content you are provided"
                },
                {
                    "role": "user",
                    "content":`${prompt}`
                }
            ],
            temperature: 0.7,
            max_tokens: 4095,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
        });
        console.log(response);
        console.dir(response.choices[0].message);
        res.status(200).send({
            bot : response.choices[0].message.content
        });
    }catch (error) {
        console.log(error);
        res.status(500).send({error: error.message});
    }
});

app.post("/smart_review", async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log("Inside smart review")
        console.log(prompt);
        const response = await openai.chat.completions.create({
            model: "gpt-4-1106-preview",
            messages: [
                {
                    "role": "system",
                    "content": "You will be presented with a grant application. Review the application on the basis of the following criteria: 1. Is the applicant eligible for the grant? 2. Is the applicant's project eligible for the grant? 3. Is the applicant's budget eligible for the grant? 4. Is the applicant's budget eligible for the grant? 5. Is the applicant's budget eligible for the grant? 6. Is the applicant's budget eligible for the grant? 7. Is the applicant's budget eligible for the grant? 8. Is the applicant's budget eligible for the grant? 9. Is the applicant's budget eligible for the grant? 10. Is the applicant's budget eligible for the grant? 11. Is the applicant's budget eligible for the grant? 12. Is the applicant's budget eligible for the grant? 13. Is the applicant's budget eligible for the grant? 14. Is the applicant's budget eligible for the grant? 15. Is the applicant's budget eligible for the grant?"
                },
                {
                    "role": "user",
                    "content":`${prompt}`
                }
            ],
            temperature: 0.7,
            max_tokens: 4095,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
        });
        console.log(response);
        console.dir(response.choices[0].message);
        res.status(200).send({
            bot : response.choices[0].message.content
        });
    }catch (error) {
        console.log(error);
        res.status(500).send({error: error.message});
    }
});

app.listen(5001, () => {
    console.log("Server is running on port http://localhost:5001/");
});