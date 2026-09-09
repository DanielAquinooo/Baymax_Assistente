document.addEventListener("DOMContentLoaded", function () {
    let conversaAtiva = false;

    const botao = document.getElementById("botao");

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Seu navegador não suporta reconhecimento de voz.");
        return;
    }

    const reconhecimento = new SpeechRecognition();

    reconhecimento.lang = "pt-BR";
    reconhecimento.continuous = false;
    reconhecimento.interimResults = false;


    // Botão
    botao.addEventListener("click", function () {
        console.log("CLIQUE NO BOTÃO");
              if(!conversaAtiva){
            conversaAtiva = true;
            botao.textContent = "Encerrar conversa";
            reconhecimento.start();
            
           
              } else {
            conversaAtiva = false
            botao.textContent = "Falar";
            reconhecimento.stop();
        }
                
    });


    // Ouvir
    reconhecimento.onstart = function () {

        console.log("Baymax está ouvindo...");

    };


    //Reconhecimento de Voz
    reconhecimento.onresult = function (event) {

        const texto =
            event.results[0][0].transcript.toLowerCase();

        console.log("Você disse:", texto);

        perguntarAoBaymaxresponder(texto);

    };


    // Responde (Básico)
    function responder(texto) {

        if (texto.includes("oi") || texto.includes("olá")) {

            falar("Oi! Como posso ajudar?");

        }

        else if (texto.includes("seu nome")) {

            falar("Meu nome é Baymax.");

        }

        else if (texto.includes("quem é você")) {

            falar("Eu sou o Baymax, seu assistente virtual.");

        }

        else if (texto.includes("tudo bem")) {

            falar("Tudo ótimo! Obrigado por perguntar.");

        }

        else if (texto.includes("obrigado") ||
                 texto.includes("obrigada")) {

            falar("Por nada!");

        }

        else if (texto.includes("bom dia")) {

            falar("Bom dia! Espero que seu dia seja ótimo.");

        }

        else if (texto.includes("boa tarde")) {

            falar("Boa tarde!");

        }

        else if (texto.includes("boa noite")) {

            falar("Boa noite! Até amanhã.");

        }

        else {

            falar("Desculpe, ainda não sei responder isso.");

        }

    }


    // Baymax responde
    function falar(texto) {

        const mensagem =
            new SpeechSynthesisUtterance(texto);

        mensagem.lang = "pt-BR";
        mensagem.rate = 1;
        mensagem.pitch = 1;

        window.speechSynthesis.cancel();
        
             mensagem.onend = function (){
                     if(conversaAtiva){
                            setTimeout(function(){
                                reconhecimento.start();
                }, 500);
                     }
             };
        window.speechSynthesis.speak(mensagem);

    }


    // Erros
    reconhecimento.onerror = function (event) {

        console.log("Erro:", event.error);

    };


    //Termina
    reconhecimento.onend = function () {

        console.log("Baymax parou de ouvir.");

    };

});

//Para celular

if ("serviceWorker" in navigator){

    window.addEventListener("load", function (){
        navigator.serviceWorker.register("./service-worker.js")
        .then(function(){
            console.log("Baymax: Service Worker registrado!");
        })
        .catch(function(erro){
            console.log("Erro no service Worker:", erro);
        });
    });
}

async function perguntaAoBaymax(pergunta) {
    try{
        const resposta = await fetch("http://localhost:3000/perguntar",{
            
            method: "POST",
            headers: {
                    "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pergunta: pergunta
            })
        });

        const dados = await resposta.json();
        console.log("Respotas do servidor:", dados.resposta);
        falar(dados.resposta);

    } catch (erro) {
        console.erro("Error ao conectar ao servidor:", erro);
        falar("Não consegui me conectar ao servidor:");
    }}


