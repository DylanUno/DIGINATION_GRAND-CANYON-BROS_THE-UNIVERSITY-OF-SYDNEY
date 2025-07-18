#!/usr/bin/env python3
"""
VitalSense Pro - MAI-DxO Virtual Medical Panel Implementation
Complete implementation of the 5-agent virtual medical panel using Gemini 2.0 Flash
"""

import json
import requests
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import os
from dotenv import load_dotenv
from config import settings

# Load environment variables
load_dotenv()

def anonymize_patient_data(data: Dict) -> Dict:
    """Removes personally identifiable information (PII) from patient data."""
    if 'personal_information' in data:
        data['personal_information'].pop('full_name', None)
        data['personal_information'].pop('phone_number', None)
    return data

@dataclass
class DebateRound:
    """Represents a single round of debate between specialists"""
    round_number: int
    specialist_responses: Dict[str, Dict[str, Any]]
    consensus_level: float
    key_disagreements: List[str]

class GeminiClient:
    """Client for interacting with Gemini 2.0 Flash API"""
    
    def __init__(self):
        self.api_key = os.getenv('GOOGLE_AI_API_KEY')
        self.api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        self.headers = {
            'Content-Type': 'application/json',
            'X-goog-api-key': self.api_key
        }
    
    def generate_response(self, prompt: str) -> str:
        """Generate response from Gemini 2.0 Flash"""
        print("\n" + "="*80)
        print("🤖 GEMINI API CALL")
        print("="*80)
        print(f"📤 Sending request to: {self.api_url}")
        print(f"🔑 Using API key: {self.api_key[:10]}..." if self.api_key else "❌ No API key found")
        
        # Print a preview of the prompt (first 500 characters)
        prompt_preview = prompt[:500] + "..." if len(prompt) > 500 else prompt
        print(f"📝 PROMPT PREVIEW:")
        print("-" * 40)
        print(prompt_preview)
        print("-" * 40)
        print(f"📏 Full prompt length: {len(prompt)} characters")
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 8192,
            }
        }
        
        try:
            print("🌐 Making API request...")
            response = requests.post(self.api_url, headers=self.headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                ai_response = result['candidates'][0]['content']['parts'][0]['text']
                print("✅ API Response received!")
                print(f"📥 RESPONSE PREVIEW:")
                print("-" * 40)
                response_preview = ai_response[:500] + "..." if len(ai_response) > 500 else ai_response
                print(response_preview)
                print("-" * 40)
                print(f"📏 Full response length: {len(ai_response)} characters")
                print("="*80)
                return ai_response
            else:
                print("❌ No valid response from Gemini API")
                print(f"🔍 Raw API response: {result}")
                raise Exception("No valid response from Gemini API")
                
        except Exception as e:
            print(f"❌ Error calling Gemini API: {e}")
            print("="*80)
            raise

class MAIDxOVirtualSpecialist:
    """Base class for virtual medical specialists"""
    
    def __init__(self, name: str, role: str, gemini_client: GeminiClient):
        self.name = name
        self.role = role
        self.gemini_client = gemini_client
    
    def analyze(self, patient_data: Dict, previous_debate: List[DebateRound] = None) -> Dict[str, Any]:
        """Analyze patient data and return specialist assessment"""
        print(f"\n🏥 {self.name} ({self.role}) - Starting Analysis")
        print(f"📊 Patient: {patient_data.get('personal_information', {}).get('full_name', 'Unknown')}")
        print(f"📋 Chief Complaint: {patient_data.get('symptoms_context', {}).get('chief_complaint', 'None')}")
        
        prompt = self.create_prompt(patient_data, previous_debate)
        
        try:
            response = self.gemini_client.generate_response(prompt)
            
            # Try to parse JSON response - handle markdown code blocks
            try:
                # Clean the response - remove markdown code blocks if present
                cleaned_response = response.strip()
                if cleaned_response.startswith('```json'):
                    cleaned_response = cleaned_response[7:]  # Remove ```json
                if cleaned_response.startswith('```'):
                    cleaned_response = cleaned_response[3:]  # Remove ```
                if cleaned_response.endswith('```'):
                    cleaned_response = cleaned_response[:-3]  # Remove ```
                
                cleaned_response = cleaned_response.strip()
                parsed_response = json.loads(cleaned_response)
                print(f"✅ {self.name} - Analysis completed successfully")
                return {
                    'specialist': self.name,
                    'role': self.role,
                    'analysis': parsed_response,
                    'timestamp': datetime.now().isoformat()
                }
            except json.JSONDecodeError as e:
                print(f"⚠️ {self.name} - JSON parsing failed: {e}")
                print(f"🔍 Raw response: {response[:200]}...")
                # If JSON parsing fails, create a structured response with raw text
                return {
                    'specialist': self.name,
                    'role': self.role,
                    'analysis': {
                        'raw_response': response,
                        'note': 'Response not in valid JSON format, stored as raw text',
                        'parsing_error': str(e)
                    },
                    'timestamp': datetime.now().isoformat()
                }
        except Exception as e:
            # If API call fails, return error
            print(f"❌ {self.name} - Analysis failed: {str(e)}")
            return {
                'specialist': self.name,
                'role': self.role,
                'analysis': {'error': str(e)},
                'timestamp': datetime.now().isoformat()
            }
    
    def create_prompt(self, patient_data: Dict, previous_debate: List[DebateRound] = None) -> str:
        """Create the prompt for this specialist - to be overridden by subclasses"""
        raise NotImplementedError

class DrHypothesis(MAIDxOVirtualSpecialist):
    """Dr. Hypothesis - Differential Assessment Specialist"""
    
    def __init__(self, gemini_client: GeminiClient):
        super().__init__("Dr. Hypothesis", "Differential Assessment Specialist", gemini_client)
    
    def create_prompt(self, patient_data: Dict, previous_debate: List[DebateRound] = None) -> str:
        previous_debate_text = ""
        if previous_debate:
            debate_data = json.dumps([r.__dict__ for r in previous_debate], indent=2)
            previous_debate_text = f"PREVIOUS PANEL DISCUSSION: {debate_data}"
        
        patient_data_str = json.dumps(patient_data, indent=2)
        
        return f"""
You are Dr. Hypothesis, the differential assessment specialist in the VitalSense virtual medical panel.

ROLE: Maintain a probability-ranked assessment of the patient's physiological condition based on complete vital signs and clinical data. Be OPINIONATED and CONFIDENT in your assessments. Don't hedge - make strong probability statements.

COMPLETE PATIENT DATA:
{patient_data_str}

{previous_debate_text}

ANALYZE SYSTEMATICALLY AND BE CONFIDENT:

1. **Multi-Modal Vital Signs Integration**:
   - ECG Analysis: {patient_data.get('vital_signs_data', {}).get('ecg_analysis', {})}
   - Video Vitals: {patient_data.get('vital_signs_data', {}).get('video_vitals_analysis', {})}
   - Cross-modal correlation assessment
   - Signal quality and confidence evaluation

2. **Top 3 Physiological Assessments** (Be CONFIDENT in your probability rankings):
   Assessment 1: [condition/pattern] - Probability: [0.0-1.0] - Supporting Evidence: [specific findings]
   Assessment 2: [condition/pattern] - Probability: [0.0-1.0] - Supporting Evidence: [specific findings]  
   Assessment 3: [condition/pattern] - Probability: [0.0-1.0] - Supporting Evidence: [specific findings]

3. **Clinical Context Integration**:
   - Symptoms correlation with objective findings
   - Medical history relevance: {patient_data.get('medical_history', {})}
   - Age/gender/demographic factors
   - Current medications impact

4. **Physiological Coherence Assessment**:
   - Cross-parameter consistency (ECG vs pulse vs respiratory rate)
   - Expected vs observed patterns
   - Measurement confidence weighting

BE CONFIDENT AND OPINIONATED. Make strong probability statements. If you disagree with previous assessments, state why clearly.

MANDATORY: Include these CORE fields in your response, then add your specialist fields:

RESPOND IN VALID JSON FORMAT:
{{
    "core_assessment": {{
        "risk_level": "low|medium|high",
        "confidence": 0.0,
        "primary_concerns": ["concern1", "concern2"],
        "urgency": "routine|expedited|urgent|emergent"
    }},
    "differential_assessments": [
        {{
            "condition": "primary physiological assessment",
            "probability": 0.0,
            "supporting_evidence": ["specific vital sign findings", "symptom correlations"],
            "clinical_significance": "immediate/moderate/low concern",
            "confidence_level": 0.0
        }},
        {{
            "condition": "secondary assessment", 
            "probability": 0.0,
            "supporting_evidence": [],
            "clinical_significance": "",
            "confidence_level": 0.0
        }},
        {{
            "condition": "tertiary consideration",
            "probability": 0.0, 
            "supporting_evidence": [],
            "clinical_significance": "",
            "confidence_level": 0.0
        }}
    ],
    "overall_assessment_confidence": 0.0,
    "key_physiological_concerns": [],
    "cross_modal_coherence": "assessment of vital signs consistency",
    "clinical_correlation": "symptoms vs objective findings alignment",
    "uncertainty_factors": ["areas requiring additional clarification"],
    "disagreements_with_others": ["specific disagreements with previous assessments if any"]
}}
"""

class DrMonitoringStrategist(MAIDxOVirtualSpecialist):
    """Dr. Monitoring Strategist - Clinical Monitoring Specialist"""
    
    def __init__(self, gemini_client: GeminiClient):
        super().__init__("Dr. Monitoring Strategist", "Clinical Monitoring Specialist", gemini_client)
    
    def create_prompt(self, patient_data: Dict, previous_debate: List[DebateRound] = None) -> str:
        hypothesis_assessment = ""
        if previous_debate:
            # Extract Dr. Hypothesis assessment from previous debate
            for round in previous_debate:
                if 'Dr. Hypothesis' in round.specialist_responses:
                    hypothesis_assessment = json.dumps(round.specialist_responses['Dr. Hypothesis'])
                    break
        
        patient_context = json.dumps(patient_data, indent=2)
        
        return f"""
You are Dr. Monitoring Strategist, the clinical monitoring specialist in the VitalSense panel.

ROLE: Determine optimal monitoring strategies and follow-up recommendations based on physiological assessment.

CURRENT ASSESSMENT: {hypothesis_assessment}
PATIENT CONTEXT: {patient_context}

MONITORING STRATEGY SELECTION:

1. **Risk Stratification for Monitoring Intensity**:
   - Immediate risk level (next 1-4 hours)
   - Short-term risk level (next 24-48 hours)
   - Monitoring urgency classification

2. **Select Up to 3 Optimal Monitoring Approaches** (maximally discriminating):
   Choose from:
   - Continuous pulse oximetry
   - Cardiac rhythm monitoring (Holter/event)
   - Blood pressure monitoring intervals
   - Respiratory pattern tracking
   - Symptom assessment schedules
   - Repeat ECG timing
   - Laboratory follow-up
   - Specialist consultation timeline

3. **Diagnostic Yield Assessment**:
   - Which monitoring provides highest diagnostic value
   - Cost-benefit analysis for rural Indonesian setting
   - Feasibility in Puskesmas environment

4. **Follow-up Strategy**:
   - Timeframes for reassessment
   - Escalation triggers and thresholds
   - Specialist referral criteria
   - Emergency intervention points

MANDATORY: Include these CORE fields in your response, then add your specialist fields:

RESPOND IN VALID JSON FORMAT:
{{
    "core_assessment": {{
        "risk_level": "low|medium|high", 
        "confidence": 0.0,
        "primary_concerns": ["concern1", "concern2"],
        "urgency": "routine|expedited|urgent|emergent"
    }},
    "risk_stratification": {{
        "immediate_risk": "low|medium|high",
        "short_term_risk": "low|medium|high",
        "monitoring_urgency": "routine|expedited|urgent|emergent"
    }},
    "selected_monitoring": [
        {{
            "type": "monitoring approach",
            "rationale": "why this monitoring maximally discriminates",
            "duration": "monitoring timeframe",
            "feasibility_rural": "high|medium|low",
            "discriminatory_value": 0.0,
            "cost_level": "low|medium|high"
        }}
    ],
    "follow_up_strategy": {{
        "reassessment_timeline": "timeframe for next evaluation",
        "escalation_triggers": ["specific parameters requiring immediate action"],
        "specialist_referral": {{
            "recommended": true,
            "urgency": "immediate|within_4hrs|within_24hrs|routine",
            "specialty": "cardiology|pulmonology|internal_medicine"
        }}
    }},
    "management_recommendations": {{
        "activity_level": "unrestricted|light_restriction|moderate_restriction|bed_rest",
        "medication_considerations": [],
        "return_precautions": ["warning signs for immediate return"]
    }},
    "monitoring_confidence": 0.0
}}
"""

class DrChallenger(MAIDxOVirtualSpecialist):
    """Dr. Challenger - Devil's Advocate"""
    
    def __init__(self, gemini_client: GeminiClient):
        super().__init__("Dr. Challenger", "Devil's Advocate", gemini_client)
    
    def create_prompt(self, patient_data: Dict, previous_debate: List[DebateRound] = None) -> str:
        previous_debate_text = ""
        if previous_debate:
            debate_data = json.dumps([r.__dict__ for r in previous_debate], indent=2)
            previous_debate_text = f"PREVIOUS PANEL DISCUSSION: {debate_data}"
        
        patient_data_str = json.dumps(patient_data, indent=2)
        
        return f"""
You are Dr. Challenger, the devil's advocate in the VitalSense virtual medical panel.

ROLE: Challenge assumptions, identify potential bias, and propose alternative interpretations of vital signs and clinical data. Be CONFRONTATIONAL and QUESTION everything. Disagree with other specialists when you see weaknesses in their reasoning.

CRITICAL REQUIREMENT: You MUST disagree with at least 2 other specialists' assessments. 
Real medical panels always have initial disagreements - your job is to create healthy conflict.

SPECIFIC DISAGREEMENTS TO FIND:
- Risk level conflicts: "Dr. Hypothesis says medium risk, but this is HIGH risk because..."
- Urgency disputes: "Dr. Monitoring wants routine follow-up, but this needs IMMEDIATE action because..."
- Diagnostic challenges: "The panel is missing the obvious diagnosis of..."
- Resource safety concerns: "Dr. Stewardship's cost-cutting could compromise patient safety because..."

DISAGREEMENT EXAMPLES:
- "I strongly disagree with Dr. Hypothesis's 85% ACS probability - this could be anxiety because..."
- "Dr. Monitoring Strategist underestimates urgency - this patient needs immediate specialist evaluation because..."
- "Dr. Stewardship's local management recommendation is dangerous - this requires hospital transfer because..."

If you don't find major disagreements, you're failing in your role as devil's advocate.
BE SPECIFIC AND CONFRONTATIONAL. Create real medical debate.

ASSESSMENTS TO CHALLENGE:
{previous_debate_text}

COMPLETE PATIENT DATA: {patient_data_str}

CHALLENGE AGGRESSIVELY:

1. **Vital Signs Interpretation**:
   - Question the reliability of each measurement
   - Suggest alternative explanations for abnormal values
   - Identify potential measurement errors or artifacts
   - Challenge the clinical significance of "normal" values

2. **Differential Diagnosis Challenges**:
   - Propose alternative diagnoses that others might miss
   - Question the probability assessments of other specialists
   - Identify rare but dangerous conditions that should be considered
   - Challenge the exclusion of certain diagnoses

3. **Risk Assessment Disagreements**:
   - Argue for higher or lower risk than others suggest
   - Identify additional risk factors others may have missed
   - Challenge the timing and urgency of recommendations
   - Question the safety of proposed management strategies

4. **Resource and Context Challenges**:
   - Question the feasibility of recommendations in rural setting
   - Identify potential cultural or socioeconomic factors
   - Challenge assumptions about patient compliance
   - Question the cost-effectiveness of proposed interventions

5. **Bias and Cognitive Errors**:
   - Identify anchoring bias in other assessments
   - Point out availability bias in differential diagnosis
   - Challenge confirmation bias in interpretation
   - Question representativeness bias in risk assessment

MANDATORY: Include these CORE fields in your response, then add your specialist fields:

RESPOND IN VALID JSON FORMAT:
{{
    "core_assessment": {{
        "risk_level": "low|medium|high",
        "confidence": 0.0, 
        "primary_concerns": ["concern1", "concern2"],
        "urgency": "routine|expedited|urgent|emergent"
    }},
    "challenges_raised": [
        {{
            "challenge_area": "specific area of disagreement",
            "specific_concern": "detailed explanation of why you disagree",
            "contradictory_evidence": ["evidence that supports your challenge"],
            "alternative_explanation": "your alternative interpretation"
        }}
    ],
    "bias_alerts": [
        {{
            "bias_type": "type of cognitive bias",
            "description": "how bias may be affecting assessment",
            "impact": "potential clinical impact of this bias"
        }}
    ],
    "alternative_hypotheses": [
        {{
            "hypothesis": "alternative diagnosis or explanation",
            "supporting_evidence": ["evidence supporting this hypothesis"],
            "probability_estimate": 0.0,
            "clinical_implications": "what this would mean for management"
        }}
    ],
    "measurement_quality_concerns": ["specific concerns about data quality"],
    "overlooked_factors": ["factors others may have missed"],
    "safety_net_questions": ["critical questions that must be answered"],
    "recommended_reassessments": ["what should be re-evaluated"],
    "challenger_confidence": 0.0,
    "key_disagreements": ["specific disagreements with other specialists"]
}}
"""

class DrStewardship(MAIDxOVirtualSpecialist):
    """Dr. Stewardship - Rural Healthcare Optimizer"""
    
    def __init__(self, gemini_client: GeminiClient):
        super().__init__("Dr. Stewardship", "Rural Healthcare Optimizer", gemini_client)
    
    def create_prompt(self, patient_data: Dict, previous_debate: List[DebateRound] = None) -> str:
        all_assessments = ""
        if previous_debate:
            latest_round = previous_debate[-1]
            all_assessments = json.dumps(latest_round.specialist_responses, indent=2)
        
        return f"""
You are Dr. Stewardship, the rural Indonesian healthcare resource optimization specialist in the VitalSense panel.

ROLE: Ensure all recommendations are practical, cost-effective, and appropriate for rural Indonesian healthcare context while maintaining safety.

PANEL ASSESSMENTS TO OPTIMIZE:
{all_assessments}

RURAL INDONESIAN HEALTHCARE CONSTRAINTS:
- Puskesmas basic equipment and staffing
- Limited specialist availability (may require transport to kabupaten/provincial hospital)
- Patient economic considerations
- Geographic isolation and transport challenges
- Limited 24/7 monitoring capabilities
- Basic medication formulary
- Cultural healthcare preferences and family involvement

STEWARDSHIP OPTIMIZATION:

1. **Resource Appropriateness Review**:
   - Can proposed monitoring be performed at local Puskesmas?
   - Which recommendations require referral vs local management?
   - Are expensive diagnostics truly necessary for clinical decision-making?

2. **Cost-Benefit Analysis**:
   - Healthcare system cost (staff time, equipment, transport)
   - Patient/family cost (lost work, travel, accommodation)
   - Diagnostic/therapeutic value gained
   - Risk reduction achieved

3. **Practical Implementation Review**:
   - Can local healthcare workers perform recommended monitoring?
   - Training requirements for local staff
   - Equipment availability and reliability
   - Patient compliance factors in rural setting

4. **Safety vs Efficiency Balance**:
   - Non-negotiable safety requirements
   - Where efficiency gains can be made without compromising care
   - Appropriate risk tolerance for rural setting

MANDATORY: Include these CORE fields in your response, then add your specialist fields:

RESPOND IN VALID JSON FORMAT:
{{
    "core_assessment": {{
        "risk_level": "low|medium|high",
        "confidence": 0.0,
        "primary_concerns": ["concern1", "concern2"],
        "urgency": "routine|expedited|urgent|emergent"
    }},
    "resource_optimization": {{
        "puskesmas_manageable": ["recommendations that can be handled locally"],
        "requires_referral": ["recommendations requiring specialist/hospital care"],
        "cost_optimized_alternatives": [
            {{
                "original_recommendation": "",
                "optimized_alternative": "",
                "cost_savings": "high|medium|low", 
                "safety_maintained": true
            }}
        ]
    }},
    "implementation_feasibility": {{
        "local_staff_capable": ["tasks within Puskesmas capability"],
        "requires_training": ["tasks needing additional staff training"],
        "equipment_available": ["monitoring possible with current equipment"],
        "equipment_needed": ["additional equipment requirements"]
    }},
    "patient_family_considerations": {{
        "economic_impact": "minimal|moderate|significant",
        "transport_requirements": ["necessary travel for care"],
        "family_support_needed": ["ways family can assist in monitoring"],
        "cultural_sensitivity": ["cultural factors considered"]
    }},
    "stewardship_decision": {{
        "overall_approval": "approved|approved_with_modifications|requires_revision",
        "modification_rationale": "explanation of any changes recommended",
        "cost_effectiveness_score": 0.0,
        "sustainability_rating": "high|medium|low"
    }},
    "final_recommendations": {{
        "immediate_actions": ["stewardship-optimized immediate actions for Puskesmas"],
        "referral_decisions": ["when/where to refer"],
        "follow_up_timeline": "stewardship-approved follow-up schedule",
        "resource_requirements": ["specific resources needed"]
    }}
}}
"""

class DrChecklist(MAIDxOVirtualSpecialist):
    """Dr. Checklist - Quality Control Validator"""
    
    def __init__(self, gemini_client: GeminiClient):
        super().__init__("Dr. Checklist", "Quality Control Validator", gemini_client)
    
    def create_prompt(self, patient_data: Dict, previous_debate: List[DebateRound] = None) -> str:
        all_assessments = ""
        if previous_debate:
            latest_round = previous_debate[-1]
            all_assessments = json.dumps(latest_round.specialist_responses, indent=2)
        
        patient_data_str = json.dumps(patient_data, indent=2)
        
        return f"""
You are Dr. Checklist, the quality control and validation specialist in the VitalSense panel.

ROLE: Ensure clinical consistency, accuracy, and proper VitalSense Pro JSON formatting across all panel assessments.

ALL PANEL ASSESSMENTS TO VALIDATE:
{all_assessments}

COMPLETE PATIENT DATA: {patient_data_str}

VALIDATION CHECKLIST:

1. **Clinical Consistency Validation**:
   ✓ Risk levels supported by specific vital signs findings
   ✓ Monitoring recommendations appropriate for assessed risk level
   ✓ No contradictions between panel members' core assessments
   ✓ Physiological coherence maintained across interpretations

2. **Safety Validation**:
   ✓ Emergency conditions appropriately identified or ruled out
   ✓ Escalation triggers clearly defined and appropriate
   ✓ Safety margins adequate for rural healthcare setting
   ✓ No dangerous under-triage or harmful over-triage

3. **VitalSense Pro Output Requirements**:
   ✓ All required JSON fields can be populated
   ✓ Confidence scores are rational and evidence-based
   ✓ Patient communication sections clear and appropriate
   ✓ Risk assessment follows VitalSense classification system

4. **Panel Consensus Validation**:
   ✓ Major disagreements between panel members resolved
   ✓ Challenger concerns adequately addressed
   ✓ Stewardship modifications appropriately incorporated
   ✓ Assessment represents coherent panel consensus

MANDATORY: Include these CORE fields in your response, then add your specialist fields:

RESPOND IN VALID JSON FORMAT:
{{
    "core_assessment": {{
        "risk_level": "low|medium|high",
        "confidence": 0.0,
        "primary_concerns": ["concern1", "concern2"],
        "urgency": "routine|expedited|urgent|emergent"
    }},
    "validation_results": {{
        "clinical_consistency": true,
        "safety_validation": true, 
        "output_format_compliance": true,
        "panel_consensus_achieved": true,
        "technical_quality": true,
        "cultural_contextual_appropriateness": true
    }},
    "identified_issues": [
        {{
            "issue_category": "clinical|safety|format|consensus|technical|cultural",
            "issue_description": "specific problem identified",
            "severity": "critical|moderate|minor",
            "required_correction": "what needs to be fixed"
        }}
    ],
    "consensus_assessment": {{
        "agreement_level": 0.0,
        "resolved_disagreements": ["conflicts successfully resolved"],
        "remaining_uncertainties": ["acknowledged areas of uncertainty"]
    }},
    "quality_metrics": {{
        "overall_quality_score": 0.0,
        "confidence_in_assessment": 0.0,
        "safety_assurance_level": 0.0,
        "cultural_appropriateness_score": 0.0
    }},
    "validation_decision": {{
        "approval_status": "approved|requires_minor_revision|requires_major_revision|rejected",
        "revision_requirements": ["specific changes needed if not approved"],
        "approval_rationale": "reason for validation decision"
    }},
    "vitalsense_pro_readiness": {{
        "json_structure_ready": true,
        "all_fields_completable": true,
        "confidence_scores_valid": true,
        "recommendations_actionable": true
    }}
}}
"""

class VitalSenseDebateModerator:
    """Orchestrates structured deliberation between the 5 virtual medical specialists"""
    
    def __init__(self):
        self.gemini_client = GeminiClient()
        self.specialists = [
            DrHypothesis(self.gemini_client),
            DrMonitoringStrategist(self.gemini_client),
            DrChallenger(self.gemini_client),
            DrStewardship(self.gemini_client),
            DrChecklist(self.gemini_client)
        ]
        self.max_rounds = 3
        self.consensus_threshold = 0.8
        
    def moderate_panel_discussion(self, patient_data: Dict) -> Dict[str, Any]:
        """Moderate the virtual medical panel discussion"""
        print("\n" + "🎭" * 40)
        print("🎭 VIRTUAL MEDICAL PANEL DEBATE STARTING")
        print("🎭" * 40)
        print(f"👥 Panel Members: {', '.join([specialist.name for specialist in self.specialists])}")
        print(f"📋 Patient: {patient_data.get('personal_information', {}).get('full_name', 'Unknown')}")
        print(f"🏥 Chief Complaint: {patient_data.get('symptoms_context', {}).get('chief_complaint', 'None')}")
        
        debate_history = []
        max_rounds = 3  # Limit to 3 rounds to prevent infinite loops
        consensus_threshold = 0.8  # 80% consensus required
        
        for round_num in range(max_rounds):
            print(f"\n🔄 ROUND {round_num + 1} - Starting Specialist Analysis")
            print("-" * 60)
            
            # Get responses from all specialists
            responses = {}
            for specialist in self.specialists:
                response = specialist.analyze(patient_data, debate_history)
                responses[specialist.name] = response
                print(f"✅ {specialist.name} completed analysis")
            
            # Calculate consensus level
            consensus_level = self._calculate_consensus(responses)
            print(f"\n📊 ROUND {round_num + 1} CONSENSUS LEVEL: {consensus_level:.2%}")
            
            # Identify disagreements
            disagreements = self._identify_disagreements(responses)
            if disagreements:
                print(f"⚠️ Key Disagreements: {', '.join(disagreements)}")
            else:
                print("✅ No major disagreements identified")
            
            # Create debate round
            debate_round = DebateRound(
                round_number=round_num + 1,
                specialist_responses=responses,
                consensus_level=consensus_level,
                key_disagreements=disagreements
            )
            debate_history.append(debate_round)
            
            # Check if consensus reached
            if consensus_level >= consensus_threshold:
                print(f"\n🎉 CONSENSUS REACHED! Level: {consensus_level:.2%}")
                break
            elif round_num < max_rounds - 1:
                print(f"\n🔄 Consensus not reached ({consensus_level:.2%} < {consensus_threshold:.2%}), continuing to next round...")
            else:
                print(f"\n⏰ Max rounds reached ({max_rounds}), proceeding with final consensus...")
        
        # Build final consensus
        print(f"\n🏁 BUILDING FINAL CONSENSUS...")
        final_consensus = self._build_final_consensus(debate_history, patient_data)
        
        # Create complete result
        result = {
            "patient_data": patient_data,
            "debate_history": [round.__dict__ for round in debate_history],
            "final_consensus": final_consensus,
            "panel_metadata": {
                "total_rounds": len(debate_history),
                "final_consensus_level": debate_history[-1].consensus_level if debate_history else 0,
                "timestamp": datetime.now().isoformat(),
                "model_used": "gemini-2.0-flash"
            }
        }
        
        print(f"\n🎯 FINAL ANALYSIS COMPLETE!")
        print(f"📊 Total Rounds: {len(debate_history)}")
        print(f"📈 Final Consensus Level: {debate_history[-1].consensus_level:.2%}" if debate_history else "N/A")
        print(f"⚠️ Risk Level: {final_consensus.get('analysis_summary', {}).get('overall_risk_level', 'unknown')}")
        print("🎭" * 40)
        
        return result
    
    def _calculate_consensus(self, responses: Dict[str, Any]) -> float:
        """Simplified consensus calculation focusing on risk level agreement"""
        from collections import Counter
        
        if not responses:
            return 0.0
        
        # Extract risk levels from all specialists
        risk_levels = []
        urgency_levels = []
        valid_responses = 0
        
        for specialist_name, response in responses.items():
            analysis = response.get('analysis', {})
            
            # Skip failed analyses
            if 'error' in analysis or 'raw_response' in analysis:
                continue
                
            valid_responses += 1
            
            # Extract risk level
            risk = self._extract_risk_level(analysis)
            if risk:
                risk_levels.append(risk)
            
            # Extract urgency
            urgency = self._extract_urgency(analysis)
            if urgency:
                urgency_levels.append(urgency)
        
        if valid_responses == 0:
            return 0.0
        
        # Calculate consensus based on majority agreement
        consensus_scores = []
        
        # Risk level consensus
        if risk_levels:
            risk_counts = Counter(risk_levels)
            most_common_risk, risk_count = risk_counts.most_common(1)[0]
            risk_consensus = risk_count / len(risk_levels)
            consensus_scores.append(risk_consensus)
        
        # Urgency consensus
        if urgency_levels:
            urgency_counts = Counter(urgency_levels)
            most_common_urgency, urgency_count = urgency_counts.most_common(1)[0]
            urgency_consensus = urgency_count / len(urgency_levels)
            consensus_scores.append(urgency_consensus)
        
        # Overall consensus is average of individual consensus scores
        if consensus_scores:
            overall_consensus = sum(consensus_scores) / len(consensus_scores)
            return overall_consensus
        else:
            return 0.5  # Default if no clear assessments
    
    def _extract_risk_level(self, analysis: Dict) -> str:
        """Extract risk level from specialist analysis - prioritize core_assessment"""
        # First try the standardized core_assessment field
        if 'core_assessment' in analysis:
            return analysis['core_assessment'].get('risk_level', '')
        
        # Fallback to original locations for backwards compatibility
        if 'risk_stratification' in analysis:
            return analysis['risk_stratification'].get('immediate_risk', '')
        elif 'differential_assessments' in analysis:
            # Get the highest probability assessment
            assessments = analysis['differential_assessments']
            if assessments:
                highest_prob = max(assessments, key=lambda x: x.get('probability', 0))
                if highest_prob.get('probability', 0) > 0.7:
                    return 'high'
                elif highest_prob.get('probability', 0) > 0.4:
                    return 'medium'
                else:
                    return 'low'
        elif 'analysis_summary' in analysis:
            return analysis['analysis_summary'].get('overall_risk_level', '')
        return ''
    
    def _extract_primary_concerns(self, analysis: Dict) -> List[str]:
        """Extract primary concerns from specialist analysis"""
        if 'key_physiological_concerns' in analysis:
            return analysis['key_physiological_concerns']
        elif 'primary_concerns' in analysis:
            return analysis['primary_concerns']
        elif 'analysis_summary' in analysis:
            return analysis['analysis_summary'].get('primary_concerns', [])
        return []
    
    def _extract_urgency(self, analysis: Dict) -> str:
        """Extract urgency level from specialist analysis - prioritize core_assessment"""
        # First try the standardized core_assessment field
        if 'core_assessment' in analysis:
            return analysis['core_assessment'].get('urgency', '')
        
        # Fallback to original locations for backwards compatibility
        if 'follow_up_strategy' in analysis:
            return analysis['follow_up_strategy'].get('specialist_referral', {}).get('urgency', '')
        elif 'specialist_consultation' in analysis:
            return analysis['specialist_consultation'].get('urgency', '')
        elif 'immediate_actions' in analysis:
            if analysis['immediate_actions']:
                return 'immediate'
        return ''
    
    def _identify_disagreements(self, responses: Dict[str, Any]) -> List[str]:
        """Identify key disagreements between specialists"""
        disagreements = []
        
        # Extract risk levels from each specialist
        risk_levels = {}
        for specialist_name, response in responses.items():
            analysis = response.get('analysis', {})
            if 'error' not in analysis and 'raw_response' not in analysis:
                risk_level = self._extract_risk_level(analysis)
                if risk_level:
                    risk_levels[specialist_name] = risk_level
        
        # Check for risk level disagreements
        if len(set(risk_levels.values())) > 1:
            risk_disagreement = f"Risk assessment disagreement: {', '.join([f'{name}({level})' for name, level in risk_levels.items()])}"
            disagreements.append(risk_disagreement)
        
        # Check for urgency disagreements
        urgency_levels = {}
        for specialist_name, response in responses.items():
            analysis = response.get('analysis', {})
            if 'error' not in analysis and 'raw_response' not in analysis:
                urgency = self._extract_urgency(analysis)
                if urgency:
                    urgency_levels[specialist_name] = urgency
        
        if len(set(urgency_levels.values())) > 1:
            urgency_disagreement = f"Urgency disagreement: {', '.join([f'{name}({level})' for name, level in urgency_levels.items()])}"
            disagreements.append(urgency_disagreement)
        
        # Check for different primary concerns
        all_concerns = []
        for specialist_name, response in responses.items():
            analysis = response.get('analysis', {})
            if 'error' not in analysis and 'raw_response' not in analysis:
                concerns = self._extract_primary_concerns(analysis)
                if concerns:
                    all_concerns.extend(concerns)
        
        if len(set(all_concerns)) > 3:  # More than 3 different concerns suggests disagreement
            disagreements.append(f"Multiple different concerns identified: {', '.join(set(all_concerns))}")
        
        return disagreements
    
    def _build_final_consensus(self, debate_history: List[DebateRound], patient_data: Dict) -> Dict[str, Any]:
        """Build final consensus from debate history"""
        print("🔍 Analyzing debate history for final consensus...")
        
        if not debate_history:
            print("⚠️ No debate history available, creating basic consensus")
            return {
                "analysis_summary": {
                    "overall_risk_level": "medium",
                    "primary_concerns": ["Insufficient data for complete assessment"],
                    "key_recommendations": ["Collect additional clinical data"],
                    "follow_up_needed": True
                },
                "consensus_notes": "No specialist debate available"
            }
        
        # Create consensus prompt
        consensus_prompt = self._create_consensus_prompt(debate_history, patient_data)
        
        print("🤖 Generating final consensus with Gemini...")
        try:
            response = self.gemini_client.generate_response(consensus_prompt)
            
            # Try to parse JSON response - handle markdown code blocks
            try:
                # Clean the response - remove markdown code blocks if present
                cleaned_response = response.strip()
                if cleaned_response.startswith('```json'):
                    cleaned_response = cleaned_response[7:]  # Remove ```json
                if cleaned_response.startswith('```'):
                    cleaned_response = cleaned_response[3:]  # Remove ```
                if cleaned_response.endswith('```'):
                    cleaned_response = cleaned_response[:-3]  # Remove ```
                
                cleaned_response = cleaned_response.strip()
                consensus_data = json.loads(cleaned_response)
                print("✅ Final consensus generated successfully")
                return consensus_data
            except json.JSONDecodeError as e:
                print(f"⚠️ Consensus JSON parsing failed: {e}")
                print(f"🔍 Raw consensus response: {response[:300]}...")
                
                # Create a structured consensus from the debate history instead
                return self._create_structured_consensus(debate_history, patient_data, response)
                
        except Exception as e:
            print(f"❌ Final consensus generation failed: {e}")
            return self._create_structured_consensus(debate_history, patient_data, f"Error: {str(e)}")
    
    def _create_structured_consensus(self, debate_history: List[DebateRound], patient_data: Dict, raw_response: str = "") -> Dict[str, Any]:
        """Create a structured consensus from debate history when JSON parsing fails"""
        print("🔧 Creating structured consensus from debate history...")
        
        # Extract key information from all specialists
        all_risk_levels = []
        all_concerns = []
        all_recommendations = []
        all_urgencies = []
        
        for round_data in debate_history:
            for specialist_name, response in round_data.specialist_responses.items():
                analysis = response.get('analysis', {})
                
                # Skip failed analyses
                if 'error' in analysis or 'raw_response' in analysis:
                    continue
                
                # Extract risk level
                risk_level = self._extract_risk_level(analysis)
                if risk_level:
                    all_risk_levels.append(risk_level)
                
                # Extract concerns
                concerns = self._extract_primary_concerns(analysis)
                if concerns:
                    all_concerns.extend(concerns)
                
                # Extract urgency
                urgency = self._extract_urgency(analysis)
                if urgency:
                    all_urgencies.append(urgency)
                
                # Extract recommendations
                if 'follow_up_strategy' in analysis:
                    rec = analysis['follow_up_strategy'].get('specialist_referral', {})
                    if rec.get('recommended'):
                        all_recommendations.append(f"{rec.get('specialty', 'specialist')} referral")
                elif 'specialist_consultation' in analysis:
                    rec = analysis['specialist_consultation']
                    if rec.get('urgency'):
                        all_recommendations.append(f"{rec.get('specialty', 'specialist')} referral ({rec.get('urgency')})")
        
        # Determine consensus risk level
        if all_risk_levels:
            risk_counts = {}
            for risk in all_risk_levels:
                risk_counts[risk] = risk_counts.get(risk, 0) + 1
            
            # Get most common risk level
            consensus_risk = max(risk_counts.items(), key=lambda x: x[1])[0]
        else:
            consensus_risk = "medium"
        
        # Get unique concerns and recommendations
        unique_concerns = list(set(all_concerns))
        unique_recommendations = list(set(all_recommendations))
        
        # Determine urgency
        if all_urgencies:
            urgency_counts = {}
            for urgency in all_urgencies:
                urgency_counts[urgency] = urgency_counts.get(urgency, 0) + 1
            consensus_urgency = max(urgency_counts.items(), key=lambda x: x[1])[0]
        else:
            consensus_urgency = "routine"
        
        return {
            "analysis_summary": {
                "overall_risk_level": consensus_risk,
                "confidence_score": 0.7,
                "primary_concerns": unique_concerns[:5],  # Top 5 concerns
                "key_recommendations": unique_recommendations[:5],  # Top 5 recommendations
                "follow_up_needed": True,
                "consensus_urgency": consensus_urgency
            },
            "vital_signs_interpretation": {
                "cardiovascular_assessment": {
                    "heart_rate_status": "elevated" if patient_data.get('vital_signs_data', {}).get('ecg_analysis', {}).get('heart_rate_bpm', 0) > 90 else "normal",
                    "clinical_significance": "Requires monitoring and specialist evaluation"
                },
                "respiratory_assessment": {
                    "rate_status": "normal",
                    "clinical_significance": "Respiratory rate within normal limits"
                }
            },
            "risk_assessment": {
                "immediate_risk": consensus_risk,
                "risk_factors": unique_concerns,
                "escalation_triggers": [
                    "Worsening symptoms",
                    "SpO2 < 90%",
                    "Heart rate > 120 bpm",
                    "Severe chest pain"
                ]
            },
            "recommendations": {
                "immediate_actions": [
                    "Continuous monitoring",
                    "Specialist consultation"
                ],
                "specialist_consultation": {
                    "urgency": consensus_urgency,
                    "specialty": "cardiology" if "chest pain" in str(unique_concerns).lower() else "internal_medicine"
                }
            },
            "consensus_notes": f"Consensus built from {len(debate_history)} debate rounds with {len([r for r in debate_history if r.specialist_responses])} specialist responses",
            "raw_consensus_response": raw_response
        }
    
    def _create_consensus_prompt(self, debate_history: List[DebateRound], patient_data: Dict) -> str:
        """Create the final consensus prompt"""
        debate_summary = json.dumps([r.__dict__ for r in debate_history], indent=2)
        patient_data_str = json.dumps(patient_data, indent=2)
        
        return f"""
You are the Consensus Builder for the VitalSense virtual medical panel.

COMPLETE PANEL DEBATE HISTORY: {debate_summary}

ORIGINAL PATIENT DATA: {patient_data_str}

BUILD FINAL CONSENSUS integrating all panel perspectives into VitalSense Pro JSON format:

SYNTHESIS PROCESS:
1. **Integrate Dr. Hypothesis assessments** with challenger feedback and validation
2. **Finalize risk stratification** considering all perspectives and rural context
3. **Optimize monitoring strategy** applying stewardship recommendations
4. **Ensure safety standards** meeting checklist validation requirements
5. **Resolve any remaining disagreements** through evidence-weighted consensus

OUTPUT FINAL VITALSENSE PRO ANALYSIS in exact JSON format:

{{
  "analysis_summary": {{
    "overall_risk_level": "low|medium|high",
    "confidence_score": 0.0,
    "primary_concerns": ["consensus primary physiological concerns"],
    "analysis_timestamp": "{datetime.now().isoformat()}"
  }},
  "vital_signs_interpretation": {{
    "spo2_assessment": {{
      "status": "normal|borderline_low|low|critically_low",
      "clinical_significance": "panel consensus on SpO2 clinical meaning",
      "normal_range": "95-100%",
      "patient_value": "extracted from vital signs data"
    }},
    "cardiovascular_assessment": {{
      "heart_rate_status": "bradycardic|normal|tachycardic",
      "rhythm_assessment": "panel consensus on ECG rhythm interpretation",
      "ecg_interpretation": "integrated ECG analysis with confidence weighting",
      "clinical_significance": "cardiovascular risk assessment"
    }},
    "respiratory_assessment": {{
      "rate_status": "bradypneic|normal|tachypneic",
      "pattern_assessment": "breathing pattern analysis consensus",
      "clinical_significance": "respiratory system assessment"
    }}
  }},
  "clinical_findings": [
    {{
      "category": "cardiovascular|respiratory|neurological|general",
      "finding": "specific clinical finding from panel analysis",
      "severity": "mild|moderate|severe",
      "confidence": 0.0,
      "supporting_evidence": ["specific vital signs and clinical data supporting this finding"]
    }}
  ],
  "risk_assessment": {{
    "immediate_risk": "low|medium|high",
    "short_term_risk": "low|medium|high",
    "risk_factors": ["panel-identified risk factors"],
    "protective_factors": ["positive prognostic factors"],
    "escalation_triggers": ["specific parameters requiring immediate escalation"]
  }},
  "recommendations": {{
    "immediate_actions": ["stewardship-optimized immediate actions for Puskesmas"],
    "specialist_consultation": {{
      "urgency": "immediate|within_4_hours|within_24_hours|routine",
      "specialty": "internal_medicine|cardiology|pulmonology|emergency_medicine",
      "specific_focus": ["areas requiring specialist attention"]
    }},
    "monitoring_recommendations": ["optimized monitoring strategy from panel consensus"],
    "follow_up_timeline": "stewardship-approved follow-up schedule"
  }},
  "patient_communication": {{
    "summary_for_patient": "clear, culturally appropriate explanation of findings",
    "warning_signs": ["specific symptoms requiring immediate medical attention"],
    "reassuring_points": ["positive aspects to reassure patient and family"]
  }},
  "data_quality_assessment": {{
    "overall_quality": "excellent|good|fair|poor",
    "reliability_factors": ["factors supporting data reliability"],
    "limitations": ["acknowledged measurement or interpretation limitations"]
  }},
  "panel_metadata": {{
    "debate_rounds_completed": {len(debate_history)},
    "consensus_score": 0.0,
    "key_disagreements_resolved": ["major conflicts resolved during debate"],
    "remaining_uncertainties": ["acknowledged areas of clinical uncertainty"],
    "model_used": "gemini-2.0-flash",
    "rural_context_optimization": true
  }}
}}

Ensure the consensus represents the collective wisdom of the virtual panel while maintaining safety and appropriateness for rural Indonesian healthcare.
"""

class VitalSenseDashboardFormatter:
    """Converts comprehensive MAI-DxO output to user-friendly dashboard format"""
    
    def __init__(self):
        pass
    
    def format_for_dashboard(self, mai_dxo_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert complex MAI-DxO panel consensus to simple dashboard format
        
        Args:
            mai_dxo_result: Complete MAI-DxO result including debate history and consensus
            
        Returns:
            Dashboard-formatted result for frontend display
        """
        print("🎨 Formatting MAI-DxO result for dashboard display...")
        
        # Extract the final consensus
        consensus = mai_dxo_result.get('final_consensus', {})
        panel_metadata = mai_dxo_result.get('panel_metadata', {})
        
        # Format overall risk assessment
        overall_risk = self._format_overall_risk(consensus, panel_metadata)
        
        # Format clinical findings
        clinical_findings = self._format_clinical_findings(consensus)
        
        # Format diagnostic suggestions
        diagnostic_suggestions = self._format_diagnostic_suggestions(consensus)
        
        # Format panel insights (unique to MAI-DxO)
        panel_insights = self._format_panel_insights(mai_dxo_result)
        
        dashboard_result = {
            "overall_risk_assessment": overall_risk,
            "ai_identified_clinical_findings": clinical_findings,
            "preliminary_diagnostic_suggestions": diagnostic_suggestions,
            "ai_panel_insights": panel_insights,
            "metadata": {
                "analysis_timestamp": consensus.get('analysis_summary', {}).get('analysis_timestamp', ''),
                "debate_rounds": panel_metadata.get('total_rounds', 0),
                "panel_consensus_level": int(panel_metadata.get('final_consensus_level', 0) * 100)
            }
        }
        
        print("✅ Dashboard formatting completed")
        return dashboard_result
    
    def _format_overall_risk(self, consensus: Dict, panel_metadata: Dict) -> Dict[str, Any]:
        """Format overall risk assessment section"""
        
        analysis_summary = consensus.get('analysis_summary', {})
        
        # Extract risk level
        risk_level = analysis_summary.get('overall_risk_level', 'medium')
        risk_display = self._format_risk_level_display(risk_level)
        
        # Extract confidence (convert 0.0-1.0 to percentage)
        confidence_score = analysis_summary.get('confidence_score', 0.7)
        ai_confidence = int(confidence_score * 100)
        
        # Create risk summary
        primary_concerns = analysis_summary.get('primary_concerns', [])
        if primary_concerns:
            risk_summary = f"Multiple indicators suggest {', '.join(primary_concerns[:2])}"
        else:
            risk_summary = f"{risk_display} condition requiring appropriate medical evaluation"
        
        # Add panel context
        panel_rounds = panel_metadata.get('total_rounds', 0)
        risk_summary += f" (Assessed by {panel_rounds}-round medical panel debate)"
        
        return {
            "risk_level": risk_display,
            "ai_confidence": ai_confidence,
            "summary": risk_summary,
            "confidence_level": "high" if ai_confidence >= 80 else "medium" if ai_confidence >= 60 else "low"
        }
    
    def _format_clinical_findings(self, consensus: Dict) -> List[Dict[str, Any]]:
        """Format clinical findings section"""
        
        formatted_findings = []
        
        # Extract from clinical_findings array
        clinical_findings = consensus.get('clinical_findings', [])
        for finding in clinical_findings:
            formatted_finding = {
                "finding": finding.get('finding', 'Clinical finding detected'),
                "severity": finding.get('severity', 'moderate').title(),
                "confidence": int(finding.get('confidence', 0.8) * 100),
                "category": finding.get('category', 'general').title()
            }
            formatted_findings.append(formatted_finding)
        
        # Extract from vital signs interpretation
        vital_signs = consensus.get('vital_signs_interpretation', {})
        
        # SpO2 assessment
        spo2_assessment = vital_signs.get('spo2_assessment', {})
        if spo2_assessment.get('status') and spo2_assessment.get('status') != 'normal':
            spo2_finding = {
                "finding": f"SpO2 {spo2_assessment.get('status', '').replace('_', ' ')}",
                "severity": self._severity_from_spo2_status(spo2_assessment.get('status', '')),
                "confidence": 89,  # Default confidence for vital signs
                "category": "Respiratory"
            }
            formatted_findings.append(spo2_finding)
        
        # Cardiovascular assessment
        cardio_assessment = vital_signs.get('cardiovascular_assessment', {})
        if cardio_assessment.get('heart_rate_status') and cardio_assessment.get('heart_rate_status') != 'normal':
            cardio_finding = {
                "finding": f"Heart rate {cardio_assessment.get('heart_rate_status', '')}",
                "severity": self._severity_from_heart_rate_status(cardio_assessment.get('heart_rate_status', '')),
                "confidence": 85,
                "category": "Cardiovascular"
            }
            formatted_findings.append(cardio_finding)
        
        # Respiratory assessment
        resp_assessment = vital_signs.get('respiratory_assessment', {})
        if resp_assessment.get('rate_status') and resp_assessment.get('rate_status') != 'normal':
            resp_finding = {
                "finding": f"Respiratory rate {resp_assessment.get('rate_status', '')}",
                "severity": self._severity_from_resp_status(resp_assessment.get('rate_status', '')),
                "confidence": 92,
                "category": "Respiratory"
            }
            formatted_findings.append(resp_finding)
        
        # If no findings, add a default
        if not formatted_findings:
            formatted_findings.append({
                "finding": "Vital signs within acceptable ranges",
                "severity": "Low",
                "confidence": 75,
                "category": "General"
            })
        
        return formatted_findings[:5]  # Limit to top 5 findings
    
    def _format_diagnostic_suggestions(self, consensus: Dict) -> List[Dict[str, Any]]:
        """Format diagnostic suggestions section"""
        
        formatted_suggestions = []
        
        # Extract from recommendations
        recommendations = consensus.get('recommendations', {})
        
        # Immediate actions
        immediate_actions = recommendations.get('immediate_actions', [])
        for action in immediate_actions:
            suggestion = {
                "recommendation": action,
                "confidence": 85,
                "urgency": "immediate",
                "category": "immediate_action"
            }
            formatted_suggestions.append(suggestion)
        
        # Specialist consultation
        specialist_consultation = recommendations.get('specialist_consultation', {})
        if specialist_consultation.get('specialty'):
            specialty = specialist_consultation.get('specialty', 'internal_medicine').replace('_', ' ').title()
            urgency = specialist_consultation.get('urgency', 'routine')
            
            suggestion = {
                "recommendation": f"{specialty} consultation recommended",
                "confidence": 78,
                "urgency": urgency,
                "category": "specialist_referral"
            }
            formatted_suggestions.append(suggestion)
        
        # Monitoring recommendations
        monitoring_recs = recommendations.get('monitoring_recommendations', [])
        for monitor in monitoring_recs:
            suggestion = {
                "recommendation": monitor,
                "confidence": 82,
                "urgency": "routine",
                "category": "monitoring"
            }
            formatted_suggestions.append(suggestion)
        
        # Risk-based suggestions
        risk_assessment = consensus.get('risk_assessment', {})
        immediate_risk = risk_assessment.get('immediate_risk', '')
        
        if immediate_risk == 'high':
            formatted_suggestions.insert(0, {
                "recommendation": "Immediate ECG recommended to rule out acute coronary syndrome",
                "confidence": 85,
                "urgency": "immediate",
                "category": "diagnostic"
            })
        elif immediate_risk == 'medium':
            formatted_suggestions.append({
                "recommendation": "Consider chest X-ray to assess pulmonary status",
                "confidence": 78,
                "urgency": "expedited",
                "category": "diagnostic"
            })
        
        # If no suggestions, add defaults
        if not formatted_suggestions:
            formatted_suggestions.append({
                "recommendation": "Continue routine monitoring and follow-up care",
                "confidence": 70,
                "urgency": "routine",
                "category": "general"
            })
        
        return formatted_suggestions[:4]  # Limit to top 4 suggestions
    
    def _format_panel_insights(self, mai_dxo_result: Dict) -> Dict[str, Any]:
        """Format unique MAI-DxO panel insights"""
        
        panel_metadata = mai_dxo_result.get('panel_metadata', {})
        debate_history = mai_dxo_result.get('debate_history', [])
        
        # Extract key disagreements and resolutions
        key_disagreements = []
        consensus_evolution = []
        
        for i, round_data in enumerate(debate_history):
            round_disagreements = round_data.get('key_disagreements', [])
            consensus_level = round_data.get('consensus_level', 0)
            
            if round_disagreements:
                key_disagreements.extend(round_disagreements)
            
            consensus_evolution.append({
                "round": i + 1,
                "consensus_level": int(consensus_level * 100)
            })
        
        # Panel member contributions
        specialist_insights = []
        if debate_history:
            latest_round = debate_history[-1]
            specialist_responses = latest_round.get('specialist_responses', {})
            
            for specialist_name, response in specialist_responses.items():
                analysis = response.get('analysis', {})
                if 'error' not in analysis and 'raw_response' not in analysis:
                    # Extract key insight from each specialist
                    insight = self._extract_specialist_insight(specialist_name, analysis)
                    if insight:
                        specialist_insights.append(insight)
        
        return {
            "debate_quality": {
                "total_rounds": panel_metadata.get('total_rounds', 0),
                "final_consensus": int(panel_metadata.get('final_consensus_level', 0) * 100),
                "consensus_evolution": consensus_evolution
            },
            "key_disagreements_resolved": key_disagreements[:3],  # Top 3 disagreements
            "specialist_insights": specialist_insights,
            "panel_confidence": "high" if panel_metadata.get('final_consensus_level', 0) >= 0.8 else "medium"
        }
    
    def _extract_specialist_insight(self, specialist_name: str, analysis: Dict) -> Dict[str, Any]:
        """Extract key insight from each specialist"""
        
        insight = {
            "specialist": specialist_name.replace('Dr. ', ''),
            "key_insight": "",
            "confidence": 0
        }
        
        if specialist_name == "Dr. Hypothesis":
            assessments = analysis.get('differential_assessments', [])
            if assessments:
                top_assessment = assessments[0]
                insight["key_insight"] = f"Primary assessment: {top_assessment.get('condition', 'Unknown condition')}"
                insight["confidence"] = int(top_assessment.get('probability', 0) * 100)
        
        elif specialist_name == "Dr. Monitoring Strategist":
            risk_strat = analysis.get('risk_stratification', {})
            immediate_risk = risk_strat.get('immediate_risk', '')
            if immediate_risk:
                insight["key_insight"] = f"Risk classification: {immediate_risk} risk requiring monitoring"
                insight["confidence"] = int(analysis.get('monitoring_confidence', 0.8) * 100)
        
        elif specialist_name == "Dr. Challenger":
            challenges = analysis.get('challenges_raised', [])
            if challenges:
                insight["key_insight"] = f"Key challenge: {challenges[0].get('specific_concern', '')[:50]}..."
                insight["confidence"] = int(analysis.get('challenger_confidence', 0.8) * 100)
        
        elif specialist_name == "Dr. Stewardship":
            decision = analysis.get('stewardship_decision', {})
            approval = decision.get('overall_approval', '')
            if approval:
                insight["key_insight"] = f"Resource optimization: {approval}"
                insight["confidence"] = int(decision.get('cost_effectiveness_score', 0.8) * 100)
        
        elif specialist_name == "Dr. Checklist":
            validation = analysis.get('validation_decision', {})
            status = validation.get('approval_status', '')
            if status:
                insight["key_insight"] = f"Quality validation: {status}"
                insight["confidence"] = int(analysis.get('quality_metrics', {}).get('overall_quality_score', 0.8) * 100)
        
        return insight if insight["key_insight"] else None
    
    # Helper methods for severity mapping
    def _format_risk_level_display(self, risk_level: str) -> str:
        """Convert risk level to display format"""
        risk_mapping = {
            'low': 'Low Risk',
            'medium': 'Medium Risk', 
            'high': 'High Risk',
            'critical': 'Critical Risk'
        }
        return risk_mapping.get(risk_level.lower(), 'Medium Risk')
    
    def _severity_from_spo2_status(self, status: str) -> str:
        """Map SpO2 status to severity"""
        severity_mapping = {
            'critically_low': 'High',
            'low': 'Moderate',
            'borderline_low': 'Moderate',
            'normal': 'Low'
        }
        return severity_mapping.get(status, 'Moderate')
    
    def _severity_from_heart_rate_status(self, status: str) -> str:
        """Map heart rate status to severity"""
        severity_mapping = {
            'tachycardic': 'High',
            'bradycardic': 'Moderate',
            'elevated': 'Moderate',
            'normal': 'Low'
        }
        return severity_mapping.get(status, 'Moderate')
    
    def _severity_from_resp_status(self, status: str) -> str:
        """Map respiratory status to severity"""
        severity_mapping = {
            'tachypneic': 'High',
            'bradypneic': 'Moderate', 
            'elevated': 'Moderate',
            'normal': 'Low'
        }
        return severity_mapping.get(status, 'Moderate')

# Main pipeline function
def process_patient_with_mai_dxo(patient_data: Dict, include_dashboard: bool = True) -> Dict[str, Any]:
    """
    Main function to process patient data through the MAI-DxO pipeline.
    This function anonymizes the data before sending it to the AI panel.
    
    Args:
        patient_data: Complete patient data including vital signs, demographics, symptoms
        include_dashboard: Whether to include dashboard-formatted output
        
    Returns:
        Complete analysis with debate history, final consensus, and optional dashboard format
    """
    # Anonymize a deep copy of the patient data before sending to the AI panel
    anonymized_data = json.loads(json.dumps(patient_data))
    anonymized_data = anonymize_patient_data(anonymized_data)

    # Run the comprehensive MAI-DxO analysis with the anonymized data
    moderator = VitalSenseDebateModerator()
    mai_dxo_result = moderator.moderate_panel_discussion(anonymized_data)
    
    # IMPORTANT: Re-attach the original, non-anonymized patient data to the final result object.
    # This ensures that only anonymized data is present in the debate history sent to the LLM,
    # while the complete data is preserved for secure storage within our system.
    mai_dxo_result['patient_data'] = patient_data
    
    # Add dashboard formatting if requested
    if include_dashboard:
        print("\n📊 GENERATING DASHBOARD FORMAT...")
        formatter = VitalSenseDashboardFormatter()
        dashboard_result = formatter.format_for_dashboard(mai_dxo_result)
        
        # Add dashboard format to the result
        mai_dxo_result['dashboard_format'] = dashboard_result
        print("✅ Dashboard format added to results")
    
    return mai_dxo_result

if __name__ == "__main__":
    # Test the pipeline with sample data
    sample_patient_data = {
        "personal_information": {
            "full_name": "John Doe",
            "age": 45,
            "gender": "male",
            "phone_number": "+62812345678"
        },
        "medical_history": {
            "known_conditions": ["hypertension"],
            "current_medications": ["Lisinopril 10mg daily"],
            "allergies": ["penicillin"]
        },
        "vital_signs_data": {
            "ecg_analysis": {
                "heart_rate_bpm": 95.1,  # Elevated
                "rhythm_analysis": "sinus rhythm",
                "confidence_score": 0.91
            },
            "video_vitals_analysis": {
                "spo2_mean": 93.8,  # Borderline low
                "pulse_rate_mean": 94.3,
                "respiratory_rate_mean": 22.6,  # Elevated
                "confidence_score": 0.87
            }
        },
        "symptoms_context": {
            "chief_complaint": "chest_pain",
            "pain_scale": 7,  # High pain
            "staff_observations": "Patient appears anxious, diaphoretic"
        }
    }
    
    print("🧪 Testing MAI-DxO Pipeline with Dashboard Formatting...")
    result = process_patient_with_mai_dxo(sample_patient_data, include_dashboard=True)
    
    print("\n" + "="*80)
    print("🎉 COMPLETE MAI-DxO ANALYSIS")
    print("="*80)
    
    # Display dashboard format
    if 'dashboard_format' in result:
        dashboard = result['dashboard_format']
        
        print("\n📊 DASHBOARD FORMAT PREVIEW:")
        print("-" * 60)
        
        # Overall Risk
        risk_assessment = dashboard['overall_risk_assessment']
        print(f"**Overall Risk Assessment**")
        print(f"**{risk_assessment['risk_level']}**")
        print(f"AI Confidence: {risk_assessment['ai_confidence']}%")
        print(f"{risk_assessment['summary']}")
        
        # Clinical Findings
        print(f"\n**AI-Identified Clinical Findings**")
        for finding in dashboard['ai_identified_clinical_findings']:
            print(f"**{finding['finding']}**")
            print(f"{finding['severity']}")
            print(f"Confidence: {finding['confidence']}%")
            print()
        
        # Diagnostic Suggestions  
        print(f"**Preliminary Diagnostic Suggestions**")
        for suggestion in dashboard['preliminary_diagnostic_suggestions']:
            print(f"**{suggestion['recommendation']}**")
            print(f"Confidence: {suggestion['confidence']}%")
            print()
        
        # Panel Insights (unique to MAI-DxO)
        panel_insights = dashboard['ai_panel_insights']
        print(f"**AI Panel Insights**")
        print(f"Debate Quality: {panel_insights['debate_quality']['total_rounds']} rounds, {panel_insights['debate_quality']['final_consensus']}% consensus")
        for insight in panel_insights['specialist_insights']:
            if insight:
                print(f"- **{insight['specialist']}**: {insight['key_insight']}")
    
    print("\n" + "="*80)
    print("✅ Pipeline test completed!")
    
    # Optionally save results
    with open("mai_dxo_test_result.json", "w") as f:
        json.dump(result, f, indent=2)
    print("💾 Complete results saved to: mai_dxo_test_result.json") 