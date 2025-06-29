import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { HeartPulse, Stethoscope, BrainCircuit, Users, ArrowRight } from "lucide-react"

export default function LandingPageComponent() {
  return (
    <div className="flex flex-col min-h-dvh bg-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <HeartPulse className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-semibold text-primary">HealthAI</span>
          <span className="sr-only">AI Health Analysis Platform</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button
            asChild
            variant="outline"
            className="border-brand-medical-green text-brand-medical-green hover:bg-brand-medical-green/10 hover:text-brand-medical-green"
          >
            <Link href="/auth/patient/login">Patient Access</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/specialist/login">Specialist Login</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-brand-light-gray">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none text-gray-800">
                    AI-Powered Multi-Modal Health Analysis Platform
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    Bridging rural healthcare with urban medical expertise through intelligent vital sign analysis.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    asChild
                    className="bg-brand-medical-green hover:bg-brand-medical-green/90 text-white"
                  >
                    <Link href="/auth/patient/login">
                      Patient Access
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="default" asChild>
                    {/* Primary blue */}
                    <Link href="/auth/specialist/login">
                      Specialist Login
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="h-[550px] w-[550px] bg-gray-200 rounded-xl mx-auto overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Medical Illustration
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-brand-medical-green/10 px-3 py-1 text-sm text-brand-medical-green font-medium">
                Key Capabilities
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-800">
                Advanced Health Insights, Remotely
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform leverages cutting-edge AI to provide comprehensive health assessments, connecting patients
                with specialists anytime, anywhere.
              </p>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <div className="grid gap-2 p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow">
                <Stethoscope className="h-10 w-10 text-brand-medical-green mb-2" />
                <h3 className="text-xl font-bold text-gray-800">Multi-Modal Vital Sign Analysis</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive analysis of various vital signs from toolkit data to provide a holistic health overview.
                </p>
              </div>
              <div className="grid gap-2 p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow">
                <BrainCircuit className="h-10 w-10 text-brand-medical-green mb-2" />
                <h3 className="text-xl font-bold text-gray-800">AI-Powered Clinical Assessment</h3>
                <p className="text-sm text-gray-600">
                  Intelligent algorithms assess data to identify potential health risks and provide preliminary clinical
                  insights.
                </p>
              </div>
              <div className="grid gap-2 p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow">
                <Users className="h-10 w-10 text-brand-medical-green mb-2" />
                <h3 className="text-xl font-bold text-gray-800">Remote Specialist Consultation</h3>
                <p className="text-sm text-gray-600">
                  Seamlessly connect with medical specialists for expert review and consultation based on the analyzed
                  data.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} HealthAI Platform. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-500">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-500">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
