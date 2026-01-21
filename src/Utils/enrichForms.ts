// src/Utils/enrichForms.ts
export async function enrichForms() {
  function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    const utms: Record<string, string> = {};

    for (const [key, value] of params.entries()) {
      const k = key.toLowerCase();
      if (k.startsWith("utm") || k === "gclid" || k === "gbraid" || k === "wbraid") {
        utms[k] = value;
      }
    }
    return utms;
  }

  function stripUtmFromUrl(url: string) {
    const u = new URL(url);
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "utm_id",
      "gclid",
      "gbraid",
      "wbraid",
    ].forEach((p) => u.searchParams.delete(p));
    return u.toString();
  }

  const utm = getUtmParams();
  const utmSource = (utm["utm_source"] || "").toLowerCase();
  const utmMedium = (utm["utm_medium"] || "").toLowerCase();
  const utmCampaign = utm["utm_campaign"] || "";

  const clientLang = navigator.language || "";
  const pageLang = document.documentElement.getAttribute("lang") || "";
  const ymuid = (document.cookie.match(/_ym_uid=([^;]+)/) || [])[1] || "";
  const landingUrl = stripUtmFromUrl(window.location.href);

  const ref = (document.referrer || "").toLowerCase();
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;

  // ✅ cache IP so it doesn't fetch every route change
  let clientIp = sessionStorage.getItem("client_ip") || "";
  if (!clientIp) {
    try {
      const res = await fetch("https://ipapi.co/json");
      if (res.ok) {
        const ipdata = await res.json();
        clientIp = ipdata.ip || "";
        if (clientIp) sessionStorage.setItem("client_ip", clientIp);
      }
    } catch {
      // ignore
    }
  }

  let marketingSource = "Direct / Other";
  let marketingCampaign = "";

  const gclidCombined =
    utm["gclid"] ||
    utm["gbraid"] ||
    utm["wbraid"] ||
    localStorage.getItem("gclid") ||
    localStorage.getItem("gbraid") ||
    localStorage.getItem("wbraid") ||
    "";

  if (
    gclidCombined ||
    ["cpc", "ppc", "paidsearch", "sem"].includes(utmMedium) ||
    (utmSource === "google" && ["cpc", "ppc"].includes(utmMedium))
  ) {
    marketingSource = "Google Ads";
    marketingCampaign = utmCampaign || "Google Ads Campaign";
  } else if (
    ["facebook", "instagram", "meta", "fb", "ig"].includes(utmSource) ||
    ref.includes("facebook.com") ||
    ref.includes("instagram.com")
  ) {
    marketingSource = ["cpc", "paid_social", "paid"].includes(utmMedium)
      ? "Meta Ads (Facebook / Instagram)"
      : "Meta Organic (Facebook / Instagram)";
    marketingCampaign = utmCampaign;
  } else if (utmSource.includes("tiktok") || ref.includes("tiktok.com")) {
    marketingSource = ["cpc", "paid", "paid_social"].includes(utmMedium)
      ? "TikTok Ads"
      : "TikTok Organic";
    marketingCampaign = utmCampaign;
  } else if (utmSource.includes("linkedin") || ref.includes("linkedin.com")) {
    marketingSource = ["cpc", "paid", "paid_social"].includes(utmMedium)
      ? "LinkedIn Ads"
      : "LinkedIn Organic";
    marketingCampaign = utmCampaign;
  } else if (utmMedium === "email" || utmSource === "email") {
    marketingSource = "Email";
    marketingCampaign = utmCampaign;
  } else if (ref.includes("google.")) {
    marketingSource = "Google Organic";
  } else if (
    ref.includes("bing.") ||
    ref.includes("yahoo.") ||
    ref.includes("duckduckgo.") ||
    ref.includes("baidu.") ||
    ref.includes("yandex.")
  ) {
    marketingSource = "Other Search (Organic)";
  } else {
    marketingSource = !ref ? "Direct" : "Referral / Other";
    marketingCampaign = utmCampaign;
  }

  document.querySelectorAll("form").forEach((form) => {
    const add = (name: string, value: string) => {
      const existing = form.querySelector(
        `input[type="hidden"][name="${name}"]`
      ) as HTMLInputElement | null;

      if (existing) {
        existing.value = value;
        return;
      }

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    // System info
    add("client_ip", clientIp);
    add("user_agent", userAgent);
    add("platform", platform);
    add("language_of_client", clientLang);
    add("page_language", pageLang);
    add("ymuid", ymuid);

    // Raw UTMs
    add("utm_source", utm["utm_source"] || "");
    add("utm_medium", utm["utm_medium"] || "");
    add("utm_campaign", utm["utm_campaign"] || "");
    add("utm_term", utm["utm_term"] || "");
    add("utm_content", utm["utm_content"] || "");
    add("utm_id", utm["utm_id"] || "");

    // Bitrix "source"
    add("source", utm["utm_source"] || "");

    // gclid / gbraid / wbraid
    add("gclid", utm["gclid"] || localStorage.getItem("gclid") || "");
    add("gbraid", utm["gbraid"] || localStorage.getItem("gbraid") || "");
    add("wbraid", utm["wbraid"] || localStorage.getItem("wbraid") || "");

    // Clean landing URL
    add("landing_page_url", landingUrl);

    // Final classified marketing values
    add("marketing_source", marketingSource);
    add("marketing_campaign", marketingCampaign);
  });
}