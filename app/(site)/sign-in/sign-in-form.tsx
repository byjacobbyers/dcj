'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  hasAgreedToCurrentVersion,
  normalizeEmail,
  PAYMENT_AMOUNTS,
  PAYMENT_OPTIONS,
  paymentNeedsAmount,
  type PaymentAmount,
  type PaymentMethod,
} from '@/lib/signin'
import { cn } from '@/lib/utils'

type SubmitStatus = 'idle' | 'success' | 'error'
type LookupStatus = 'idle' | 'loading' | 'found' | 'none' | 'error'
type FieldName = 'firstName' | 'lastName' | 'email' | 'guidelines' | 'paymentMethod' | 'amount'
type FormErrors = Partial<Record<FieldName | 'form', string>>
type LookupMatch = { email: string; guidelinesVersion: string | null }

function parseLookupMatches(value: unknown): LookupMatch[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    const email = typeof item?.email === 'string' ? item.email.trim() : ''
    if (!email) return []
    const version = typeof item?.guidelinesVersion === 'string' ? item.guidelinesVersion : null
    return [{ email, guidelinesVersion: version }]
  })
}

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email)
}

export default function SignInForm({ guidelinesVersion }: { guidelinesVersion: string | null }) {
  const emailListId = useId()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [agreedToGuidelines, setAgreedToGuidelines] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('')
  const [amount, setAmount] = useState<PaymentAmount | null>(null)
  const [matches, setMatches] = useState<LookupMatch[]>([])
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>('idle')
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const lastLookupKeyRef = useRef('')
  const lookupRequestIdRef = useRef(0)
  const emailManuallyEditedRef = useRef(false)

  const matchingEmails = matches.map((match) => match.email)
  const currentMatch = matches.find((match) => match.email === normalizeEmail(email))
  const guidelinesUpdatedSinceLastVisit = Boolean(
    currentMatch?.guidelinesVersion &&
      !hasAgreedToCurrentVersion(currentMatch.guidelinesVersion, guidelinesVersion)
  )

  const clearFieldError = (field: FieldName) => {
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }))
  }

  /**
   * Sets the email and, with it, the guidelines box: pre-checked when this
   * person already agreed to the current version, unchecked otherwise.
   */
  const applyEmail = useCallback(
    (value: string, knownMatches: LookupMatch[]) => {
      setEmail(value)
      const match = knownMatches.find((m) => m.email === normalizeEmail(value))
      setAgreedToGuidelines(
        hasAgreedToCurrentVersion(match?.guidelinesVersion ?? null, guidelinesVersion)
      )
    },
    [guidelinesVersion]
  )

  const resetLookupForNameChange = () => {
    lastLookupKeyRef.current = ''
    emailManuallyEditedRef.current = false
    applyEmail('', [])
    setMatches([])
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

        const data = (await response.json()) as { matches?: unknown }
        const found = parseLookupMatches(data.matches)

        if (lookupRequestIdRef.current !== requestId) return

        setMatches(found)
        setLookupStatus(found.length > 0 ? 'found' : 'none')

        if (!emailManuallyEditedRef.current) {
          applyEmail(found.length === 1 ? found[0].email : '', found)
        }
      } catch (error) {
        console.error('[SignInForm] Email lookup failed:', error)
        if (lookupRequestIdRef.current !== requestId) return
        setMatches([])
        setLookupStatus('error')
      }
    },
    [firstName, lastName, applyEmail]
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
    if (!agreedToGuidelines) nextErrors.guidelines = 'Please read the guidelines on the table, then check this box'
    if (!paymentMethod) {
      nextErrors.paymentMethod = 'Select a payment method'
    } else if (paymentNeedsAmount(paymentMethod) && amount === null) {
      nextErrors.amount = 'Choose an amount'
    }

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
          agreedToGuidelines,
          paymentMethod,
          amount: paymentNeedsAmount(paymentMethod) ? amount : null,
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
                  applyEmail(event.target.value, matches)
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
              <div className="flex items-center gap-4">
                <Checkbox
                  id="guidelines"
                  checked={agreedToGuidelines}
                  onCheckedChange={(checked) => {
                    setAgreedToGuidelines(checked === true)
                    clearFieldError('guidelines')
                  }}
                  aria-invalid={errors.guidelines ? true : undefined}
                  className="size-8 [&_svg]:size-6"
                />
                <Label htmlFor="guidelines" className="text-lg 2xl:text-2xl">
                  I have read the jam guidelines
                </Label>
              </div>
              {guidelinesUpdatedSinceLastVisit ? (
                <p className="text-base text-muted-foreground">
                  The guidelines were updated since your last visit. Please read the new copy on the table.
                </p>
              ) : null}
              {errors.guidelines ? (
                <p className="text-base text-red-500">{errors.guidelines}</p>
              ) : null}
            </div>

            <div className="space-y-3">
              <Label className="text-lg 2xl:text-2xl">Payment method</Label>
              <div className="grid gap-3 md:grid-cols-3">
                {PAYMENT_OPTIONS.map((option) => {
                  const selected = paymentMethod === option.value
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={selected ? 'default' : 'outline'}
                      aria-pressed={selected}
                      onClick={() => {
                        setPaymentMethod(option.value)
                        if (!paymentNeedsAmount(option.value)) setAmount(null)
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

            {paymentNeedsAmount(paymentMethod) ? (
              <div className="space-y-3">
                <Label className="text-lg 2xl:text-2xl">Amount</Label>
                <div className="grid gap-3 md:grid-cols-3">
                  {PAYMENT_AMOUNTS.map((value) => {
                    const selected = amount === value
                    return (
                      <Button
                        key={value}
                        type="button"
                        variant={selected ? 'default' : 'outline'}
                        aria-pressed={selected}
                        onClick={() => {
                          setAmount(value)
                          clearFieldError('amount')
                        }}
                        className="h-16 text-xl 2xl:text-3xl"
                      >
                        ${value}
                      </Button>
                    )
                  })}
                </div>
                <p className="text-base text-muted-foreground">
                  Paying more helps the jam cover the building.
                </p>
                {errors.amount ? (
                  <p className="text-base text-red-500">{errors.amount}</p>
                ) : null}
              </div>
            ) : null}
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
