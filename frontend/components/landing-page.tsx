import Link from "next/link"
import Image from "next/image"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Timer, BrainCircuit, Stethoscope, Building2, CheckCircle, ArrowRight, Plus } from "lucide-react"

export default function LandingPageComponent() {
  return (
    <div className="flex flex-col min-h-dvh bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 lg:px-6 h-16 flex items-center border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <Link href="/" className="flex items-center justify-center">
          <div className="feature-icon health mr-3">
            <Plus className="h-6 w-6 rotate-45" />
          </div>
          <span className="text-h2 font-bold text-neutral-900">VitalSense Pro</span>
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
                  <p className="text-body-lg text-neutral-600 mb-4">
                    Bridging rural healthcare with urban medical expertise through intelligent vital sign analysis
                  </p>
                  <h1 className="text-display font-bold tracking-tight text-neutral-900">
                    Bringing Specialist-Level Healthcare to Every Corner of{" "}
                    <span className="text-trust-blue">Indonesia's Archipelago</span>
                  </h1>
                </div>

                {/* Key Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6">
                  <div className="text-center p-4 bg-white/80 rounded-lg border border-neutral-200 shadow-soft">
                    <div className="text-h2 font-bold text-trust-blue">17,380+</div>
                    <div className="text-body-sm text-neutral-600">Islands Served</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-lg border border-neutral-200 shadow-soft">
                    <div className="text-h2 font-bold text-health-teal">10,180+</div>
                    <div className="text-body-sm text-neutral-600">Puskesmas Ready for Transformation</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-lg border border-neutral-200 shadow-soft">
                    <div className="text-h2 font-bold text-calm-purple">170M+</div>
                    <div className="text-body-sm text-neutral-600">Potential Smartphone Users</div>
                  </div>
                </div>

                {/* Three Primary Access Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <EnhancedButton size="xl" asChild className="animate-scale-in">
                    <Link href="/auth/login/health-worker">
                      Health Worker Login
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </EnhancedButton>
                  <EnhancedButton
                    size="xl"
                    variant="secondary"
                    asChild
                    className="bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    <Link href="/auth/login/specialist">Specialist Login</Link>
                  </EnhancedButton>
                  <EnhancedButton size="xl" variant="success" asChild>
                    <Link href="/auth/login/patient">Patient Login</Link>
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

        {/* How It Works Flow */}
        <section className="section-spacing bg-white">
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
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-body-sm text-neutral-500">
              &copy; {new Date().getFullYear()} VitalSense Pro. Transforming Indonesian healthcare.
            </p>
            <nav className="flex gap-6">
              <Link href="#" className="text-body-sm text-neutral-500 hover:text-trust-blue transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-body-sm text-neutral-500 hover:text-trust-blue transition-colors">
                Terms of Service
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
