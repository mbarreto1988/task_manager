// Exportamos un objeto que contiene las configuraciones de voz
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
        voiceSettings.rate = parseFloat(inputRate.value); // Actualizar configuración global
        document.getElementById("labelInputRate").textContent = `Velocidad de reproducción: ${inputRate.value}`;
    });

    selectVoice.addEventListener("change", () => {
        voiceSettings.lang = selectVoice.value; // Actualizar configuración global
    });

    function speakText() {
        utterance.text = textToSpeak.value || "Escribe el texto que quieres escuchar.";
        utterance.rate = voiceSettings.rate; // Usar configuración global
        utterance.lang = voiceSettings.lang; // Usar configuración global

        synth.speak(utterance);
    }

    playButton.addEventListener("click", () => {
        synth.cancel();
        speakText();
    });
}