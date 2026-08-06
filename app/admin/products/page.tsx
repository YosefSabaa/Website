'use client';

import * as React from 'react';
import { AdminLayout } from '@/components/shared/admin-layout';
import { Plus, Search, Edit, Trash2, Eye, AlertTriangle, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatPrice } from '@/lib/data';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [filterCat, setFilterCat] = React.useState('all');
  const [editing, setEditing] = React.useState<any | null>(null);
  const [showModal, setShowModal] = React.useState(false);

  const loadData = () => {
    Promise.all([
      fetch('/api/admin/products').then(r => r.json()),
      fetch('/api/admin/categories').then(r => r.json()),
    ]).then(([p, c]) => {
      setProducts(p.products || []);
      setCategories(c.categories || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  React.useEffect(() => { loadData(); }, []);

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.includes(search);
    const matchCat = filterCat === 'all' || p.category_id === filterCat;
    return matchSearch && matchCat;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('تم حذف المنتج');
      loadData();
    } else {
      toast.error('فشل حذف المنتج');
    }
  };

  const handleSave = async () => {
    if (!editing.name || !editing.price) {
      toast.error('يرجى إدخال البيانات المطلوبة');
      return;
    }
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      toast.success('تم حفظ المنتج');
      setShowModal(false);
      setEditing(null);
      loadData();
    } else {
      toast.error('فشل حفظ المنتج');
    }
  };

  const openNew = () => {
    setEditing({
      name: '', slug: '', description: '', long_description: '',
      category_id: categories[0]?.id || '', brand: '', sku: '', barcode: '',
      stock: 0, price: 0, old_price: null, tags: [],
      is_featured: false, is_bestseller: false, is_new: false, is_recommended: false,
      images: [],
    });
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditing({ ...p });
    setShowModal(true);
  };

  return (
    <AdminLayout activeKey="products">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
          <p className="text-sm text-muted-foreground">{products.length} منتج</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus size={18} />
          إضافة منتج
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="بحث عن منتج..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-48"><SelectValue placeholder="كل الفئات" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الفئات</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="p-3 text-right font-semibold">المنتج</th>
                <th className="p-3 text-right font-semibold">الفئة</th>
                <th className="p-3 text-right font-semibold">السعر</th>
                <th className="p-3 text-right font-semibold">المخزون</th>
                <th className="p-3 text-right font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />}
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{p.category_name}</td>
                  <td className="p-3 font-bold text-primary">{formatPrice(p.price)} ر.س</td>
                  <td className="p-3">
                    {p.stock <= 10 ? (
                      <span className="flex items-center gap-1 text-destructive">
                        <AlertTriangle size={14} /> {p.stock}
                      </span>
                    ) : (
                      <span className="text-success">{p.stock}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)} title="تعديل">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} title="حذف" className="text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="py-12 text-center text-muted-foreground">لا توجد منتجات</p>}
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id && !editing.id.startsWith('p17') ? 'تعديل منتج' : 'إضافة منتج جديد'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>اسم المنتج</Label>
                  <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </div>
                <div>
                  <Label>العلامة التجارية</Label>
                  <Input value={editing.brand || ''} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>الوصف</Label>
                <Textarea value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>السعر (ر.س)</Label>
                  <Input type="number" value={editing.price || 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>السعر القديم</Label>
                  <Input type="number" value={editing.old_price || ''} onChange={(e) => setEditing({ ...editing, old_price: e.target.value ? Number(e.target.value) : null })} />
                </div>
                <div>
                  <Label>المخزون</Label>
                  <Input type="number" value={editing.stock || 0} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>الفئة</Label>
                  <Select value={editing.category_id} onValueChange={(v) => setEditing({ ...editing, category_id: v })}>
                    <SelectTrigger><SelectValue placeholder="اختر فئة" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>SKU</Label>
                  <Input value={editing.sku || ''} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>روابط الصور (كل رابط في سطر)</Label>
                <Textarea
                  value={(editing.images || []).join('\n')}
                  onChange={(e) => setEditing({ ...editing, images: e.target.value.split('\n').filter(Boolean) })}
                  rows={3}
                  dir="ltr"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={!!editing.is_featured} onCheckedChange={(v) => setEditing({ ...editing, is_featured: v })} />
                  مميز
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={!!editing.is_bestseller} onCheckedChange={(v) => setEditing({ ...editing, is_bestseller: v })} />
                  الأكثر مبيعاً
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={!!editing.is_new} onCheckedChange={(v) => setEditing({ ...editing, is_new: v })} />
                  جديد
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={!!editing.is_recommended} onCheckedChange={(v) => setEditing({ ...editing, is_recommended: v })} />
                  موصى به
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>إلغاء</Button>
            <Button onClick={handleSave} className="gap-2">
              <Save size={16} /> حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
