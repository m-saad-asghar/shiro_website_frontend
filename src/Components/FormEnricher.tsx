import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { enrichForms } from "@/Utils/enrichForms";

export default function FormEnricher() {
  const location = useLocation();

  useEffect(() => {
    // 1️⃣ Run on initial load + route change
    const t = setTimeout(() => enrichForms(), 0);

    // 2️⃣ Observe DOM changes (for modals, lazy-loaded forms)
    const observer = new MutationObserver((mutations) => {
      let shouldRun = false;

      for (const m of mutations) {
        if (
          m.type === "childList" &&
          Array.from(m.addedNodes).some(
            (node) =>
              node instanceof HTMLElement &&
              (node.tagName === "FORM" || node.querySelector?.("form"))
          )
        ) {
          shouldRun = true;
          break;
        }
      }

      if (shouldRun) {
        enrichForms();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, [location.pathname, location.search]);

  return null;
}
