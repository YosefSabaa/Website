import type { Category, Product, Testimonial, FAQItem, BlogPost, Order } from './types';

export const categories: Category[] = [
  {
    id: '1',
    slug: 'primary-school',
    name: 'المرحلة الابتدائية',
    description: 'كتب وأدوات المرحلة الابتدائية',
    icon: 'GraduationCap',
    image: 'https://images.pexels.com/photos/6147085/pexels-photo-6147085.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 124,
    subcategories: [
      { name: 'كتب الصف الأول', slug: 'grade-1' },
      { name: 'كتب الصف الثاني', slug: 'grade-2' },
      { name: 'كتب الصف الثالث', slug: 'grade-3' },
      { name: 'كتب الصف الرابع', slug: 'grade-4' },
      { name: 'كتب الصف الخامس', slug: 'grade-5' },
      { name: 'كتب الصف السادس', slug: 'grade-6' },
    ],
  },
  {
    id: '2',
    slug: 'preparatory',
    name: 'المرحلة الإعدادية',
    description: 'كتب وأدوات المرحلة الإعدادية',
    icon: 'BookOpen',
    image: 'https://images.pexels.com/photos/6147082/pexels-photo-6147082.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 89,
    subcategories: [
      { name: 'الصف الأول الإعدادي', slug: 'prep-1' },
      { name: 'الصف الثاني الإعدادي', slug: 'prep-2' },
      { name: 'الصف الثالث الإعدادي', slug: 'prep-3' },
    ],
  },
  {
    id: '3',
    slug: 'secondary',
    name: 'المرحلة الثانوية',
    description: 'كتب وأدوات المرحلة الثانوية',
    icon: 'Library',
    image: 'https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 156,
    subcategories: [
      { name: 'الصف الأول الثانوي', slug: 'sec-1' },
      { name: 'الصف الثاني الثانوي', slug: 'sec-2' },
      { name: 'الصف الثالث الثانوي', slug: 'sec-3' },
    ],
  },
  {
    id: '4',
    slug: 'stationery',
    name: 'القرطاسية',
    description: 'كل مستلزمات القرطاسية',
    icon: 'Pencil',
    image: 'https://images.pexels.com/photos/7977866/pexels-photo-7977866.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 210,
    subcategories: [
      { name: 'أقلام', slug: 'pens' },
      { name: 'دفاتر', slug: 'notebooks' },
      { name: 'أوراق', slug: 'papers' },
      { name: 'أدوات مكتبية', slug: 'office-supplies' },
    ],
  },
  {
    id: '5',
    slug: 'pens',
    name: 'الأقلام',
    description: 'أقلام رصاص وحبر وgel',
    icon: 'PenTool',
    image: 'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 78,
  },
  {
    id: '6',
    slug: 'notebooks',
    name: 'الدفاتر',
    description: 'دفاتر وكشاكول ومفكرات',
    icon: 'Notebook',
    image: 'https://images.pexels.com/photos/6147360/pexels-photo-6147360.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 64,
  },
  {
    id: '7',
    slug: 'school-bags',
    name: 'الحقائب المدرسية',
    description: 'حقائب مدرسية متنوعة',
    icon: 'Backpack',
    image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 45,
  },
  {
    id: '8',
    slug: 'art-supplies',
    name: 'أدوات الفن',
    description: 'ألوان وريش وأدوات رسم',
    icon: 'Palette',
    image: 'https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 92,
  },
  {
    id: '9',
    slug: 'printing',
    name: 'خدمات الطباعة',
    description: 'طباعة ونسخ وتجليد',
    icon: 'Printer',
    image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 23,
  },
  {
    id: '10',
    slug: 'office-supplies',
    name: 'المستلزمات المكتبية',
    description: 'أدوات المكتب والمستلزمات',
    icon: 'Briefcase',
    image: 'https://images.pexels.com/photos/7709221/pexels-photo-7709221.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 134,
  },
  {
    id: '11',
    slug: 'gifts',
    name: 'الهدايا',
    description: 'هدايا مناسبات وعلب gift',
    icon: 'Gift',
    image: 'https://images.pexels.com/photos/264786/pexels-photo-264786.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 56,
  },
];

