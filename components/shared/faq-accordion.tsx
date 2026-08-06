'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import type { FAQItem } from '@/lib/types';

export function FAQAccordion({ items, className }: { items: FAQItem[]; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <Accordion type="single" collapsible className="space-y-3">
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="overflow-hidden rounded-2xl border border-border bg-card px-5 transition-shadow data-[state=open]:shadow-soft"
          >
            <AccordionTrigger className="text-right text-base font-semibold hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
}
