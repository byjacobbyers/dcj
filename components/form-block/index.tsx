'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import SimpleText from '@/components/simple-text'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { trackEvent } from '@/lib/gtm'

import type { FormBlockFields, FormBlockProps } from '@/types/components/form-block-type'

export default function FormBlock({
  active = true,
  componentIndex = 0,
  anchor,
  content,
}: FormBlockProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState<FormBlockFields>({
    name: '',
    email: '',
    message: '',
    isAnonymous: false,
    website: '',
  })
  const [errors, setErrors] = useState<Partial<FormBlockFields>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<FormBlockFields> = {}

    if (!formData.isAnonymous) {
      if (!formData.name.trim()) newErrors.name = 'Name is required'
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      if (formData.website) {
        setErrors({ message: 'Invalid submission' })
        return
      }

      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.isAnonymous ? undefined : formData.name,
          email: formData.isAnonymous ? undefined : formData.email,
          message: formData.message,
          isAnonymous: formData.isAnonymous,
          website: formData.website,
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        trackEvent('form_submit', { form_name: 'contact', form_type: 'contact' })
        setFormData({
          name: '',
          email: '',
          message: '',
          isAnonymous: false,
          website: '',
        })
        setErrors({})
      } else {
        const errorData = await response.json()
        if (errorData.error === 'Bot detected') {
          setSubmitStatus('error')
          setErrors({ message: 'Bot activity detected. Please try again.' })
        } else {
          setSubmitStatus('error')
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormBlockFields, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (!active) return null

  return (
    <section
      id={anchor || `form-${componentIndex}`}
      className="form-block w-full flex justify-center px-5 py-16 lg:py-24 bg-primary text-primary-foreground"
    >
      <div className="container flex flex-col justify-center">
        <motion.div
          className="w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: componentIndex !== 0 ? 0.5 : 0,
            type: 'spring',
            duration: 1.5,
          }}
        >
          {content ? (
            <div className="content">
              <SimpleText content={content} />
            </div>
          ) : null}

          <div className="bg-background text-foreground shadow-lg p-6 mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-row items-center justify-between border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Send Anonymously?</Label>
                  <p className="text-sm text-muted-foreground">
                    Send your message without revealing your identity
                  </p>
                </div>
                <Switch
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked: boolean) => handleInputChange('isAnonymous', checked)}
                />
              </div>

              {!formData.isAnonymous && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
              )}

              {!formData.isAnonymous && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message here..."
                  className={`min-h-[120px] resize-none ${errors.message ? 'border-red-500' : ''}`}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                />
                {errors.message && (
                  <p className="text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              <input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-md"
                >
                  <p className="text-green-800 text-sm">
                    Thank you! Your message has been sent successfully.
                  </p>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-md"
                >
                  <p className="text-red-800 text-sm">
                    Sorry, there was an error sending your message. Please try again.
                  </p>
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
