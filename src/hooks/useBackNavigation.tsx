import { useNavigate, useLocation } from "react-router-dom";

/**
 * A reusable hook that handles safe back navigation.
 * - Goes back if browser history exists
 * - Falls back to a default path if opened in a new tab or direct URL
 * - Optionally preserves query params (e.g., userId)
 */
export function useSmartBackNavigation(defaultPath = "/", preserveParams = false) {
  const navigate = useNavigate();
  const location = useLocation();

  return () => {
    const hasHistory = window.history.state && window.history.state.idx > 0;

    if (hasHistory) {
      navigate(-1);
    } else {
      if (preserveParams && location.search) {
        navigate(`${defaultPath}${location.search}`, { replace: true });
      } else {
        navigate(defaultPath, { replace: true });
      }
    }
  };
}
