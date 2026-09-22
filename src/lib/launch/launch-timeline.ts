import gsap from "gsap";

/**
 * Master timeline architecture for the cinematic sequence.
 * Currently inactive but structured for later phases.
 */
export class LaunchTimeline {
  private masterTimeline: gsap.core.Timeline | null = null;

  constructor() {
    this.masterTimeline = gsap.timeline({ paused: true });
  }

  public play() {
    this.masterTimeline?.play();
  }

  public pause() {
    this.masterTimeline?.pause();
  }

  public kill() {
    if (this.masterTimeline) {
      this.masterTimeline.kill();
      this.masterTimeline = null;
    }
  }

  // Placeholder for future sequence registrations
  public registerSequence(name: string, timeline: gsap.core.Timeline) {
    this.masterTimeline?.add(timeline, name);
  }
}
