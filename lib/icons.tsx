import {
  GraduationCap, BookOpen, Library, Pencil, PenTool, Notebook,
  Backpack, Palette, Printer, Briefcase, Gift, Package, Users, Truck, Award,
  ShoppingCart, Heart, Search, User, Menu, X, ChevronDown, ChevronLeft, ChevronRight,
  Star, Plus, Minus, Trash2, Eye, Share2, Check, Filter, SlidersHorizontal, Grid, List,
  Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, MessageCircle, Send,
  ArrowRight, ArrowLeft, Home, Tag, Percent, Bell, Settings, LogOut, Package2,
  ClipboardList, MapPinHouse, CreditCard, Shield, Zap, BookMarked, FileText, Copy,
  Layers, Scissors, Paintbrush, Rocket, ThumbsUp, Quote, ChevronUp, ShoppingBag,
  TrendingUp, Eye as EyeIcon, Loader2, AlertCircle, CheckCircle2, XCircle, Info,
  type LucideProps,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  GraduationCap, BookOpen, Library, Pencil, PenTool, Notebook,
  Backpack, Palette, Printer, Briefcase, Gift, Package, Users, Truck, Award,
  ShoppingCart, Heart, Search, User, Menu, X, ChevronDown, ChevronLeft, ChevronRight,
  Star, Plus, Minus, Trash2, Eye, Share2, Check, Filter, SlidersHorizontal, Grid, List,
  Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, MessageCircle, Send,
  ArrowRight, ArrowLeft, Home, Tag, Percent, Bell, Settings, LogOut, Package2,
  ClipboardList, MapPinHouse, CreditCard, Shield, Zap, BookMarked, FileText, Copy,
  Layers, Scissors, Paintbrush, Rocket, ThumbsUp, Quote, ChevronUp, ShoppingBag,
  TrendingUp, Loader2, AlertCircle, CheckCircle2, XCircle, Info,
};

export function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = iconMap[name] || Package;
  return <Icon {...props} />;
}
