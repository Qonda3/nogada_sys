import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  AlertTriangle, 
  Shield,
  Volume2,
  Mic,
  Brain,
  Video,
  MessageCircle,
  MoreVertical
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CallSimulationProps {
  onClose: () => void;
}

const CallSimulation = ({ onClose }: CallSimulationProps) => {
  const [callPhase, setCallPhase] = useState<'incoming' | 'active' | 'analyzing' | 'threat-detected' | 'blocked'>('incoming');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [threatLevel, setThreatLevel] = useState(0);
  const { toast } = useToast();

  const suspiciousPhrase = "Hello, this is from your bank. We've detected suspicious activity on your account. To secure your account, please provide your PIN number...";
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callPhase === 'active') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [callPhase]);

  useEffect(() => {
    if (callPhase === 'analyzing') {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          const newProgress = prev + 2;
          setThreatLevel(Math.min(newProgress * 1.2, 100));
          
          if (newProgress >= 100) {
            setCallPhase('threat-detected');
            toast({
              title: "🚨 THREAT DETECTED",
              description: "AI-generated voice and social engineering detected",
              variant: "destructive",
            });
            return 100;
          }
          return newProgress;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [callPhase, toast]);

  const handleAnswerCall = () => {
    setCallPhase('active');
    setTimeout(() => {
      setCallPhase('analyzing');
    }, 3000);
  };

  const handleBlockCall = () => {
    setCallPhase('blocked');
    toast({
      title: "✅ Call Blocked",
      description: "Threat neutralized. Number added to blacklist.",
    });
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="w-full max-w-sm bg-black text-white h-full flex flex-col relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-green-600">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="text-lg font-medium">WhatsApp</span>
          </div>
          <MoreVertical className="w-5 h-5 text-white" />
        </div>

        {/* Call Content */}
        <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-green-700 to-green-800">
          
          {/* Incoming Call */}
          {callPhase === 'incoming' && (
            <>
              <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gray-400 flex items-center justify-center text-6xl">
                    👤
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium text-white">Unknown</h3>
                    <p className="text-lg text-green-100">+27-XXX-XXX-9876</p>
                    <p className="text-sm text-green-200 mt-2">WhatsApp voice call</p>
                  </div>
                </div>
                
                {/* AI Detection Badge */}
                <div className="bg-orange-500/20 border border-orange-400 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-orange-300" />
                    <span className="text-sm text-orange-200">AI Monitoring Active</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-16">
                <Button 
                  onClick={onClose}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 border-4 border-white/20"
                >
                  <PhoneOff className="w-6 h-6 text-white" />
                </Button>
                <Button 
                  onClick={handleAnswerCall}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 border-4 border-white/20"
                >
                  <Phone className="w-6 h-6 text-white" />
                </Button>
              </div>
            </>
          )}

          {/* Active Call */}
          {callPhase === 'active' && (
            <>
              <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gray-400 flex items-center justify-center text-6xl">
                    👤
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium text-white">Unknown</h3>
                    <p className="text-lg text-green-100">+27-XXX-XXX-9876</p>
                    <Badge variant="secondary" className="mt-2 bg-green-600 text-white">{formatTime(callDuration)}</Badge>
                  </div>
                </div>
                
                {/* Audio Visualization */}
                <div className="flex items-center justify-center space-x-2">
                  <Volume2 className="w-5 h-5 text-green-300" />
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-1 h-8 bg-green-300 rounded animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                    ))}
                  </div>
                  <Mic className="w-5 h-5 text-green-300" />
                </div>

                <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-blue-300" />
                    <span className="text-sm text-blue-200">Analyzing conversation...</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-16">
                <Button 
                  size="lg"
                  className="w-16 h-16 rounded-full bg-gray-600 hover:bg-gray-700 border-4 border-white/20"
                >
                  <Mic className="w-6 h-6 text-white" />
                </Button>
                <Button 
                  onClick={onClose}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 border-4 border-white/20"
                >
                  <PhoneOff className="w-6 h-6 text-white" />
                </Button>
                <Button 
                  size="lg"
                  className="w-16 h-16 rounded-full bg-gray-600 hover:bg-gray-700 border-4 border-white/20"
                >
                  <Video className="w-6 h-6 text-white" />
                </Button>
              </div>
            </>
          )}

          {/* Analyzing */}
          {callPhase === 'analyzing' && (
            <>
              <div className="flex-1 flex flex-col space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gray-400 flex items-center justify-center text-6xl relative">
                    👤
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium text-orange-300">⚠️ THREAT ANALYSIS</h3>
                    <p className="text-lg text-green-100">+27-XXX-XXX-9876</p>
                  </div>
                </div>
                
                {/* Detected Content */}
                <div className="bg-orange-900/50 border border-orange-500 rounded-lg p-4">
                  <p className="text-sm text-orange-200 mb-2">🎙️ Detected Speech:</p>
                  <p className="text-xs text-orange-100 italic">"{suspiciousPhrase.substring(0, 80)}..."</p>
                </div>
                
                {/* Progress Bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">AI Voice Analysis</span>
                      <span className="text-orange-300">{analysisProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">Threat Level</span>
                      <span className="text-red-400 font-semibold">{Math.round(threatLevel)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${threatLevel}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Threat Indicators */}
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="destructive" className="text-xs">AI Voice: 94%</Badge>
                  <Badge variant="destructive" className="text-xs">Social Eng: 89%</Badge>
                  <Badge variant="destructive" className="text-xs">Bank Fraud: 97%</Badge>
                  <Badge variant="destructive" className="text-xs">Urgency: 92%</Badge>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={onClose}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 border-4 border-white/20"
                >
                  <PhoneOff className="w-6 h-6 text-white" />
                </Button>
              </div>
            </>
          )}

          {/* Threat Detected */}
          {callPhase === 'threat-detected' && (
            <>
              <div className="flex-1 flex flex-col space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gray-400 flex items-center justify-center text-6xl relative">
                    👤
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                      🚨
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-red-400">🚨 SCAM DETECTED</h3>
                    <p className="text-sm text-red-200">AI voice clone • Banking fraud attempt</p>
                  </div>
                </div>
                
                {/* Threat Summary */}
                <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                  <h4 className="font-semibold text-red-200 mb-2">⚠️ THREAT ANALYSIS</h4>
                  <ul className="text-xs text-red-100 space-y-1">
                    <li>✓ AI-generated voice detected (94%)</li>
                    <li>✓ Social engineering patterns</li>
                    <li>✓ Banking credential theft attempt</li>
                    <li>✓ Urgency manipulation tactics</li>
                  </ul>
                </div>
                
                <Button 
                  onClick={handleBlockCall}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 animate-pulse"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  BLOCK & REPORT THREAT
                </Button>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={onClose}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 border-4 border-white/20"
                >
                  <PhoneOff className="w-6 h-6 text-white" />
                </Button>
              </div>
            </>
          )}

          {/* Blocked */}
          {callPhase === 'blocked' && (
            <>
              <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full bg-green-600 flex items-center justify-center">
                    <Shield className="w-16 h-16 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-400">✅ PROTECTED</h3>
                    <p className="text-sm text-green-200">Threat blocked • Number blacklisted</p>
                  </div>
                </div>
                
                <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 w-full">
                  <h4 className="font-semibold text-green-200 mb-2">Protection Actions:</h4>
                  <ul className="text-xs text-green-100 space-y-1">
                    <li>✓ Call automatically terminated</li>
                    <li>✓ Number added to blacklist</li>
                    <li>✓ Threat shared with network</li>
                    <li>✓ Incident logged for analysis</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

        {/* WhatsApp-style bottom indicator */}
        <div className="h-1 bg-green-500"></div>
      </div>
    </div>
  );
};

export default CallSimulation;