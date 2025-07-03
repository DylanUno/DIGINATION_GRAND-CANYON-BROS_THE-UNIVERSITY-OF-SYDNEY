import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display font-bold text-neutral-900">Help & Support</h1>
        <p className="text-body-lg text-neutral-600 mt-2">
          Find answers to common questions and get support for using the VitalSense platform.
        </p>
      </div>

      <Card className="shadow-soft border-neutral-200">
        <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
          <CardTitle className="text-h2 text-neutral-900">Frequently Asked Questions</CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Get quick answers to common questions about health screenings and platform usage.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-neutral-200">
              <AccordionTrigger className="text-body font-medium text-neutral-900 hover:text-trust-blue">
                How do I start a new health screening?
              </AccordionTrigger>
              <AccordionContent className="text-body text-neutral-600">
                Navigate to the "New Screening" section from the sidebar. You will be guided through a step-by-step
                process to upload your vital signs data and provide necessary health information for AI analysis.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-neutral-200">
              <AccordionTrigger className="text-body font-medium text-neutral-900 hover:text-trust-blue">
                What files do I need for the vital signs data upload?
              </AccordionTrigger>
              <AccordionContent className="text-body text-neutral-600">
                You will need ECG data files (typically .dat extension) and header files (.hea extension) from your
                health monitoring toolkit. You'll also provide measurements like heart rate, SpO2, and respiratory rate.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-neutral-200">
              <AccordionTrigger className="text-body font-medium text-neutral-900 hover:text-trust-blue">
                How is my health data kept secure and private?
              </AccordionTrigger>
              <AccordionContent className="text-body text-neutral-600">
                We use industry-standard security measures to protect your personal and medical information. All data is
                encrypted in transit and at rest, and only authorized healthcare professionals can access your
                information.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-neutral-200">
              <AccordionTrigger className="text-body font-medium text-neutral-900 hover:text-trust-blue">
                What happens after I submit my health screening?
              </AccordionTrigger>
              <AccordionContent className="text-body text-neutral-600">
                Our AI system analyzes your data and provides a preliminary risk assessment. If needed, volunteer
                specialists review your case and provide expert guidance and recommendations for your healthcare.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-8 space-y-6">
            <div className="p-6 bg-gradient-to-r from-health-teal/10 to-blue-50 rounded-lg border border-health-teal/20">
              <h3 className="font-semibold text-h3 text-neutral-900 mb-2">Video Tutorials</h3>
              <p className="text-body text-neutral-600">
                Coming soon: Step-by-step video guides for using the health screening platform and understanding your
                results.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-r from-trust-blue/10 to-blue-50 rounded-lg border border-trust-blue/20">
              <h3 className="font-semibold text-h3 text-neutral-900 mb-2">Community Support</h3>
              <p className="text-body text-neutral-600">
                If you need further assistance, please contact our community support team at support@vitalsense.health
                or reach out to your local health center coordinator.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
