import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  AlertTriangle, 
  Shield,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  isSpam?: boolean;
  detectedKeywords?: string[];
  threatLevel?: number;
}

const WhatsAppDemo = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const { toast } = useToast();

  // Same suspicious keywords from VoiceAnalyzer
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
    'asap', 'act now', 'respond immediately',
    
    // Reward & Prize Terms
    'reward', 'win', 'lottery', 'free', 'congratulations', 'youve been selected',
    'special offer', 'winner',
    
    // Pressure & Urgency Tactics
    'act quickly', 'dont tell anyone', 'risk', 'emergency',
    'help me', 'in trouble', 'need money', 'send money', 'wire money',
    'gift card', 'urgent help needed', 'family emergency', 'arrested',
    'hospital', 'accident', 'stranded', 'lost wallet', 'need cash',
    
    // Authority & Government
    'government', 'tax office', 'legal action', 'police', 'court',
    'lawsuit', 'arrest warrant', 'irs', 'federal', 'investigation'
  ];

  // Demo conversation with spam messages
  const demoMessages = [
    {
      sender: "Mom",
      text: "Hi honey, how was your day?",
      timestamp: "2:30 PM"
    },
    {
      sender: "You",
      text: "Great! Just finished work. How are you?",
      timestamp: "2:32 PM"
    },
    {
      sender: "Unknown Number",
      text: "🚨 URGENT SECURITY ALERT! Your bank account has been suspended due to suspicious activity. Confirm your identity immediately by providing your PIN number and CVV to secure your account. Act now!",
      timestamp: "2:35 PM"
    },
    {
      sender: "Mom",
      text: "I'm good. Did you get any strange messages today?",
      timestamp: "2:40 PM"
    },
    {
      sender: "Bank Security",
      text: "Congratulations! You've been selected for a special offer. Free reward waiting! Click here to claim your lottery winnings. Limited time only - respond immediately with your bank details.",
      timestamp: "2:42 PM"
    },
    {
      sender: "You",
      text: "Yes, I got a few suspicious messages. Good thing I have spam detection!",
      timestamp: "2:45 PM"
    },
    {
      sender: "Tax Office",
      text: "Legal action required! You owe $2,500 in unpaid taxes. Arrest warrant issued. Call now to avoid court proceedings. Wire transfer payment needed immediately.",
      timestamp: "2:50 PM"
    },
    {
      sender: "Friend",
      text: "Emergency! I'm stranded at the airport and lost my wallet. Need cash urgently. Can you send money via gift card? Don't tell anyone, please help!",
      timestamp: "3:00 PM"
    }
  ];

  const analyzeMessage = (text: string) => {
    const lowerText = text.toLowerCase();
    const foundKeywords = suspiciousKeywords.filter(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
    
    const threatLevel = Math.min(foundKeywords.length * 15, 100);
    
    return {
      isSpam: foundKeywords.length > 0,
      detectedKeywords: foundKeywords,
      threatLevel
    };
  };

  const addMessage = (messageData: typeof demoMessages[0], index: number) => {
    const analysis = analyzeMessage(messageData.text);
    
    const message: Message = {
      id: index,
      sender: messageData.sender,
      text: messageData.text,
      timestamp: messageData.timestamp,
      ...analysis
    };

    setMessages(prev => [...prev, message]);

    // Show alert for high-threat messages
    if (analysis.threatLevel > 50) {
      toast({
        title: "🚨 Potential Scam Detected",
        description: `Message from "${messageData.sender}" contains ${analysis.detectedKeywords?.length} suspicious keywords`,
        variant: "destructive"
      });
    }
  };

  const startDemo = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setCurrentMessageIndex(0);
    setMessages([]);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentMessageIndex(0);
    setMessages([]);
  };

  useEffect(() => {
    if (isPlaying && currentMessageIndex < demoMessages.length) {
      const timer = setTimeout(() => {
        addMessage(demoMessages[currentMessageIndex], currentMessageIndex);
        setCurrentMessageIndex(prev => prev + 1);
      }, 2000);

      return () => clearTimeout(timer);
    } else if (currentMessageIndex >= demoMessages.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentMessageIndex]);

  const highlightKeywords = (text: string, keywords: string[]) => {
    if (!keywords.length) return text;
    
    let highlightedText = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-red-200 text-red-800 px-1 rounded">$1</mark>');
    });
    
    return highlightedText;
  };

  const getThreatColor = (level: number) => {
    if (level >= 80) return "text-red-500";
    if (level >= 60) return "text-orange-500";
    if (level >= 40) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          WhatsApp Spam Detection Demo
        </h3>
        
        <div className="flex gap-2">
          <Button
            onClick={startDemo}
            disabled={isPlaying}
            size="sm"
            variant="default"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Demo
          </Button>
          
          <Button
            onClick={resetDemo}
            size="sm"
            variant="outline"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 max-h-96 overflow-y-auto">
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'You' 
                    ? 'bg-green-500 text-white' 
                    : message.isSpam 
                    ? 'bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800' 
                    : 'bg-white dark:bg-gray-800 border'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {message.sender}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp}
                    </span>
                  </div>
                  
                  <div 
                    className="text-sm"
                    dangerouslySetInnerHTML={{ 
                      __html: message.isSpam 
                        ? highlightKeywords(message.text, message.detectedKeywords || [])
                        : message.text 
                    }}
                  />
                </div>
              </div>

              {/* Spam Detection Alert */}
              {message.isSpam && (
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md bg-red-100 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-700 dark:text-red-400">
                        Potential Scam Detected
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-red-600 dark:text-red-400">Threat Level:</span>
                        <Badge variant="destructive" className="text-xs">
                          {message.threatLevel}%
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="text-xs text-red-600 dark:text-red-400">
                          Detected Keywords ({message.detectedKeywords?.length}):
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {message.detectedKeywords?.slice(0, 3).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs text-red-700 border-red-300">
                              {keyword}
                            </Badge>
                          ))}
                          {(message.detectedKeywords?.length || 0) > 3 && (
                            <Badge variant="outline" className="text-xs text-red-700 border-red-300">
                              +{(message.detectedKeywords?.length || 0) - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isPlaying && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>Real-time spam detection active</span>
        </div>
        
        <div>
          {messages.length > 0 && (
            <span>
              {messages.filter(m => m.isSpam).length} of {messages.length} messages flagged
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WhatsAppDemo;