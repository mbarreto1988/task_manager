export const voiceSettings = {
    rate: 1,
    lang: 'es-MX'
};


export function initializeVoiceConfig() {
    const textToSpeak = document.getElementById("voiceTextToSpeak");
    const inputRate = document.getElementById("voiceInputRate");
    const selectVoice = document.getElementById("voiceSelectVoice");
    const playButton = document.getElementById("playConfiguredVoice");


    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();


    inputRate.addEventListener("input", () => {
        voiceSettings.rate = parseFloat(inputRate.value);
        document.getElementById("labelInputRate").textContent = `Velocidad de reproducción: ${inputRate.value}`;
    });


    selectVoice.addEventListener("change", () => {
        voiceSettings.lang = selectVoice.value;
    });


    function speakText() {
        utterance.text = textToSpeak.value || "Escribe el texto que quieres escuchar.";
        utterance.rate = voiceSettings.rate;
        utterance.lang = voiceSettings.lang;
        synth.speak(utterance);
    }


    playButton.addEventListener("click", () => {
        synth.cancel();
        speakText();
    });
}