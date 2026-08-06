'use client';

import * as React from 'react';
import { AdminLayout } from '@/components/shared/admin-layout';
import { Save, Store, Facebook, Truck, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => { setSettings(d.settings); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { id, ...updateData } = settings;
    const { error } = await supabase
      .from('store_settings')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', 1);
    setSaving(false);
    if (error) toast.error('فشل حفظ الإعدادات: ' + error.message);
    else toast.success('تم حفظ الإعدادات بنجاح');
  };

  if (loading || !settings) {
    return (
      <AdminLayout activeKey="settings">
        <div className="flex h-96 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeKey="settings">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إعدادات المتجر</h1>
          <p className="text-sm text-muted-foreground">إدارة معلومات المتجر والتكاملات</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save size={18} />
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </Button>
      </div>

      <div className="space-y-6">
        <SettingsCard icon={Store} title="معلومات المتجر">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>اسم المتجر (عربي)</Label>
              <Input value={settings.store_name || ''} onChange={(e) => setSettings({ ...settings, store_name: e.target.value })} />
            </div>
            <div>
              <Label>اسم المتجر (إنجليزي)</Label>
              <Input value={settings.store_name_en || ''} onChange={(e) => setSettings({ ...settings, store_name_en: e.target.value })} dir="ltr" />
            </div>
            <div className="sm:col-span-2">
              <Label>وصف المتجر</Label>
              <Textarea value={settings.description || ''} onChange={(e) => setSettings({ ...settings, description: e.target.value })} rows={2} />
            </div>
            <div>
              <Label>رقم الهاتف</Label>
              <Input value={settings.phone || ''} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} dir="ltr" />
            </div>
            <div>
              <Label>البريد الإلكتروني</Label>
              <Input value={settings.email || ''} onChange={(e) => setSettings({ ...settings, email: e.target.value })} dir="ltr" />
            </div>
            <div className="sm:col-span-2">
              <Label>العنوان</Label>
              <Input value={settings.address || ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard icon={DollarSign} title="إعدادات الشحن والضريبة">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <Label>الشحن القياسي (ر.س)</Label>
              <Input type="number" value={settings.shipping_cost || 0} onChange={(e) => setSettings({ ...settings, shipping_cost: Number(e.target.value) })} />
            </div>
            <div>
              <Label>الشحن السريع (ر.س)</Label>
              <Input type="number" value={settings.express_shipping_cost || 0} onChange={(e) => setSettings({ ...settings, express_shipping_cost: Number(e.target.value) })} />
            </div>
            <div>
              <Label>حد الشحن المجاني (ر.س)</Label>
              <Input type="number" value={settings.free_shipping_threshold || 0} onChange={(e) => setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })} />
            </div>
            <div>
              <Label>نسبة الضريبة (%)</Label>
              <Input type="number" value={settings.tax_rate || 0} onChange={(e) => setSettings({ ...settings, tax_rate: Number(e.target.value) })} />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard icon={Facebook} title="تكامل Facebook Shop">
          <div className="space-y-4">
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
              <p className="text-sm text-foreground">
                لربط متجرك بـ Facebook Shop، قم بإنشاء كتالوج منتجات على Facebook Commerce Manager وأدخل معرف الكتالوج ورابط المتجر أدناه.
                سيتم تصدير منتجاتك تلقائياً لعرضها على صفحة Facebook الخاصة بمتجرك.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>معرف كتالوج Facebook</Label>
                <Input
                  value={settings.facebook_catalog_id || ''}
                  onChange={(e) => setSettings({ ...settings, facebook_catalog_id: e.target.value })}
                  dir="ltr"
                  placeholder="1234567890"
                />
              </div>
              <div>
                <Label>رابط Facebook Shop</Label>
                <Input
                  value={settings.facebook_shop_url || ''}
                  onChange={(e) => setSettings({ ...settings, facebook_shop_url: e.target.value })}
                  dir="ltr"
                  placeholder="https://facebook.com/yourshop"
                />
              </div>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard icon={Truck} title="روابط التواصل الاجتماعي">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>رابط Facebook</Label>
              <Input value={settings.facebook_url || ''} onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })} dir="ltr" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <Label>رابط Instagram</Label>
              <Input value={settings.instagram_url || ''} onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })} dir="ltr" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <Label>رابط Twitter</Label>
              <Input value={settings.twitter_url || ''} onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })} dir="ltr" placeholder="https://twitter.com/..." />
            </div>
            <div>
              <Label>رقم WhatsApp</Label>
              <Input value={settings.whatsapp_number || ''} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })} dir="ltr" placeholder="9665xxxxxxxx" />
            </div>
          </div>
        </SettingsCard>
      </div>
    </AdminLayout>
  );
}

function SettingsCard({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <Icon size={20} className="text-primary" />
        {title}
      </h2>
      {children}
    </div>
  );
}
