import React from "react";
import toast from "react-hot-toast";
import CustomToast from "../components/CustomToast";

/**
 * Custom Toast Helpers
 * Triggers toast notifications styled with the custom Octane design.
 */

const normalizeToastMessage = (msg, fallback = "An unexpected error occurred") => {
  if (!msg) return fallback;
  if (typeof msg === "string") return msg;
  if (typeof msg === "object") {
    return (
      msg.response?.data?.message ||
      msg.message ||
      msg.error ||
      fallback
    );
  }
  return String(msg);
};

export const showSuccessToast = (message, options = {}) => {
  toast.dismiss();
  const safeMsg = normalizeToastMessage(message, "Operation successful");
  return toast.custom(
    (t) => React.createElement(CustomToast, { t, message: safeMsg, type: "success" }),
    {
      duration: 3500,
      ...options,
    }
  );
};

export const showErrorToast = (message, options = {}) => {
  toast.dismiss();
  const safeMsg = normalizeToastMessage(message, "An error occurred");
  return toast.custom(
    (t) => React.createElement(CustomToast, { t, message: safeMsg, type: "error" }),
    {
      duration: 4000,
      ...options,
    }
  );
};

export const showInfoToast = (message, options = {}) => {
  toast.dismiss();
  return toast.custom(
    (t) => React.createElement(CustomToast, { t, message, type: "info" }),
    {
      duration: 3500,
      ...options,
    }
  );
};

export const showWarningToast = (message, options = {}) => {
  toast.dismiss();
  return toast.custom(
    (t) => React.createElement(CustomToast, { t, message, type: "warning" }),
    {
      duration: 3500,
      ...options,
    }
  );
};

export default {
  success: showSuccessToast,
  error: showErrorToast,
  info: showInfoToast,
  warning: showWarningToast,
};