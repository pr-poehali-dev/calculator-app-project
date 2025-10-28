import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

type WaveType = 'sine' | 'square' | 'sawtooth' | 'triangle';

type Note = {
  name: string;
  frequency: number;
  key: string;
  isBlack?: boolean;
};

export default function Synthesizer() {
  const [octave, setOctave] = useState(4);
  const [waveType, setWaveType] = useState<WaveType>('sine');
  const [volume, setVolume] = useState([0.3]);
  const [attack, setAttack] = useState([0.01]);
  const [release, setRelease] = useState([0.3]);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, { osc: OscillatorNode; gain: GainNode }>>(new Map());

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      oscillatorsRef.current.forEach(({ osc, gain }) => {
        osc.stop();
        gain.disconnect();
      });
      oscillatorsRef.current.clear();
    };
  }, []);

  const notes: Note[] = [
    { name: 'C', frequency: 261.63 * Math.pow(2, octave - 4), key: 'a' },
    { name: 'C#', frequency: 277.18 * Math.pow(2, octave - 4), key: 'w', isBlack: true },
    { name: 'D', frequency: 293.66 * Math.pow(2, octave - 4), key: 's' },
    { name: 'D#', frequency: 311.13 * Math.pow(2, octave - 4), key: 'e', isBlack: true },
    { name: 'E', frequency: 329.63 * Math.pow(2, octave - 4), key: 'd' },
    { name: 'F', frequency: 349.23 * Math.pow(2, octave - 4), key: 'f' },
    { name: 'F#', frequency: 369.99 * Math.pow(2, octave - 4), key: 't', isBlack: true },
    { name: 'G', frequency: 392.00 * Math.pow(2, octave - 4), key: 'g' },
    { name: 'G#', frequency: 415.30 * Math.pow(2, octave - 4), key: 'y', isBlack: true },
    { name: 'A', frequency: 440.00 * Math.pow(2, octave - 4), key: 'h' },
    { name: 'A#', frequency: 466.16 * Math.pow(2, octave - 4), key: 'u', isBlack: true },
    { name: 'B', frequency: 493.88 * Math.pow(2, octave - 4), key: 'j' },
    { name: 'C', frequency: 523.25 * Math.pow(2, octave - 4), key: 'k' },
  ];

  const playNote = (note: Note) => {
    if (!audioContextRef.current || activeNotes.has(note.name)) return;

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = waveType;
    oscillator.frequency.value = note.frequency;

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume[0], context.currentTime + attack[0]);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();

    oscillatorsRef.current.set(note.name, { osc: oscillator, gain: gainNode });
    setActiveNotes(prev => new Set(prev).add(note.name));
  };

  const stopNote = (note: Note) => {
    const nodes = oscillatorsRef.current.get(note.name);
    if (!nodes || !audioContextRef.current) return;

    const context = audioContextRef.current;
    const { osc, gain } = nodes;

    gain.gain.cancelScheduledValues(context.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, context.currentTime);
    gain.gain.linearRampToValueAtTime(0, context.currentTime + release[0]);

    setTimeout(() => {
      osc.stop();
      gain.disconnect();
      oscillatorsRef.current.delete(note.name);
    }, release[0] * 1000 + 100);

    setActiveNotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(note.name);
      return newSet;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = notes.find(n => n.key === e.key.toLowerCase());
      if (note) playNote(note);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = notes.find(n => n.key === e.key.toLowerCase());
      if (note) stopNote(note);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [notes, waveType, volume, attack, release]);

  const waveTypes: { type: WaveType; label: string; icon: string }[] = [
    { type: 'sine', label: 'Синус', icon: 'Waves' },
    { type: 'square', label: 'Квадрат', icon: 'Square' },
    { type: 'sawtooth', label: 'Пила', icon: 'TrendingUp' },
    { type: 'triangle', label: 'Треугольник', icon: 'Triangle' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1C] to-[#2A2A2E] flex items-center justify-center p-4">
      <Card className="bg-gradient-to-b from-[#1A1A1C] to-[#0F0F10] p-8 shadow-2xl border-4 border-[#FF6B35] rounded-lg max-w-5xl w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#FF6B35] mb-2 font-mono tracking-wider text-center">
            SYNTH-80
          </h1>
          <p className="text-[#C0C0C0] text-center text-sm font-mono">ANALOG SYNTHESIZER</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#2A2A2E] p-4 border-2 border-[#3A3A3E]">
            <h3 className="text-[#FF6B35] font-mono text-sm mb-3 flex items-center gap-2">
              <Icon name="Waves" size={16} />
              ФОРМА ВОЛНЫ
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {waveTypes.map((wave) => (
                <Button
                  key={wave.type}
                  onClick={() => setWaveType(wave.type)}
                  className={`${
                    waveType === wave.type
                      ? 'bg-[#FF6B35] text-white shadow-[0_0_15px_rgba(255,107,53,0.6)]'
                      : 'bg-[#3A3A3E] text-[#C0C0C0] hover:bg-[#4A4A4E]'
                  } font-mono text-xs transition-all`}
                >
                  {wave.label}
                </Button>
              ))}
            </div>
          </Card>

          <Card className="bg-[#2A2A2E] p-4 border-2 border-[#3A3A3E]">
            <h3 className="text-[#FF6B35] font-mono text-sm mb-3 flex items-center gap-2">
              <Icon name="Volume2" size={16} />
              ГРОМКОСТЬ
            </h3>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={1}
              step={0.01}
              className="mb-2"
            />
            <div className="text-[#C0C0C0] text-xs font-mono text-center">
              {Math.round(volume[0] * 100)}%
            </div>
          </Card>

          <Card className="bg-[#2A2A2E] p-4 border-2 border-[#3A3A3E]">
            <h3 className="text-[#FF6B35] font-mono text-sm mb-3 flex items-center gap-2">
              <Icon name="Music" size={16} />
              ОКТАВА
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={() => setOctave(Math.max(1, octave - 1))}
                className="bg-[#3A3A3E] hover:bg-[#4A4A4E] text-[#FF6B35] flex-1"
              >
                -
              </Button>
              <div className="bg-[#0A0A0A] text-[#FF6B35] font-mono text-2xl px-6 py-2 rounded flex items-center justify-center border border-[#FF6B35] shadow-[inset_0_0_10px_rgba(255,107,53,0.3)]">
                {octave}
              </div>
              <Button
                onClick={() => setOctave(Math.min(7, octave + 1))}
                className="bg-[#3A3A3E] hover:bg-[#4A4A4E] text-[#FF6B35] flex-1"
              >
                +
              </Button>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#2A2A2E] p-4 border-2 border-[#3A3A3E]">
            <h3 className="text-[#FF6B35] font-mono text-sm mb-3">АТАКА (Attack)</h3>
            <Slider
              value={attack}
              onValueChange={setAttack}
              max={1}
              step={0.01}
              className="mb-2"
            />
            <div className="text-[#C0C0C0] text-xs font-mono text-center">
              {attack[0].toFixed(2)}s
            </div>
          </Card>

          <Card className="bg-[#2A2A2E] p-4 border-2 border-[#3A3A3E]">
            <h3 className="text-[#FF6B35] font-mono text-sm mb-3">ЗАТУХАНИЕ (Release)</h3>
            <Slider
              value={release}
              onValueChange={setRelease}
              max={2}
              step={0.01}
              className="mb-2"
            />
            <div className="text-[#C0C0C0] text-xs font-mono text-center">
              {release[0].toFixed(2)}s
            </div>
          </Card>
        </div>

        <Card className="bg-[#0A0A0A] p-6 border-2 border-[#FF6B35] shadow-[0_0_30px_rgba(255,107,53,0.2)]">
          <div className="relative h-48">
            <div className="flex justify-center items-end h-full gap-1">
              {notes.map((note, idx) => {
                if (note.isBlack) {
                  return (
                    <button
                      key={idx}
                      onMouseDown={() => playNote(note)}
                      onMouseUp={() => stopNote(note)}
                      onMouseLeave={() => stopNote(note)}
                      className={`absolute w-12 h-28 rounded-b-md transition-all z-10 ${
                        activeNotes.has(note.name)
                          ? 'bg-[#FF6B35] shadow-[0_0_20px_rgba(255,107,53,0.8)]'
                          : 'bg-gradient-to-b from-[#2A2A2E] to-[#1A1A1C]'
                      } border-2 border-[#0A0A0A] shadow-lg hover:bg-[#FF8B55]`}
                      style={{ left: `${idx * 62 - 24}px` }}
                    >
                      <span className="text-[8px] text-[#C0C0C0] font-mono absolute bottom-1 left-0 right-0 text-center">
                        {note.key.toUpperCase()}
                      </span>
                    </button>
                  );
                }
                return null;
              })}
              {notes.filter(n => !n.isBlack).map((note, idx) => (
                <button
                  key={idx}
                  onMouseDown={() => playNote(note)}
                  onMouseUp={() => stopNote(note)}
                  onMouseLeave={() => stopNote(note)}
                  className={`w-16 h-full rounded-b-lg transition-all ${
                    activeNotes.has(note.name)
                      ? 'bg-gradient-to-b from-[#FF6B35] to-[#FF8B55] shadow-[0_0_25px_rgba(255,107,53,0.9)]'
                      : 'bg-gradient-to-b from-[#F0F0F0] to-[#C0C0C0]'
                  } border-2 border-[#0A0A0A] shadow-lg hover:from-[#FFE0D0] hover:to-[#D0D0D0]`}
                >
                  <span className="text-xs text-[#2A2A2E] font-mono font-bold absolute bottom-2 left-0 right-0 text-center">
                    {note.key.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center text-[#C0C0C0] text-sm font-mono">
          <Icon name="Keyboard" size={16} className="inline mr-2" />
          Используйте клавиатуру: A-K для нот
        </div>
      </Card>
    </div>
  );
}
