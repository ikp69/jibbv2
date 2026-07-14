"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, MapPin, Clock, Users, Globe, Building2,
  Mail, Phone, Send, CheckCircle, AlertCircle, Sparkles, ArrowLeft
} from 'lucide-react'
import { EventData } from '@/lib/eventsData'
import { Input, Textarea } from '@/components/ui/input'
import { AnimatedButton } from '@/components/ui/AnimatedButton'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { submitExhibitionInquiry } from '@/app/actions/exhibition'
import { isValidPhone, PHONE_ERROR } from '@/app/lib/validation/phone'

interface Props {
  event: EventData
  locale: string
}

export default function EventDetailClientPage({ event, locale }: Props) {
  const t = event[locale as 'en' | 'ja'] || event.en
  const jpFont = locale === 'ja' ? { fontFamily: 'var(--font-noto-sans-jp)' } : {}

  // Translations
  const labels = {
    en: {
      back: 'All Events',
      registerTitle: 'Exhibit in the Japan Pavilion',
      registerDesc: 'Interested in showcasing your technology or services at the Japan Pavilion? Contact us to discuss booth space, government subsidy support, and trade matching opportunities.',
      formTitle: 'Exhibition Inquiry Form',
      name: 'Full Name / Company Name',
      email: 'Corporate Email',
      phone: 'Phone Number',
      message: 'Brief details on what you plan to exhibit',
      submit: 'Submit Exhibit Request',
      submitting: 'Submitting...',
      successTitle: 'Inquiry Submitted!',
      successDesc: 'Thank you for your interest. A representative from JIBB / Japan India Consulting will contact you within 2 business days to discuss your pavilion application.',
      sendAnother: 'Send Another Request',
      benefitsTitle: 'Why Exhibit in the JIBB Japan Pavilion?',
      benefits: [
        'Premium Turnkey Booth Setup with high visual branding',
        'Pre-event B2B partner matchmaking and government liaison support',
        'End-to-end logistics, local coordinator support, and translators',
        'Enhanced visibility and networking sessions with VIP Indian buyers'
      ],
      detailsTitle: 'Exhibition Highlights',
      organizer: 'Organizer',
      format: 'Format',
      venue: 'Venue',
      website: 'Official Website',
      visitWebsite: 'Visit Event Website'
    },
    ja: {
      back: 'イベント一覧へ戻る',
      registerTitle: 'ジャパンパビリオン出展のご案内',
      registerDesc: 'JIBBが主催するジャパンパビリオンへの出展にご興味がありますか？ブーススペースの確保、公的補助金の適用、現地企業とのビジネスマッチング等についてお気軽にご相談ください。',
      formTitle: 'ジャパンパビリオン出展お問合せフォーム',
      name: '担当者名 / 企業名',
      email: '会社用メールアドレス',
      phone: '電話番号',
      message: '出展予定の製品・サービス等の詳細',
      submit: '出展希望・問合せを送信する',
      submitting: '送信中...',
      successTitle: 'お問合せを送信しました！',
      successDesc: 'ジャパンパビリオンへの出展・協賛についてのお問合せを承りました。2営業日以内に担当者より詳細なご案内資料をお送りいたします。',
      sendAnother: '別のお問合せを送信する',
      benefitsTitle: 'ジャパンパビリオンに出展するメリット',
      benefits: [
        '装飾・設営が全て含まれたターンキー・ブースパッケージ',
        '事前ビジネスマッチング支援およびインド政府官公庁との折衝代行',
        '現地の通訳手配、出展・物流における事務局サポート',
        'VIPバイヤーや主要出展者との限定ネットワーキングへの招待'
      ],
      detailsTitle: '開催概要',
      organizer: '主催',
      format: '開催形式',
      venue: '会場',
      website: '公式ウェブサイト',
      visitWebsite: '公式ページを開く'
    }
  }

  const l = labels[locale as 'en' | 'ja']
  const fullEventName = `${t.title} ${t.titleHighlight || ''} ${t.titleEnd || ''}`.trim()
  const defaultMessage = locale === 'ja'
    ? `【${fullEventName}】のジャパンパビリオンにおいて、弊社の【技術・製品名】の出展を検討しています。希望ブース規模は【例：9平米】です。`
    : `We are interested in exhibiting our [insert technology/products] at the Japan Pavilion for ${fullEventName}. Our estimated booth space requirement is [e.g., 9 sqm].`

  // Form State
  const [form, setForm] = useState({
    inquiryType: 'trade', // maps to Trade & Partner Matching Support
    name: '',
    email: '',
    phone: '',
    message: defaultMessage,
    honeypot: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const c = { ...prev }
        delete c[name]
        return c
      })
    }
  }

  const validate = () => {
    const temp: Record<string, string> = {}
    if (!form.name.trim()) temp.name = locale === 'ja' ? 'お名前/企業名は必須です' : 'Full name is required'
    if (!form.email.trim()) {
      temp.email = locale === 'ja' ? 'メールアドレスは必須です' : 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      temp.email = locale === 'ja' ? 'メールアドレスの形式が正しくありません' : 'Invalid email format'
    }
    if (!form.phone.trim()) {
      temp.phone = locale === 'ja' ? '電話番号は必須です' : 'Phone number is required'
    } else if (!isValidPhone(form.phone)) {
      temp.phone = PHONE_ERROR
    }
    if (!form.message.trim()) {
      temp.message = locale === 'ja' ? '出展詳細を入力してください' : 'Message details are required'
    } else if (form.message.trim().length < 10) {
      temp.message = locale === 'ja' ? '出展詳細は10文字以上で入力してください' : 'Message details must be at least 10 characters long'
    }

    setErrors(temp)
    return Object.keys(temp).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setGeneralError(null)

    try {
      const response = await submitExhibitionInquiry({
        eventName: `${t.title} ${t.titleHighlight || ''} ${t.titleEnd || ''}`.trim(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        honeypot: form.honeypot
      })

      if (response.success) {
        setIsSuccess(true)
        setForm({
          inquiryType: 'trade',
          name: '',
          email: '',
          phone: '',
          message: defaultMessage,
          honeypot: ''
        })
      } else {
        setGeneralError(response.error || 'Failed to submit inquiry')
      }
    } catch (err) {
      console.error(err)
      setGeneralError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formContent = (
    <ScrollReveal className="relative rounded-3xl p-6 sm:p-8 bg-card border border-border/80 shadow-jibb-lg overflow-hidden text-left w-full">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            className="absolute inset-0 bg-card/98 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CheckCircle className="size-16 text-emerald-500 mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold text-foreground mb-2" style={jpFont}>
              {l.successTitle}
            </h3>
            <p className="text-sm text-slate-500 max-w-md" style={jpFont}>
              {l.successDesc}
            </p>
            <AnimatedButton
              variant="outline"
              className="mt-6 font-semibold"
              onClick={() => setIsSuccess(false)}
              style={jpFont}
            >
              {l.sendAnother}
            </AnimatedButton>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="space-y-2 mb-6">
        <h3 className="text-2xl font-bold text-foreground tracking-tight" style={jpFont}>
          {l.formTitle}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed" style={jpFont}>
          {l.registerDesc}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {generalError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
            <AlertCircle className="size-5 shrink-0 mt-0.5 text-red-500" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Honeypot field for spam protection */}
        <div className="absolute opacity-0 pointer-events-none -z-10 h-0 w-0 overflow-hidden">
          <input
            type="text"
            name="honeypot"
            tabIndex={-1}
            value={form.honeypot}
            onChange={handleInputChange}
            autoComplete="off"
          />
        </div>

        {/* Selected Event (Read Only) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block" style={jpFont}>
            {locale === 'ja' ? '対象イベント' : 'Inquiry For Event'}
          </label>
          <Input
            type="text"
            value={fullEventName}
            readOnly
            className="focus-visible:ring-slate-200 rounded-xl h-11 text-sm bg-slate-50 dark:bg-slate-800/50 border-slate-200 text-slate-500 cursor-not-allowed"
          />
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block" style={jpFont}>
            {l.name} <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            placeholder="Jane Doe / Acme Corp"
          />
          {errors.name && <span className="text-[10px] text-red-500 font-semibold">{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block" style={jpFont}>
            {l.email} <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            placeholder="corporate@example.com"
          />
          {errors.email && <span className="text-[10px] text-red-500 font-semibold">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block" style={jpFont}>
            {l.phone} <span className="text-red-500">*</span>
          </label>
          <Input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            placeholder="+81 90-1234-5678"
          />
          {errors.phone && <span className="text-[10px] text-red-500 font-semibold">{errors.phone}</span>}
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block" style={jpFont}>
            {l.message} <span className="text-red-500">*</span>
          </label>
          <Textarea
            name="message"
            value={form.message}
            onChange={handleInputChange}
            className={`focus-visible:ring-jibb-orange rounded-xl min-h-[120px] text-sm ${errors.message ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            placeholder={locale === 'ja' ? '出展したい技術分野や、ご希望のブース規模などをご記入ください。' : 'Details on technology/products to showcase...'}
          />
          {errors.message && <span className="text-[10px] text-red-500 font-semibold">{errors.message}</span>}
        </div>

        <div className="pt-2">
          <AnimatedButton
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-jibb-orange text-white font-bold rounded-xl shadow-lg text-sm flex items-center justify-center gap-2"
            style={jpFont}
          >
            {isSubmitting ? l.submitting : l.submit}
            <Send className="size-4" />
          </AnimatedButton>
        </div>
      </form>
    </ScrollReveal>
  )

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300 min-h-screen py-8 pb-12 relative">
      {/* Background radial glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-jibb-indigo/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-jibb-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-jibb-orange transition-colors mb-10 group"
          style={jpFont}
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          {l.back}
        </Link>

        {/* Flat Responsive Layout using CSS Grid/Flex */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Header Block - spans left column on desktop */}
          <div className="w-full lg:col-span-7 text-left mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 dark:bg-white/5 dark:border-white/10 mb-4">
              <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
              <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-white/80">
                {t.tagline}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight" style={jpFont}>
              {t.title} <span className="text-jibb-orange">{t.titleHighlight}</span> {t.titleEnd}
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mt-4">
              {t.subtitle}
            </p>
          </div>

          {/* Poster Card - second on mobile, right column on desktop */}
          <div className="w-full lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-3 lg:sticky lg:top-24 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-jibb overflow-hidden">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 mb-6 border border-slate-100 dark:border-slate-800">
                <Image
                  src={locale === 'ja' ? event.posterJa : event.posterEn}
                  alt={t.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              {/* Quick Details List */}
              <div className="space-y-4 text-left">
                <h4 className="text-base font-bold text-foreground mb-2" style={jpFont}>
                  {l.detailsTitle}
                </h4>

                <div className="flex gap-3 text-sm">
                  <Calendar className="size-4.5 text-jibb-orange shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white" style={jpFont}>{locale === 'ja' ? '開催日程' : 'Dates'}</p>
                    <p className="text-slate-500 dark:text-slate-400">{t.date}</p>
                  </div>
                </div>

                <div className="flex gap-3 text-sm">
                  <MapPin className="size-4.5 text-jibb-orange shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white" style={jpFont}>{l.venue}</p>
                    <p className="text-slate-500 dark:text-slate-400">{t.venue}</p>
                    <p className="text-xs text-slate-400">{t.venueAddress}</p>
                  </div>
                </div>

                {t.organizer && (
                  <div className="flex gap-3 text-sm">
                    <Building2 className="size-4.5 text-jibb-orange shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white" style={jpFont}>{l.organizer}</p>
                      <p className="text-slate-500 dark:text-slate-400">
                        {t.organizer} {t.coOrganizers?.length ? `& ${t.coOrganizers.join(' & ')}` : ''}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 text-sm">
                  <Globe className="size-4.5 text-jibb-orange shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white" style={jpFont}>{l.website}</p>
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-jibb-indigo hover:text-jibb-orange font-semibold hover:underline flex items-center gap-1 mt-0.5 text-xs transition-colors"
                      style={jpFont}
                    >
                      {l.visitWebsite}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Card - third on mobile, left column on desktop */}
          <div className="w-full lg:col-span-7 lg:col-start-1 lg:row-start-2">
            <ScrollReveal className="bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 text-left">
              <h3 className="text-xl font-bold text-foreground mb-4" style={jpFont}>
                {l.benefitsTitle}
              </h3>
              <ul className="space-y-3.5">
                {l.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <CheckCircle className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>

          {/* Inquiry Form Card - fourth (bottom) on mobile, left column on desktop */}
          <div className="w-full lg:col-span-7 lg:col-start-1 lg:row-start-3">
            {formContent}
          </div>
        </div>
      </div>
    </main>
  )
}
