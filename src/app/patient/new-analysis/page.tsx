import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCheck, UploadCloud, ListChecks, Video, Send } from "lucide-react"

// Placeholder for the multi-step form
export default function NewAnalysisPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold md:text-3xl text-gray-800 mb-6">New Health Analysis</h1>
      <Card>
        <CardHeader>
          <CardTitle>Analysis Submission Workflow</CardTitle>
          <CardDescription>Follow these steps to submit your health data for analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* This will be replaced by a proper multi-step form component */}
          <div className="flex items-center p-4 bg-gray-50 rounded-md">
            <ListChecks className="h-8 w-8 text-primary mr-4" />
            <div>
              <h3 className="font-semibold text-lg">Step 1: Pre-Analysis Instructions</h3>
              <p className="text-sm text-gray-600">Review guidelines and prepare your toolkit.</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-md">
            <UploadCloud className="h-8 w-8 text-primary mr-4" />
            <div>
              <h3 className="font-semibold text-lg">Step 2: Toolkit Data Upload</h3>
              <p className="text-sm text-gray-600">Upload your .dat and .hea files.</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-md">
            <FileCheck className="h-8 w-8 text-primary mr-4" />
            <div>
              <h3 className="font-semibold text-lg">Step 3: Current Symptoms & Context</h3>
              <p className="text-sm text-gray-600">Provide details about your current condition.</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-md">
            <Video className="h-8 w-8 text-primary mr-4" />
            <div>
              <h3 className="font-semibold text-lg">Step 4: Video Recording Options</h3>
              <p className="text-sm text-gray-600">Upload or record a video for respiratory analysis.</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-md">
            <Send className="h-8 w-8 text-primary mr-4" />
            <div>
              <h3 className="font-semibold text-lg">Step 5: Submission & Processing</h3>
              <p className="text-sm text-gray-600">Review your data and submit for AI analysis.</p>
            </div>
          </div>
          <p className="text-center text-gray-500 italic">Detailed forms for each step will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
