import { LightningElement, api } from 'lwc';

const DEFAULT_TEXT =
    'Hola. Esta es una demostración de lectura en voz alta desde Salesforce.';

export default class TextToSpeech extends LightningElement {
    @api defaultText = DEFAULT_TEXT;

    text = DEFAULT_TEXT;
    voices = [];
    selectedVoiceURI = '';
    rate = 1;
    isSupported = false;
    isSpeaking = false;
    isPaused = false;
    statusMessage = '';

    synthesis;
    voicesChangedHandler;

    connectedCallback() {
        this.text = this.defaultText || DEFAULT_TEXT;
        this.synthesis = window.speechSynthesis;
        this.isSupported = Boolean(
            this.synthesis && window.SpeechSynthesisUtterance
        );

        if (!this.isSupported) {
            this.statusMessage =
                'La lectura en voz alta no está disponible en este navegador.';
            return;
        }

        this.loadVoices();
        this.voicesChangedHandler = () => this.loadVoices();
        this.synthesis.addEventListener(
            'voiceschanged',
            this.voicesChangedHandler
        );
    }

    disconnectedCallback() {
        if (this.synthesis && this.voicesChangedHandler) {
            this.synthesis.removeEventListener(
                'voiceschanged',
                this.voicesChangedHandler
            );
        }
        if (this.synthesis && this.isSpeaking) {
            this.synthesis.cancel();
        }
    }

    get voiceOptions() {
        return [
            { label: 'Voz predeterminada del dispositivo', value: '' },
            ...this.voices.map((voice) => ({
                label: `${voice.name} (${voice.lang})`,
                value: voice.voiceURI
            }))
        ];
    }

    get canSpeak() {
        return this.isSupported && Boolean(this.text.trim());
    }

    get isSpeakDisabled() {
        return !this.canSpeak;
    }

    get areControlsDisabled() {
        return !this.isSpeaking;
    }

    get pauseResumeLabel() {
        return this.isPaused ? 'Continuar' : 'Pausar';
    }

    get pauseResumeIcon() {
        return this.isPaused ? 'utility:play' : 'utility:pause';
    }

    loadVoices() {
        this.voices = this.synthesis
            .getVoices()
            .slice()
            .sort((firstVoice, secondVoice) => {
                const firstIsSpanish = firstVoice.lang
                    .toLowerCase()
                    .startsWith('es');
                const secondIsSpanish = secondVoice.lang
                    .toLowerCase()
                    .startsWith('es');
                return Number(secondIsSpanish) - Number(firstIsSpanish);
            });
    }

    handleTextChange(event) {
        this.text = event.target.value;
    }

    handleVoiceChange(event) {
        this.selectedVoiceURI = event.detail.value;
    }

    handleRateChange(event) {
        this.rate = event.detail.value;
    }

    handleSpeak() {
        if (!this.canSpeak) {
            return;
        }

        this.synthesis.cancel();
        const utterance = new window.SpeechSynthesisUtterance(this.text.trim());
        const selectedVoice = this.voices.find(
            (voice) => voice.voiceURI === this.selectedVoiceURI
        );

        utterance.rate = this.rate;
        utterance.lang = selectedVoice?.lang || 'es-ES';
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.onstart = () => {
            this.isSpeaking = true;
            this.isPaused = false;
            this.statusMessage = 'Reproduciendo…';
        };
        utterance.onend = () => {
            this.isSpeaking = false;
            this.isPaused = false;
            this.statusMessage = 'Lectura finalizada.';
        };
        utterance.onerror = (event) => {
            this.isSpeaking = false;
            this.isPaused = false;
            this.statusMessage =
                event.error === 'not-allowed'
                    ? 'Toca «Leer en voz alta» para permitir la reproducción.'
                    : 'No se pudo reproducir el texto. Inténtalo de nuevo.';
        };

        this.isSpeaking = true;
        this.isPaused = false;
        this.statusMessage = 'Preparando lectura…';
        this.synthesis.speak(utterance);
    }

    handlePauseResume() {
        if (this.isPaused) {
            this.synthesis.resume();
            this.isPaused = false;
            this.statusMessage = 'Reproduciendo…';
        } else {
            this.synthesis.pause();
            this.isPaused = true;
            this.statusMessage = 'Lectura en pausa.';
        }
    }

    handleStop() {
        this.synthesis.cancel();
        this.isSpeaking = false;
        this.isPaused = false;
        this.statusMessage = 'Lectura detenida.';
    }
}