const reviewBank: Product['reviews'] = [
  {
    id: 'r1',
    author: 'أحمد محمد',
    rating: 5,
    date: '2026-07-15',
    comment: 'منتج ممتاز وجودة عالية، التوصيل كان سريع جداً. أنصح به بشدة!',
    verified: true,
  },
  {
    id: 'r2',
    author: 'فاطمة علي',
    rating: 4,
    date: '2026-07-10',
    comment: 'جودة جيدة وسعر مناسب، لكن التغليف كان يمكن أن يكون أفضل.',
    verified: true,
  },
  {
    id: 'r3',
    author: 'خالد سعيد',
    rating: 5,
    date: '2026-07-08',
    comment: 'تعاملت معهم أكثر من مرة، خدمة رائعة ومنتجات أصلية.',
    verified: true,
  },
  {
    id: 'r4',
    author: 'نورة أحمد',
    rating: 5,
    date: '2026-07-05',
    comment: 'أفضل مكتبة تعاملت معها، تشكيلة كبيرة وأسعار منافسة.',
    verified: true,
  },
];

function makeReviews(seed: number): Product['reviews'] {
  return reviewBank.slice(0, 2 + (seed % 3)).map((r, i) => ({
    ...r,
    id: `${r.id}-${seed}-${i}`,
  }));
}

