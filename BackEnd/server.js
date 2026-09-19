require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express ();
const PORT = process.env.PORT || 3000;
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
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
            const resposta = await ai.models.generateContent({
                model: "gemini-3.6-flash",
                contents: pergunta,
                config: {
                        systemInstruction: "Você é o Baymax, um assistente virtual amigável. Responda em português do Brasil de forma clara e natural."
                }            
});
    console.log("Resposta da IA:", resposta.text);
    res.json({
        resposta: resposta.text
    });
        } catch (erro){
            console.error("Error na IA:", erro);
            res.status(500).json({
                resposta:"Desculpa, tive um problema para pensar em uma resposta."
            });
        }
        });
 app.listen(PORT, () =>{
    console.log(`Baymax backend rodando em http://localhost:${PORT}`);
});