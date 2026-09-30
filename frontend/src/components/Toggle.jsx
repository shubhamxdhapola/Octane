import React, { useState, useRef, useEffect } from "react";

export default function Toggle({
  checked = false,
  onChange,
  disabled = false,
  loading = false,
  className = "",
  title,
}) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const isBusy = Boolean(loading || internalLoading);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (disabled || isBusy) return;

    const nextVal = !checked;
    if (!onChange) return;

    try {
      const result = onChange(nextVal);
      if (result && typeof result.then === "function") {
        setInternalLoading(true);
        await result;
      }
    } catch (err) {
      console.error("Toggle error:", err);
    } finally {
      if (isMounted.current) {
        setInternalLoading(false);
      }
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-busy={isBusy}
      disabled={disabled || isBusy}
      onClick={handleClick}
      title={title || (isBusy ? "Updating..." : checked ? "Deactivate" : "Activate")}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        checked ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-300 hover:bg-slate-400"
      } ${
        disabled || isBusy ? "cursor-wait opacity-80" : "cursor-pointer"
      } ${className}`}
    >
      <span
        className={`pointer-events-none flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      >
        {isBusy ? (
          <svg
            className={`h-3.5 w-3.5 animate-spin ${
              checked ? "text-emerald-600" : "text-slate-500"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : null}
      </span>
    </button>
  );
}
