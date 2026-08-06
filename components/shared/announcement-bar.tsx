'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Phone, Percent, Sparkles } from 'lucide-react';

const announcements = [
  { icon: Truck, text: 'توصيل سريع لجميع مدن المملكة خلال 1-3 أيام' },
  { icon: Percent, text: 'خصومات تصل إلى 40% على العودة للمدارس' },
  { icon: Phone, text: 'خدمة العملاء: 800-124-5678 - متاح يومياً من 8ص حتى 11م' },
  { icon: Sparkles, text: 'شحن مجاني للطلبات فوق 200 ر.س' },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = announcements[index];

  return (
    <div className="brand-gradient-bg text-white">
      <div className="container-px mx-auto max-w-7xl">
        <div className="relative flex h-9 items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-xs font-medium sm:text-sm"
            >
              <current.icon size={16} className="shrink-0" />
              <span>{current.text}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
