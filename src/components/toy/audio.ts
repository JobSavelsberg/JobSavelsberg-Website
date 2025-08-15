import * as Tone from "tone";

export class Audio {
    private reverb: Tone.Reverb;
    private started = false;
    private readonly cMajor = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];

    constructor() {
        this.reverb = new Tone.Reverb(2);
        this.reverb.wet.value = 0.8;
        this.reverb.toDestination();
    }

    public async init(): Promise<void> {
        await Tone.loaded();
    }

    public async playPluck(): Promise<void> {
        if (!this.started) {
            await Tone.start();
            this.started = true;
        }

        const duration = 2; // note duration
        const note =
            this.cMajor[Math.floor(Math.random() * this.cMajor.length)];

        const osc = new Tone.Oscillator(note, "sine");
        const env = new Tone.AmplitudeEnvelope({
            attack: 0.01,
            decay: duration,
            sustain: 0,
            release: 0.1,
        });

        // Proper routing: osc -> env -> reverb
        osc.connect(env);
        env.connect(this.reverb);

        const time = Tone.now();

        osc.start(time);
        env.triggerAttackRelease(duration, time);

        setTimeout(
            () => {
                osc.dispose();
                env.dispose();
            },
            duration * 1000 + 100
        ); // Add small buffer
    }

    public dispose(): void {
        this.reverb.dispose();
    }
}