const imageBank = {
  books: [
    'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1370750/pexels-photo-1370750.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/220326/pexels-photo-220326.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2437890/pexels-photo-2437890.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  pens: [
    'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/261766/pexels-photo-261766.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  notebooks: [
    'https://images.pexels.com/photos/6147360/pexels-photo-6147360.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  bags: [
    'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1204464/pexels-photo-1204464.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  art: [
    'https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  stationery: [
    'https://images.pexels.com/photos/7977866/pexels-photo-7977866.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/7709221/pexels-photo-7709221.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  gifts: [
    'https://images.pexels.com/photos/264786/pexels-photo-264786.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2821660/pexels-photo-2821660.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  printing: [
    'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
};

function imgSet(key: keyof typeof imageBank, seed: number): string[] {
  const arr = imageBank[key];
  const out: string[] = [];
  for (let i = 0; i < 4; i++) out.push(arr[(seed + i) % arr.length]);
  return Array.from(new Set(out));
}

interface RawProduct {
  name: string;
  category: string;
  categorySlug: string;
  brand: string;
  price: number;
  oldPrice?: number;
  stock: number;
  imgKey: keyof typeof imageBank;
  desc: string;
  tags: string[];
  flags?: Partial<Pick<Product, 'isFeatured' | 'isBestSeller' | 'isNewArrival' | 'isRecommended' | 'isOnOffer'>>;
  specs?: { label: string; value: string }[];
}

const rawProducts: RawProduct[] = [
  // Books - External
  {
    name: 'كتاب الرياضيات للصف السادس - النسخة الخارجية',
    category: 'المرحلة الابتدائية',
    categorySlug: 'primary-school',
    brand: 'Pearson',
    price: 145, oldPrice: 190,
    stock: 35, imgKey: 'books',
    desc: 'كتاب الرياضيات الخارجي للصف السادس الابتدائي، يغطي جميع وحدات المنهج بشرح مبسط وتمارين متنوعة.',
    tags: ['كتب خارجية', 'رياضيات', 'ابتدائي'],
    flags: { isFeatured: true, isBestSeller: true, isOnOffer: true },
    specs: [{ label: 'الناشر', value: 'Pearson' }, { label: 'عدد الصفحات', value: '320' }, { label: 'اللغة', value: 'عربي/إنجليزي' }],
  },
  {
    name: 'كتاب Science الثانوية العامة - نسخة محدثة',
    category: 'المرحلة الثانوية',
    categorySlug: 'secondary',
    brand: 'Cambridge',
    price: 220, oldPrice: 280,
    stock: 28, imgKey: 'books',
    desc: 'كتاب العلور الخارجي للمرحلة الثانوية، مراجع شامل لمنهج الثانوية العامة مع نماذج امتحانات.',
    tags: ['كتب خارجية', 'علوم', 'ثانوي'],
    flags: { isFeatured: true, isBestSeller: true, isOnOffer: true },
  },
  {
    name: 'موسوعة العلوم للأطفال - 5 أجزاء',
    category: 'المرحلة الابتدائية',
    categorySlug: 'primary-school',
    brand: 'DK',
    price: 340,
    stock: 15, imgKey: 'books',
    desc: 'موسوعة علمية مصورة للأطفال تتناول مواضيع العلوم بطريقة مبسطة وممتعة.',
    tags: ['موسوعة', 'علوم', 'أطفال'],
    flags: { isNewArrival: true, isRecommended: true },
  },
  {
    name: 'كتاب اللغة الإنجليزية - English Grammar in Use',
    category: 'المرحلة الثانوية',
    categorySlug: 'secondary',
    brand: 'Cambridge',
    price: 175, oldPrice: 210,
    stock: 42, imgKey: 'books',
    desc: 'المرجع الأشهر لتعلم قواعد اللغة الإنجليزية، مناسب لكل المستويات.',
    tags: ['كتب خارجية', 'إنجليزي', 'قواعد'],
    flags: { isBestSeller: true, isOnOffer: true },
  },
  {
    name: 'كتاب الفيزياء الخارجي - الإعدادية',
    category: 'المرحلة الإعدادية',
    categorySlug: 'preparatory',
    brand: 'Oxford',
    price: 130,
    stock: 22, imgKey: 'books',
    desc: 'كتاب الفيزياء للمرحلة الإعدادية بشرح تفصيلي وتجارب عملية.',
    tags: ['كتب خارجية', 'فيزياء', 'إعدادي'],
    flags: { isNewArrival: true },
  },
  {
    name: 'قاموس Oxford الإنجليزي-العربي',
    category: 'القرطاسية', categorySlug: 'stationery',
    brand: 'Oxford', price: 260, oldPrice: 310, stock: 18, imgKey: 'books',
    desc: 'قاموس ثنائي اللغة شامل، أكثر من 100,000 كلمة ومصطلح.',
    tags: ['قاموس', 'إنجليزي', 'مرجع'],
    flags: { isFeatured: true, isRecommended: true, isOnOffer: true },
  },
  // Pens
  {
    name: 'طقم أقلام حبر جل 12 لون - Pilot',
    category: 'الأقلام', categorySlug: 'pens',
    brand: 'Pilot', price: 85, oldPrice: 110, stock: 120, imgKey: 'pens',
    desc: 'طقم أقلام جل عالية الجودة بـ 12 لون مختلف، حبر ناعم وسريع الجفاف.',
    tags: ['أقلام', 'gel', 'ألوان'],
    flags: { isBestSeller: true, isOnOffer: true, isRecommended: true },
  },
  {
    name: 'علبة أقلام رصاص HB - 50 قلم',
    category: 'الأقلام', categorySlug: 'pens',
    brand: 'Faber-Castell', price: 95, stock: 60, imgKey: 'pens',
    desc: 'علبة اقتصادية تحتوي على 50 قلم رصاص درجة HB مثالية للكتابة والرسم.',
    tags: ['أقلام رصاص', 'مدرسي'],
    flags: { isFeatured: true, isNewArrival: true },
  },
  {
    name: 'قلم حبر فاخر - Lamy Safari',
    category: 'الأقلام', categorySlug: 'pens',
    brand: 'Lamy', price: 180, oldPrice: 230, stock: 25, imgKey: 'pens',
    desc: 'قلم حبر فاخر بتصميم عصري وسن معدني، تجربة كتابة سلسة.',
    tags: ['قلم حبر', 'فاخر', 'Lamy'],
    flags: { isRecommended: true, isOnOffer: true },
  },
  {
    name: 'طقم أقلام تحديد Highlighter - 6 ألوان',
    category: 'الأقلام', categorySlug: 'pens',
    brand: 'Stabilo', price: 65, oldPrice: 85, stock: 80, imgKey: 'pens',
    desc: 'أقلام تحديد بألوان زاهية وحبر لا يخترق الورق، مثالية للدراسة.',
    tags: ['أقلام تحديد', 'مدرسي'],
    flags: { isBestSeller: true, isOnOffer: true },
  },
  // Notebooks
  {
    name: 'دفتر 200 ورقة خط مرسم - A4',
    category: 'الدفاتر', categorySlug: 'notebooks',
    brand: 'Camel', price: 45, oldPrice: 60, stock: 200, imgKey: 'notebooks',
    desc: 'دفتر A4 بـ 200 ورقة خط مرسم، ورق عالي الجودة 70 جرام.',
    tags: ['دفاتر', 'A4', 'مدرسي'],
    flags: { isBestSeller: true, isOnOffer: true, isRecommended: true },
  },
  {
    name: 'كشكول 300 ورقة ملون - A4',
    category: 'الدفاتر', categorySlug: 'notebooks',
    brand: 'Camel', price: 72, stock: 95, imgKey: 'notebooks',
    desc: 'كشكول A4 بـ 300 ورقة بأقسام ملونة لتنظيم المذاكرة.',
    tags: ['كشكول', 'ملون'],
    flags: { isFeatured: true, isNewArrival: true },
  },
  {
    name: 'دفتر رسم مربعات - 100 ورقة',
    category: 'الدفاتر', categorySlug: 'notebooks',
    brand: 'Camel', price: 38, oldPrice: 48, stock: 140, imgKey: 'notebooks',
    desc: 'دفتر رسم مربعات مناسب لمواد الرياضيات والعلوم.',
    tags: ['دفتر', 'مربعات', 'رسم'],
    flags: { isOnOffer: true },
  },
  {
    name: 'طقم 5 دفاتر صغيرة للجيب',
    category: 'الدفاتر', categorySlug: 'notebooks',
    brand: 'Moleskine', price: 120, stock: 40, imgKey: 'notebooks',
    desc: 'طقم من 5 دفاتر صغيرة بحجم الجيب لتدوين الملاحظات السريعة.',
    tags: ['دفاتر', 'جيب', 'ملاحظات'],
    flags: { isRecommended: true, isNewArrival: true },
  },
  // School Bags
  {
    name: 'حقيبة مدرسية ظهر - مقاومة للماء',
    category: 'الحقائب المدرسية', categorySlug: 'school-bags',
    brand: 'Targus', price: 320, oldPrice: 420, stock: 30, imgKey: 'bags',
    desc: 'حقيبة ظهر مدرسية مقاومة للماء بتصميم مريح وعدة جيوب.',
    tags: ['حقيبة', 'مدرسي', 'ظهر'],
    flags: { isFeatured: true, isBestSeller: true, isOnOffer: true },
  },
  {
    name: 'حقيبة مدرسية للأطفال - شخصيات كرتونية',
    category: 'الحقائب المدرسية', categorySlug: 'school-bags',
    brand: 'Disney', price: 210, oldPrice: 260, stock: 45, imgKey: 'bags',
    desc: 'حقيبة مدرسية ملونة بشخصيات كرتونية محببة للأطفال.',
    tags: ['حقيبة', 'أطفال', 'كرتون'],
    flags: { isOnOffer: true, isNewArrival: true },
  },
  {
    name: 'حقيبة لاب توب مدرسية - 15.6 إنش',
    category: 'الحقائب المدرسية', categorySlug: 'school-bags',
    brand: 'Lenovo', price: 185, stock: 22, imgKey: 'bags',
    desc: 'حقيبة لاب توب بحماية مزدوجة وجيوب إضافية للكتب.',
    tags: ['حقيبة', 'لاب توب'],
    flags: { isRecommended: true },
  },
  // Art Supplies
  {
    name: 'طقم ألوان مائية - 24 لون',
    category: 'أدوات الفن', categorySlug: 'art-supplies',
    brand: 'Faber-Castell', price: 140, oldPrice: 180, stock: 55, imgKey: 'art',
    desc: 'طقم ألوان مائية عالية الجودة بـ 24 لون، مثالي للرسم الفني.',
    tags: ['ألوان', 'مائية', 'فن'],
    flags: { isBestSeller: true, isOnOffer: true },
  },
  {
    name: 'طقم أقلام رصاص فنية - 12 درجة',
    category: 'أدوات الفن', categorySlug: 'art-supplies',
    brand: 'Staedtler', price: 110, stock: 38, imgKey: 'art',
    desc: 'أقلام رصاص فنية بـ 12 درجة صلابة مختلفة للرسم الاحترافي.',
    tags: ['أقلام', 'رسم', 'فني'],
    flags: { isFeatured: true, isRecommended: true },
  },
  {
    name: 'طقم ألوان خشبية - 36 لون',
    category: 'أدوات الفن', categorySlug: 'art-supplies',
    brand: 'Crayola', price: 95, oldPrice: 125, stock: 70, imgKey: 'art',
    desc: 'ألوان خشبية عالية الجودة بـ 36 لون، آمنة للأطفال.',
    tags: ['ألوان', 'خشبية', 'أطفال'],
    flags: { isOnOffer: true, isBestSeller: true },
  },
  {
    name: 'ورق رسم أبيض - 100 ورقة A3',
    category: 'أدوات الفن', categorySlug: 'art-supplies',
    brand: 'Strathmore', price: 78, stock: 85, imgKey: 'art',
    desc: 'ورق رسم سميك 200 جرام بحجم A3، مناسب لجميع أنواع الألوان.',
    tags: ['ورق', 'رسم', 'A3'],
    flags: { isNewArrival: true },
  },
  // Stationery / Office
  {
    name: 'مجعة أوراق ملونة - 500 ورقة A4',
    category: 'القرطاسية', categorySlug: 'stationery',
    brand: 'Double A', price: 55, oldPrice: 70, stock: 110, imgKey: 'stationery',
    desc: 'حزمة أوراق A4 ملونة بـ 5 ألوان مختلفة، 100 ورقة لكل لون.',
    tags: ['أوراق', 'ملونة', 'A4'],
    flags: { isOnOffer: true, isBestSeller: true },
  },
  {
    name: 'دباسة مكتبية فاخرة + 1000 دباسة',
    category: 'المستلزمات المكتبية', categorySlug: 'office-supplies',
    brand: 'Swingline', price: 88, stock: 50, imgKey: 'stationery',
    desc: 'دباسة مكتبية متينة مع 1000 دباسة، تصميم مريح للاستخدام اليومي.',
    tags: ['دباسة', 'مكتب'],
    flags: { isFeatured: true, isRecommended: true },
  },
  {
    name: 'منظم مكتب 5 أدراج شفاف',
    category: 'المستلزمات المكتبية', categorySlug: 'office-supplies',
    brand: 'IKEA', price: 165, oldPrice: 200, stock: 28, imgKey: 'stationery',
    desc: 'منظم مكتب شفاف بـ 5 أدراج لتنظيم الأوراق والقرطاسية.',
    tags: ['منظم', 'مكتب', 'أدراج'],
    flags: { isOnOffer: true, isNewArrival: true },
  },
  {
    name: 'آلة حاسبة علمية - Casio fx-991',
    category: 'المستلزمات المكتبية', categorySlug: 'office-supplies',
    brand: 'Casio', price: 195, oldPrice: 240, stock: 35, imgKey: 'stationery',
    desc: 'آلة حاسبة علمية متقدمة بـ 552 دالة، مثالية للمرحلة الثانوية.',
    tags: ['آلة حاسبة', 'علمي', 'كاسيو'],
    flags: { isBestSeller: true, isOnOffer: true, isRecommended: true },
  },
  // Gifts
  {
    name: 'علبة هدية فاخرة - أدوات مكتبية',
    category: 'الهدايا', categorySlug: 'gifts',
    brand: 'GiftBox', price: 250, oldPrice: 320, stock: 20, imgKey: 'gifts',
    desc: 'علبة هدية أنيقة تحتوي على قلم فاخر ودفتر جلدي ومفكرة.',
    tags: ['هدية', 'علبة', 'فاخر'],
    flags: { isFeatured: true, isOnOffer: true, isRecommended: true },
  },
  {
    name: 'كوب سيراميك مخصص - تصميم خاص',
    category: 'الهدايا', categorySlug: 'gifts',
    brand: 'GiftBox', price: 65, stock: 75, imgKey: 'gifts',
    desc: 'كوب سيراميك عالي الجودة مع إمكانية الطباعة بالاسم أو الصورة.',
    tags: ['هدية', 'كوب', 'طباعة'],
    flags: { isNewArrival: true },
  },
  {
    name: 'دفتر ملاحظات جلدي - نقش اسم',
    category: 'الهدايا', categorySlug: 'gifts',
    brand: 'GiftBox', price: 95, oldPrice: 120, stock: 40, imgKey: 'gifts',
    desc: 'دفتر ملاحظات بغلاف جلدي فاخر مع نقش الاسم مجاناً.',
    tags: ['هدية', 'دفتر', 'جلد'],
    flags: { isOnOffer: true },
  },
  // Printing
  {
    name: 'خدمة طباعة بحث - حتى 100 صفحة',
    category: 'خدمات الطباعة', categorySlug: 'printing',
    brand: 'Scientific Center', price: 50, oldPrice: 70, stock: 999, imgKey: 'printing',
    desc: 'خدمة طباعة بحوث ورسائل علمية بجودة عالية حتى 100 صفحة.',
    tags: ['طباعة', 'بحوث'],
    flags: { isFeatured: true, isOnOffer: true },
  },
  {
    name: 'خدمة تجليد سلك وغلاف حراري',
    category: 'خدمات الطباعة', categorySlug: 'printing',
    brand: 'Scientific Center', price: 30, stock: 999, imgKey: 'printing',
    desc: 'خدمة تجليد البحوث بالسلك أو الغلاف الحراري باحترافية.',
    tags: ['تجليد', 'طباعة'],
    flags: { isRecommended: true },
  },
  {
    name: 'خدمة تصوير مستندات - 500 نسخة',
    category: 'خدمات الطباعة', categorySlug: 'printing',
    brand: 'Scientific Center', price: 120, oldPrice: 150, stock: 999, imgKey: 'printing',
    desc: 'خدمة تصوير مستندات بكميات كبيرة بأسعار منافسة وجودة عالية.',
    tags: ['تصوير', 'طباعة'],
    flags: { isOnOffer: true, isBestSeller: true },
  },
];

export const products: Product[] = rawProducts.map((rp, i) => {
  const id = `p${i + 1}`;
  const slug = rp.name
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, '')
    .toLowerCase();
  const specs = rp.specs || [
    { label: 'العلامة التجارية', value: rp.brand },
    { label: 'الفئة', value: rp.category },
    { label: 'الضمان', value: 'سنة واحدة' },
    { label: 'بلد المنشأ', value: 'مستورد' },
  ];
  return {
    id,
    slug,
    name: rp.name,
    description: rp.desc,
    longDescription: `${rp.desc} هذا المنتج جزء من تشكيلة مكتبة المركز العلمي الواسعة. نحن نضمن لك جودة عالية وأسعار منافسة مع خدمة توصيل سريعة لجميع المناطق. منتج أصلي 100% مع إمكانية الاستبدال والاسترجاع خلال 14 يوماً.`,
    specifications: specs,
    images: imgSet(rp.imgKey, i),
    category: rp.category,
    categorySlug: rp.categorySlug,
    brand: rp.brand,
    barcode: `629${String(1000000 + i * 137).slice(0, 10)}`,
    sku: `SC-${String(i + 1).padStart(4, '0')}`,
    stock: rp.stock,
    price: rp.price,
    oldPrice: rp.oldPrice,
    rating: 4 + ((i * 7) % 10) / 10,
    reviewsCount: 12 + (i * 13) % 80,
    reviews: makeReviews(i),
    tags: rp.tags,
    relatedIds: rawProducts
      .map((other, j) => ({ id: `p${j + 1}`, slug: other.categorySlug }))
      .filter((item) => item.id !== id && item.slug === rp.categorySlug)
      .map((item) => item.id)
      .slice(0, 4),
    ...rp.flags,
    createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  };
});

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'محمد عبد الله',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    comment: 'أفضل مكتبة تعاملت معها على الإطلاق. تشكيلة رائعة من الكتب الخارجية وأسعار منافسة جداً. التوصيل كان سريعاً والتغليف ممتاز.',
    location: 'الرياض',
  },
  {
    id: 't2',
    name: 'سارة المطيري',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    comment: 'طلبت أدوات مدرسية لطفلي وكانت كلها بأعلى جودة. خدمة العملاء متعاونة جداً وساعدوني في اختيار الأفضل. شكراً للمركز العلمي.',
    location: 'جدة',
  },
  {
    id: 't3',
    name: 'عبد الرحمن السالم',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4,
    comment: 'خدمة الطباعة ممتازة وسريعة. طبعوا لي البحث في نفس اليوم بجودة عالية. الأسعار معقولة والتعامل احترافي.',
    location: 'الدمام',
  },
  {
    id: 't4',
    name: 'هند العتيبي',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    comment: 'تجربة تسوق مريحة وسلسة. الموقع سهل الاستخدام والدفع آمن. وصل الطلب في الوقت المحدد. بالتأكيد سأطلب مرة أخرى.',
    location: 'مكة المكرمة',
  },
];

