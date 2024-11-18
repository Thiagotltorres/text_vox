// Verifica se o navegador suporta a Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  // Inicialize o reconhecimento de fala
  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR'; // Definir o idioma para português
  recognition.interimResults = true; // Exibir resultados enquanto a pessoa está falando

  const startBtn = document.getElementById('start-record-btn');
  const pauseBtn = document.getElementById('pause-record-btn');
  const transcription = document.getElementById('transcription');
  let isRecognizing = false; // Controle de estado para o reconhecimento
  let hideTimeout; // Variável para o temporizador de esconder a legenda

  // Função para iniciar o reconhecimento de fala
  const startRecognition = () => {
    if (!isRecognizing) {
      recognition.start();
      isRecognizing = true;
      transcription.textContent = "Aguardando fala...";
      transcription.style.opacity = 1;
    }
  };

  // Função para parar o reconhecimento de fala
  const stopRecognition = () => {
    if (isRecognizing) {
      recognition.stop();
      isRecognizing = false;
      transcription.textContent = "Reconhecimento pausado.";
    }
  };

  // Evento de clique no botão Iniciar
  startBtn.addEventListener('click', startRecognition);

  // Evento de clique no botão Pausar
  pauseBtn.addEventListener('click', stopRecognition);

  // Atualizar o texto da legenda em tempo real
  recognition.addEventListener('result', (event) => {
    let interimTranscript = ''; // Variável para armazenar o texto temporário

    for (let i = 0; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        transcription.textContent = transcript; // Atualiza com o texto final
      } else {
        interimTranscript += transcript; // Atualiza com o texto parcial
      }
    }

    transcription.textContent = interimTranscript || transcription.textContent;
    transcription.style.opacity = 1;

    // Limpa o temporizador anterior e define um novo para esconder as legendas
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      transcription.style.opacity = 0;
    }, 3000); // Esconde as legendas após 3 segundos de inatividade
  });

  // Controle para o fim da fala: se não estiver pausado, reinicia automaticamente
  recognition.addEventListener('end', () => {
    if (isRecognizing) {
      recognition.start();
    }
  });
} else {
  console.log("A Web Speech API não é suportada no seu navegador.");
  alert("Infelizmente, seu navegador não suporta a Web Speech API. Tente no Google Chrome.");
}
