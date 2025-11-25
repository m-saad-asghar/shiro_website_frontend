import { useState, useEffect } from "react";
import { PASSWORD_CONFIG } from "@/config/passwordConfig";

interface UsePasswordProtectionReturn {
  isAccessGranted: boolean;
  grantAccess: () => void;
  revokeAccess: () => void;
  checkAccess: () => boolean;
}

export const usePasswordProtection = (): UsePasswordProtectionReturn => {
  const [isAccessGranted, setIsAccessGranted] = useState(false);

  // Check access status
  const checkAccess = (): boolean => {
    // In development mode, can skip protection
    if (
      import.meta.env.DEV &&
      !PASSWORD_CONFIG.DEVELOPMENT.ENABLE_PROTECTION_IN_DEV
    ) {
      return true;
    }

    try {
      const accessStatus = localStorage.getItem(
        PASSWORD_CONFIG.STORAGE_KEYS.ACCESS_STATUS
      );
      const accessTime = localStorage.getItem(
        PASSWORD_CONFIG.STORAGE_KEYS.ACCESS_TIME
      );

      if (accessStatus !== "granted" || !accessTime) {
        return false;
      }

      // Check expiry
      const timeDiff = Date.now() - parseInt(accessTime);
      if (timeDiff > PASSWORD_CONFIG.ACCESS_EXPIRY_TIME) {
        // Expired, delete data
        localStorage.removeItem(PASSWORD_CONFIG.STORAGE_KEYS.ACCESS_STATUS);
        localStorage.removeItem(PASSWORD_CONFIG.STORAGE_KEYS.ACCESS_TIME);
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  // Grant access
  const grantAccess = (): void => {
    try {
      localStorage.setItem(
        PASSWORD_CONFIG.STORAGE_KEYS.ACCESS_STATUS,
        "granted"
      );
      localStorage.setItem(
        PASSWORD_CONFIG.STORAGE_KEYS.ACCESS_TIME,
        Date.now().toString()
      );
      setIsAccessGranted(true);
    } catch (error) {
      // Error granting access
    }
  };

  // Revoke access
  const revokeAccess = (): void => {
    try {
      localStorage.removeItem(PASSWORD_CONFIG.STORAGE_KEYS.ACCESS_STATUS);
      localStorage.removeItem(PASSWORD_CONFIG.STORAGE_KEYS.ACCESS_TIME);
      setIsAccessGranted(false);
    } catch (error) {
      // Error revoking access
    }
  };

  // Check access on page load
  useEffect(() => {
    const accessGranted = checkAccess();
    setIsAccessGranted(accessGranted);

    // Add listener for localStorage changes (for switching between tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === PASSWORD_CONFIG.STORAGE_KEYS.ACCESS_STATUS ||
        e.key === PASSWORD_CONFIG.STORAGE_KEYS.ACCESS_TIME
      ) {
        const accessGranted = checkAccess();
        setIsAccessGranted(accessGranted);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Periodic validity check (every minute)
    const interval = setInterval(() => {
      const accessGranted = checkAccess();
      setIsAccessGranted(accessGranted);
    }, 60000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return {
    isAccessGranted,
    grantAccess,
    revokeAccess,
    checkAccess,
  };
};

// Export password settings for use in other components
export { PASSWORD_CONFIG } from "@/config/passwordConfig";
