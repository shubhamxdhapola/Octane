import { TbGasStation } from "react-icons/tb";
import { useSelector } from "react-redux";

export default function Logo({
  compact = false,
  isLogo = true,
  customTitle = null,
  customSubtitle = null,
}) {
  const brandName = customTitle || "Octane";
  const subtitle = customSubtitle || "Smart Fuel Station Management";

  return (
    <div className="flex items-center gap-2.5">
      {isLogo && (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand to-blue-500 text-white shadow-md shadow-brand/20 shrink-0">
          <TbGasStation className="text-2xl" />
        </div>
      )}
      {!compact && (
        <div className="flex flex-col justify-center min-w-0 text-left">
          <div className="text-lg font-extrabold leading-tight tracking-tight text-slate-800 whitespace-nowrap truncate max-w-[190px]" title={brandName}>
            {brandName}
          </div>
          <div className="text-[10px] font-bold tracking-wider uppercase text-brand/80 flex items-center gap-1 whitespace-nowrap">
            <span className="whitespace-nowrap">{subtitle}</span>
          </div>
        </div>
      )}
    </div>
  );
}

