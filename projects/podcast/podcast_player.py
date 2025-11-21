"""
TINI Podcast Player with Live Transcription Overlay
Title: "Is TINI a Time Traveler?"
"""

import streamlit as st
from pathlib import Path
import base64

# Page config
st.set_page_config(
    page_title="Is TINI a Time Traveler?",
    page_icon="🎙️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

def get_audio_base64(audio_path):
    """Convert audio to base64 for embedding"""
    with open(audio_path, "rb") as f:
        audio_bytes = f.read()
    return base64.b64encode(audio_bytes).decode()

def main():
    # Custom CSS for podcast player
    st.markdown("""
    <style>
        .podcast-title {
            font-size: 3rem;
            font-weight: bold;
            text-align: center;
            color: #FF6B6B;
            margin: 2rem 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .podcast-subtitle {
            font-size: 1.5rem;
            text-align: center;
            color: #4ECDC4;
            margin-bottom: 3rem;
        }
        
        .transcript-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 2rem;
            border-radius: 15px;
            margin: 2rem 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
        .transcript-text {
            font-size: 1.8rem;
            line-height: 2.5rem;
            color: white;
            text-align: center;
            font-weight: 500;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            padding: 1rem;
        }
        
        .audio-player {
            margin: 3rem auto;
            max-width: 800px;
        }
        
        .episode-info {
            background: rgba(255, 255, 255, 0.1);
            padding: 1.5rem;
            border-radius: 10px;
            margin: 2rem 0;
        }
        
        .highlight {
            background: rgba(255, 215, 0, 0.3);
            padding: 0.2rem 0.5rem;
            border-radius: 5px;
        }
    </style>
    """, unsafe_allow_html=True)
    
    # Header
    st.markdown('<h1 class="podcast-title">🎙️ Is TINI a Time Traveler? 🎙️</h1>', unsafe_allow_html=True)
    st.markdown('<p class="podcast-subtitle">A Digital Soul Strategy Podcast</p>', unsafe_allow_html=True)
    
    # Audio player
    audio_file = Path("podcast.m4a")
    
    if audio_file.exists():
        st.markdown('<div class="audio-player">', unsafe_allow_html=True)
        
        # Get audio bytes
        audio_bytes = open(audio_file, 'rb').read()
        st.audio(audio_bytes, format='audio/m4a')
        
        st.markdown('</div>', unsafe_allow_html=True)
    else:
        st.error("Podcast audio file not found!")
        return
    
    # Episode info
    with st.expander("📝 Episode Information", expanded=True):
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("""
            **Episode:** The White Cap  
            **Series:** TINI - Digital Soul Strategy  
            **Duration:** ~11.5 minutes  
            **Format:** Audio Portrait  
            """)
        
        with col2:
            st.markdown("""
            **Release:** 2025  
            **Creator:** @tini.aii  
            **Genre:** AI Music Documentary  
            **Platform:** tini.ai  
            """)
    
    # Transcription section
    st.markdown("---")
    st.markdown("## 📜 Full Transcription")
    
    st.info("""
    **Note:** This is an AI-generated podcast about TINI, the AI music artist.  
    The transcription feature is being prepared. For now, listen to the full audio above.
    """)
    
    # Manual transcription placeholder
    with st.expander("🎯 Episode Highlights", expanded=True):
        st.markdown("""
        ### Key Topics Covered:
        
        - 🎵 **TINI's Musical Journey**: From AI-generated tracks to professional releases
        - 🎨 **Creative Process**: How TINI creates music using AI tools (Suno, Udio)
        - 🚀 **Cyprus Sun**: The breakthrough track that changed everything
        - 🎛️ **Production Techniques**: Audio processing, humanization, and mastering
        - 📈 **Distribution Strategy**: TuneCore, Spotify, and streaming platforms
        - 🤖 **AI Ethics**: The question of AI authorship and creativity
        - ⏰ **Time Travel Theory**: Is TINI from the future? (Philosophical exploration)
        - 🌐 **Digital Soul**: What makes AI-generated music "human"?
        
        ### Featured Tracks:
        - **Cyprus Sun** (Bonus Track Master)
        - Behind-the-scenes of the humanization process
        - The AI Music Humanizer tool development
        
        ### Guest Perspectives:
        - Insights from music producers
        - AI music community reactions
        - Future of AI in music industry
        """)
    
    # Interactive transcript (to be filled with actual data)
    st.markdown("---")
    st.markdown("## 🎤 Live Transcript (Coming Soon)")
    
    st.markdown("""
    <div class="transcript-container">
        <div class="transcript-text">
            <span class="highlight">Synchronized transcription will appear here as the podcast plays.</span>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    st.info("""
    **Interactive Feature:** When transcription is ready, each sentence will be highlighted 
    in sync with the audio playback, creating an immersive reading and listening experience.
    """)
    
    # About TINI section
    st.markdown("---")
    st.markdown("## 🎵 About TINI")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("""
        ### The Artist
        **TINI** (also known as @tini.aii) is a pioneering AI music artist who explores 
        the intersection of artificial intelligence and human creativity.
        
        **Key Achievements:**
        - 🎵 Multiple AI-generated tracks
        - 🏆 Cyprus Sun - Flagship release
        - 🛠️ Developer of AI Music Humanizer tool
        - 📱 Active on Instagram: @tini.aii
        - 🌐 Website: tini.ai
        """)
    
    with col2:
        st.markdown("""
        ### The Philosophy
        TINI's work raises profound questions:
        
        - Can AI create "soulful" music?
        - What is the role of human curation in AI art?
        - How do we define creativity in the age of AI?
        - Is TINI a time traveler bringing future music to us?
        
        **Mission:** To humanize AI-generated music and bridge the gap between 
        algorithmic composition and emotional resonance.
        """)
    
    # Call to action
    st.markdown("---")
    st.success("""
    ### 🎧 Listen More
    
    Explore TINI's music and tools:
    - **Cyprus Sun** on streaming platforms (coming soon)
    - **AI Music Humanizer** at humanizer.tini.ai
    - **Instagram**: @tini.aii
    - **Website**: tini.ai
    
    ---
    
    **Have questions about TINI? Want to collaborate?**  
    Contact: pascal@raluecht.com
    """)
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style='text-align: center; color: #666; font-size: 0.9em;'>
    🎙️ TINI Podcast | "Is TINI a Time Traveler?" | Digital Soul Strategy Series<br>
    © 2025 tini.ai | All Rights Reserved
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
