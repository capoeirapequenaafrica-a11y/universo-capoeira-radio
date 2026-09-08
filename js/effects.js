// ============================================
// VINHETAS E MÚSICA DE FUNDO
// ============================================

const VINHETAS_URLS = {
    'universo': 'https://github.com/capoeirapequenaafrica-a11y/universo-capoeira-radio/raw/main/audio/universo-capoeira.mp3',
    'on-air': 'https://github.com/capoeirapequenaafrica-a11y/universo-capoeira-radio/raw/main/audio/on-air.mp3',
    'fundo': 'https://github.com/capoeirapequenaafrica-a11y/universo-capoeira-radio/raw/main/audio/fundo-capoeira.mp3'
};

let fundoAtivo = false;
let vinhetaEmExecucao = false;
const audioVinheta = new Audio();
const audioFundo = new Audio();

audioFundo.volume = 0.2;
audioFundo.loop = true;

// ===== TOCAR VINHETA + FUNDO =====
function tocarVinheta(tipo = 'universo') {
    if (vinhetaEmExecucao) {
        toast('⏳ Aguarde a vinheta terminar...');
        return;
    }

    try {
        vinhetaEmExecucao = true;
        
        // Pausar rádio
        if (radioAtivo) {
            audio.pause();
        }
        
        // Tocar música de fundo
        if (!fundoAtivo) {
            audioFundo.src = VINHETAS_URLS['fundo'];
            audioFundo.play().catch(() => {
                console.log('Fundo não carregou');
            });
            fundoAtivo = true;
        }
        
        // Tocar vinheta
        audioVinheta.src = VINHETAS_URLS[tipo] || VINHETAS_URLS['universo'];
        audioVinheta.volume = 0.9;
        audioVinheta.play().catch(() => {
            toast('⏳ Carregando vinheta...');
        });
        
        const nomes = {
            'universo': '🎙️ Universo Capoeira',
            'on-air': '📡 ON AIR'
        };
        toast('🎙️ ' + (nomes[tipo] || 'Vinheta'));
        
        // Retomar rádio após vinheta terminar
        audioVinheta.onended = () => {
            vinhetaEmExecucao = false;
            audioFundo.pause();
            fundoAtivo = false;
            
            if (radioAtivo) {
                setTimeout(() => {
                    const playlist = JSON.parse(localStorage.getItem('playlist_github')) || [];
                    tocarMusicaGitHub(playlist);
                }, 500);
            }
        };
    } catch(e) {
        vinhetaEmExecucao = false;
        toast('❌ Erro na vinheta');
    }
}

// ===== CRIAR VINHETA COM VOZ (TEXT-TO-SPEECH) =====
function criarVinhetaVoz(texto) {
    if (vinhetaEmExecucao) {
        toast('⏳ Aguarde a vinheta terminar...');
        return;
    }
    
    try {
        vinhetaEmExecucao = true;
        
        // Pausar rádio
        if (radioAtivo) {
            audio.pause();
        }
        
        // Tocar música de fundo
        if (!fundoAtivo) {
            audioFundo.src = VINHETAS_URLS['fundo'];
            audioFundo.play().catch(() => {
                console.log('Fundo não carregou');
            });
            fundoAtivo = true;
        }
        
        // Criar vinheta com síntese de voz
        const synth = new SpeechSynthesisUtterance(texto);
        synth.lang = 'pt-BR';
        synth.rate = 0.9;
        synth.pitch = 1.1;
        synth.volume = 0.9;
        
        synth.onend = () => {
            vinhetaEmExecucao = false;
            audioFundo.pause();
            fundoAtivo = false;
            
            if (radioAtivo) {
                setTimeout(() => {
                    const playlist = JSON.parse(localStorage.getItem('playlist_github')) || [];
                    tocarMusicaGitHub(playlist);
                }, 500);
            }
        };
        
        synth.onerror = () => {
            vinhetaEmExecucao = false;
            audioFundo.pause();
            fundoAtivo = false;
        };
        
        speechSynthesis.speak(synth);
        toast('🎙️ ' + texto);
    } catch(e) {
        vinhetaEmExecucao = false;
        toast('❌ Erro na vinheta');
    }
}

// ===== PARAR VINHETA =====
function pararVinheta() {
    audioVinheta.pause();
    audioFundo.pause();
    vinhetaEmExecucao = false;
    fundoAtivo = false;
    speechSynthesis.cancel();
    toast('⏹️ Vinheta cancelada');
}