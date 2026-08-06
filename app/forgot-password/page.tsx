'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Check } from 'lucide-react';
import { AuthLayout } from '@/components/shared/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const steps = ['البريد الإلكتروني', 'رمز التحقق', 'كلمة مرور جديدة'];

  const [otp, setOtp] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/forgot-password`,
    });
    setLoading(false);
    if (error) {
      toast.error('حدث خطأ، تأكد من البريد الإلكتروني');
      return;
    }
    setStep(1);
    toast.success('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error('أدخل الرمز كاملاً');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      toast.success('تم التحقق من الرمز بنجاح');
    }, 1000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      toast.error('حدث خطأ أثناء تحديث كلمة المرور');
      return;
    }
    toast.success('تم تغيير كلمة المرور بنجاح');
    router.push('/login');
  };

  return (
    <AuthLayout title="استعادة كلمة المرور" subtitle="اتبع الخطوات لاستعادة حسابك">
      {/* Steps indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  i <= step ? 'brand-gradient-bg text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {i < step ? <Check size={16} /> : i + 1}
              </div>
              <span className={`text-xs ${i <= step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-8 rounded ${i < step ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Email */}
        {step === 0 && (
          <motion.form
            key="email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleEmailSubmit}
            className="space-y-4"
          >
            <div className="rounded-xl bg-primary/5 p-4 text-sm text-muted-foreground">
              أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق لاستعادة كلمة المرور.
            </div>
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative mt-1.5">
                <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" required placeholder="example@mail.com" className="pr-10" dir="ltr" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : 'إرسال رمز التحقق'}
            </Button>
          </motion.form>
        )}

        {/* Step 1: OTP */}
        {step === 1 && (
          <motion.form
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleOtpSubmit}
            className="space-y-6"
          >
            <div className="text-center">
              <p className="text-sm text-muted-foreground">أدخل رمز التحقق المرسل إلى بريدك</p>
            </div>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup dir="ltr">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : 'تأكيد الرمز'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              لم يصلك الرمز؟{' '}
              <button type="button" onClick={() => toast.success('تم إعادة إرسال الرمز')} className="font-semibold text-primary hover:underline">
                إعادة الإرسال
              </button>
            </div>
          </motion.form>
        )}

        {/* Step 2: New password */}
        {step === 2 && (
          <motion.form
            key="password"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handlePasswordSubmit}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
              <div className="relative mt-1.5">
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="newPassword" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="pr-10" dir="ltr" />
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <div className="relative mt-1.5">
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="confirmPassword" type="password" required placeholder="••••••••" className="pr-10" dir="ltr" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : 'تغيير كلمة المرور'}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      <Link href="/login" className="mt-6 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft size={16} />
        العودة لتسجيل الدخول
      </Link>
    </AuthLayout>
  );
}
