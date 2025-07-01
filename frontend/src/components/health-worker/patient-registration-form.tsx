"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import {
  patientRegistrationSchema,
  type PatientRegistrationFormValues,
} from "@/lib/schemas/patient-registration-schema"

export function PatientRegistrationForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess?: (data: PatientRegistrationFormValues) => void
}) {
  const form = useForm<PatientRegistrationFormValues>({
    resolver: zodResolver(patientRegistrationSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      gender: undefined,
      phone: "",
      address: "",
      weightKg: undefined,
      heightCm: undefined,
      knownMedicalConditions: "",
      allergies: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
    },
  })

  function onSubmit(data: PatientRegistrationFormValues) {
    console.log("Patient registration data:", data)
    toast({
      title: "Patient Registered Successfully!",
      description: `${data.fullName} has been added to the system.`,
    })
    if (onSubmitSuccess) {
      onSubmitSuccess(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="shadow-soft border-neutral-200">
          <CardHeader>
            <CardTitle className="text-h2 text-neutral-900">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-body font-medium text-neutral-700">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-body font-medium text-neutral-700">Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue" {...field} />
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-body font-medium text-neutral-700">Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+62 812 3456 7890" className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-body font-medium text-neutral-700">Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Jl. Merdeka No. 123, Karimunjawa, Jepara, Jawa Tengah" className="rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-neutral-200">
          <CardHeader>
            <CardTitle className="text-h2 text-neutral-900">Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="weightKg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-body font-medium text-neutral-700">Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="70" className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue" {...field} />
                  </FormControl>
                  <FormDescription className="text-body-sm text-neutral-500">For BMI calculation</FormDescription>
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
                    <Input type="number" placeholder="175" className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue" {...field} />
                  </FormControl>
                  <FormDescription className="text-body-sm text-neutral-500">For BMI calculation</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="knownMedicalConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-body font-medium text-neutral-700">Known Medical Conditions</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List any known medical conditions..." className="rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-body font-medium text-neutral-700">Allergies</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List any known allergies..." className="rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-neutral-200">
          <CardHeader>
            <CardTitle className="text-h2 text-neutral-900">Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="emergencyContactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-body font-medium text-neutral-700">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue" {...field} />
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
                    <Input type="tel" placeholder="+62 812 3456 7890" className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue" {...field} />
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
                    <Input placeholder="Spouse, Parent, Friend, etc." className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="shadow-soft border-neutral-200">
          <CardFooter className="pt-6">
            <EnhancedButton
              type="submit"
              size="xl"
              className="w-full md:w-auto bg-health-teal hover:bg-teal-600"
            >
              Register Patient
            </EnhancedButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
} 