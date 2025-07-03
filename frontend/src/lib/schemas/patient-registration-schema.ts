import { z } from "zod"

export const patientRegistrationSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Gender is required" }),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[0-9\s\-()]{10,20}$/, "Invalid phone number format"),
  address: z.string().min(5, "Address must be at least 5 characters"),

  // Medical Information
  weightKg: z.coerce.number().min(1, "Weight must be positive").max(500, "Weight seems too high"),
  heightCm: z.coerce.number().min(30, "Height must be positive").max(300, "Height seems too high"),
  knownMedicalConditions: z.string().optional(),
  allergies: z.string().optional(),

  // Emergency Contact
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z
    .string()
    .min(10, "Enter a valid phone number for emergency contact")
    .regex(/^\+?[0-9\s\-()]{10,20}$/, "Invalid phone number format"),
  emergencyContactRelationship: z.string().min(1, "Relationship to emergency contact is required"),
})

export type PatientRegistrationFormValues = z.infer<typeof patientRegistrationSchema> 