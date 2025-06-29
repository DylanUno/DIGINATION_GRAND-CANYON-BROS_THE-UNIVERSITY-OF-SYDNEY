import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold md:text-3xl text-gray-800 mb-6">Help & Instructions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Find answers to common questions and troubleshooting tips.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I start a new analysis?</AccordionTrigger>
              <AccordionContent>
                Navigate to the "New Analysis" section from the sidebar. You will be guided through a multi-step process
                to upload your data and provide necessary information.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What files do I need for the toolkit data upload?</AccordionTrigger>
              <AccordionContent>
                You will need a vital signs data file (typically with a .dat extension) and a header file (typically
                with a .hea extension) from your medical toolkit.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How is my data kept secure?</AccordionTrigger>
              <AccordionContent>
                We use industry-standard security measures to protect your personal and medical information. All data is
                encrypted in transit and at rest.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What if I encounter technical issues?</AccordionTrigger>
              <AccordionContent>
                Please check our troubleshooting guides. If the issue persists, contact our support team via the contact
                information provided on this platform.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mt-6">
            <h3 className="font-semibold text-lg text-gray-700">Video Tutorials</h3>
            <p className="text-gray-600 mt-2">Coming soon: Video guides for common tasks.</p>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold text-lg text-gray-700">Contact Support</h3>
            <p className="text-gray-600 mt-2">
              If you need further assistance, please email support@healthaiplatform.com or call (555) 123-4567.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