export const faqItems: FAQItem[] = [
  {
    question: 'كيف يمكنني الطلب من الموقع؟',
    answer: 'يمكنك تصفح المنتجات وإضافتها إلى سلة التسوق ثم إتمام الطلب عبر صفحة الدفع. اختر طريقة التوصيل المناسبة وقم بإدخال بياناتك بدقة.',
  },
  {
    question: 'ما هي مدة التوصيل؟',
    answer: 'التوصيل داخل المدينة يستغرق 1-2 يوم عمل، أما خارج المدينة فيستغرق 3-5 أيام عمل. التوصيل السريع متاح داخل الرياض خلال نفس اليوم.',
  },
  {
    question: 'هل يمكنني إرجاع المنتج؟',
    answer: 'نعم، يمكنك إرجاع أو استبدال المنتج خلال 14 يوماً من تاريخ الاستلام بشرط أن يكون في حالته الأصلية مع التغليف.',
  },
  {
    question: 'ما هي طرق الدفع المتاحة؟',
    answer: 'نوفر الدفع عند الاستلام، الدفع بالبطاقات الائتمانية (مدى، فيزا، ماستركارد)، التحويل البنكي، والدفع عبر محافظ إلكترونية مثل آبل باي.',
  },
  {
    question: 'هل تقدمون خدمة الطباعة؟',
    answer: 'نعم، نقدم خدمات طباعة وتصوير وتجليد البحوث والرسائل العلمية. يمكنك طلب الخدمة عبر قسم خدمات الطباعة في الموقع.',
  },
  {
    question: 'هل هناك خصومات للجملة؟',
    answer: 'نعم، نقدم خصومات خاصة للطلبات بالجملة للمدارس والمؤسسات. تواصل معنا عبر صفحة تواصل معنا للحصول على عرض سعر مخصص.',
  },
  {
    question: 'كيف أتتبع طلبي؟',
    answer: 'بعد إتمام الطلب ستصلك رسالة برقم التتبع. يمكنك متابعة حالة الطلب من صفحة "تتبع الطلب" باستخدام رقم الطلب أو من حسابك.',
  },
  {
    question: 'هل الكتب الخارجية أصلية؟',
    answer: 'نعم، جميع الكتب الخارجية أصلية 100% ومستوردة من دور النشر المعتمدة. نضمن لك جودة وأصالة كل منتج.',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'b1',
    slug: 'back-to-school-tips',
    title: '10 نصائح لاستعداد العودة للمدارس',
    excerpt: 'دليل شامل لكل ما يحتاجه طفلك للعودة المدرسية من أدوات ومستلزمات ونصائح لتنظيم الوقت.',
    content: 'العودة للمدارس حدث مهم لكل طالب وأسرته. في هذا المقال نقدم لك عشر نصائح عملية للاستعداد... العودة للمدارس حدث مهم لكل طالب وأسرته. في هذا المقال نقدم لك عشر نصائح عملية للاستعداد بشكل مثالي. أولاً، قم بإعداد قائمة بالأدوات المدرسية المطلوبة مبكراً. ثانياً، نظم جدولاً للدراسة والراحة. ثالثاً، تأكد من شراء حقيبة مدرسية مريحة لظهر الطفل. رابعاً، وفّر مكاناً هادئاً للدراسة في المنزل. خامساً، شجع طفلك على القراءة اليومية. سادساً، تابع نظامه الغذائي ونومه. سابعاً، تواصل مع المعلمين بانتظام. ثامناً، كافئ إنجازات طفلك. تاسعاً، علمه تنظيم وقته. عاشراً، كن داعماً ومتفائلاً.',
    image: 'https://images.pexels.com/photos/6147085/pexels-photo-6147085.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'د. فاطمة الزهراء',
    authorAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2026-07-20',
    category: 'نصائح مدرسية',
    readTime: '5 دقائق',
    tags: ['عودة للمدارس', 'نصائح', 'أدوات مدرسية'],
  },
  {
    id: 'b2',
    slug: 'choosing-the-right-notebook',
    title: 'كيف تختار الدفتر المناسب لدراستك؟',
    excerpt: 'أنواع الدفاتر المختلفة وكيفية اختيار الأنسب لكل مادة دراسية.',
    content: 'اختيار الدفتر المناسب يلعب دوراً مهماً في تنظيم دراستك. هناك أنواع متعددة من الدفاتر... الدفتر المرسم خط مناسب لمواد اللغة العربية. الدفتر المربع مناسب للرياضيات. الدفتر المربع الصغير للعلوم. الكشكول الملون ممتاز لتنظيم المواد. اختر دائماً ورقاً عالي الجودة لا ينفذ منه الحبر بسرعة. وانتبه لحجم الدفتر المناسب لجريدتك.',
    image: 'https://images.pexels.com/photos/6147360/pexels-photo-6147360.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'أ. محمد العبدالله',
    authorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2026-07-18',
    category: 'نصائح دراسية',
    readTime: '4 دقائق',
    tags: ['دفاتر', 'دراسة', 'نصائح'],
  },
  {
    id: 'b3',
    slug: 'importance-of-reading',
    title: 'أهمية القراءة في تطوير مهارات الطفل',
    excerpt: 'كيف تساهم القراءة في نمو عقلي وثقافي للطفل وأفضل الكتب لكل مرحلة عمرية.',
    content: 'القراءة من أهم العادات التي يجب غرسها في الأطفال منذ الصغر. تساهم القراءة في تطوير... القراءة من أهم العادات التي يجب غرسها في الأطفال منذ الصغر. تساهم القراءة في تطوير اللغة والمفردات، وتعزز الخيال والإبداع، وتفتح آفاقاً معرفية واسعة. ابدأ بالكتب المصورة للأطفال، ثم القصص القصيرة، ثم الكتب العلمية المبسطة. خصص وقتاً يومياً للقراءة مع طفلك.',
    image: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'د. سارة الحربي',
    authorAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2026-07-15',
    category: 'تربية وتعليم',
    readTime: '6 دقائق',
    tags: ['قراءة', 'تربية', 'أطفال'],
  },
  {
    id: 'b4',
    slug: 'study-organization-tips',
    title: 'تنظيم وقت الدراسة: دليل الطالب الناجح',
    excerpt: 'استراتيجيات إدارة الوقت الفعالة لتحقيق أفضل نتائج دراسية.',
    content: 'إدارة الوقت من أهم مهارات الطالب الناجح. إليك أهم الاستراتيجيات... استخدم تقنية بومودورو للدراسة. قسّم أهدافك الكبيرة إلى مهام صغيرة. خذ فترات راحة منتظمة. نم جيداً. مارس الرياضة. تجنب المشتتات. راجع دروسك يومياً. استخدم تطبيقات تنظيم الوقت.',
    image: 'https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'أ. خالد المطيري',
    authorAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2026-07-12',
    category: 'نصائح دراسية',
    readTime: '7 دقائق',
    tags: ['دراسة', 'تنظيم وقت', 'نصائح'],
  },
];

