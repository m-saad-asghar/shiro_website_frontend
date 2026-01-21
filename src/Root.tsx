import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Footer, Header } from "./Components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TypesContextProvider from "./Context/TypesContext";
import { ValueProvider } from "./Context/ValueContext";
import { FavoiteProvider } from "./Context/FavoiteContext";
import { AreaUnitProvider } from "./Context/AreaUnitContext";
import { Toaster } from "@/Components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ScrollToTop from "./Components/ScrollToTop";
import PasswordProtection from "./Components/PasswordProtection";
import { usePasswordProtection } from "./hooks/usePasswordProtection";
import FormEnricher from "./Components/FormEnricher";

const Root = () => {
  const location = useLocation();
  const { isAccessGranted, grantAccess } = usePasswordProtection();

  const queryClient = new QueryClient({
    // your existing options (unchanged)
  });

  const isAuthRoute =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgotpassword" ||
    location.pathname === "/myproperty";

  if (!isAccessGranted) {
    return (
      <QueryClientProvider client={queryClient}>
        <PasswordProtection onSuccess={grantAccess} />
      </QueryClientProvider>
    );
  }

  return (
    <>
      {/* ✅ Runs on every route change – enriches all forms */}
      <FormEnricher />

      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
          <ValueProvider>
            <FavoiteProvider>
              <TypesContextProvider>
                <AreaUnitProvider>
                  <div className="App">
                    {isAuthRoute ? (
                      <Outlet />
                    ) : (
                      <>
                        <Header />

                        {/* push body below header */}
                        <main className="pt-[0px] md:pt-[80px] lg:pt-[87.2px] sm:pt-[0px]">
                          <Outlet />
                        </main>

                        <Footer />
                      </>
                    )}

                    <Toaster />
                    <ScrollToTop />
                  </div>
                </AreaUnitProvider>
              </TypesContextProvider>
            </FavoiteProvider>
          </ValueProvider>
        </GoogleOAuthProvider>
      </QueryClientProvider>

      <ScrollRestoration />
    </>
  );
};

export default Root;