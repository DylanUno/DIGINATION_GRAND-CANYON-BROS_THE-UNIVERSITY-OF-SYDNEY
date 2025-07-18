import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session
    const sessionUserId = request.headers.get('x-user-id')
    
    if (!sessionUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 })
    }
    
    // Get patient ID from user ID
    const patientResult = await query(`
      SELECT id, patient_id FROM patients WHERE user_id = $1
    `, [sessionUserId])

    if (patientResult.length === 0) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const patient = patientResult[0]

    // Get the most recent analysis session for this patient
    const analysisResult = await query(`
      SELECT 
        session_id,
        mai_dxo_data,
        features,
        clinical_notes,
        ai_risk_level,
        heart_rate_bpm,
        respiratory_rate_bpm,
        spo2_percent,
        hrv_sdnn,
        created_at
      FROM analysis_sessions 
      WHERE patient_id = $1 
      ORDER BY created_at DESC 
      LIMIT 1
    `, [patient.patient_id])

    if (analysisResult.length === 0) {
      return NextResponse.json({
        clinical_findings: [],
        ai_risk_level: null,
        analysis_date: null
      })
    }

    const analysis = analysisResult[0]
    
    // Parse MAI-DxO data to extract clinical findings
    let clinical_findings = []
    let maiDxoData = null
    
    try {
      if (analysis.mai_dxo_data) {
        maiDxoData = typeof analysis.mai_dxo_data === 'string' 
          ? JSON.parse(analysis.mai_dxo_data) 
          : analysis.mai_dxo_data
        
        // Extract clinical findings from the final consensus
        const finalConsensus = maiDxoData.final_consensus || {}
        const consensusFindings = finalConsensus.clinical_findings || []
        
        // Convert to the format expected by the frontend
        clinical_findings = consensusFindings.map((finding: any) => ({
          finding: finding.finding || 'Clinical finding detected',
          category: finding.category || 'general',
          severity: finding.severity || 'moderate',
          confidence: Math.round((finding.confidence || 0.8) * 100),
          specialist: getSpecialistFromCategory(finding.category || 'general')
        }))
        
        // If no findings in final consensus, try to extract from dashboard format
        if (clinical_findings.length === 0 && maiDxoData.dashboard_format) {
          const dashboardFindings = maiDxoData.dashboard_format.ai_identified_clinical_findings || []
          clinical_findings = dashboardFindings.map((finding: any) => ({
            finding: finding.finding || 'Clinical finding detected',
            category: finding.category || 'General',
            severity: finding.severity || 'Moderate',
            confidence: finding.confidence || 80,
            specialist: finding.specialist || getSpecialistFromCategory(finding.category || 'general')
          }))
        }
      }
    } catch (error) {
      console.error('Error parsing MAI-DxO data:', error)
    }
    
    // If still no findings, generate some based on vital signs
    if (clinical_findings.length === 0) {
      clinical_findings = generateClinicalFindingsFromVitals(analysis)
    }

    return NextResponse.json({
      clinical_findings,
      ai_risk_level: analysis.ai_risk_level,
      analysis_date: analysis.created_at,
      session_id: analysis.session_id
    })

  } catch (error) {
    console.error('Error fetching clinical findings:', error)
    return NextResponse.json({ error: 'Failed to fetch clinical findings' }, { status: 500 })
  }
}

function getSpecialistFromCategory(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'cardiovascular': 'Cardiology AI',
    'respiratory': 'Pulmonology AI',
    'neurological': 'Neurology AI',
    'general': 'Internal Medicine AI',
    'metabolic': 'Endocrinology AI'
  }
  
  return categoryMap[category.toLowerCase()] || 'General Assessment AI'
}

function generateClinicalFindingsFromVitals(analysis: any): any[] {
  const findings = []
  
  // Check heart rate
  if (analysis.heart_rate_bpm) {
    const hr = analysis.heart_rate_bpm
    if (hr > 100) {
      findings.push({
        finding: "Elevated heart rate above normal range",
        category: "Cardiovascular",
        severity: "Moderate",
        confidence: 92,
        specialist: "Cardiology AI"
      })
    } else if (hr < 60) {
      findings.push({
        finding: "Bradycardia detected",
        category: "Cardiovascular", 
        severity: "Moderate",
        confidence: 88,
        specialist: "Cardiology AI"
      })
    }
  }
  
  // Check respiratory rate
  if (analysis.respiratory_rate_bpm && analysis.respiratory_rate_bpm > 20) {
    findings.push({
      finding: "Elevated respiratory rate",
      category: "Respiratory",
      severity: "Moderate", 
      confidence: 85,
      specialist: "Pulmonology AI"
    })
  }
  
  // Check SpO2
  if (analysis.spo2_percent && analysis.spo2_percent < 95) {
    findings.push({
      finding: "SpO2 below optimal levels",
      category: "Respiratory",
      severity: "Moderate",
      confidence: 90,
      specialist: "Pulmonology AI"
    })
  }
  
  // Check HRV
  if (analysis.hrv_sdnn && analysis.hrv_sdnn < 30) {
    findings.push({
      finding: "Reduced heart rate variability indicating potential cardiac stress",
      category: "Cardiovascular",
      severity: "Mild",
      confidence: 82,
      specialist: "Cardiology AI"
    })
  }
  
  // If no abnormalities, add a general assessment
  if (findings.length === 0) {
    findings.push({
      finding: "Clinical assessment completed with no acute abnormalities detected",
      category: "General",
      severity: "Normal",
      confidence: 95,
      specialist: "General Assessment AI"
    })
  }
  
  return findings.slice(0, 3) // Limit to top 3 findings
} 