export const orders: Order[] = [
  {
    id: 'o1',
    number: 'SC-2026-1042',
    date: '2026-07-28',
    status: 'delivered',
    total: 415,
    items: [
      { name: 'كتاب الرياضيات للصف السادس', image: products[0].images[0], price: 145, quantity: 1 },
      { name: 'دفتر 200 ورقة خط مرسم - A4', image: products[9].images[0], price: 45, quantity: 2 },
      { name: 'طقم أقلام حبر جل 12 لون', image: products[6].images[0], price: 85, quantity: 1 },
    ],
    address: 'الرياض، حي النرجس، شارع الأمير محمد',
    trackingSteps: [
      { label: 'تم استلام الطلب', date: '2026-07-28 10:00', done: true },
      { label: 'جاري التجهيز', date: '2026-07-28 14:30', done: true },
      { label: 'تم الشحن', date: '2026-07-29 09:15', done: true },
      { label: 'تم التوصيل', date: '2026-07-30 16:00', done: true },
    ],
  },
  {
    id: 'o2',
    number: 'SC-2026-1051',
    date: '2026-07-29',
    status: 'shipped',
    total: 540,
    items: [
      { name: 'حقيبة مدرسية ظهر - مقاومة للماء', image: products[13].images[0], price: 320, quantity: 1 },
      { name: 'طقم ألوان مائية - 24 لون', image: products[16].images[0], price: 140, quantity: 1 },
      { name: 'طقم أقلام تحديد Highlighter', image: products[9].images[0], price: 65, quantity: 1 },
    ],
    address: 'جدة، حي الروضة، طريق الملك',
    trackingSteps: [
      { label: 'تم استلام الطلب', date: '2026-07-29 11:00', done: true },
      { label: 'جاري التجهيز', date: '2026-07-29 15:00', done: true },
      { label: 'تم الشحن', date: '2026-07-30 08:00', done: true },
      { label: 'تم التوصيل', date: '—', done: false },
    ],
  },
  {
    id: 'o3',
    number: 'SC-2026-1058',
    date: '2026-07-30',
    status: 'processing',
    total: 280,
    items: [
      { name: 'كتاب Science الثانوية العامة', image: products[1].images[0], price: 220, quantity: 1 },
      { name: 'طقم أقلام تحديد Highlighter', image: products[9].images[0], price: 65, quantity: 1 },
    ],
    address: 'الدمام، حي الشاطئ، كورنيش الدمام',
    trackingSteps: [
      { label: 'تم استلام الطلب', date: '2026-07-30 09:00', done: true },
      { label: 'جاري التجهيز', date: '—', done: false },
      { label: 'تم الشحن', date: '—', done: false },
      { label: 'تم التوصيل', date: '—', done: false },
    ],
  },
];

