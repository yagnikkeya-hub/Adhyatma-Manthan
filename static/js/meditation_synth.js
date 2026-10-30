class SpiritualAudioEngine {
    constructor() {
        this.htmlAudio = new Audio();
        this.isAudioElementPlaying = false;

        
        this.ctx = null;
        this.activeNodes = [];
        this.masterGain = null;

        this.currentTrackData = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.isRepeat = false;
        this.masterVolume = 0.65;
        this.elapsedSeconds = 0;
        this.totalDuration = 300;
        this.timerInterval = null;

        this.onProgressUpdate = null;
        this.onStateChange = null;
        this.onNotice = null;

        this.setupHtmlAudio();
    }

    setupHtmlAudio() {
        this.htmlAudio.preload = 'metadata';
        
        this.htmlAudio.addEventListener('loadedmetadata', () => {
            if (this.htmlAudio.duration && !isNaN(this.htmlAudio.duration)) {
                this.totalDuration = Math.floor(this.htmlAudio.duration);
            }
        });

        this.htmlAudio.addEventListener('timeupdate', () => {
            if (this.isAudioElementPlaying) {
                this.elapsedSeconds = Math.floor(this.htmlAudio.currentTime);
                if (this.onProgressUpdate) {
                    this.onProgressUpdate(this.elapsedSeconds, this.totalDuration);
                }
            }
        });

        this.htmlAudio.addEventListener('ended', () => {
            if (this.isRepeat) {
                this.htmlAudio.currentTime = 0;
                this.htmlAudio.play();
            } else {
                this.pauseTrack();
            }
        });

        this.htmlAudio.addEventListener('error', (e) => {
            console.log('Recorded chant file not found or inaccessible; falling back to peaceful devotional ambient synthesizer.');
            if (this.isAudioElementPlaying) {
                this.isAudioElementPlaying = false;
                this.startSynthesizerFallback(this.currentTrackData);
                if (this.onNotice) {
                    this.onNotice('Devotional Chant Audio Recording not found in /static/audio/. Playing sacred devotional ambient tones with Sanskrit text to chant along.');
                }
            }
        });
    }

    initSynthContext() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContextClass();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setVolume(val) {
        this.masterVolume = Math.max(0, Math.min(1, parseFloat(val)));
        this.htmlAudio.volume = this.masterVolume;
        if (this.masterGain && this.ctx && !this.isMuted) {
            this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
            this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.08);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.htmlAudio.muted = this.isMuted;
        if (this.masterGain && this.ctx) {
            const target = this.isMuted ? 0 : this.masterVolume;
            this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
            this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
        }
        return this.isMuted;
    }

    toggleRepeat() {
        this.isRepeat = !this.isRepeat;
        this.htmlAudio.loop = this.isRepeat;
        return this.isRepeat;
    }

    seek(seconds) {
        this.elapsedSeconds = Math.max(0, Math.min(this.totalDuration, seconds));
        if (this.isAudioElementPlaying) {
            try {
                this.htmlAudio.currentTime = this.elapsedSeconds;
            } catch(e) {}
        }
        if (this.onProgressUpdate) {
            this.onProgressUpdate(this.elapsedSeconds, this.totalDuration);
        }
    }

    playTrack(trackData) {
        if (!trackData) return;
        this.currentTrackData = trackData;
        this.isPlaying = true;

        
        if (trackData.audio_file) {
            this.stopSynthesizer();
            this.htmlAudio.src = trackData.audio_file;
            this.htmlAudio.volume = this.isMuted ? 0 : this.masterVolume;
            this.isAudioElementPlaying = true;

            const playPromise = this.htmlAudio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    
                    if (this.onStateChange) this.onStateChange(true, trackData, 'recording');
                }).catch(err => {
                    
                    this.isAudioElementPlaying = false;
                    this.startSynthesizerFallback(trackData);
                    if (this.onNotice) {
                        this.onNotice('Chant recording not found in /static/audio/. Playing meditative ambient tones for chanting.');
                    }
                });
            }
        } else {
            this.startSynthesizerFallback(trackData);
        }

        if (this.onStateChange) this.onStateChange(true, trackData, this.isAudioElementPlaying ? 'recording' : 'synth');
    }

    startSynthesizerFallback(trackData) {
        this.initSynthContext();
        this.stopSynthesizer();
        this.elapsedSeconds = 0;

        if (trackData.id === 1) this.totalDuration = 330;
        else if (trackData.id === 2) this.totalDuration = 300;
        else if (trackData.id === 3) this.totalDuration = 300;
        else if (trackData.id === 4) this.totalDuration = 240;
        else if (trackData.id === 5) this.totalDuration = 420;
        else this.totalDuration = 300;

        const type = trackData.sound_type || 'shiva_om';
        const baseFreq = trackData.base_freq || 136.1;

        if (type === 'shiva_om') this.createMahaMrityunjayaLandscape(baseFreq);
        else if (type === 'solar_morning') this.createGayatriSolarLandscape(baseFreq);
        else if (type === 'prana_flow') this.createPranayamaAirLandscape(baseFreq);
        else if (type === 'water_peace') this.createShantiPeaceLandscape(baseFreq);
        else this.createEveningGratitudeLandscape(baseFreq);

        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (this.isPlaying && !this.isAudioElementPlaying) {
                this.elapsedSeconds++;
                if (this.onProgressUpdate) {
                    this.onProgressUpdate(this.elapsedSeconds, this.totalDuration);
                }
                if (this.elapsedSeconds >= this.totalDuration) {
                    if (this.isRepeat && this.currentTrackData) {
                        this.elapsedSeconds = 0;
                        this.playTrack(this.currentTrackData);
                    } else {
                        this.pauseTrack();
                    }
                }
            }
        }, 1000);
    }

    pauseTrack() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);

        if (this.isAudioElementPlaying) {
            try { this.htmlAudio.pause(); } catch(e) {}
            this.isAudioElementPlaying = false;
        }

        this.stopSynthesizer();
        if (this.onStateChange) this.onStateChange(false, this.currentTrackData);
    }

    createMahaMrityunjayaLandscape(root) {
        const t = this.ctx.currentTime;
        const trackGain = this.ctx.createGain();
        trackGain.gain.setValueAtTime(0.0001, t);
        trackGain.gain.exponentialRampToValueAtTime(0.32, t + 2.5);
        trackGain.connect(this.masterGain);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280, t);
        filter.Q.setValueAtTime(1.2, t);
        filter.connect(trackGain);

        const freqs = [root * 0.5, root, root * 1.5, root * 0.998, root * 1.002];
        freqs.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t);

            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.setValueAtTime(0.08 + (idx * 0.02), t);
            lfoGain.gain.setValueAtTime(0.03, t);
            lfo.connect(lfoGain);
            lfoGain.connect(gain.gain);
            lfo.start();
            this.activeNodes.push(lfo);

            const oscVol = idx === 0 ? 0.35 : idx === 1 ? 0.30 : 0.12;
            gain.gain.setValueAtTime(oscVol, t);
            osc.connect(gain);
            gain.connect(filter);
            osc.start();
            this.activeNodes.push(osc);
        });

        this.activeNodes.push(trackGain, filter);
    }

    createGayatriSolarLandscape(root) {
        const t = this.ctx.currentTime;
        const trackGain = this.ctx.createGain();
        trackGain.gain.setValueAtTime(0.0001, t);
        trackGain.gain.exponentialRampToValueAtTime(0.28, t + 2.5);
        trackGain.connect(this.masterGain);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(420, t);
        filter.connect(trackGain);

        const notes = [root * 0.5, root * 0.75, root, root * 1.004];
        notes.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t);
            g.gain.setValueAtTime(i === 0 ? 0.30 : 0.18, t);
            osc.connect(g);
            g.connect(filter);
            osc.start();
            this.activeNodes.push(osc);
        });

        this.activeNodes.push(trackGain, filter);
    }

    createPranayamaAirLandscape(root) {
        const t = this.ctx.currentTime;
        const trackGain = this.ctx.createGain();
        trackGain.gain.setValueAtTime(0.0001, t);
        trackGain.gain.exponentialRampToValueAtTime(0.26, t + 2.5);
        trackGain.connect(this.masterGain);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, t);
        filter.connect(trackGain);

        const freqs = [root * 0.25, root * 0.5, root * 0.75];
        freqs.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t);
            g.gain.setValueAtTime(i === 0 ? 0.32 : 0.16, t);
            osc.connect(g);
            g.connect(filter);
            osc.start();
            this.activeNodes.push(osc);
        });

        this.activeNodes.push(trackGain, filter);
    }

    createShantiPeaceLandscape(root) {
        const t = this.ctx.currentTime;
        const trackGain = this.ctx.createGain();
        trackGain.gain.setValueAtTime(0.0001, t);
        trackGain.gain.exponentialRampToValueAtTime(0.28, t + 2.5);
        trackGain.connect(this.masterGain);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(360, t);
        filter.connect(trackGain);

        const notes = [root * 0.5, root, root * 1.5];
        notes.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t);
            g.gain.setValueAtTime(i === 0 ? 0.34 : 0.18, t);
            osc.connect(g);
            g.connect(filter);
            osc.start();
            this.activeNodes.push(osc);
        });

        this.activeNodes.push(trackGain, filter);
    }

    createEveningGratitudeLandscape(root) {
        const t = this.ctx.currentTime;
        const trackGain = this.ctx.createGain();
        trackGain.gain.setValueAtTime(0.0001, t);
        trackGain.gain.exponentialRampToValueAtTime(0.25, t + 3.0);
        trackGain.connect(this.masterGain);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(220, t);
        filter.connect(trackGain);

        const freqs = [root * 0.25, root * 0.5, root * 0.75];
        freqs.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t);
            g.gain.setValueAtTime(idx === 0 ? 0.38 : 0.14, t);
            osc.connect(g);
            g.connect(filter);
            osc.start();
            this.activeNodes.push(osc);
        });

        this.activeNodes.push(trackGain, filter);
    }

    stopSynthesizer() {
        if (this.activeNodes.length === 0) return;
        const nodesToStop = [...this.activeNodes];
        this.activeNodes = [];

        nodesToStop.forEach(n => {
            try { if (n.stop) n.stop(); if (n.disconnect) n.disconnect(); } catch (e) {}
        });
    }
}

window.SpiritualSynth = new SpiritualAudioEngine();