import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const audioDir = path.resolve(here, "../audio");
const sampleRate = 48_000;
const tau = Math.PI * 2;
const duration = 104;
const bpm = 112;
const beat = 60 / bpm;

await mkdir(audioDir, { recursive: true });

function clamp(value, low = 0, high = 1) {
  return Math.max(low, Math.min(high, value));
}

function smoothstep(edge0, edge1, value) {
  const p = clamp((value - edge0) / (edge1 - edge0));
  return p * p * (3 - 2 * p);
}

function pseudoNoise(index, salt = 0) {
  const x = Math.sin((index + salt * 7919) * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

function softClip(value) {
  return Math.tanh(value * 1.28) / Math.tanh(1.28);
}

async function writeStereoWav(filename, seconds, sample) {
  const frames = Math.floor(seconds * sampleRate);
  const dataSize = frames * 4;
  const buffer = Buffer.allocUnsafe(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(2, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 4, 28);
  buffer.writeUInt16LE(4, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let frame = 0; frame < frames; frame += 1) {
    const t = frame / sampleRate;
    const [left, right] = sample(t, frame);
    buffer.writeInt16LE(Math.round(clamp(softClip(left), -1, 1) * 32767), 44 + frame * 4);
    buffer.writeInt16LE(Math.round(clamp(softClip(right), -1, 1) * 32767), 46 + frame * 4);
  }
  await writeFile(path.join(audioDir, filename), buffer);
  console.log(`Generated ${filename}`);
}

const progression = [
  { root: 73.42, notes: [146.83, 174.61, 220.0, 261.63] },
  { root: 58.27, notes: [116.54, 146.83, 174.61, 220.0] },
  { root: 87.31, notes: [174.61, 220.0, 261.63, 329.63] },
  { root: 65.41, notes: [130.81, 164.81, 196.0, 261.63] },
];

await writeStereoWav("mahvara-v2-score.wav", duration, (t, frame) => {
  const beatIndex = Math.floor(t / beat);
  const beatT = t - beatIndex * beat;
  const bar = beat * 4;
  const barIndex = Math.floor(t / bar);
  const chord = progression[barIndex % progression.length];
  const sectionEnergy = t < 4
    ? 0.36 + 0.64 * smoothstep(0, 4, t)
    : t < 34
      ? 0.92
      : t < 65
        ? 0.98
        : t < 79
          ? 1.09
          : t < 88
            ? 0.9
            : t < 98
              ? 1.01
              : 0.82;
  const introGate = smoothstep(0.15, 2.9, t);
  const outroGate = 1 - smoothstep(99.1, duration, t);
  const drumsGate = smoothstep(2.8, 4.3, t) * (1 - smoothstep(97.2, 99.7, t));
  const padGate = introGate * outroGate;
  let left = 0;
  let right = 0;

  chord.notes.forEach((frequency, index) => {
    const phase = index * 0.63;
    const breath = 0.75 + 0.25 * Math.sin(tau * (0.035 + index * 0.006) * t + phase);
    const fundamental = Math.sin(tau * frequency * t + phase);
    const detune = Math.sin(tau * frequency * 1.0032 * t + phase * 1.22);
    const glass = Math.sin(tau * frequency * 2.002 * t + phase * 0.41);
    left += (fundamental * 0.020 + detune * 0.012 + glass * 0.0037) * breath * padGate;
    right += (detune * 0.020 + fundamental * 0.011 + glass * 0.0041) * breath * padGate;
  });

  const bassPhase = (t % bar) / bar;
  const bassEnvelope = 0.62 + 0.38 * Math.sin(Math.PI * bassPhase);
  const bass = (Math.sin(tau * chord.root * t) + 0.24 * Math.sin(tau * chord.root * 2 * t)) * 0.044 * bassEnvelope * introGate;
  left += bass;
  right += bass * 0.96;

  const kickEnvelope = Math.exp(-beatT * 13.5);
  const kickFrequency = 49 + 68 * Math.exp(-beatT * 24);
  const kick = Math.sin(tau * kickFrequency * beatT) * kickEnvelope * 0.18 * drumsGate;
  left += kick;
  right += kick;

  const beatInBar = beatIndex % 4;
  if (beatInBar === 1 || beatInBar === 3) {
    const clapEnvelope = Math.exp(-beatT * 27);
    const clapNoise = pseudoNoise(frame, beatIndex) * 0.048 + Math.sin(tau * 1320 * beatT) * 0.019;
    left += clapNoise * clapEnvelope * drumsGate;
    right += (pseudoNoise(frame, beatIndex + 11) * 0.052 - Math.sin(tau * 1550 * beatT) * 0.015) * clapEnvelope * drumsGate;
  }

  const eighth = beat / 2;
  const hatT = t % eighth;
  const hatStep = Math.floor(t / eighth);
  const hatEnvelope = Math.exp(-hatT * 76);
  const hatAccent = hatStep % 2 ? 0.58 : 1;
  const hat = pseudoNoise(frame, hatStep + 31) * hatEnvelope * 0.018 * hatAccent * drumsGate;
  left += hat * (hatStep % 2 ? 0.65 : 1);
  right += hat * (hatStep % 2 ? 1 : 0.65);

  const sixteenth = beat / 4;
  const pulseT = t % sixteenth;
  const pulseStep = Math.floor(t / sixteenth);
  const note = chord.notes[(pulseStep + barIndex) % chord.notes.length] * 2;
  const pluckEnvelope = Math.exp(-pulseT * 31);
  const pluck = (Math.sin(tau * note * t) + 0.31 * Math.sin(tau * note * 2 * t)) * pluckEnvelope * 0.018 * introGate;
  left += pluck * (pulseStep % 2 ? 0.48 : 1);
  right += pluck * (pulseStep % 2 ? 1 : 0.48);

  if (t >= 65 && t < 79) {
    const adminPulse = Math.sin(tau * chord.root * 0.5 * t) * 0.025;
    left += adminPulse;
    right += adminPulse;
  }

  const air = pseudoNoise(frame, 97) * 0.0017 * padGate;
  left += air;
  right -= air * 0.74;

  const master = sectionEnergy * introGate * outroGate * 0.9;
  return [left * master, right * master];
});

await writeStereoWav("ui-hover.wav", 0.16, (t) => {
  const envelope = Math.exp(-t * 34);
  const tone = Math.sin(tau * 1760 * t) * 0.072 + Math.sin(tau * 2640 * t) * 0.025;
  return [tone * envelope, tone * envelope * 0.84];
});

await writeStereoWav("ui-click-v2.wav", 0.2, (t) => {
  const envelope = Math.exp(-t * 29);
  const snap = Math.sin(tau * 1380 * t) * 0.14 + Math.sin(tau * 2420 * t) * 0.055;
  return [snap * envelope, snap * envelope * 0.76];
});

await writeStereoWav("ui-pop.wav", 0.48, (t) => {
  const envelope = Math.exp(-t * 8.8);
  const frequency = 410 + 350 * t;
  const tone = Math.sin(tau * frequency * t) * 0.105 + Math.sin(tau * frequency * 2 * t) * 0.022;
  return [tone * envelope, tone * envelope * 0.92];
});

await writeStereoWav("ui-confirm.wav", 1.05, (t) => {
  const notes = [659.25, 783.99, 987.77];
  let tone = 0;
  notes.forEach((frequency, index) => {
    const local = t - index * 0.16;
    if (local >= 0) tone += Math.sin(tau * frequency * local) * Math.exp(-local * 7.3) * 0.078;
  });
  return [tone, tone * 0.9];
});

await writeStereoWav("ui-sweep-v2.wav", 0.78, (t, frame) => {
  const p = t / 0.78;
  const envelope = Math.sin(Math.PI * p) ** 1.25;
  const noise = pseudoNoise(frame, 131) * (0.02 + p * 0.034);
  const tone = Math.sin(tau * (210 + 990 * p * p) * t) * 0.052;
  return [(noise + tone) * envelope, (-noise * 0.82 + tone) * envelope];
});

await writeStereoWav("ui-impact-v2.wav", 1.18, (t, frame) => {
  const envelope = Math.exp(-t * 4.35);
  const body = Math.sin(tau * (58 - 13 * t) * t) * 0.28;
  const harmonic = Math.sin(tau * 116 * t) * 0.055;
  const texture = pseudoNoise(frame, 211) * Math.exp(-t * 18) * 0.035;
  return [(body + harmonic + texture) * envelope, (body + harmonic * 0.83 - texture * 0.7) * envelope];
});

await writeStereoWav("digital-rise-v2.wav", 1.7, (t, frame) => {
  const p = t / 1.7;
  const envelope = Math.sin(Math.PI * p * 0.5) ** 1.35;
  const tone = Math.sin(tau * (125 + 760 * p * p) * t) * 0.064;
  const air = pseudoNoise(frame, 307) * (0.008 + 0.04 * p) * envelope;
  return [(tone + air) * envelope, (tone - air * 0.78) * envelope];
});
