console.log("SCRIPT NOVO BAYMAX 123");
document.addEventListener("DOMContentLoaded", function () {
    let conversaAtiva = false;

        const botao = document.getElementById("botao");

        const SpeechRecognition =
                window.SpeechRecognition ||
                window.webkitSpeechRecognition;

        if(!SpeechRecognition){
            alert("Seu navegador não suporta reconhecimento de voz.");
            return;
        }

        const reconhecimento = new SpeechRecognition();
                reconhecimento.lang = "pt-BR";
                reconhecimento.continuous = false;
                reconhecimento.interimResults = false;

//  BOTÃO
        botao.addEventListener("click", function(){
            
            console.log("CLIQUE NO BOTÃO");

        if(!conversaAtiva){

            conversaAtiva = true;
            botao.textContent = "ENCERRAR CONVERSA.";

            reconhecimento.start();

        } else{

            conversaAtiva = false;
            botao.textContent = "FALAR";

            reconhecimento.stop();
            window.speechSynthesis.cancel();
        }
        });

//BAYMAX COMEÇA A OUVIR
        reconhecimento.onstart = function (){
            console.log("Baymax está ouvindo...");
        };

//RECONHECIMENTO DE VOZ
reconhecimento.onresult = function (event){
                const texto =
                    event.results[0][0].transcript.toLowerCase();
                console.log("Você disse:", texto);
            perguntaAoBaymax(texto);
};

//ENVIA A PERGUNTA PARA O BACKEND
async function perguntaAoBaymax(pergunta) {
    try{
            console.log("Enviando para o servidor:", pergunta);
            const resposta = await fetch(
                "http://localhost:3000/perguntar",
                {
                    method: "POST",

                    headers: {
                            "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        pergunta: pergunta
                    })
                }
            );

            const dados = await resposta.json();
                    console.log(
                        "Resposta do servidor:",
                        dados.resposta
                    );
                falar(dados.resposta);
                        }catch (erro){
                            console.error(
                                "Erro ao conectar ao servidor:",
                                erro
                            );

                            falar(
                                "Não consegui me conectar ao servidor."
                            );
                        }
                    }

//BAYMAX FALA
function falar(texto){ 
    
    const mensagem = 
    new SpeechSynthesisUtterance(texto);
    mensagem.lang = "pt-BR";
    mensagem.rate = 1;
    mensagem.pitch = 1; 
    
    window.speechSynthesis.cancel();
    mensagem.onend = function (){
        if (conversaAtiva){
            setTimeout(function (){
                try{
                    reconhecimento.start();
                }catch (erro){
                    console.log(
                        "Reconhecimento já estava ativo."
                    );
                }
            }, 500);
        }
        };  
        window.speechSynthesis.speak(mensagem);  
    }
//ERROS DE RECONHECIMENTO
reconhecimento.onerror = function (event){
    console.log(
        "Erro de reconhecimento:",
        event.error
    );
};

//BAYMAX PARA DE OUVIR
reconhecimento.onend = function (){
    console.log(
        "Baymax parou de ouvir."
    );
};
});

//SERVICE WORKER    
if("serviceWorker" in navigator){
    window.addEventListener("load", function(){
        navigator.serviceWorker
        .register("./service-worker.js")
            .then(function (){
        console.log(
            "Baymax: Service Worker registrado!" 
        );
        })

        .catch(function (erro){
            console.log(
                "Erro no Service Worker:",
                erro
            );
        });
    });
}