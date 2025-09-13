import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Phone, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Brain,
  Users,
  Clock,
  Play
} from "lucide-react";
import CallSimulation from "./CallSimulation";
import VoiceAnalyzer from "./VoiceAnalyzer";
import WhatsAppDemo from "./WhatsAppDemo";

interface ThreatAlert {
  id: string;
  type: "high" | "medium" | "low";
  message: string;
  timestamp: Date;
  phoneNumber: string;
}

interface CallData {
  id: string;
  phoneNumber: string;
  duration: number;
  threatLevel: "safe" | "suspicious" | "dangerous";
  aiConfidence: number;
  timestamp: Date;
}

const Dashboard = () => {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [showCallSimulation, setShowCallSimulation] = useState(false);
  const [activeThreats, setActiveThreats] = useState<ThreatAlert[]>([
    {
      id: "1",
      type: "high",
      message: "AI-generated voice detected attempting banking credential theft",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      phoneNumber: "+27-XXX-XXX-1234"
    },
    {
      id: "2", 
      type: "medium",
      message: "Social engineering phrases detected in ongoing call",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      phoneNumber: "+27-XXX-XXX-5678"
    }
  ]);

  const [recentCalls, setRecentCalls] = useState<CallData[]>([
    {
      id: "1",
      phoneNumber: "+27-XXX-XXX-1234",
      duration: 45,
      threatLevel: "dangerous",
      aiConfidence: 94,
      timestamp: new Date(Date.now() - 2 * 60 * 1000)
    },
    {
      id: "2", 
      phoneNumber: "+27-XXX-XXX-5678",
      duration: 120,
      threatLevel: "suspicious",
      aiConfidence: 78,
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: "3",
      phoneNumber: "+27-XXX-XXX-9999",
      duration: 30,
      threatLevel: "safe",
      aiConfidence: 12,
      timestamp: new Date(Date.now() - 10 * 60 * 1000)
    }
  ]);

  const [stats] = useState({
    callsAnalyzed: 1247,
    threatsBlocked: 23,
    avgResponseTime: "0.8s",
    uptime: "99.9%"
  });

  const getThreatBadgeVariant = (type: string) => {
    switch (type) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "dangerous": return "text-destructive";
      case "suspicious": return "text-warning";
      case "safe": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 cyber-gradient rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Nogada
              </h1>
              <p className="text-muted-foreground">AI-Powered Social Engineering Protection</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant={isMonitoring ? "default" : "secondary"} className="px-4 py-2">
              <div className={`w-2 h-2 rounded-full mr-2 ${isMonitoring ? 'bg-success pulse-safe' : 'bg-muted-foreground'}`} />
              {isMonitoring ? "Active Monitoring" : "Monitoring Paused"}
            </Badge>
            <Button 
              onClick={() => setShowCallSimulation(true)}
              variant="outline"
              className="mr-2"
            >
              <Play className="w-4 h-4 mr-2" />
              Demo Call
            </Button>
            <Button 
              onClick={() => setIsMonitoring(!isMonitoring)}
              variant={isMonitoring ? "secondary" : "default"}
            >
              {isMonitoring ? "Pause" : "Resume"} Monitoring
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 cyber-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Calls Analyzed</p>
                <p className="text-2xl font-bold text-foreground">{stats.callsAnalyzed.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6 threat-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Threats Blocked</p>
                <p className="text-2xl font-bold text-destructive">{stats.threatsBlocked}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </Card>

          <Card className="p-6 safe-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold text-success">{stats.avgResponseTime}</p>
              </div>
              <Brain className="w-8 h-8 text-success" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold text-foreground">{stats.uptime}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Threats */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-destructive" />
                Active Threats
              </h2>
              <Badge variant="destructive" className="pulse-threat">
                {activeThreats.length} Active
              </Badge>
            </div>
            
            <div className="space-y-4">
              {activeThreats.map((threat) => (
                <div key={threat.id} className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={getThreatBadgeVariant(threat.type)}>
                      {threat.type.toUpperCase()} RISK
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {threat.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-1">{threat.message}</p>
                  <p className="text-xs text-muted-foreground">From: {threat.phoneNumber}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Call Analysis */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary" />
                Recent Call Analysis
              </h2>
            </div>
            
            <div className="space-y-4">
              {recentCalls.map((call) => (
                <div key={call.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{call.phoneNumber}</span>
                      <Badge 
                        variant={call.threatLevel === "dangerous" ? "destructive" : 
                               call.threatLevel === "suspicious" ? "secondary" : "outline"}
                      >
                        {call.threatLevel}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {call.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Duration: {Math.floor(call.duration / 60)}m {call.duration % 60}s
                    </span>
                    <span className={getThreatLevelColor(call.threatLevel)}>
                      AI Confidence: {call.aiConfidence}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Voice Analysis Section */}
        <VoiceAnalyzer />

        {/* WhatsApp Demo Section */}
        <WhatsAppDemo />

        {/* AI Detection Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Brain className="w-5 h-5 mr-2 text-accent" />
              AI Detection Systems
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 cyber-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Voice Cloning Detection</h3>
              <p className="text-sm text-muted-foreground mb-2">Real-time AI voice analysis</p>
              <Badge variant="default" className="pulse-cyber">Active</Badge>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 safe-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Social Engineering Detection</h3>
              <p className="text-sm text-muted-foreground mb-2">Pattern recognition & NLP</p>
              <Badge variant="default" className="pulse-safe">Active</Badge>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 threat-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Real-time Monitoring</h3>
              <p className="text-sm text-muted-foreground mb-2">24/7 background protection</p>
              <Badge variant="default" className="pulse-threat">Active</Badge>
            </div>
          </div>
        </Card>
      </div>
      
      {showCallSimulation && (
        <CallSimulation onClose={() => setShowCallSimulation(false)} />
      )}
    </div>
  );
};

export default Dashboard;