"use client"

import { motion } from "framer-motion"
import {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Film,
  Heart,
  GraduationCap,
  Plane,
  Home,
  Smartphone,
  Briefcase,
  Gift,
  Landmark,
  Wallet,
  CreditCard,
  TrendingUp,
  Banknote,
  AlertCircle,
  Coffee,
  Bus,
  Shirt,
  Music,
  Stethoscope,
  BookOpen,
  MapPin,
  Building,
  Tv,
  DollarSign,
  Package,
  PenTool,
  ShoppingCart,
  Gamepad2,
  Camera,
  Headphones,
  Watch,
  Bike,
  Train,
  Fuel,
  ParkingCircle,
  Baby,
  Dumbbell,
  Pill,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/app/lib/utils/cn"

export const AVAILABLE_ICONS: { name: string; icon: LucideIcon }[] = [
  { name: "Utensils", icon: Utensils },
  { name: "Car", icon: Car },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Zap", icon: Zap },
  { name: "Film", icon: Film },
  { name: "Heart", icon: Heart },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Plane", icon: Plane },
  { name: "Home", icon: Home },
  { name: "Smartphone", icon: Smartphone },
  { name: "Briefcase", icon: Briefcase },
  { name: "Gift", icon: Gift },
  { name: "Landmark", icon: Landmark },
  { name: "Wallet", icon: Wallet },
  { name: "CreditCard", icon: CreditCard },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "Banknote", icon: Banknote },
  { name: "AlertCircle", icon: AlertCircle },
  { name: "Coffee", icon: Coffee },
  { name: "Bus", icon: Bus },
  { name: "Shirt", icon: Shirt },
  { name: "Music", icon: Music },
  { name: "Stethoscope", icon: Stethoscope },
  { name: "BookOpen", icon: BookOpen },
  { name: "MapPin", icon: MapPin },
  { name: "Building", icon: Building },
  { name: "Tv", icon: Tv },
  { name: "DollarSign", icon: DollarSign },
  { name: "Package", icon: Package },
  { name: "PenTool", icon: PenTool },
  { name: "ShoppingCart", icon: ShoppingCart },
  { name: "Gamepad2", icon: Gamepad2 },
  { name: "Camera", icon: Camera },
  { name: "Headphones", icon: Headphones },
  { name: "Watch", icon: Watch },
  { name: "Bike", icon: Bike },
  { name: "Train", icon: Train },
  { name: "Fuel", icon: Fuel },
  { name: "ParkingCircle", icon: ParkingCircle },
  { name: "Baby", icon: Baby },
  { name: "Dumbbell", icon: Dumbbell },
  { name: "Pill", icon: Pill },
]

interface IconPickerProps {
  selected: string
  onSelect: (iconName: string) => void
}

export default function IconPicker({ selected, onSelect }: IconPickerProps) {
  return (
    <div className="grid grid-cols-7 gap-2 sm:grid-cols-8">
      {AVAILABLE_ICONS.map(({ name, icon: Icon }, i) => {
        const isSelected = selected === name
        return (
          <motion.button
            key={name}
            type="button"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelect(name)}
            className={cn(
              "flex aspect-square items-center justify-center rounded-xl border transition",
              isSelected
                ? "border-primary/60 bg-primary/15 text-primary"
                : "border-border/50 bg-background/60 text-foreground/60 hover:border-primary/30 hover:bg-white/70 hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
          </motion.button>
        )
      })}
    </div>
  )
}

