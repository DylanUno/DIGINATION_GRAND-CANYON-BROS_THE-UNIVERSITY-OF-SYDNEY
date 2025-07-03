import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display font-bold text-neutral-900">Profile Settings</h1>
        <p className="text-body-lg text-neutral-600 mt-2">
          Manage your personal and medical information for better health assessments.
        </p>
      </div>

      <Card className="shadow-soft border-neutral-200">
        <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
          <CardTitle className="text-h2 text-neutral-900">Update Your Health Profile</CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Keep your information current to ensure accurate health screenings and specialist consultations.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-body text-neutral-600">
              Your editable health profile form will be displayed here, allowing you to update your medical information,
              emergency contacts, and health history.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
