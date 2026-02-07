//////------THIS UTILITY TOAST IS NOT YET IN USE-----///////
import { toast, ToastOptions } from 'react-toastify';

// Base toast styling options
const baseToastOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  className: 'rounded-lg shadow-lg',
  // bodyClassName: 'text-sm font-medium',
};

// Custom success toast with your brand colors
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    ...baseToastOptions,
    className:
      'bg-green-800 border border-green-600 text-white rounded-lg shadow-lg',
    progressClassName: 'bg-green-400',
    ...options,
  });
};

// Custom error toast
export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    ...baseToastOptions,
    className:
      'bg-red-800 border border-red-600 text-white rounded-lg shadow-lg',
    progressClassName: 'bg-red-400',
    ...options,
  });
};

// Custom warning toast
export const showWarningToast = (message: string, options?: ToastOptions) => {
  return toast.warning(message, {
    ...baseToastOptions,
    className:
      'bg-yellow-800 border border-yellow-600 text-white rounded-lg shadow-lg',
    progressClassName: 'bg-yellow-400',
    ...options,
  });
};

// Custom info toast
export const showInfoToast = (message: string, options?: ToastOptions) => {
  return toast.info(message, {
    ...baseToastOptions,
    className:
      'bg-blue-800 border border-blue-600 text-white rounded-lg shadow-lg',
    progressClassName: 'bg-blue-400',
    ...options,
  });
};

// Custom branded toast using your app's primary color
export const showBrandedToast = (message: string, options?: ToastOptions) => {
  return toast(message, {
    ...baseToastOptions,
    className:
      'bg-[#4084B9] border border-[#4084B9] text-white rounded-lg shadow-lg',
    progressClassName: 'bg-[#488ec3]',
    ...options,
  });
};
