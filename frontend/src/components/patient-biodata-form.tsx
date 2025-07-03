"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  patientBiodataSchema,
  type PatientBiodataFormValues,
  commonConditions,
} from "@/lib/schemas/patient-biodata-schema"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

export function PatientBiodataForm({
  defaultValues,
  onSubmitSuccess,
}: { defaultValues?: Partial<PatientBiodataFormValues>; onSubmitSuccess?: (data: PatientBiodataFormValues) => void }) {
  const form = useForm<PatientBiodataFormValues>({
    resolver: zodResolver(patientBiodataSchema),
    defaultValues: {
      age: undefined,
      gender: undefined,
      weightKg: undefined,
      heightCm: undefined,
      currentMedications: "",
      knownMedicalConditions: [],
      otherMedicalCondition: "",
      allergies: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      ...defaultValues,
    },
  })

  function onSubmit(data: PatientBiodataFormValues) {
    console.log(data)
    toast({
      title: "Health Profile Saved!",
      description: "Your information has been securely saved to help provide better care.",
      className: "bg-health-teal text-white",
    })
    if (onSubmitSuccess) {
      onSubmitSuccess(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
            <CardTitle className="text-h3 text-neutral-900">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-body font-medium text-neutral-700">Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 35"
                      className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-body font-medium text-neutral-700">Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weightKg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-body font-medium text-neutral-700">Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 70"
                      className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-body-sm text-neutral-500">
                    For health assessment calculations.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heightCm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-body font-medium text-neutral-700">Height (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 175"
                      className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-body-sm text-neutral-500">
                    For health assessment calculations.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
            <CardTitle className="text-h3 text-neutral-900">Medical History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="currentMedications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-body font-medium text-neutral-700">Current Medications</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List all current medications, including dosage if known (e.g., Lisinopril 10mg daily)"
                      className="min-h-[100px] rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="knownMedicalConditions"
              render={() => (
                <FormItem>
                  <FormLabel className="text-body font-medium text-neutral-700">Known Medical Conditions</FormLabel>
                  <FormDescription className="text-body-sm text-neutral-500">Select all that apply.</FormDescription>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {commonConditions.map((condition) => (
                      <FormField
                        key={condition}
                        control={form.control}
                        name="knownMedicalConditions"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(condition)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), condition])
                                      : field.onChange(field.value?.filter((value) => value !== condition))
                                  }}
                                  className="border-neutral-300 data-[state=checked]:bg-trust-blue data-[state=checked]:border-trust-blue"
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-body-sm text-neutral-700">{condition}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otherMedicalCondition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-body font-medium text-neutral-700">Other Medical Condition(s)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="If not listed above, specify here"
                      className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-body font-medium text-neutral-700">Allergies</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List any known allergies (e.g., Penicillin, Peanuts)"
                      className="min-h-[80px] rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
            <CardTitle className="text-h3 text-neutral-900">Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
            <FormField
              control={form.control}
              name="emergencyContactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-body font-medium text-neutral-700">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., John Doe"
                      className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-body font-medium text-neutral-700">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="e.g., (555) 123-4567"
                      className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContactRelationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-body font-medium text-neutral-700">Relationship</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Spouse, Parent, Friend"
                      className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <CardFooter className="px-0">
          <EnhancedButton type="submit" size="full" className="bg-health-teal hover:bg-teal-600">
            Save Health Profile
          </EnhancedButton>
        </CardFooter>
      </form>
    </Form>
  )
}
