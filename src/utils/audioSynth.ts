/**
 * Pure Web Audio API Sound Synthesizer for relaxing ambient soundscapes & meditation chimes.
 * Generates continuous audio procedurally without external audio assets or network dependencies.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private activeNodes: { [key: string]: { stop: () => void; setVolume: (v: number) => void } } = {};

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a soft Tibetan singing bowl chime (for breathing cycles or start/end of meditation)
  playChime(freq = 432, duration = 3.5) {
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      // Soft overtone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.756, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (duration * 0.7));

      osc.connect(gain);
      osc2.connect(gain2);
      gain.connect(ctx.destination);
      gain2.connect(ctx.destination);

      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + duration);
      osc2.stop(ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  // Gentle breathing tone (low pleasant flute-like drone that swells with inhale and calms with exhale)
  playBreathCue(type: 'inhale' | 'exhale' | 'hold') {
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);

      const now = ctx.currentTime;
      if (type === 'inhale') {
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(330, now + 1.5);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.5);
        gain.gain.linearRampToValueAtTime(0.001, now + 1.8);
      } else if (type === 'exhale') {
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.exponentialRampToValueAtTime(196, now + 1.8);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 2.0);
      } else {
        // Hold
        osc.frequency.setValueAtTime(261.63, now); // Middle C
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.8);
      }

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(now + 2.1);
    } catch {
      // Ignore
    }
  }

  // Start continuous procedural soundscapes
  startSoundscape(soundType: 'rain' | 'ocean' | 'pink_noise' | 'forest_wind', volume = 0.5) {
    this.stopSoundscape(soundType);
    try {
      const ctx = this.initContext();
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate base noise
      let lastOut = 0.0;
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (soundType === 'pink_noise' || soundType === 'rain') {
          // Paul Kellet's filtered pink noise algorithm
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        } else {
          // Brown noise (ocean / wind)
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        }
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);

      if (soundType === 'rain') {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1100, ctx.currentTime);
        noise.connect(filter);
        filter.connect(masterGain);
      } else if (soundType === 'ocean') {
        // Slow LFO for ocean wave cycles
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 sec ocean swell cycle
        lfoGain.gain.setValueAtTime(320, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        noise.connect(filter);
        filter.connect(masterGain);
        lfo.start();
      } else if (soundType === 'forest_wind') {
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(380, ctx.currentTime);
        filter.Q.setValueAtTime(1.8, ctx.currentTime);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
        lfoGain.gain.setValueAtTime(180, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        noise.connect(filter);
        filter.connect(masterGain);
        lfo.start();
      } else {
        // Pink noise
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2500, ctx.currentTime);
        noise.connect(filter);
        filter.connect(masterGain);
      }

      masterGain.connect(ctx.destination);
      noise.start();

      this.activeNodes[soundType] = {
        stop: () => {
          try {
            masterGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            setTimeout(() => {
              try {
                noise.stop();
                noise.disconnect();
              } catch {
                // Ignore
              }
            }, 600);
          } catch {
            // Ignore
          }
        },
        setVolume: (v: number) => {
          masterGain.gain.setValueAtTime(v * 0.25, ctx.currentTime);
        },
      };
    } catch {
      // Audio autoplay policy
    }
  }

  stopSoundscape(soundType: string) {
    if (this.activeNodes[soundType]) {
      this.activeNodes[soundType].stop();
      delete this.activeNodes[soundType];
    }
  }

  stopAll() {
    Object.keys(this.activeNodes).forEach((k) => this.stopSoundscape(k));
  }

  isSoundActive(soundType: string): boolean {
    return !!this.activeNodes[soundType];
  }
}

export const soundSynth = new SoundSynthesizer();
