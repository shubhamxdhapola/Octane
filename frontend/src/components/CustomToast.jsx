import React from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Check, X, AlertCircle, Info, AlertTriangle } from "lucide-react";

/**
 * CustomToast styled with Octane's signature blue brand palette:
 * - Rounded card with subtle ice-blue border & soft elevated shadow
 * - Solid colored circular icon badge (Octane Blue #0068FF for success) with micro-spring pop
 * - Compact, refined font size with Sora typography
 * - Circular close button with subtle hover feedback
 * - Tactile spring popup appearing animation
 */
export default function CustomToast({ t, message, type = "success" }) {
  const configs = {
    success: {
      bg: "bg-[#EDF4FF]",
      border: "border-[#CCE0FF]",
      text: "text-[#050B3F]",
      badgeBg: "bg-[#0068FF]",
      icon: <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />,
      closeBtn: "bg-blue-900/[0.06] hover:bg-blue-900/[0.12] text-[#44517C] hover:text-[#050B3F]",
    },
    error: {
      bg: "bg-[#FDEEED]",
      border: "border-[#F8C6C4]",
      text: "text-[#1A0A0A]",
      badgeBg: "bg-[#E11D48]",
      icon: <AlertCircle className="w-3.5 h-3.5 text-white stroke-[2.5]" />,
      closeBtn: "bg-black/[0.05] hover:bg-black/[0.1] text-[#6E3B3B] hover:text-[#1A0A0A]",
    },
    info: {
      bg: "bg-[#EFF6FF]",
      border: "border-[#CCE0FF]",
      text: "text-[#050B3F]",
      badgeBg: "bg-[#2563EB]",
      icon: <Info className="w-3.5 h-3.5 text-white stroke-[3]" />,
      closeBtn: "bg-blue-900/[0.06] hover:bg-blue-900/[0.12] text-[#44517C] hover:text-[#050B3F]",
    },
    warning: {
      bg: "bg-[#FEF7EC]",
      border: "border-[#FBE0B5]",
      text: "text-[#2A1800]",
      badgeBg: "bg-[#F59E0B]",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-white stroke-[3]" />,
      closeBtn: "bg-black/[0.05] hover:bg-black/[0.1] text-[#58432A] hover:text-[#2A1800]",
    },
  };

  const config = configs[type] || configs.success;

  return (
    <motion.div
      role="alert"
      aria-live="polite"
      initial={{ opacity: 0, scale: 0.72, y: -20 }}
      animate={
        t?.visible
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.8, y: -12 }
      }
      transition={{
        type: "spring",
        stiffness: 440,
        damping: 24,
        mass: 0.75,
      }}
      className={`
        pointer-events-auto flex items-center gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3
        rounded-[16px] shadow-[0_12px_32px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.08)]
        border ${config.border} ${config.bg} ${config.text}
        min-w-[270px] max-w-sm sm:max-w-md select-none font-sora
      `}
    >
      {/* Icon Badge with subtle entrance bounce */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.08, type: "spring", stiffness: 480, damping: 20 }}
        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${config.badgeBg} flex items-center justify-center shrink-0 shadow-sm`}
      >
        {config.icon}
      </motion.div>

      {/* Message Text */}
      <span className="font-semibold text-[13px] sm:text-[13.5px] tracking-tight leading-snug flex-1 break-words">
        {typeof message === "string"
          ? message
          : typeof message === "object" && message !== null
          ? message.response?.data?.message || message.message || message.error || "An error occurred"
          : String(message || "")}
      </span>

      {/* Close Button */}
      {t && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toast.dismiss(t.id);
          }}
          className={`ml-1.5 w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full ${config.closeBtn} transition-all flex items-center justify-center shrink-0 cursor-pointer`}
          aria-label="Dismiss toast"
        >
          <X className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      )}
    </motion.div>
  );
}
