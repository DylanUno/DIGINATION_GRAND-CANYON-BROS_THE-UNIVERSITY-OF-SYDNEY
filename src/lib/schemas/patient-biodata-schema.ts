import { z } from "zod"

const commonConditions = [
  "Hypertension",
  "Diabetes",
  "Asthma",
  "Heart Disease",
  "Arthritis",
  "Depression",
  "Anxiety",
  "COPD",
  "Kidney Disease",
  "Thyroid Disorder",
] as const

export const patientBiodataSchema = z.object({
  age: z.coerce.number().min(18, "Must be 18 or older").max(120, "Age seems too high"),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Gender is required" }),
  weightKg: z.coerce.number().min(1, "Weight must be positive").max(500, "Weight seems too high"),
  heightCm: z.coerce.number().min(30, "Height must be positive").max(300, "Height seems too high"),
  currentMedications: z.string().optional(),
  knownMedicalConditions: z.array(z.enum(commonConditions)).optional(),
  otherMedicalCondition: z.string().optional(),
  allergies: z.string().optional(),
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z
    .string()
    .min(10, "Enter a valid phone number for emergency contact")
    .regex(/^\+?[0-9\s\-()]{10,20}$/, "Invalid phone number format"),
  emergencyContactRelationship: z.string().min(1, "Relationship to emergency contact is required"),
})

export type PatientBiodataFormValues = z.infer<typeof patientBiodataSchema>
export { commonConditions }
