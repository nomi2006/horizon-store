import React, { useState, useEffect } from 'react'
import { Save, RefreshCw } from 'lucide-react'
import { settingsService } from '../../services/settingsService'
import { X } from 'lucide-react'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'


export function SettingsPage() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const { data } = await settingsService.getAll()
      const settingsMap = {}
      data?.forEach(item => {
        settingsMap[item.key] = item.value?.value || ''
      })
      setSettings(settingsMap)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      for (const [key, value] of Object.entries(settings)) {
        await settingsService.set(key, { value })
      }
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  const settingGroups = {
    'Store Information': [
      { key: 'store_name', label: 'Store Name', type: 'text' },
      { key: 'store_email', label: 'Store Email', type: 'email' },
      { key: 'store_phone', label: 'Store Phone', type: 'text' },
      { key: 'store_address', label: 'Store Address', type: 'textarea' }
    ],
    'Shipping Settings': [
      { key: 'shipping_rate', label: 'Shipping Rate ($)', type: 'number' },
      { key: 'shipping_free_threshold', label: 'Free Shipping Threshold ($)', type: 'number' }
    ],
    'Currency & Locale': [
      { key: 'currency', label: 'Currency Code', type: 'text' },
      { key: 'currency_symbol', label: 'Currency Symbol', type: 'text' },
      { key: 'timezone', label: 'Timezone', type: 'text' },
      { key: 'date_format', label: 'Date Format', type: 'text' },
      { key: 'time_format', label: 'Time Format', type: 'select', options: ['12h', '24h'] }
    ],
    'Features': [
      { key: 'enable_coupons', label: 'Enable Coupons', type: 'checkbox' },
      { key: 'enable_wishlist', label: 'Enable Wishlist', type: 'checkbox' },
      { key: 'enable_reviews', label: 'Enable Reviews', type: 'checkbox' }
    ]
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="h-5 w-5" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {Object.entries(settingGroups).map(([groupName, fields]) => (
          <div
            key={groupName}
            className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {groupName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="label">{field.label}</label>
                  {field.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[field.key] === 'true' || settings[field.key] === true}
                        onChange={(e) => handleChange(field.key, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Enabled</span>
                    </label>
                  ) : field.type === 'select' ? (
                    <select
                      value={settings[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="select-field"
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={settings[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="input-field"
                      rows="3"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={settings[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="input-field"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}