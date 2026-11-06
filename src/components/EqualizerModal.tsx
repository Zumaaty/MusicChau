'use client';

import React, { useState } from 'react';
import { eqEngine } from '@/lib/equalizerEngine';
import { X, Sliders } from 'lucide-react';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS = [
  { name: 'Mặc định', gains: [0, 0, 0, 0, 0] },
  { name: '🔥 Bass Boost (Siêu trầm)', gains: [8, 5, 0, 0, 2] },
  { name: '🎤 Vocal Boost (Tăng lời ca sĩ)', gains: [-2, 2, 6, 4, 1] },
  { name: '🎸 Acoustic Việt', gains: [3, 2, 4, 3, 2] },
  { name: '🎧 Pop / EDM', gains: [6, 3, 0, 4, 5] },
];

export default function EqualizerModal({ isOpen, onClose }: EqualizerModalProps) {
  const [gains, setGains] = useState<number[]>([0, 0, 0, 0, 0]);
  const [activePreset, setActivePreset] = useState('Mặc định');

  if (!isOpen) return null;

  const handleGainChange = (index: number, val: number) => {
    const newGains = [...gains];
    newGains[index] = val;
    setGains(newGains);
    eqEngine.setGain(index, val);
    setActivePreset('Custom');
  };

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    setActivePreset(preset.name);
    setGains(preset.gains);
    eqEngine.applyPreset(preset.gains);
  };

  const freqs = ['60Hz (Bass)', '230Hz', '910Hz (Mid)', '4kHz', '14kHz (Treble)'];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-[#181818] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Sliders className="text-[#1DB954]" size={22} />
            <h3 className="text-lg font-bold">Bộ Chỉnh Âm (Equalizer)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 mb-6">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handlePresetSelect(p)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                activePreset === p.name ? 'bg-[#1DB954] text-black font-bold border-[#1DB954]' : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-5 gap-2 text-center my-4">
          {gains.map((gain, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-3">
              <span className="text-xs font-semibold text-green-400">{gain > 0 ? `+${gain}` : gain}dB</span>
              <input 
                type="range"
                min="-12"
                max="12"
                step="1"
                value={gain}
                onChange={(e) => handleGainChange(idx, Number(e.target.value))}
                className="h-32 accent-[#1DB954] [writing-mode:vertical-lr] [direction:rtl] cursor-pointer"
              />
              <span className="text-[10px] text-gray-400">{freqs[idx]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
