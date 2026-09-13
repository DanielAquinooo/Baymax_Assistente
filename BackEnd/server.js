require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express ();
const PORT = 3000;
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use (express.json());

app.get("/", (req, res) => {
    res.send("Baymax backend está funcionado!");
});

app.post("/perguntar", async(req, res) => {
    const pergunta = req.body.pergunta;
        console.log("Pergunta recebida:", pergunta);

        try{
            const resposta = await openai.responses.create({
                model: "gpt-5.6-Luna",
                input: [{
                    role: "system",
                    content: "Você é o Baymax, um assistente virtual amigável. Responda em português do Brasil de forma clara e natural."
                },
                {
                    role: "user",
                    content:pergunta
                }
            ]
});
    console.log("Resposta da IA:", resposta.output_text);
    res.json({
        resposta: resposta.output_text
    });
        } catch (erro){
            console.error("Error na IA:", erro);
            res.status(500).json({
                resposta:"Desculpa, tive um problema para pensar em uma resposta."
            });
        }
        });
