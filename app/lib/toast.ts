/**
 * This is a wrapper for the Toastify component
 * Reference: https://github.com/apvarun/toastify-js/blob/master/README.md
 */

import Toastify from "toastify-js";

interface ToastProps {
  status: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export const Toast = ({ status, message }: ToastProps) => {
  const getBackgroundColor = (status: typeof message) => {
    switch (status) {
      case 'info':
        return '#50C5B7';
      case 'error':
        return '#cf2c4f';
      case 'warning':
        return '#ffad02';
      case 'success':
        return '#32965d';
      default:
        return '#50C5B7';
    }
  }

  Toastify({
    className: `bg-warning toastify-${status}`,
    text: message,
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: getBackgroundColor(status),
    }
  }).showToast();
}