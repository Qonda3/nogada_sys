import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Mic, 
  MicOff, 
  Brain, 
  AlertTriangle, 
  Shield,
  Volume2,
  AudioLines,
  FileAudio,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceAnalyzerProps {
  isCallActive?: boolean;
  onThreatDetected?: (threatLevel: number, details: any) => void;
}

interface ThreatAnalysis {
  aiVoiceConfidence: number;
  socialEngineeringScore: number;
  suspiciousKeywords: string[];
  emotionalManipulation: number;
  urgencyLevel: number;
  overallThreat: number;
}

const VoiceAnalyzer = ({ isCallActive = false, onThreatDetected }: VoiceAnalyzerProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [threatAnalysis, setThreatAnalysis] = useState<ThreatAnalysis | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Comprehensive suspicious keywords for social engineering detection
  const suspiciousKeywords = [
    // Account & Security Terms
    'urgent', 'verify', 'account suspended', 'password reset', 'bank details',
    'transfer money', 'credit card', 'security alert', 'confidential',
    'immediate action required', 'confirm your identity', 'unauthorized transaction',
    'account locked', 'login attempt', 'update your details', 'customer support',
    'request verification', 'urgent response needed', 'password', 'account number',
    'social security', 'pin number', 'suspended', 'blocked', 'bank',
    'security department', 'fraudulent activity', 'confirm details',
    
    // Monetary & Financial Terms
    'balance', 'deposit', 'withdrawal', 'pin', 'passcode', 'cvv',
    'one-time password', 'otp', 'transaction id', 'bank account number',
    'routing number', 'security code', 'funds transfer', 'payment confirmation',
    'direct deposit', 'billing information', 'wire transfer', 'check your statement',
    'loan approval', 'credit limit', 'secure login', 'reset password',
    'change password', 'authentication code', 'verification code',
    'personal identification number', 'financial information', 'tax refund',
    'suspicious activity', 'invoice', 'payment required',
    
    // Urgency & Action Terms
    'call now', 'click here', 'limited time', 'immediate', 'now', 'quickly',
    'asap', 'act now', 'respond immediately'
  ];

  const manipulationPhrases = [
    // Reward & Prize Terms
    'reward', 'win', 'lottery', 'free', 'congratulations', 'youve been selected',
    'special offer', 'winner',
    
    // Pressure & Urgency Tactics
    'act quickly', 'limited time', 'dont tell anyone', 'risk', 'emergency',
    'help me', 'in trouble', 'need money', 'send money', 'wire money',
    'gift card', 'urgent help needed', 'family emergency', 'arrested',
    'hospital', 'accident', 'stranded', 'lost wallet', 'need cash',
    
    // Authority & Government
    'government', 'tax office', 'legal action', 'police', 'court',
    'lawsuit', 'arrest warrant', 'irs', 'federal', 'investigation'
  ];

  useEffect(() => {
    if (isCallActive) {
      startVoiceAnalysis();
    } else {
      stopVoiceAnalysis();
    }
  }, [isCallActive]);

  const initializeAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average);
          requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access for voice analysis",
        variant: "destructive"
      });
    }
  };

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
          analyzeTranscript(finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  };

  const analyzeTranscript = (text: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      
      // Check for suspicious keywords
      const foundKeywords = suspiciousKeywords.filter(keyword => 
        lowerText.includes(keyword.toLowerCase())
      );
      
      const foundManipulation = manipulationPhrases.filter(phrase =>
        lowerText.includes(phrase.toLowerCase())
      );
      
      // Calculate threat scores
      const socialEngineeringScore = Math.min(
        (foundKeywords.length * 15) + (foundManipulation.length * 20), 
        100
      );
      
      // Simulate AI voice detection (in real app, this would use actual AI)
      const aiVoiceConfidence = Math.random() * 100;
      
      // Calculate emotional manipulation score
      const emotionalWords = ['urgent', 'immediately', 'act now', 'limited time'];
      const emotionalManipulation = Math.min(
        emotionalWords.filter(word => lowerText.includes(word)).length * 25,
        100
      );
      
      // Calculate urgency level
      const urgencyWords = ['urgent', 'immediately', 'now', 'quickly', 'asap'];
      const urgencyLevel = Math.min(
        urgencyWords.filter(word => lowerText.includes(word)).length * 20,
        100
      );
      
      // Overall threat calculation
      const overallThreat = Math.round(
        (socialEngineeringScore * 0.4) +
        (aiVoiceConfidence * 0.3) +
        (emotionalManipulation * 0.2) +
        (urgencyLevel * 0.1)
      );
      
      const analysis: ThreatAnalysis = {
        aiVoiceConfidence: Math.round(aiVoiceConfidence),
        socialEngineeringScore: Math.round(socialEngineeringScore),
        suspiciousKeywords: [...foundKeywords, ...foundManipulation],
        emotionalManipulation: Math.round(emotionalManipulation),
        urgencyLevel: Math.round(urgencyLevel),
        overallThreat
      };
      
      setThreatAnalysis(analysis);
      setIsAnalyzing(false);
      
      // Trigger threat callback if high risk
      if (overallThreat > 70 && onThreatDetected) {
        onThreatDetected(overallThreat, analysis);
        toast({
          title: "🚨 HIGH THREAT DETECTED",
          description: `Threat Level: ${overallThreat}% - Social Engineering Detected`,
          variant: "destructive"
        });
      }
    }, 1500);
  };

  const startVoiceAnalysis = async () => {
    setIsListening(true);
    setTranscript(""); // Clear transcript for clean slate
    setThreatAnalysis(null); // Clear previous analysis
    await initializeAudioAnalysis();
    initializeSpeechRecognition();
    
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopVoiceAnalysis = () => {
    setIsListening(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      toast({
        title: "Audio File Uploaded",
        description: "Analyzing voice recording for threats...",
      });
      
      // In a real app, you would process the audio file here
      setTimeout(() => {
        analyzeTranscript("Hello, this is from your bank security department. We detected suspicious activity on your account. Please confirm your PIN number immediately to secure your account.");
      }, 2000);
    }
  };

  const getThreatColor = (score: number) => {
    if (score >= 80) return "text-red-500";
    if (score >= 60) return "text-orange-500";
    if (score >= 40) return "text-yellow-500";
    return "text-green-500";
  };

  const getThreatBadgeVariant = (score: number) => {
    if (score >= 80) return "destructive";
    if (score >= 60) return "secondary";
    return "default";
  };

  return (
    <div className="space-y-4">
      {/* Control Panel */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Voice Threat Analysis
          </h3>
          
          <div className="flex gap-2">
            <Button
              onClick={isListening ? stopVoiceAnalysis : startVoiceAnalysis}
              variant={isListening ? "destructive" : "default"}
              size="sm"
            >
              {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
              {isListening ? "Stop" : "Start"} Monitoring
            </Button>
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Audio
                </span>
              </Button>
            </label>
          </div>
        </div>

        {/* Audio Level Indicator */}
        {isListening && (
          <div className="flex items-center gap-3 mb-4">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-100"
                style={{ width: `${Math.min(audioLevel, 100)}%` }}
              />
            </div>
            <AudioLines className="w-4 h-4 text-muted-foreground" />
          </div>
        )}

        {/* Status */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm text-muted-foreground">
            {isListening ? 'Actively monitoring voice patterns' : 'Voice monitoring inactive'}
          </span>
        </div>
      </Card>

      {/* Live Transcript */}
      {transcript && (
        <Card className="p-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <FileAudio className="w-4 h-4" />
            Live Transcript
          </h4>
          <div className="bg-muted rounded-lg p-3 max-h-32 overflow-y-auto">
            <p className="text-sm">{transcript}</p>
          </div>
        </Card>
      )}

      {/* Threat Analysis Results */}
      {threatAnalysis && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium flex items-center gap-2">
              {threatAnalysis.overallThreat >= 70 ? (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              ) : (
                <Shield className="w-4 h-4 text-green-500" />
              )}
              Threat Analysis
            </h4>
            
            <Badge 
              variant={getThreatBadgeVariant(threatAnalysis.overallThreat)}
              className="font-semibold"
            >
              {threatAnalysis.overallThreat}% Threat Level
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-muted-foreground">AI Voice Detection</div>
              <div className={`font-semibold ${getThreatColor(threatAnalysis.aiVoiceConfidence)}`}>
                {threatAnalysis.aiVoiceConfidence}%
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Social Engineering</div>
              <div className={`font-semibold ${getThreatColor(threatAnalysis.socialEngineeringScore)}`}>
                {threatAnalysis.socialEngineeringScore}%
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Emotional Manipulation</div>
              <div className={`font-semibold ${getThreatColor(threatAnalysis.emotionalManipulation)}`}>
                {threatAnalysis.emotionalManipulation}%
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Urgency Tactics</div>
              <div className={`font-semibold ${getThreatColor(threatAnalysis.urgencyLevel)}`}>
                {threatAnalysis.urgencyLevel}%
              </div>
            </div>
          </div>

          {/* Suspicious Keywords */}
          {threatAnalysis.suspiciousKeywords.length > 0 && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Detected Keywords</div>
              <div className="flex flex-wrap gap-1">
                {threatAnalysis.suspiciousKeywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {isAnalyzing && (
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Analyzing voice patterns...
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default VoiceAnalyzer;