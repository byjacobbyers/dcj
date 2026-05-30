'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type PaymentMethod = 'cash' | 'card' | 'none'
type SubmitStatus = 'idle' | 'success' | 'error'
type LookupStatus = 'idle' | 'loading' | 'found' | 'none' | 'error'
type FieldName = 'firstName' | 'lastName' | 'email' | 'paymentMethod'
type FormErrors = Partial<Record<FieldName | 'form', string>>

const paymentOptions: Array<{ value: PaymentMethod; label: string }> = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'none', label: 'None' },
]

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email)
}

export default function SignInForm() {
  const emailListId = useId()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('')
  const [matchingEmails, setMatchingEmails] = useState<string[]>([])
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>('idle')
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const lastLookupKeyRef = useRef('')
  const lookupRequestIdRef = useRef(0)
  const emailManuallyEditedRef = useRef(false)

  const clearFieldError = (field: FieldName) => {
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }))
  }

  const resetLookupForNameChange = () => {
    lastLookupKeyRef.current = ''
    emailManuallyEditedRef.current = false
    setEmail('')
    setMatchingEmails([])
    setLookupStatus('idle')
  }

  const handleNameChange = (field: 'firstName' | 'lastName', value: string) => {
    if (field === 'firstName') {
      setFirstName(value)
    } else {
      setLastName(value)
    }

    resetLookupForNameChange()
    clearFieldError(field)
  }

  const lookupEmails = useCallback(
    async (force = false) => {
      const trimmedFirstName = firstName.trim()
      const trimmedLastName = lastName.trim()

      if (!trimmedFirstName || !trimmedLastName) return

      const lookupKey = `${trimmedFirstName.toLowerCase()}:${trimmedLastName.toLowerCase()}`
      if (!force && lastLookupKeyRef.current === lookupKey) return

      lastLookupKeyRef.current = lookupKey
      const requestId = lookupRequestIdRef.current + 1
      lookupRequestIdRef.current = requestId
      setLookupStatus('loading')

      try {
        const response = await fetch('/api/lookup-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
          }),
        })

        if (!response.ok) {
          throw new Error('Email lookup failed')
        }

        const data = (await response.json()) as { emails?: unknown }
        const emails = Array.isArray(data.emails)
          ? data.emails.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
          : []

        if (lookupRequestIdRef.current !== requestId) return

        setMatchingEmails(emails)
        setLookupStatus(emails.length > 0 ? 'found' : 'none')

        if (!emailManuallyEditedRef.current) {
          setEmail(emails.length === 1 ? emails[0] : '')
        }
      } catch (error) {
        console.error('[SignInForm] Email lookup failed:', error)
        if (lookupRequestIdRef.current !== requestId) return
        setMatchingEmails([])
        setLookupStatus('error')
      }
    },
    [firstName, lastName]
  )

  useEffect(() => {
    if (!firstName.trim() || !lastName.trim()) return

    const timeout = window.setTimeout(() => {
      void lookupEmails()
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [firstName, lastName, lookupEmails])

  const validateForm = () => {
    const nextErrors: FormErrors = {}
    const trimmedFirstName = firstName.trim()
    const trimmedLastName = lastName.trim()
    const trimmedEmail = email.trim()

    if (!trimmedFirstName) nextErrors.firstName = 'First name is required'
    if (!trimmedLastName) nextErrors.lastName = 'Last name is required'
    if (!trimmedEmail) {
      nextErrors.email = 'Email is required'
    } else if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address'
    }
    if (!paymentMethod) nextErrors.paymentMethod = 'Select a payment method'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrors({})

    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          paymentMethod,
        }),
      })

      if (!response.ok) {
        throw new Error('Sign-in failed')
      }

      setSubmitStatus('success')
      window.setTimeout(() => {
        window.location.reload()
      }, 3000)
    } catch (error) {
      console.error('[SignInForm] Sign-in failed:', error)
      setSubmitStatus('error')
      setErrors({ form: 'Sorry, sign-in failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-8 text-center md:p-10">
          <div className="space-y-4">
            <p className="font-heading text-h2 text-foreground">Thank you!</p>
            <p className="text-xl text-muted-foreground 2xl:text-2xl">
              You are signed in. This screen will reset for the next person in a few seconds.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <fieldset disabled={isSubmitting} className="space-y-8 disabled:opacity-70">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-lg 2xl:text-2xl">
                  First name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onBlur={() => void lookupEmails(true)}
                  onChange={(event) => handleNameChange('firstName', event.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  className={cn(
                    'h-16 text-xl 2xl:text-3xl',
                    errors.firstName ? 'border-red-500' : ''
                  )}
                />
                {errors.firstName ? (
                  <p className="text-base text-red-500">{errors.firstName}</p>
                ) : null}
              </div>

              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-lg 2xl:text-2xl">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onBlur={() => void lookupEmails(true)}
                  onChange={(event) => handleNameChange('lastName', event.target.value)}
                  placeholder="Last name"
                  autoComplete="family-name"
                  className={cn(
                    'h-16 text-xl 2xl:text-3xl',
                    errors.lastName ? 'border-red-500' : ''
                  )}
                />
                {errors.lastName ? (
                  <p className="text-base text-red-500">{errors.lastName}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <Label htmlFor="email" className="text-lg 2xl:text-2xl">
                  Email
                </Label>
                {lookupStatus === 'loading' ? (
                  <p className="text-base text-muted-foreground">Looking up past emails...</p>
                ) : null}
                {lookupStatus === 'found' && matchingEmails.length === 1 ? (
                  <p className="text-base text-muted-foreground">We found an email from a previous sign-in.</p>
                ) : null}
                {lookupStatus === 'found' && matchingEmails.length > 1 ? (
                  <p className="text-base text-muted-foreground">Choose a previous email or type a new one.</p>
                ) : null}
                {lookupStatus === 'none' ? (
                  <p className="text-base text-muted-foreground">No previous email found.</p>
                ) : null}
                {lookupStatus === 'error' ? (
                  <p className="text-base text-red-500">Email lookup failed. Please type your email.</p>
                ) : null}
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                list={matchingEmails.length > 1 ? emailListId : undefined}
                onChange={(event) => {
                  emailManuallyEditedRef.current = true
                  setEmail(event.target.value)
                  clearFieldError('email')
                }}
                placeholder="you@example.com"
                autoComplete="email"
                className={cn(
                  'h-16 text-xl 2xl:text-3xl',
                  errors.email ? 'border-red-500' : ''
                )}
              />
              {matchingEmails.length > 1 ? (
                <datalist id={emailListId}>
                  {matchingEmails.map((matchedEmail) => (
                    <option key={matchedEmail} value={matchedEmail} />
                  ))}
                </datalist>
              ) : null}
              {errors.email ? (
                <p className="text-base text-red-500">{errors.email}</p>
              ) : null}
            </div>

            <div className="space-y-3">
              <Label className="text-lg 2xl:text-2xl">Payment method</Label>
              <div className="grid gap-3 md:grid-cols-3">
                {paymentOptions.map((option) => {
                  const selected = paymentMethod === option.value
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={selected ? 'default' : 'outline'}
                      aria-pressed={selected}
                      onClick={() => {
                        setPaymentMethod(option.value)
                        clearFieldError('paymentMethod')
                      }}
                      className="h-16 text-xl 2xl:text-3xl"
                    >
                      {option.label}
                    </Button>
                  )
                })}
              </div>
              {errors.paymentMethod ? (
                <p className="text-base text-red-500">{errors.paymentMethod}</p>
              ) : null}
            </div>
          </fieldset>

          {errors.form || submitStatus === 'error' ? (
            <div className="border border-red-200 bg-red-50 p-4 text-red-800">
              <p className="text-base">{errors.form ?? 'Sorry, sign-in failed. Please try again.'}</p>
            </div>
          ) : null}

          <Button type="submit" size="lg" className="min-h-16 w-full text-xl 2xl:text-3xl hover:cursor-pointer hover:text-background" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
