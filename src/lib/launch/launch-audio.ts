import { LaunchState } from "./launch-state";

class LaunchAudioController {
  private openingBed: HTMLAudioElement | null = null;
  private keyTap: HTMLAudioElement | null = null;
  private submitWhoosh: HTMLAudioElement | null = null;
  private logoTransition: HTMLAudioElement | null = null;
  private logoReveal: HTMLAudioElement | null = null;
  private poppers: HTMLAudioElement[] = [];

  private isInitialized = false;
  private isMuted = false;
  private muteListeners: Set<(muted: boolean) => void> = new Set();
  private fadeInterval: NodeJS.Timeout | null = null;

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    const allAudios = [this.openingBed, this.keyTap, this.submitWhoosh, this.logoTransition, this.logoReveal, ...this.poppers];
    allAudios.forEach(audio => {
      if (audio) {
        audio.muted = muted;
      }
    });
    this.muteListeners.forEach(listener => listener(muted));
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public subscribeMute(listener: (muted: boolean) => void): () => void {
    this.muteListeners.add(listener);
    listener(this.isMuted);
    return () => {
      this.muteListeners.delete(listener);
    };
  }

  public init() {
    if (this.isInitialized || typeof window === "undefined") return;
    this.isInitialized = true;

    try {
      this.openingBed = new Audio("/assets/sound_effects/opening.mp3");
      this.openingBed.loop = true;
      this.openingBed.volume = 0; // Start at 0 for fade in

      this.keyTap = new Audio("/assets/sound_effects/keyboard.mp3");
      this.keyTap.volume = 0.1; // ~0.08-0.12

      this.submitWhoosh = new Audio("/assets/sound_effects/submission_whoosh.mp3");
      this.submitWhoosh.volume = 0.22; // ~0.18-0.25

      this.logoTransition = new Audio("/assets/sound_effects/logo_transition.mp3");
      this.logoTransition.volume = 0.24; // ~0.20-0.28

      this.logoReveal = new Audio("/assets/sound_effects/logo_reveal.mp3");
      this.logoReveal.volume = 0.26; // ~0.22-0.30

      // Two popper instances for left and right
      this.poppers = [
        new Audio("/assets/sound_effects/poppers.mp3"),
        new Audio("/assets/sound_effects/poppers.mp3")
      ];
      this.poppers.forEach(p => { p.volume = 0.35; }); // ~0.30-0.40

      // Start playing opening bed on init (since init should only be called on user interaction)
      this.playOpeningBed();
    } catch (e) {
      console.warn("Audio initialization failed:", e);
    }
  }

  private playOpeningBed() {
    if (!this.openingBed) return;

    this.openingBed.play().then(() => {
      this.fadeOpeningBed(0.2, 2000); // fade to 0.2 over 2 seconds
    }).catch((e) => {
      console.warn("Autoplay blocked for opening bed", e);
    });
  }

  private fadeOpeningBed(targetVolume: number, durationMs: number) {
    if (!this.openingBed) return;
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const startVolume = this.openingBed.volume;
    const diff = targetVolume - startVolume;
    const steps = 20;
    const stepTime = durationMs / steps;
    const volStep = diff / steps;

    let currentStep = 0;

    this.fadeInterval = setInterval(() => {
      currentStep++;
      if (!this.openingBed) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        return;
      }

      let newVol = startVolume + (volStep * currentStep);
      newVol = Math.max(0, Math.min(1, newVol));
      this.openingBed.volume = newVol;

      if (currentStep >= steps) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
      }
    }, stepTime);
  }

  public playKeyTap() {
    this.init(); // Ensures init on first keystroke if not already initialized
    if (!this.keyTap) return;

    // Use clone to allow rapid typing without cutting off
    const tap = this.keyTap.cloneNode() as HTMLAudioElement;
    tap.volume = this.keyTap.volume;
    tap.play().catch(() => {});
  }

  public playSubmission() {
    this.init();
    if (this.submitWhoosh) {
      this.submitWhoosh.currentTime = 0;
      this.submitWhoosh.play().catch(() => {});
    }
  }

  public playLogoTransition() {
    if (this.logoTransition) {
      this.logoTransition.currentTime = 0;
      this.logoTransition.play().catch(() => {});
    }
  }

  public playLogoReveal() {
    if (this.logoReveal) {
      this.logoReveal.currentTime = 0;
      this.logoReveal.play().catch(() => {});

      // Subtle ducking of the music
      if (this.openingBed) {
        this.fadeOpeningBed(0.12, 500);
        setTimeout(() => {
          this.fadeOpeningBed(0.2, 1500);
        }, 3000);
      }
    }
  }

  public playPopper(index: number) {
    const popper = this.poppers[index % this.poppers.length];
    if (popper) {
      popper.currentTime = 0;
      popper.play().catch(() => {});
    }
  }

  public handleStateChange(newState: LaunchState) {
    // Attempt initialization on state progress if not done yet
    if (!this.isInitialized && newState !== LaunchState.IDLE && newState !== LaunchState.INPUT_ACTIVE) {
      this.init();
    }

    switch (newState) {
      case LaunchState.IDLE:
        this.reset();
        break;
      case LaunchState.HI_SUBMITTED:
        this.playSubmission();
        break;
      case LaunchState.SIGN_COMPLETE:
        this.playLogoTransition();
        break;
      case LaunchState.LOGO_REVEAL:
        this.playLogoReveal();
        break;
      case LaunchState.IDENTITY_REVEAL:
        this.playPopper(0);
        setTimeout(() => this.playPopper(1), 85);
        break;
      case LaunchState.WEBSITE_REVEAL:
        this.fadeOpeningBed(0, 2500);
        break;
      case LaunchState.EXPERIENCE_COMPLETE:
        this.stopAll();
        break;
    }
  }

  private reset() {
    [this.submitWhoosh, this.logoTransition, this.logoReveal, ...this.poppers].forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    if (this.openingBed) {
      this.openingBed.currentTime = 0;
      this.fadeOpeningBed(0.2, 1000);
      this.openingBed.play().catch(() => {});
    }
  }

  private stopAll() {
    [this.openingBed, this.submitWhoosh, this.logoTransition, this.logoReveal, ...this.poppers].forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }

  public cleanup() {
    this.stopAll();
    if (this.fadeInterval) clearInterval(this.fadeInterval);
  }
}

export const launchAudio = new LaunchAudioController();
