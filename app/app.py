import json
import vosk
import sys
import sounddevice as s
from app import SCAM_KEYWORDS


# Load Vosk model (offline speech-to-text)
model = vosk.Model("vosk-model-small-en-us-0.15")
rec = vosk.KaldiRecognizer(model, 16000)


def is_scam(text: str) -> bool:
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in SCAM_KEYWORDS)

def analyze_audio(seconds=10):
    """Record audio from mic and analyze"""
    print("🎙️ Recording... Speak into the mic")
    audio = sd.rec(int(seconds * 16000), samplerate=16000, channels=1, dtype='int16')
    sd.wait()

    rec.AcceptWaveform(audio.tobytes())
    result = rec.Result()
    text = json.loads(result).get("text", "")

    print(f"\n📝 Transcript: {text}")
    if is_scam(text):
        print("⚠️ Possible scam detected!")
    else:
        print("✅ Call seems safe.")

if __name__ == "__main__":
    analyze_audio(10)  # record for 10s