export const stats = [
  { label: 'منتج متوفر', value: '1000+', icon: 'Package' },
  { label: 'عميل سعيد', value: '15,000+', icon: 'Users' },
  { label: 'طلب تم تسليمه', value: '25,000+', icon: 'Truck' },
  { label: 'سنوات خبرة', value: '12+', icon: 'Award' },
];

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getRelatedProducts(product: Product): Product[] {
  return product.relatedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNewArrival);
}

export function getRecommended(): Product[] {
  return products.filter((p) => p.isRecommended);
}

export function getOnOffer(): Product[] {
  return products.filter((p) => p.isOnOffer);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export const popularSearches = [
  'كتب خارجية',
  'أقلام حبر',
  'دفاتر A4',
  'حقائب مدرسية',
  'ألوان مائية',
  'آلة حاسبة',
  'خدمات طباعة',
];

export const recentSearches = [
  'كتاب الرياضيات',
  'دفتر 200 ورقة',
  'أقلام جل',
];

export const brands = ['Pearson', 'Cambridge', 'Oxford', 'DK', 'Pilot', 'Faber-Castell', 'Lamy', 'Stabilo', 'Camel', 'Moleskine', 'Casio', 'Crayola', 'Staedtler', 'Strathmore', 'Double A', 'Swingline', 'IKEA', 'Disney', 'Targus', 'Lenovo', 'GiftBox'];
