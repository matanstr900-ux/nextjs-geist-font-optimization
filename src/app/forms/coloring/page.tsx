'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ColoringFormData {
  date: string
  employeeName: string
  employeeNumber: string
  itemCode: string
  productionOrder: string
  startTime: string
  endTime: string
  quantity: string
  actionPerformed1: string
  actionPerformed2: string
  signature: string
  notes: string
}

export default function ColoringForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<ColoringFormData>({
    date: new Date().toISOString().split('T')[0],
    employeeName: '',
    employeeNumber: '',
    itemCode: '',
    productionOrder: '',
    startTime: '',
    endTime: '',
    quantity: '',
    actionPerformed1: '',
    actionPerformed2: '',
    signature: '',
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

  const handleInputChange = (field: keyof ColoringFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // Save to localStorage
    const existingData = JSON.parse(localStorage.getItem('coloringData') || '[]')
    const newEntry = {
      ...formData,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    }
    existingData.push(newEntry)
    localStorage.setItem('coloringData', JSON.stringify(existingData))

    // Show success message
    alert('הטופס נשמר בהצלחה!')
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      employeeName: localStorage.getItem('employeeName') || '',
      employeeNumber: localStorage.getItem('employeeNumber') || '',
      itemCode: '',
      productionOrder: '',
      startTime: '',
      endTime: '',
      quantity: '',
      actionPerformed1: '',
      actionPerformed2: '',
      signature: '',
      notes: ''
    })
  }

  const isFormValid = formData.itemCode && formData.productionOrder && 
                     formData.startTime && formData.endTime && formData.quantity

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">צבע</h1>
            <p className="text-gray-600">מעקב פעילות צביעה</p>
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

            {/* Production Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemCode">מק״ט *</Label>
                <Input
                  id="itemCode"
                  placeholder="הכנס מק״ט"
                  value={formData.itemCode}
                  onChange={(e) => handleInputChange('itemCode', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productionOrder">פק״ע *</Label>
                <Input
                  id="productionOrder"
                  placeholder="הכנס מספר פקודת עבודה"
                  value={formData.productionOrder}
                  onChange={(e) => handleInputChange('productionOrder', e.target.value)}
                />
              </div>
            </div>

            {/* Time Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">שעת התחלה *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">שעת סיום *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">כמות *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="הכנס כמות"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="actionPerformed1">פעולה שבוצעה 1</Label>
                <Input
                  id="actionPerformed1"
                  placeholder="תאר את הפעולה הראשונה"
                  value={formData.actionPerformed1}
                  onChange={(e) => handleInputChange('actionPerformed1', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actionPerformed2">פעולה שבוצעה 2</Label>
                <Input
                  id="actionPerformed2"
                  placeholder="תאר את הפעולה השנייה"
                  value={formData.actionPerformed2}
                  onChange={(e) => handleInputChange('actionPerformed2', e.target.value)}
                />
              </div>
            </div>

            {/* Signature */}
            <div className="space-y-2">
              <Label htmlFor="signature">חתימת עובד או ראש צוות</Label>
              <Input
                id="signature"
                placeholder="שם החותם"
                value={formData.signature}
                onChange={(e) => handleInputChange('signature', e.target.value)}
              />
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
