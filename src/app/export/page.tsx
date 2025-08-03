'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ExportData {
  injections: any[]
  assemblies: any[]
  coloring: any[]
  filling: any[]
}

export default function ExportPage() {
  const router = useRouter()
  const [data, setData] = useState<ExportData>({
    injections: [],
    assemblies: [],
    coloring: [],
    filling: []
  })

  useEffect(() => {
    // Load all data from localStorage
    const injectionsData = JSON.parse(localStorage.getItem('injectionsData') || '[]')
    const assembliesData = JSON.parse(localStorage.getItem('assembliesData') || '[]')
    const coloringData = JSON.parse(localStorage.getItem('coloringData') || '[]')
    const fillingData = JSON.parse(localStorage.getItem('fillingData') || '[]')

    setData({
      injections: injectionsData,
      assemblies: assembliesData,
      coloring: coloringData,
      filling: fillingData
    })
  }, [])

  const exportToCSV = (dataArray: any[], filename: string) => {
    if (dataArray.length === 0) {
      alert('אין נתונים לייצוא עבור קטגוריה זו')
      return
    }

    // Get headers from the first object
    const headers = Object.keys(dataArray[0]).filter(key => key !== 'id')
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...dataArray.map(row => 
        headers.map(header => {
          const value = row[header] || ''
          // Escape commas and quotes in values
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value
        }).join(',')
      )
    ].join('\n')

    // Create and download file
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportAllData = () => {
    const allData = [
      ...data.injections.map(item => ({ ...item, category: 'הזרקות' })),
      ...data.assemblies.map(item => ({ ...item, category: 'הרכבות' })),
      ...data.coloring.map(item => ({ ...item, category: 'צבע' })),
      ...data.filling.map(item => ({ ...item, category: 'מילוי' }))
    ]

    if (allData.length === 0) {
      alert('אין נתונים לייצוא')
      return
    }

    exportToCSV(allData, 'כל_הנתונים_מעקב_עובדים')
  }

  const clearAllData = () => {
    if (confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו לא ניתנת לביטול.')) {
      localStorage.removeItem('injectionsData')
      localStorage.removeItem('assembliesData')
      localStorage.removeItem('coloringData')
      localStorage.removeItem('fillingData')
      
      setData({
        injections: [],
        assemblies: [],
        coloring: [],
        filling: []
      })
      
      alert('כל הנתונים נמחקו בהצלחה')
    }
  }

  const totalEntries = data.injections.length + data.assemblies.length + 
                      data.coloring.length + data.filling.length

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">יצוא נתונים</h1>
            <p className="text-gray-600">הורדה וניהול נתוני מעקב העובדים</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/')}>
            חזרה לדף הראשי
          </Button>
        </div>

        {/* Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>סיכום נתונים</CardTitle>
            <CardDescription>סך הכל {totalEntries} רשומות נשמרו במערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{data.injections.length}</div>
                <div className="text-sm text-gray-600">הזרקות</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{data.assemblies.length}</div>
                <div className="text-sm text-gray-600">הרכבות</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{data.coloring.length}</div>
                <div className="text-sm text-gray-600">צבע</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{data.filling.length}</div>
                <div className="text-sm text-gray-600">מילוי</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>יצוא נתונים</CardTitle>
              <CardDescription>הורדת הנתונים כקבצי CSV</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={exportAllData}
                className="w-full"
                disabled={totalEntries === 0}
              >
                יצוא כל הנתונים
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => exportToCSV(data.injections, 'הזרקות')}
                  disabled={data.injections.length === 0}
                  className="text-sm"
                >
                  הזרקות ({data.injections.length})
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => exportToCSV(data.assemblies, 'הרכבות')}
                  disabled={data.assemblies.length === 0}
                  className="text-sm"
                >
                  הרכבות ({data.assemblies.length})
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => exportToCSV(data.coloring, 'צבע')}
                  disabled={data.coloring.length === 0}
                  className="text-sm"
                >
                  צבע ({data.coloring.length})
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => exportToCSV(data.filling, 'מילוי')}
                  disabled={data.filling.length === 0}
                  className="text-sm"
                >
                  מילוי ({data.filling.length})
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ניהול נתונים</CardTitle>
              <CardDescription>פעולות ניהול על הנתונים השמורים</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">הוראות העלאה לגוגל דרייב:</h4>
                <ol className="text-sm text-yellow-700 space-y-1">
                  <li>1. לחץ על "יצוא כל הנתונים"</li>
                  <li>2. פתח את גוגל דרייב</li>
                  <li>3. העלה את הקובץ שהורד</li>
                  <li>4. שתף את הקובץ עם המנהלים</li>
                </ol>
              </div>
              
              <Button 
                variant="destructive" 
                onClick={clearAllData}
                disabled={totalEntries === 0}
                className="w-full"
              >
                מחק את כל הנתונים
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Entries Preview */}
        {totalEntries > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>רשומות אחרונות</CardTitle>
              <CardDescription>תצוגה מקדימה של הרשומות האחרונות</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {[...data.injections, ...data.assemblies, ...data.coloring, ...data.filling]
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 10)
                  .map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{entry.employeeName}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(entry.timestamp).toLocaleString('he-IL')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {entry.category || 
                           (data.injections.includes(entry) ? 'הזרקות' :
                            data.assemblies.includes(entry) ? 'הרכבות' :
                            data.coloring.includes(entry) ? 'צבע' : 'מילוי')}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
