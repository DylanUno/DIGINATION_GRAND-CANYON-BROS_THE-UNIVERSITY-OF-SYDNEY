import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Activity,
  Stethoscope,
  Calendar,
  AlertOctagon,
  TrendingUp,
  Heart,
  Eye,
  Phone,
  Car
} from "lucide-react"
import { useState } from "react"

interface StructuredAIAssessmentProps {
  maiDxoResults: any
  aiRiskLevel: string
  consensusLevel?: number
}

export function StructuredAIAssessment({ maiDxoResults, aiRiskLevel, consensusLevel = 85 }: StructuredAIAssessmentProps) {
  const [isDetailedOpen, setIsDetailedOpen] = useState(false)

  // Parse and structure the AI recommendations
  const parseRecommendations = (maiDxoResults: any) => {
    const immediateActions: string[] = []
    const monitoringProtocol: string[] = []
    const followUp: string[] = []

    // Handle different MAI-DxO result structures
    let recommendations: any[] = []
    
    // Check for dashboard_format structure first
    if (maiDxoResults?.dashboard_format?.preliminary_diagnostic_suggestions) {
      recommendations = maiDxoResults.dashboard_format.preliminary_diagnostic_suggestions
    }
    // Fallback to key_recommendations
    else if (maiDxoResults?.key_recommendations) {
      recommendations = maiDxoResults.key_recommendations.map((rec: string) => ({ recommendation: rec }))
    }
    // Check for final_consensus structure
    else if (maiDxoResults?.final_consensus?.recommendations?.immediate_actions) {
      immediateActions.push(...maiDxoResults.final_consensus.recommendations.immediate_actions)
      monitoringProtocol.push(...(maiDxoResults.final_consensus.recommendations.monitoring_recommendations || []))
      return { immediateActions, monitoringProtocol, followUp }
    }

    recommendations?.forEach((rec: any) => {
      const recommendation = rec.recommendation || rec
      const lowerRec = recommendation.toLowerCase()
      const urgency = rec.urgency || ''
      
      // Immediate actions (urgent/emergency)
      if (urgency === 'immediate' || urgency === 'emergent' || 
          lowerRec.includes('immediate') || lowerRec.includes('emergency') || 
          lowerRec.includes('urgent') || lowerRec.includes('ecg') || 
          lowerRec.includes('contact') || lowerRec.includes('transport') ||
          lowerRec.includes('referral') || lowerRec.includes('manual assessment')) {
        immediateActions.push(recommendation)
      }
      // Monitoring protocol
      else if (urgency === 'monitoring' || 
               lowerRec.includes('monitor') || lowerRec.includes('continuous') || 
               lowerRec.includes('tracking') || lowerRec.includes('observation') ||
               lowerRec.includes('vital') || lowerRec.includes('bp') ||
               lowerRec.includes('o2') || lowerRec.includes('saturation') ||
               lowerRec.includes('cardiac monitoring')) {
        monitoringProtocol.push(recommendation)
      }
      // Follow-up
      else if (urgency === 'follow_up' || 
               lowerRec.includes('follow') || lowerRec.includes('visit') || 
               lowerRec.includes('schedule') || lowerRec.includes('appointment') ||
               lowerRec.includes('week') || lowerRec.includes('month') ||
               lowerRec.includes('address') || lowerRec.includes('compliance')) {
        followUp.push(recommendation)
      }
      // Default categorization based on risk level
      else {
        if (aiRiskLevel === 'HIGH') {
          immediateActions.push(recommendation)
        } else if (aiRiskLevel === 'MEDIUM') {
          monitoringProtocol.push(recommendation)
        } else {
          followUp.push(recommendation)
        }
      }
    })

    return { immediateActions, monitoringProtocol, followUp }
  }

  const { immediateActions, monitoringProtocol, followUp } = parseRecommendations(maiDxoResults)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'MEDIUM':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      default:
        return 'text-green-600 bg-green-50 border-green-200'
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return <AlertOctagon className="h-5 w-5 text-red-600" />
      case 'MEDIUM':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-600" />
    }
  }

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-orange-600" />
          AI Assessment & Recommendations
        </CardTitle>
        <CardDescription>
          Structured diagnostic insights and action plan based on AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Assessment */}
        <div className={`p-4 rounded-lg border ${getRiskColor(aiRiskLevel)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getRiskIcon(aiRiskLevel)}
              <div>
                <h3 className="text-lg font-semibold">{aiRiskLevel} Risk Assessment</h3>
                <p className="text-sm opacity-80">AI Confidence: {consensusLevel}%</p>
              </div>
            </div>
            <Badge variant={aiRiskLevel === 'HIGH' ? 'destructive' : aiRiskLevel === 'MEDIUM' ? 'default' : 'secondary'}>
              {aiRiskLevel} Priority
            </Badge>
          </div>
        </div>

        {/* Tiered Information Architecture */}
        <div className="space-y-4">
          {/* Immediate Actions */}
          {immediateActions.length > 0 && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertOctagon className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-red-800">🚨 IMMEDIATE ACTIONS</h4>
              </div>
              <ul className="space-y-2">
                {immediateActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                    <span className="text-red-600 mt-1">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Monitoring Protocol */}
          {monitoringProtocol.length > 0 && (
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">📋 MONITORING PROTOCOL</h4>
              </div>
              <ul className="space-y-2">
                {monitoringProtocol.map((protocol, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{protocol}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow-up */}
          {followUp.length > 0 && (
            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800">📅 FOLLOW-UP</h4>
              </div>
              <ul className="space-y-2">
                {followUp.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fallback if no structured recommendations */}
          {immediateActions.length === 0 && monitoringProtocol.length === 0 && followUp.length === 0 && (
            <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="h-5 w-5 text-gray-600" />
                <h4 className="font-semibold text-gray-800">📋 GENERAL RECOMMENDATIONS</h4>
              </div>
              <p className="text-sm text-gray-600">
                {maiDxoResults?.key_recommendations?.length > 0 
                  ? "Review detailed recommendations below for comprehensive assessment."
                  : "No specific recommendations available at this time."
                }
              </p>
            </div>
          )}
        </div>

        {/* Detailed Recommendations Collapsible */}
        <Collapsible open={isDetailedOpen} onOpenChange={setIsDetailedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>View Detailed Recommendations</span>
              {isDetailedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-gray-800 mb-3">Detailed AI Analysis</h4>
              
                             {/* Specialist Insights */}
               {(maiDxoResults?.specialist_insights?.length > 0 || maiDxoResults?.dashboard_format?.ai_panel_insights?.specialist_insights?.length > 0) && (
                 <div className="mb-4">
                   <h5 className="text-sm font-medium text-gray-700 mb-2">Specialist Panel Insights:</h5>
                   <div className="space-y-2">
                     {(maiDxoResults?.dashboard_format?.ai_panel_insights?.specialist_insights || maiDxoResults?.specialist_insights || []).map((insight: any, index: number) => (
                       <div key={index} className="p-3 bg-white border border-gray-200 rounded">
                         <div className="flex justify-between items-start mb-1">
                           <span className="text-sm font-medium text-gray-800">
                             {insight.key_insight || insight.key_finding}
                           </span>
                           <Badge variant="outline" className="text-xs">
                             {insight.specialist}
                           </Badge>
                         </div>
                         <p className="text-xs text-gray-600">Confidence: {insight.confidence}%</p>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

                             {/* Raw Recommendations */}
               {(maiDxoResults?.key_recommendations?.length > 0 || maiDxoResults?.dashboard_format?.preliminary_diagnostic_suggestions?.length > 0) && (
                 <div>
                   <h5 className="text-sm font-medium text-gray-700 mb-2">Complete Recommendations:</h5>
                   <ul className="space-y-2">
                     {(maiDxoResults?.dashboard_format?.preliminary_diagnostic_suggestions || maiDxoResults?.key_recommendations || []).map((rec: any, index: number) => (
                       <li key={index} className="text-sm text-gray-700 p-2 bg-white border border-gray-200 rounded">
                         {typeof rec === 'string' ? rec : rec.recommendation}
                       </li>
                     ))}
                   </ul>
                 </div>
               )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
} 