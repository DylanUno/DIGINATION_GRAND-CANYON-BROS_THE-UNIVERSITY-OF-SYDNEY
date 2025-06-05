import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfileSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold md:text-3xl text-gray-800 mb-6">Profile Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Information</CardTitle>
          <CardDescription>Update your personal and medical details.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Patient biodata form (editable version) will be displayed here.</p>
          {/* This would typically show the PatientBiodataForm component with existing data */}
        </CardContent>
      </Card>
    </div>
  )
}
