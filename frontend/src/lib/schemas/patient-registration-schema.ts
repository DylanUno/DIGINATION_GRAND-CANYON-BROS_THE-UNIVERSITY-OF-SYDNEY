import { z } from "zod"

export const patientRegistrationSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select a gender",
  }),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),

  // Medical Information
  weightKg: z.coerce
    .number()
    .min(1, "Weight must be greater than 0")
    .max(500, "Weight must be realistic")
    .optional(),
  heightCm: z.coerce
    .number()
    .min(30, "Height must be greater than 30cm")
    .max(300, "Height must be realistic")
    .optional(),
  knownMedicalConditions: z.string().optional(),
  allergies: z.string().optional(),

  // Emergency Contact
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone is required"),
  emergencyContactRelationship: z.string().min(1, "Relationship is required"),
})

export type PatientRegistrationFormValues = z.infer<typeof patientRegistrationSchema> 