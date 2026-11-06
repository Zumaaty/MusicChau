class EqualizerEngine {
  private ctx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private bands: BiquadFilterNode[] = [];
  private isInit = false;

  public init(audioElement: HTMLAudioElement) {
    if (this.isInit) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.sourceNode = this.ctx.createMediaElementSource(audioElement);

      const freqs = [60, 230, 910, 4000, 14000];
      this.bands = freqs.map((freq) => {
        const filter = this.ctx!.createBiquadFilter();
        filter.type = freq <= 60 ? 'lowshelf' : freq >= 14000 ? 'highshelf' : 'peaking';
        filter.frequency.value = freq;
        filter.gain.value = 0;
        return filter;
      });

      // Chain nodes: Source -> Band1 -> Band2 ... -> Destination
      let current: AudioNode = this.sourceNode;
      this.bands.forEach((band) => {
        current.connect(band);
        current = band;
      });
      current.connect(this.ctx.destination);
      this.isInit = true;
    } catch (e) {
      console.warn('Equalizer AudioContext failed to init:', e);
    }
  }

  public setGain(bandIndex: number, gainValue: number) {
    if (this.bands[bandIndex]) {
      this.bands[bandIndex].gain.value = gainValue;
    }
  }

  public applyPreset(presetGains: number[]) {
    presetGains.forEach((g, idx) => this.setGain(idx, g));
  }
}

export const eqEngine = new EqualizerEngine();
