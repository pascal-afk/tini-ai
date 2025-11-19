import librosa
import numpy as np
import json

# Load audio
audio_path = "audio/cyprus-sun-bonus.mp3"
print(f"🎵 Analyzing: {audio_path}")
print("="*60)

# Load with librosa
y, sr = librosa.load(audio_path, sr=None)
duration = librosa.get_duration(y=y, sr=sr)

# Basic Info
print(f"\n📊 BASIC INFO:")
print(f"Sample Rate: {sr} Hz")
print(f"Duration: {duration:.2f} seconds ({duration/60:.2f} minutes)")
print(f"Samples: {len(y):,}")
print(f"Channels: Stereo (converted to mono for analysis)")

# Tempo & Beat
tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
print(f"\n🥁 RHYTHM:")
print(f"Estimated Tempo: {tempo:.1f} BPM")
print(f"Number of Beats: {len(beats)}")

# Spectral Features
spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)
spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)

print(f"\n🎼 SPECTRAL ANALYSIS:")
print(f"Spectral Centroid (avg): {np.mean(spectral_centroids):.2f} Hz")
print(f"Spectral Rolloff (avg): {np.mean(spectral_rolloff):.2f} Hz")

# Energy Analysis
rms = librosa.feature.rms(y=y)
print(f"\n⚡ ENERGY:")
print(f"RMS Energy (avg): {np.mean(rms):.4f}")
print(f"Peak Amplitude: {np.max(np.abs(y)):.4f}")

# Frequency bands analysis
stft = np.abs(librosa.stft(y))
freq_bins = librosa.fft_frequencies(sr=sr)

low_freq = np.mean(stft[freq_bins < 200])
mid_freq = np.mean(stft[(freq_bins >= 200) & (freq_bins < 2000)])
high_freq = np.mean(stft[freq_bins >= 2000])

print(f"\n🔊 FREQUENCY BANDS:")
print(f"Low (< 200Hz): {low_freq:.4f}")
print(f"Mid (200-2000Hz): {mid_freq:.4f}")
print(f"High (> 2000Hz): {high_freq:.4f}")

# Detect vocal segments (rough estimate)
onset_env = librosa.onset.onset_strength(y=y, sr=sr)
print(f"\n🎤 STRUCTURE HINTS:")
print(f"Onset Strength (avg): {np.mean(onset_env):.4f}")

print("\n" + "="*60)
print("✅ Analysis complete!")
