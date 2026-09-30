import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiPhone,
  FiUser,
  FiMapPin,
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
} from "react-icons/fi";
import { TbGasStation } from "react-icons/tb";
import { clearAuthError, registerOwner } from "../redux/slices/auth.slice";
import { showErrorToast, showSuccessToast } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import Logo from "../components/Logo";

export default function Register() {
  const [step, setStep] = useState(1);
  const [checkingPhone, setCheckingPhone] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    pumpName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearAuthError());
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const updateField = (field, value) => {
    dispatch(clearAuthError());
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = async (event) => {
    event.preventDefault();

    const nameTrim = (form.name || "").trim();
    if (!nameTrim || nameTrim.length < 3) {
      showErrorToast("Owner full name must be at least 3 characters");
      return;
    }

    const phoneTrim = (form.phone || "").trim();
    if (!/^[6-9]\d{9}$/.test(phoneTrim)) {
      showErrorToast("Enter a valid 10-digit Indian phone number");
      return;
    }

    if (!form.password || form.password.length < 4) {
      showErrorToast("Password must be at least 4 characters long");
      return;
    }

    // Check if phone number already exists before proceeding to Step 2
    try {
      setCheckingPhone(true);
      const { data } = await axiosInstance.post(API_PATHS.AUTH.CHECK_PHONE, {
        phone: phoneTrim,
      });

      if (data?.available) {
        setStep(2);
      } else {
        showErrorToast(data?.message || "Phone number is already registered");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Phone number is already registered";
      showErrorToast(errorMsg);
    } finally {
      setCheckingPhone(false);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const submit = async (event) => {
    event.preventDefault();

    const pumpNameTrim = (form.pumpName || "").trim();
    if (!pumpNameTrim || pumpNameTrim.length < 2) {
      showErrorToast("Petrol pump name must be at least 2 characters");
      return;
    }

    const addressTrim = (form.address || "").trim();
    if (!addressTrim || addressTrim.length < 3) {
      showErrorToast("Station address must be at least 3 characters");
      return;
    }

    const cityTrim = (form.city || "").trim();
    if (!cityTrim || cityTrim.length < 2) {
      showErrorToast("City must be at least 2 characters");
      return;
    }

    const stateTrim = (form.state || "").trim();
    if (!stateTrim || stateTrim.length < 2) {
      showErrorToast("State must be at least 2 characters");
      return;
    }

    const pincodeTrim = (form.pincode || "").trim();
    if (!/^[1-9][0-9]{5}$/.test(pincodeTrim)) {
      showErrorToast("Enter a valid 6-digit Indian pincode");
      return;
    }

    try {
      const payload = {
        name: form.name.trim(),
        ownerName: form.name.trim(),
        phone: form.phone.trim(),
        password: form.password,
        pumpName: pumpNameTrim,
        petrolPumpName: pumpNameTrim,
        address: addressTrim,
        city: cityTrim,
        state: stateTrim,
        pincode: pincodeTrim,
      };


      const user = await dispatch(registerOwner(payload)).unwrap();
      showSuccessToast("Owner account and petrol pump registered successfully!");
      navigate(user.role === "admin" ? "/admin/dashboard" : "/employee/my-shifts");
    } catch (err) {
      showErrorToast(err || "Unable to register");
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12 bg-white font-sora">
      {/* Left Panel: Form */}
      <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 xl:p-12 bg-white min-h-screen w-full">
        {/* Top Section: Logo */}
        <div className="flex items-center justify-start w-full">
          <Logo customTitle="Octane" />
        </div>

        {/* Heading Section */}
        <div className="mx-auto my-auto w-full max-w-[420px] py-10 px-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-2xl">
            {step === 1 ? "Create Account" : "Petrol Pump Details"}
          </h1>
          <p className="mt-1 mb-6 text-sm text-muted">
            {step === 1
              ? "Enter your details to register as a station owner."
              : "Enter your station details to configure your workspace."}
          </p>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${step === 1
                  ? "bg-brand text-white shadow-sm ring-4 ring-blue-100"
                  : "bg-emerald-500 text-white"
                  }`}
              >
                {step > 1 ? <FiCheck className="text-sm" /> : "1"}
              </div>
              <span
                className={`text-xs font-bold transition-colors ${step === 1 ? "text-slate-900" : "text-emerald-600"
                  }`}
              >
                Owner Info
              </span>
            </div>

            <div
              className={`h-[2px] flex-1 rounded transition-colors duration-300 ${step > 1 ? "bg-emerald-500" : "bg-slate-200"
                }`}
            />

            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${step === 2
                  ? "bg-brand text-white shadow-sm ring-4 ring-blue-100"
                  : "bg-slate-100 text-slate-400"
                  }`}
              >
                2
              </div>
              <span
                className={`text-xs font-bold transition-colors ${step === 2 ? "text-slate-900" : "text-slate-400"
                  }`}
              >
                Pump Details
              </span>
            </div>
          </div>

          {/* Middle Section: Form Container */}

          {/* STEP 1: Owner Information */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="mt-8 space-y-6">
              <label className="block">
                <span className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Full Name
                </span>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-blue-100"
                    placeholder="e.g. Vikram Sharma"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Phone Number
                </span>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
                  <input
                    type="tel"
                    className="w-full rounded-lg border border-slate-200 bg-white py-3.5 pl-11 pr-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-blue-100"
                    placeholder="9876543210"
                    value={form.phone}
                    maxLength={10}
                    onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Password
                </span>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-lg border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-blue-100"
                    placeholder="Create a password (min 6 chars)"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-400 hover:text-ink transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={checkingPhone}
                className="w-full rounded-lg bg-brand py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 pt-3"
              >
                <span>{checkingPhone ? "Verifying Phone..." : "Pump Details"}</span>
                {!checkingPhone && <FiArrowRight className="text-base" />}
              </button>
            </form>
          )}

          {/* STEP 2: Petrol Pump Details */}
          {step === 2 && (
            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block">
                <span className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Petrol Pump Name
                </span>
                <div className="relative">
                  <TbGasStation className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-blue-100"
                    placeholder="e.g. City Express Fuel"
                    value={form.pumpName}
                    onChange={(e) => updateField("pumpName", e.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Station Address
                </span>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-blue-100"
                    placeholder="e.g. Plot 12, Main Highway"
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    required
                  />
                </div>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="block">
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                    City
                  </span>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white py-3.5 px-3.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-blue-100"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    required
                  />
                </label>

                <label className="block">
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                    State
                  </span>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white py-3.5 px-3.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-blue-100"
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    required
                  />
                </label>

                <label className="block">
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                    Pincode
                  </span>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white py-3.5 px-3.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-blue-100"
                    placeholder="6 digits"
                    value={form.pincode}
                    maxLength={6}
                    onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="rounded-lg border border-slate-200 bg-white py-3.5 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2"
                >
                  <FiArrowLeft className="text-base" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-brand py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? "Registering Station..." : "Complete Registration"}
                </button>
              </div>
            </form>
          )}

          {/* Login Link */}
          <div className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-brand hover:underline">
              Log in here
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center text-xs text-slate-400 w-full mt-6">
          <p>© {new Date().getFullYear()} Octane — Smart Fuel Station Management</p>
        </div>
      </div>

      {/* Right Panel: Promotional/Illustration Card */}
      <div className="hidden lg:flex lg:col-span-7 relative overflow-hidden bg-gradient-to-br from-brand via-[#1650e6] to-[#040930] justify-center items-center p-8 xl:p-16 min-h-screen">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-400/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[100px]" />

        {/* Grid Background Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">
          <h2 className="text-3xl font-extrabold text-white xl:text-4xl leading-tight tracking-tight">
            Scale your fuel retail business with complete data privacy.
          </h2>
          <p className="mt-4 text-base text-blue-100 max-w-md font-normal leading-relaxed opacity-90">
            Each petrol pump gets its own isolated database scope, intelligent shift management, automated fuel price tracking, and Gemini AI assistant.
          </p>

          {/* Floating Dashboard Illustration */}
          <div className="relative mt-12 w-full rounded-2xl bg-white/5 p-4 backdrop-blur-md border border-white/10 shadow-2xl transition hover:scale-[1.02] duration-500">
            {/* Header circles mimicking web window */}
            <div className="flex gap-1.5 mb-3 border-b border-white/5 pb-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>
            {/* Mock Dashboard Image */}
            <img
              src="/petrol_dashboard.png"
              alt="Petrol Pump Dashboard Mockup"
              className="rounded-lg shadow-lg border border-white/10 w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
