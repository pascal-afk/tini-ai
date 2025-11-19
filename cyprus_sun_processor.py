#!/usr/bin/env python3
"""
Cyprus Sun Audio Processor
===========================
Professional audio processing toolkit for humanizing AI-generated music
and making it TuneCore-compliant by avoiding Content ID similarity detection.

Based on production analysis and reverse engineering recommendations.
"""

import librosa
import soundfile as sf
import numpy as np
from pedalboard import (
    Pedalboard, Reverb, Distortion, Compressor, 
    HighpassFilter, LowpassFilter, Gain
)
import os
from pathlib import Path

class CyprusSunProcessor:
    """Main processor for Cyprus Sun track modifications"""
    
    def __init__(self, input_file):
        """
        Initialize processor with input audio file
        
        Args:
            input_file: Path to Cyprus Sun MP3/WAV file
        """
        self.input_file = input_file
        self.output_dir = Path("/home/user/webapp/audio/processed")
        self.output_dir.mkdir(exist_ok=True)
        
        print(f"🎵 Loading: {input_file}")
        self.audio, self.sr = librosa.load(input_file, sr=44100, mono=False)
        
        # Handle stereo
        if len(self.audio.shape) == 2:
            self.audio_mono = librosa.to_mono(self.audio)
        else:
            self.audio_mono = self.audio
            
        self.duration = librosa.get_duration(y=self.audio_mono, sr=self.sr)
        print(f"✅ Loaded: {self.duration:.2f}s @ {self.sr}Hz")
        
    def apply_telephone_eq(self, audio, highpass_freq=400, lowpass_freq=4000):
        """
        Apply "Telephone Effect" EQ to vocals
        Removes AI artifacts in extreme frequencies
        
        Args:
            audio: Audio array
            highpass_freq: High-pass frequency (default 400Hz)
            lowpass_freq: Low-pass frequency (default 4000Hz)
        
        Returns:
            Processed audio with bandpass filter
        """
        print(f"📞 Applying Telephone EQ ({highpass_freq}-{lowpass_freq}Hz)...")
        
        board = Pedalboard([
            HighpassFilter(cutoff_frequency_hz=highpass_freq),
            LowpassFilter(cutoff_frequency_hz=lowpass_freq)
        ])
        
        return board(audio, self.sr)
    
    def apply_saturation(self, audio, drive_db=6.0):
        """
        Apply saturation/distortion to mask AI artifacts
        
        Args:
            audio: Audio array
            drive_db: Drive amount in dB (default 6.0)
        
        Returns:
            Saturated audio
        """
        print(f"🔥 Applying Saturation ({drive_db}dB drive)...")
        
        board = Pedalboard([
            Distortion(drive_db=drive_db),
            Compressor(threshold_db=-10, ratio=3)
        ])
        
        return board(audio, self.sr)
    
    def apply_reverb(self, audio, room_size=0.5, wet_level=0.3):
        """
        Apply reverb for depth and space
        
        Args:
            audio: Audio array
            room_size: Room size (0-1)
            wet_level: Wet/dry mix (0-1)
        
        Returns:
            Audio with reverb
        """
        print(f"🌊 Applying Reverb (room={room_size}, wet={wet_level})...")
        
        board = Pedalboard([
            Reverb(room_size=room_size, wet_level=wet_level)
        ])
        
        return board(audio, self.sr)
    
    def pitch_shift(self, audio, semitones):
        """
        Pitch shift audio without formant shifting
        
        Args:
            audio: Audio array
            semitones: Semitones to shift (+/-)
        
        Returns:
            Pitch-shifted audio
        """
        print(f"🎹 Pitch Shifting: {semitones:+d} semitones...")
        
        return librosa.effects.pitch_shift(audio, sr=self.sr, n_steps=semitones)
    
    def slice_audio(self, start_time, end_time):
        """
        Slice audio segment
        
        Args:
            start_time: Start time in seconds
            end_time: End time in seconds
        
        Returns:
            Sliced audio segment
        """
        start_sample = int(start_time * self.sr)
        end_sample = int(end_time * self.sr)
        
        if len(self.audio.shape) == 2:
            return self.audio[:, start_sample:end_sample]
        else:
            return self.audio[start_sample:end_sample]
    
    def create_vocal_chop_version(self):
        """
        Create full "Vocal Chop" version with all processing
        This applies the complete transformation pipeline:
        1. Telephone EQ (remove extreme frequencies)
        2. Saturation (mask AI artifacts)
        3. Reverb (add depth)
        4. Light pitch shift (change character)
        """
        print("\n" + "="*60)
        print("🎤 CREATING VOCAL CHOP VERSION")
        print("="*60)
        
        # Use stereo if available
        if len(self.audio.shape) == 2:
            audio = self.audio
        else:
            audio = self.audio_mono
        
        # Processing chain
        audio = self.apply_telephone_eq(audio)
        audio = self.apply_saturation(audio, drive_db=4.0)
        audio = self.apply_reverb(audio, room_size=0.4, wet_level=0.25)
        
        # Light pitch shift (sounds more human)
        audio_shifted = self.pitch_shift(audio, semitones=-1)
        
        # Save
        output_path = self.output_dir / "cyprus_sun_vocal_chop.wav"
        sf.write(output_path, audio_shifted.T if len(audio_shifted.shape) == 2 else audio_shifted, 
                 self.sr, subtype='PCM_16')
        
        print(f"✅ Saved: {output_path}")
        return str(output_path)
    
    def create_lo_fi_version(self):
        """
        Create lo-fi version with heavy EQ and saturation
        """
        print("\n" + "="*60)
        print("📻 CREATING LO-FI VERSION")
        print("="*60)
        
        audio = self.audio if len(self.audio.shape) == 2 else self.audio_mono
        
        # Aggressive telephone EQ
        audio = self.apply_telephone_eq(audio, highpass_freq=500, lowpass_freq=3000)
        
        # Heavy saturation
        audio = self.apply_saturation(audio, drive_db=10.0)
        
        # Add reverb
        audio = self.apply_reverb(audio, room_size=0.6, wet_level=0.35)
        
        output_path = self.output_dir / "cyprus_sun_lofi.wav"
        sf.write(output_path, audio.T if len(audio.shape) == 2 else audio, 
                 self.sr, subtype='PCM_16')
        
        print(f"✅ Saved: {output_path}")
        return str(output_path)
    
    def create_pitch_variations(self, semitones_list=[-3, -1, +1, +3]):
        """
        Create multiple pitch-shifted versions
        
        Args:
            semitones_list: List of semitone shifts to create
        
        Returns:
            List of output file paths
        """
        print("\n" + "="*60)
        print("🎹 CREATING PITCH VARIATIONS")
        print("="*60)
        
        audio = self.audio_mono
        output_paths = []
        
        for semitones in semitones_list:
            audio_shifted = self.pitch_shift(audio, semitones)
            
            output_path = self.output_dir / f"cyprus_sun_pitch_{semitones:+d}st.wav"
            sf.write(output_path, audio_shifted, self.sr, subtype='PCM_16')
            
            print(f"✅ Saved: {output_path}")
            output_paths.append(str(output_path))
        
        return output_paths
    
    def extract_vocal_segment(self, start_time, end_time, name="segment"):
        """
        Extract and process a specific vocal segment for chopping
        
        Args:
            start_time: Start time in seconds
            end_time: End time in seconds
            name: Name for output file
        
        Returns:
            Path to extracted segment
        """
        print(f"\n✂️  Extracting segment: {start_time:.2f}s - {end_time:.2f}s")
        
        segment = self.slice_audio(start_time, end_time)
        
        # Apply vocal chop processing
        segment = self.apply_telephone_eq(segment)
        segment = self.apply_saturation(segment, drive_db=5.0)
        
        output_path = self.output_dir / f"vocal_chop_{name}.wav"
        sf.write(output_path, segment.T if len(segment.shape) == 2 else segment, 
                 self.sr, subtype='PCM_16')
        
        print(f"✅ Saved: {output_path}")
        return str(output_path)
    
    def process_all(self):
        """
        Run all processing variations
        """
        print("\n" + "🚀 STARTING FULL PROCESSING PIPELINE")
        print("="*60)
        
        results = {
            "vocal_chop": self.create_vocal_chop_version(),
            "lofi": self.create_lo_fi_version(),
            "pitch_variations": self.create_pitch_variations()
        }
        
        print("\n" + "="*60)
        print("✅ ALL PROCESSING COMPLETE!")
        print("="*60)
        print(f"\nOutput directory: {self.output_dir}")
        
        return results


def main():
    """Main entry point"""
    input_file = "/home/user/webapp/audio/cyprus-sun-bonus.mp3"
    
    print("="*60)
    print("🎵 CYPRUS SUN - PROFESSIONAL AUDIO PROCESSOR")
    print("="*60)
    print("\nThis tool creates TuneCore-compliant versions by:")
    print("• Applying 'Telephone' EQ to remove AI artifacts")
    print("• Adding saturation to mask digital imperfections")
    print("• Creating pitch variations for unique sound")
    print("• Processing vocals as 'sampled instruments'\n")
    
    processor = CyprusSunProcessor(input_file)
    results = processor.process_all()
    
    print("\n📁 Generated files:")
    for key, value in results.items():
        if isinstance(value, list):
            print(f"\n{key}:")
            for path in value:
                print(f"  • {Path(path).name}")
        else:
            print(f"  • {Path(value).name}")
    
    print("\n💡 Next Steps:")
    print("1. Listen to the processed versions")
    print("2. Choose the best variation for your needs")
    print("3. Import into FL Studio/Ableton for further arrangement")
    print("4. Create new melody with vocal chops")
    print("5. Upload to TuneCore with confidence!")


if __name__ == "__main__":
    main()
