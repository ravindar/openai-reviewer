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
        let { prompt, model_criteria } = req.body;
        console.log("Inside summary");
        console.log(prompt);
        console.log(model_criteria);

        if (!model_criteria || model_criteria.trim() === '') {
            console.log("No summary criteria provided, using defaults. 1. Summary of Application. 2. Summary of applicants Impact. 3. Summary of applicants Team. 4. Summary of applicants Timeline. 5. Summary of applicants Risks. 6. Summary of applicants Sustainability. 7. Summary of applicants Future Plans. 8. Summary of applicants Budget.");
            model_criteria = "You will be presented with a grant application. Provide summary of the application based on these topics: 1. Summary of Application. 2. Summary of applicants Impact. 3. Summary of applicants Team. 4. Summary of applicants Timeline. 5. Summary of applicants Risks. 6. Summary of applicants Sustainability. 7. Summary of applicants Future Plans. 8. Summary of applicants Budget. ";
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4-1106-preview",
            messages: [
                {
                    "role": "system",
                    "content": `${model_criteria}`
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
        let { prompt, model_criteria } = req.body;
        console.log("Inside smart review")
        console.log(prompt);
        console.log(model_criteria);

        if (!model_criteria || model_criteria.trim() === '') {
            console.log("No review criteria provided, using defaults scale (1-5 for each). 1. Is the applicant eligible for the grant? 2. Is the applicant's project eligible for the grant? 3. Review this applicant's proposal for clarity. 4.Evaluate this proposal's feasibility. 5. Evaluate this proposal's impact. 6. Evaluate this proposal's budget. 7. Evaluate this proposal's timeline. 8. Evaluate this proposal's risks. 9. Evaluate this proposal's sustainability. 10. Evaluate this proposal's future plans. 11. Evaluate this proposal's team. 12. Evaluate this proposal's eligibility. 13. Assess the social impact of this proposal.");
            model_criteria = "You will be presented with a grant application. Review the application on the basis of the following criteria using default scale of 1-5 for each criteria. Give a total across the criteria: (1-5 for each). 1. Is the applicant eligible for the grant? 2. Is the applicant's project eligible for the grant? 3. Review this applicant's proposal for clarity. 4.Evaluate this proposal's feasibility. 5. Evaluate this proposal's impact. 6. Evaluate this proposal's budget. 7. Evaluate this proposal's timeline. 8. Evaluate this proposal's risks. 9. Evaluate this proposal's sustainability. 10. Evaluate this proposal's future plans. 11. Evaluate this proposal's team. 12. Evaluate this proposal's eligibility. 13. Assess the social impact of this proposal.";
        }
        const response = await openai.chat.completions.create({
            model: "gpt-4-1106-preview",
            messages: [
                {
                    "role": "system",
                    "content": `${model_criteria}`
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