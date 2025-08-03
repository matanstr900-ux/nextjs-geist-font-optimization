'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface InjectionFormData {
  date: string
  employeeName: string
  employeeNumber: string
  shift: '08:00' | '15:00' | ''
  machine: string
  machineType: string
  location: string
  productionOrder: string
  hoursRemaining: string
  quantityRemaining: string
  notes: string
}

export default function InjectionsForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<InjectionFormData>({
    date: new Date().toISOString().split('T')[0],
    employeeName: '',
    employeeNumber: '',
    shift: '',
    machine: '',
    machineType: '',
    location: '',
    productionOrder: '',
    hoursRemaining: '',
    quantityRemaining: '',
    notes: ''
  })

  useEffect(() => {
    // Load employee data from localStorage after component mounts
    const employeeName = localStorage.getItem('employeeName') || ''
    const employeeNumber = localStorage.getItem('employeeNumber') || ''
    setFormData(prev => ({
      ...prev,
      employeeName,
      employeeNumber
    }))
  }, [])

  const handleInputChange = (field: keyof InjectionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // Save to localStorage
    const existingData = JSON.parse(localStorage.getItem('injectionsData') || '[]')
    const newEntry = {
      ...formData,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    }
    existingData.push(newEntry)
    localStorage.setItem('injectionsData', JSON.stringify(existingData))

    // Show success message
    alert('הטופס נשמר בהצלחה!')
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      employeeName: localStorage.getItem('employeeName') || '',
      employeeNumber: localStorage.getItem('employeeNumber') || '',
      shift: '',
      machine: '',
      machineType: '',
      location: '',
      productionOrder: '',
      hoursRemaining: '',
      quantityRemaining: '',
      notes: ''
    })
  }

  const isFormValid = formData.shift && formData.machine && formData.machineType && 
                     formData.location && formData.productionOrder

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">דוח פעילות הזרקות</h1>
            <p className="text-gray-600">מילוי נתוני מכונות הזרקה</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/')}>
            חזרה לדף הראשי
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>פרטי הטופס</CardTitle>
            <CardDescription>אנא מלא את כל השדות הנדרשים</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Employee Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">תאריך</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeName">שם עובד</Label>
                <Input
                  id="employeeName"
                  value={formData.employeeName}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeNumber">מספר עובד</Label>
                <Input
                  id="employeeNumber"
                  value={formData.employeeNumber}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>

            {/* Shift Selection */}
            <div className="space-y-3">
              <Label>משמרת</Label>
              <RadioGroup
                value={formData.shift}
                onValueChange={(value) => handleInputChange('shift', value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="08:00" id="shift-morning" />
                  <Label htmlFor="shift-morning">משמרת בוקר (08:00)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="15:00" id="shift-afternoon" />
                  <Label htmlFor="shift-afternoon">משמרת אחר צהריים (15:00)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Machine Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="machine">מכונה *</Label>
                <Input
                  id="machine"
                  placeholder="הכנס מספר/שם מכונה"
                  value={formData.machine}
                  onChange={(e) => handleInputChange('machine', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="machineType">סוג מכונה *</Label>
                <Input
                  id="machineType"
                  placeholder="הכנס סוג מכונה"
                  value={formData.machineType}
                  onChange={(e) => handleInputChange('machineType', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">מיקום *</Label>
              <Input
                id="location"
                placeholder="הכנס מיקום המכונה"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>

            {/* Production Details */}
            <div className="space-y-2">
              <Label htmlFor="productionOrder">פק"ע *</Label>
              <Input
                id="productionOrder"
                placeholder="הכנס מספר פקודת עבודה"
                value={formData.productionOrder}
                onChange={(e) => handleInputChange('productionOrder', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hoursRemaining">שעות שנותרו לסיום הפק"ע</Label>
                <Input
                  id="hoursRemaining"
                  type="number"
                  placeholder="0"
                  value={formData.hoursRemaining}
                  onChange={(e) => handleInputChange('hoursRemaining', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantityRemaining">כמות שנותרה לסיום הפק"ע</Label>
                <Input
                  id="quantityRemaining"
                  type="number"
                  placeholder="0"
                  value={formData.quantityRemaining}
                  onChange={(e) => handleInputChange('quantityRemaining', e.target.value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">הערות</Label>
              <Textarea
                id="notes"
                placeholder="הערות נוספות..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button 
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="flex-1"
              >
                שמור טופס
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="flex-1"
              >
                ביטול
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
