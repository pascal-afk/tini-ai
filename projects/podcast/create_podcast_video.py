"""
TINI Podcast Video Creator
Creates video with synchronized text overlay from transcription
Title: "Is TINI a Time Traveler?"
"""

import json
import subprocess
from pathlib import Path

# Manual transcription with timestamps (you'll need to provide this)
# Format: [{"start": 0.0, "end": 5.0, "text": "sentence here"}, ...]

PODCAST_TRANSCRIPT = [
    # This will be filled with actual transcription
    # For now, creating template structure
]

def create_subtitle_file(transcript, output_path="subtitles.srt"):
    """Create SRT subtitle file from transcript"""
    
    with open(output_path, 'w', encoding='utf-8') as f:
        for i, segment in enumerate(transcript, 1):
            start_time = format_timestamp(segment['start'])
            end_time = format_timestamp(segment['end'])
            text = segment['text']
            
            f.write(f"{i}\n")
            f.write(f"{start_time} --> {end_time}\n")
            f.write(f"{text}\n")
            f.write("\n")
    
    return output_path

def format_timestamp(seconds):
    """Convert seconds to SRT timestamp format (HH:MM:SS,mmm)"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

def create_video_with_subtitles(audio_path, subtitle_path, output_path, 
                                 title="Is TINI a Time Traveler?",
                                 background_color="black",
                                 title_color="white",
                                 subtitle_color="cyan"):
    """
    Create video from audio with title and animated subtitles
    """
    
    # FFmpeg command to create video with subtitles
    cmd = [
        'ffmpeg',
        '-i', audio_path,
        '-f', 'lavfi',
        '-i', f'color=c={background_color}:s=1920x1080:d=687',  # Duration from audio
        '-vf', f"""
            drawtext=text='{title}':
                fontsize=48:
                fontcolor={title_color}:
                x=(w-text_w)/2:
                y=100:
                shadowcolor=black:
                shadowx=2:
                shadowy=2,
            subtitles={subtitle_path}:
                force_style='Fontsize=32,
                PrimaryColour=&H00{subtitle_color[-2:]}{subtitle_color[2:4]}{subtitle_color[:2]},
                Alignment=2,
                MarginV=100'
        """,
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest',
        '-y',
        output_path
    ]
    
    print(f"Creating video: {output_path}")
    subprocess.run(cmd, check=True)
    print("Video created successfully!")

if __name__ == "__main__":
    # This is a template - actual transcription needed
    print("TINI Podcast Video Creator")
    print("=" * 50)
    print()
    print("To use this script:")
    print("1. Get transcription with timestamps")
    print("2. Fill PODCAST_TRANSCRIPT list")
    print("3. Run: python create_podcast_video.py")
    print()
    print("Audio file: podcast.m4a")
    print("Duration: ~11.5 minutes")
    print("Title: Is TINI a Time Traveler?")
