import Link from "next/link"
import Image from "next/image"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { FeatureCard } from "@/components/ui/feature-card"
import { StatusIndicator } from "@/components/ui/status-indicator"
import {
  HeartPulse,
  Timer,
  MonitorIcon as Sensors,
  BrainCircuit,
  Clock,
  MapPin,
  Stethoscope,
  Users,
  ArrowRight,
  Shield,
  TrendingUp,
  AlertTriangle,
  Database,
  Building2,
  CheckCircle,
  Eye,
  Lock,
  Zap,
} from "lucide-react"

export default function LandingPageComponent() {
  return (
    <div className="flex flex-col min-h-dvh bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 lg:px-6 h-16 flex items-center border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <Link href="/" className="flex items-center justify-center">
          <div className="feature-icon health mr-3">
            <HeartPulse className="h-6 w-6" />
          </div>
          <span className="text-h2 font-bold text-neutral-900">VitalSense</span>
        </Link>
        <nav className="ml-auto flex gap-2">
          <EnhancedButton asChild variant="ghost" size="sm">
            <Link href="/auth/login/patient">Patient Access</Link>
          </EnhancedButton>
          <EnhancedButton asChild variant="ghost" size="sm">
            <Link href="/auth/login/specialist">Specialist Portal</Link>
          </EnhancedButton>
          <EnhancedButton asChild size="sm">
            <Link href="/auth/login/health-worker">Health Worker Portal</Link>
          </EnhancedButton>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="section-spacing bg-gradient-to-br from-neutral-50 to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="content-spacing animate-fade-in">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-4 py-2 bg-trust-blue/10 text-trust-blue rounded-pill text-body-sm font-medium">
                    <BrainCircuit className="w-4 h-4 mr-2" />
                    AI-Powered Multi-Modal Health Analysis Platform
                  </div>
                  <h1 className="text-display font-bold tracking-tight text-neutral-900">
                    Bringing Specialist-Level Healthcare to Every Corner of{" "}
                    <span className="text-trust-blue">Indonesia's Archipelago</span>
                  </h1>
                  <p className="text-body-lg text-neutral-600 max-w-2xl">
                    Bridging rural healthcare with urban medical expertise through intelligent vital sign analysis,
                    connecting 17,380+ islands and transforming 10,180+ Puskesmas with AI-powered clinical decision
                    support.
                  </p>
                </div>

                {/* Key Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6">
                  <div className="text-center p-4 bg-white/80 rounded-lg border border-neutral-200 shadow-soft">
                    <div className="text-h2 font-bold text-trust-blue">17,380+</div>
                    <div className="text-body-sm text-neutral-600">Islands Served</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-lg border border-neutral-200 shadow-soft">
                    <div className="text-h2 font-bold text-health-teal">10,180+</div>
                    <div className="text-body-sm text-neutral-600">Puskesmas Ready</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-lg border border-neutral-200 shadow-soft">
                    <div className="text-h2 font-bold text-calm-purple">170M+</div>
                    <div className="text-body-sm text-neutral-600">Smartphone Users</div>
                  </div>
                </div>

                {/* Primary Access Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <EnhancedButton size="xl" asChild className="animate-scale-in">
                    <Link href="/auth/login/health-worker">
                      🏥 Health Worker Login
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </EnhancedButton>
                  <EnhancedButton size="xl" variant="secondary" asChild className="bg-calm-purple hover:bg-purple-600">
                    <Link href="/auth/login/specialist">👨‍⚕️ Specialist Portal</Link>
                  </EnhancedButton>
                  <EnhancedButton size="xl" variant="success" asChild>
                    <Link href="/auth/login/patient">👤 Patient Login</Link>
                  </EnhancedButton>
                </div>
              </div>

              <div className="relative animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-br from-trust-blue/20 to-health-teal/20 rounded-2xl blur-3xl"></div>
                <Image
                  src="/placeholder.svg?width=600&height=600"
                  width="600"
                  height="600"
                  alt="AI Health Analysis Platform Dashboard"
                  className="relative mx-auto aspect-square overflow-hidden rounded-2xl object-cover shadow-strong"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Overview Section */}
        <section className="section-spacing bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center content-spacing">
              <h2 className="text-display font-bold text-neutral-900 mb-4">Complete Health Assessment in 8 Minutes</h2>
              <p className="text-body-lg text-neutral-600 max-w-3xl mx-auto">
                Advanced multi-modal analysis combining 5 vital sign modalities with AI-powered clinical decision
                support and specialist validation within 24 hours.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <FeatureCard
                icon={Timer}
                title="8-Minute Complete Health Assessment"
                description="Comprehensive vital sign analysis completed in just 8 minutes, providing immediate preliminary results for healthcare workers."
                category="health"
                badge="Fast"
                className="animate-fade-in"
              />

              <FeatureCard
                icon={Sensors}
                title="5 Vital Sign Modalities"
                description="ECG, PPG, SpO2, Respiratory monitoring, and video-based analysis for comprehensive health evaluation."
                category="specialist"
                badge="Multi-Modal"
                className="animate-fade-in"
              />

              <FeatureCard
                icon={BrainCircuit}
                title="AI-Powered Clinical Decision Support"
                description="Advanced artificial intelligence provides clinical insights and risk assessment to support healthcare decisions."
                category="specialist"
                badge="AI Powered"
                className="animate-fade-in"
              />

              <FeatureCard
                icon={Clock}
                title="Specialist Validation Within 24 Hours"
                description="Expert medical specialists review and validate AI findings within 24 hours for quality assurance."
                category="records"
                className="animate-fade-in"
              />

              <FeatureCard
                icon={MapPin}
                title="Accessible from Rural Health Centers"
                description="Designed specifically for Puskesmas and rural health centers across Indonesia's remote islands."
                category="health"
                className="animate-fade-in"
              />

              <FeatureCard
                icon={Users}
                title="Smartphone-Based Technology"
                description="Leveraging Indonesia's 170M+ smartphone users for accessible health monitoring and telemedicine."
                category="records"
                className="animate-fade-in"
              />
            </div>
          </div>
        </section>

        {/* How It Works Flow */}
        <section className="section-spacing bg-gradient-to-br from-neutral-50 to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="text-center content-spacing">
              <h2 className="text-display font-bold text-neutral-900 mb-4">How It Works</h2>
              <p className="text-body-lg text-neutral-600 max-w-3xl mx-auto mb-12">
                Simple 5-step process from your local Puskesmas to specialist-validated health recommendations.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-5">
              <div className="text-center animate-fade-in">
                <div className="feature-icon health mx-auto mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-h3 font-semibold mb-2">1. Visit Your Local Puskesmas</h3>
                <p className="text-body text-neutral-600">
                  Start your health assessment at any participating rural health center
                </p>
              </div>

              <div className="text-center animate-fade-in">
                <div className="feature-icon specialist mx-auto mb-4">
                  <Timer className="w-6 h-6" />
                </div>
                <h3 className="text-h3 font-semibold mb-2">2. 8-Minute Health Recording</h3>
                <p className="text-body text-neutral-600">
                  Quick capture of vital signs using sensors and video technology
                </p>
              </div>

              <div className="text-center animate-fade-in">
                <div className="feature-icon records mx-auto mb-4">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="text-h3 font-semibold mb-2">3. AI Analysis in Minutes</h3>
                <p className="text-body text-neutral-600">
                  Advanced AI processes your data and provides preliminary health insights
                </p>
              </div>

              <div className="text-center animate-fade-in">
                <div className="feature-icon alert mx-auto mb-4">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-h3 font-semibold mb-2">4. Specialist Review & Validation</h3>
                <p className="text-body text-neutral-600">
                  Medical specialists validate findings and provide professional recommendations
                </p>
              </div>

              <div className="text-center animate-fade-in">
                <div className="feature-icon health mx-auto mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-h3 font-semibold mb-2">5. Receive Results & Recommendations</h3>
                <p className="text-body text-neutral-600">
                  Get comprehensive health report with actionable medical guidance
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact & Quality Statistics */}
        <section className="section-spacing bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center content-spacing">
              <h2 className="text-display font-bold text-neutral-900 mb-4">Proven Impact & Clinical Quality</h2>
              <p className="text-body-lg text-neutral-600 max-w-3xl mx-auto mb-12">
                Real results improving healthcare outcomes across Indonesia's rural communities.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Patient Impact */}
              <div className="space-y-6">
                <h3 className="text-h2 font-semibold text-trust-blue text-center">Patient Impact</h3>
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-health-teal/10 to-blue-50 rounded-lg border border-health-teal/20">
                    <div className="text-h1 font-bold text-health-teal">30%</div>
                    <p className="text-body text-neutral-700">Reduction in Emergency Evacuations</p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-health-teal/10 to-blue-50 rounded-lg border border-health-teal/20">
                    <div className="text-h1 font-bold text-health-teal">$200</div>
                    <p className="text-body text-neutral-700">Average Family Savings per Episode</p>
                  </div>
                </div>
              </div>

              {/* Clinical Quality */}
              <div className="space-y-6">
                <h3 className="text-h2 font-semibold text-calm-purple text-center">Clinical Quality</h3>
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-calm-purple/10 to-blue-50 rounded-lg border border-calm-purple/20">
                    <div className="text-h1 font-bold text-calm-purple">95%</div>
                    <p className="text-body text-neutral-700">Accuracy vs Hospital Equipment</p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-calm-purple/10 to-blue-50 rounded-lg border border-calm-purple/20">
                    <div className="text-h1 font-bold text-calm-purple">96.3%</div>
                    <p className="text-body text-neutral-700">AI-Specialist Agreement Rate</p>
                  </div>
                </div>
              </div>

              {/* System Performance */}
              <div className="space-y-6">
                <h3 className="text-h2 font-semibold text-trust-blue text-center">System Performance</h3>
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-trust-blue/10 to-blue-50 rounded-lg border border-trust-blue/20">
                    <div className="text-h1 font-bold text-trust-blue">2,847+</div>
                    <p className="text-body text-neutral-700">Analyses Completed Today</p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-trust-blue/10 to-blue-50 rounded-lg border border-trust-blue/20">
                    <div className="text-h1 font-bold text-trust-blue">3.2 hrs</div>
                    <p className="text-body text-neutral-700">Average Specialist Response</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Population Health & Research Panel */}
        <section className="section-spacing bg-gradient-to-br from-trust-blue to-calm-purple text-white">
          <div className="container px-4 md:px-6">
            <div className="text-center content-spacing">
              <h2 className="text-display font-bold mb-4">Population Health & Research Impact</h2>
              <p className="text-body-lg opacity-90 max-w-3xl mx-auto mb-12">
                Contributing to Indonesia's national health intelligence and medical research advancement through
                anonymized data insights.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="h-6 w-6 text-warm-amber" />
                  <StatusIndicator status="completed" label="Active" showIcon={false} className="bg-white/20" />
                </div>
                <h3 className="text-h3 font-semibold mb-2">Early Warning System</h3>
                <p className="text-body opacity-90">Disease outbreak detection across archipelago regions</p>
              </div>

              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-6 w-6 text-warm-amber" />
                  <StatusIndicator status="processing" label="Live" showIcon={false} className="bg-white/20" />
                </div>
                <h3 className="text-h3 font-semibold mb-2">Health Trends Dashboard</h3>
                <p className="text-body opacity-90">Regional health statistics and population insights</p>
              </div>

              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="h-6 w-6 text-warm-amber" />
                  <StatusIndicator status="completed" label="Contributing" showIcon={false} className="bg-white/20" />
                </div>
                <h3 className="text-h3 font-semibold mb-2">Research Contributions</h3>
                <p className="text-body opacity-90">Anonymized data advancing medical research</p>
              </div>

              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="h-6 w-6 text-warm-amber" />
                  <StatusIndicator status="completed" label="Integrated" showIcon={false} className="bg-white/20" />
                </div>
                <h3 className="text-h3 font-semibold mb-2">Government Partnership</h3>
                <p className="text-body opacity-90">Ministry of Health integration updates</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Security & Compliance Footer */}
      <footer className="border-t border-neutral-200 bg-gradient-to-r from-neutral-50 to-white py-8">
        <div className="container px-4 md:px-6">
          {/* Security Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-neutral-200 shadow-soft">
              <Shield className="h-4 w-4 text-health-teal" />
              <span className="text-body-sm font-medium text-neutral-700">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-neutral-200 shadow-soft">
              <Lock className="h-4 w-4 text-health-teal" />
              <span className="text-body-sm font-medium text-neutral-700">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-neutral-200 shadow-soft">
              <Eye className="h-4 w-4 text-health-teal" />
              <span className="text-body-sm font-medium text-neutral-700">Audit Trail Active</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-neutral-200 shadow-soft">
              <AlertTriangle className="h-4 w-4 text-health-teal" />
              <span className="text-body-sm font-medium text-neutral-700">Emergency Protocols Ready</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-neutral-200 shadow-soft">
              <Zap className="h-4 w-4 text-health-teal" />
              <span className="text-body-sm font-medium text-neutral-700">99.8% System Uptime</span>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-neutral-200">
            <p className="text-body-sm text-neutral-500">
              &copy; {new Date().getFullYear()} VitalSense AI Health Platform. Transforming Indonesian healthcare.
            </p>
            <nav className="flex gap-6">
              <Link href="#" className="text-body-sm text-neutral-500 hover:text-trust-blue transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-body-sm text-neutral-500 hover:text-trust-blue transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-body-sm text-neutral-500 hover:text-trust-blue transition-colors">
                Security
              </Link>
              <Link href="#" className="text-body-sm text-neutral-500 hover:text-trust-blue transition-colors">
                Support
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
