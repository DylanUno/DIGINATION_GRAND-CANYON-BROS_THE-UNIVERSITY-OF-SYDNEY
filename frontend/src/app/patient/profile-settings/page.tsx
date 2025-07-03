import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Shield, 
  Bell, 
  Save, 
  Edit,
  AlertTriangle,
  Calendar,
  Weight,
  Ruler,
  Activity
} from "lucide-react"

export default function ProfileSettingsPage() {
  const patientData = {
    personalInfo: {
      fullName: "John Doe",
      dateOfBirth: "1979-03-15",
      gender: "Laki-laki",
      phone: "+62 812-3456-7890",
      email: "john.doe@email.com",
      address: "Jl. Kesehatan No. 123, Karimunjawa, Jepara, Jawa Tengah",
      nik: "3320123456789012"
    },
    medicalInfo: {
      weight: 75,
      height: 175,
      bloodType: "O+",
      allergies: "Penisilin, Udang",
      conditions: ["Hipertensi", "Diabetes Tipe 2"],
      medications: "Amlodipine 5mg (1x sehari), Metformin 500mg (2x sehari)"
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Istri",
      phone: "+62 812-3456-7891",
      address: "Sama dengan pasien"
    },
    preferences: {
      notifications: {
        results: true,
        appointments: true,
        medications: false,
        health_tips: true
      },
      privacy: {
        shareWithFamily: true,
        anonymousData: false,
        researchParticipation: true
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-health-teal/10 to-blue-50 rounded-xl p-6 border border-health-teal/20">
        <h1 className="text-display font-bold text-neutral-900">Pengaturan Profil</h1>
        <p className="text-body text-neutral-600 mt-2">
          Kelola informasi pribadi, data medis, dan preferensi akun Anda
        </p>
      </div>

      {/* Personal Information */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
            <User className="h-6 w-6 text-health-teal" />
            Informasi Pribadi
          </CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Data identitas dan kontak utama
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-body font-medium text-neutral-900">
                Nama Lengkap
              </Label>
              <Input
                id="fullName"
                defaultValue={patientData.personalInfo.fullName}
                className="h-12 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nik" className="text-body font-medium text-neutral-900">
                NIK (Nomor Induk Kependudukan)
              </Label>
              <Input
                id="nik"
                defaultValue={patientData.personalInfo.nik}
                className="h-12 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-body font-medium text-neutral-900">
                Tanggal Lahir
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                defaultValue={patientData.personalInfo.dateOfBirth}
                className="h-12 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-body font-medium text-neutral-900">
                Jenis Kelamin
              </Label>
              <Select defaultValue={patientData.personalInfo.gender}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-body font-medium text-neutral-900">
                Nomor Telepon
              </Label>
              <Input
                id="phone"
                defaultValue={patientData.personalInfo.phone}
                className="h-12 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-body font-medium text-neutral-900">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue={patientData.personalInfo.email}
                className="h-12 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="text-body font-medium text-neutral-900">
              Alamat Lengkap
            </Label>
            <Textarea
              id="address"
              defaultValue={patientData.personalInfo.address}
              className="min-h-[100px] border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
            />
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
            <Heart className="h-6 w-6 text-health-teal" />
            Informasi Medis
          </CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Data kesehatan dan riwayat medis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-body font-medium text-neutral-900">
                Berat Badan (kg)
              </Label>
              <div className="relative">
                <Weight className="absolute left-3 top-4 h-4 w-4 text-neutral-500" />
                <Input
                  id="weight"
                  type="number"
                  defaultValue={patientData.medicalInfo.weight}
                  className="pl-10 h-12 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-body font-medium text-neutral-900">
                Tinggi Badan (cm)
              </Label>
              <div className="relative">
                <Ruler className="absolute left-3 top-4 h-4 w-4 text-neutral-500" />
                <Input
                  id="height"
                  type="number"
                  defaultValue={patientData.medicalInfo.height}
                  className="pl-10 h-12 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodType" className="text-body font-medium text-neutral-900">
                Golongan Darah
              </Label>
              <Select defaultValue={patientData.medicalInfo.bloodType}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-body font-medium text-neutral-900">BMI</Label>
              <div className="h-12 flex items-center px-3 bg-neutral-50 border border-neutral-300 rounded-md">
                <span className="text-h3 font-bold text-trust-blue">
                  {(patientData.medicalInfo.weight / Math.pow(patientData.medicalInfo.height / 100, 2)).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="allergies" className="text-body font-medium text-neutral-900">
                Alergi
              </Label>
              <Textarea
                id="allergies"
                placeholder="Masukkan alergi yang Anda miliki (obat, makanan, dll.)"
                defaultValue={patientData.medicalInfo.allergies}
                className="border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-body font-medium text-neutral-900">
                Kondisi Medis Saat Ini
              </Label>
              <div className="flex flex-wrap gap-2">
                {patientData.medicalInfo.conditions.map((condition, index) => (
                  <Badge key={index} variant="outline" className="text-trust-blue border-trust-blue">
                    {condition}
                  </Badge>
                ))}
                <EnhancedButton size="sm" variant="outline">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </EnhancedButton>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medications" className="text-body font-medium text-neutral-900">
                Obat-obatan Saat Ini
              </Label>
              <Textarea
                id="medications"
                placeholder="Masukkan obat yang sedang dikonsumsi beserta dosisnya"
                defaultValue={patientData.medicalInfo.medications}
                className="border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
            <Phone className="h-6 w-6 text-health-teal" />
            Kontak Darurat
          </CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Informasi kontak untuk situasi darurat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emergencyName" className="text-body font-medium text-neutral-900">
                Nama Lengkap
              </Label>
              <Input
                id="emergencyName"
                defaultValue={patientData.emergencyContact.name}
                className="h-12 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyRelationship" className="text-body font-medium text-neutral-900">
                Hubungan
              </Label>
              <Input
                id="emergencyRelationship"
                defaultValue={patientData.emergencyContact.relationship}
                className="h-12 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone" className="text-body font-medium text-neutral-900">
                Nomor Telepon
              </Label>
              <Input
                id="emergencyPhone"
                defaultValue={patientData.emergencyContact.phone}
                className="h-12 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyAddress" className="text-body font-medium text-neutral-900">
                Alamat
              </Label>
              <Input
                id="emergencyAddress"
                defaultValue={patientData.emergencyContact.address}
                className="h-12 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-health-teal" />
            Preferensi Notifikasi
          </CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Atur notifikasi yang ingin Anda terima
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-body font-medium text-neutral-900">Hasil Analisis</Label>
                <p className="text-body-sm text-neutral-600">Notifikasi ketika hasil analisis sudah siap</p>
              </div>
              <Checkbox defaultChecked={patientData.preferences.notifications.results} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-body font-medium text-neutral-900">Janji Temu</Label>
                <p className="text-body-sm text-neutral-600">Pengingat untuk janji temu yang akan datang</p>
              </div>
              <Checkbox defaultChecked={patientData.preferences.notifications.appointments} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-body font-medium text-neutral-900">Pengingat Obat</Label>
                <p className="text-body-sm text-neutral-600">Pengingat untuk minum obat sesuai jadwal</p>
              </div>
              <Checkbox defaultChecked={patientData.preferences.notifications.medications} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-body font-medium text-neutral-900">Tips Kesehatan</Label>
                <p className="text-body-sm text-neutral-600">Informasi dan tips kesehatan terkini</p>
              </div>
              <Checkbox defaultChecked={patientData.preferences.notifications.health_tips} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-health-teal" />
            Pengaturan Privasi
          </CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Kontrol bagaimana data Anda digunakan dan dibagikan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-body font-medium text-neutral-900">Berbagi dengan Keluarga</Label>
                <p className="text-body-sm text-neutral-600">Izinkan keluarga melihat hasil analisis Anda</p>
              </div>
              <Checkbox defaultChecked={patientData.preferences.privacy.shareWithFamily} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-body font-medium text-neutral-900">Data Anonim</Label>
                <p className="text-body-sm text-neutral-600">Gunakan data Anda untuk statistik anonim</p>
              </div>
              <Checkbox defaultChecked={patientData.preferences.privacy.anonymousData} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-body font-medium text-neutral-900">Partisipasi Penelitian</Label>
                <p className="text-body-sm text-neutral-600">Sertakan data Anda dalam penelitian medis</p>
              </div>
              <Checkbox defaultChecked={patientData.preferences.privacy.researchParticipation} />
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-alert-orange mt-0.5" />
              <div>
                <h4 className="font-semibold text-body text-neutral-900 mb-1">Keamanan Data</h4>
                <p className="text-body-sm text-neutral-700">
                  Semua data Anda dienkripsi dan disimpan dengan standar keamanan tinggi. Kami tidak akan pernah 
                  membagikan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan eksplisit.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-4 justify-center">
        <EnhancedButton variant="outline" size="lg">
          Batal Perubahan
        </EnhancedButton>
        <EnhancedButton size="lg" className="bg-health-teal hover:bg-teal-600">
          <Save className="h-5 w-5 mr-2" />
          Simpan Perubahan
        </EnhancedButton>
      </div>
    </div>
  )
}
