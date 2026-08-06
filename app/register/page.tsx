'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, Check, Facebook } from 'lucide-react';
import { AuthLayout } from '@/components/shared/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/context/auth-context';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const strength = React.useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthLabels = ['ضعيفة جداً', 'ضعيفة', 'متوسطة', 'جيدة', 'قوية', 'قوية جداً'];
  const strengthColors = ['bg-destructive', 'bg-destructive', 'bg-warning', 'bg-warning', 'bg-success', 'bg-success'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (strength < 2) {
      toast.error('كلمة المرور ضعيفة جداً');
      return;
    }
    const form = e.target as HTMLFormElement;
    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value;
    const lastName = (form.elements.namedItem('lastName') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;

    setLoading(true);
    const { error } = await signUp(email, password, `${firstName} ${lastName}`, phone);
    setLoading(false);
    if (error) {
      if (error.includes('already registered') || error.includes('already been registered')) {
        toast.error('هذا البريد الإلكتروني مسجل بالفعل');
      } else if (error.includes('password')) {
        toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      } else {
        toast.error(error);
      }
      return;
    }
    toast.success('تم إنشاء الحساب بنجاح');
    router.push('/profile');
  };

  return (
    <AuthLayout title="إنشاء حساب جديد" subtitle="انضم إلينا وابدأ رحلة تسوق مميزة">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => signInWithGoogle()}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>
        <button
          onClick={() => toast.info('التسجيل عبر Facebook غير متاح حالياً')}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <Facebook size={18} className="text-[#1877F2]" />
          Facebook
        </button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">أو</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName">الاسم الأول</Label>
            <div className="relative mt-1.5">
              <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input id="firstName" name="firstName" required placeholder="محمد" className="pr-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="lastName">الاسم الأخير</Label>
            <Input id="lastName" name="lastName" required placeholder="العبدالله" className="mt-1.5" />
          </div>
        </div>

        <div>
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <div className="relative mt-1.5">
            <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" name="email" type="email" required placeholder="example@mail.com" className="pr-10" dir="ltr" />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">رقم الجوال</Label>
          <Input id="phone" name="phone" type="tel" required placeholder="05xxxxxxxx" className="mt-1.5" dir="ltr" />
        </div>

        <div>
          <Label htmlFor="password">كلمة المرور</Label>
          <div className="relative mt-1.5">
            <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="px-10"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn('h-1.5 flex-1 rounded-full transition-colors', i < strength ? strengthColors[strength] : 'bg-muted')}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                قوة كلمة المرور: <span className="font-semibold">{strengthLabels[strength]}</span>
              </p>
            </div>
          )}
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <Checkbox required className="mt-0.5" />
          <span className="text-xs text-muted-foreground">
            أوافق على <Link href="/faq" className="text-primary hover:underline">الشروط والأحكام</Link> و<Link href="/faq" className="text-primary hover:underline">سياسة الخصوصية</Link>
          </span>
        </label>

        <Button type="submit" disabled={loading} className="w-full" size="lg">
          {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : 'إنشاء الحساب'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        لديك حساب بالفعل؟{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </AuthLayout>
  );
}
