// Import all developer logos
import EMAAR from "../../Images/developer-logos/EMAAR.webp";
import Damac from "../../Images/developer-logos/Damac.webp";
import SOBHA from "../../Images/developer-logos/SOBHA.webp";
import AZIZI from "../../Images/developer-logos/AZIZI.webp";
import Binghatti from "../../Images/developer-logos/Binghatti.webp";
import SAMANA from "../../Images/developer-logos/SAMANA.webp";
import REEF from "../../Images/developer-logos/REEF.webp";
import OCTA from "../../Images/developer-logos/OCTA.webp";
import AVENEW from "../../Images/developer-logos/AVENEW.webp";
import AARK from "../../Images/developer-logos/AARK.webp";
import Empire from "../../Images/developer-logos/Empire.webp";
import GulfLand from "../../Images/developer-logos/Gulf Land.webp";
import Select from "../../Images/developer-logos/Select.webp";
import Wellington from "../../Images/developer-logos/Wellington.webp";
import ZED from "../../Images/developer-logos/ZED.webp";
import Dar from "../../Images/developer-logos/Dar.webp";
import Reportage from "../../Images/developer-logos/Reportage.webp";
import Rijas from "../../Images/developer-logos/Rijas.webp";
import SAAS from "../../Images/developer-logos/SAAS.webp";
import thoe from "../../Images/developer-logos/thoe.webp";
import AjmalMakan from "../../Images/developer-logos/Ajmal-Makan.webp";
import AYS from "../../Images/developer-logos/AYS.webp";
import Acube from "../../Images/developer-logos/Acube.webp";
import AHS from "../../Images/developer-logos/AHS.webp";
import Bamx from "../../Images/developer-logos/Bamx.webp";
import Condor from "../../Images/developer-logos/Condor.webp";
import DevCore from "../../Images/developer-logos/DevCore.webp";
import Dugasta from "../../Images/developer-logos/Dugasta.webp";
import Ellington from "../../Images/developer-logos/Ellington.webp";
import gbLogo from "../../Images/developer-logos/gb_logo.webp";
import HRE from "../../Images/developer-logos/HRE.webp";
import imtiaz from "../../Images/developer-logos/imtiaz.webp";
import LAYA from "../../Images/developer-logos/LAYA.webp";
import MAK from "../../Images/developer-logos/MAK.webp";
import MIRA from "../../Images/developer-logos/MIRA.webp";
import Omniyat from "../../Images/developer-logos/Omniyat.webp";

// Map company names to their websites
const companyUrls: { [key: string]: string } = {
  AARK: "https://aarkdevelopers.com/",
  ACUBE: "https://acubedevelopments.com/",
  AHS: "https://ahs-properties.com/",
  "AJMAL MAKAN": "https://ajmalmakan.com/",
  AVENEW: "https://www.avenewdevelopment.ae/",
  AYS: "https://aysdevelopers.ae/",
  AZIZI: "https://www.azizidevelopments.com/",
  BAMX: "https://bamx.ae/",
  BINGHATTI: "https://www.binghattiproperties.co/",
  CONDOR: "https://condordevelopers.com/",
  DAMAC: "https://www.damacproperties.com/",
  DAR: "https://darglobal.co.uk/",
  DEVCORE: "https://devcoreproperties.com/",
  DUGASTA: "https://dugasta.com/",
  ELLINGTON: "https://www.ellingtonproperties.co/",
  EMAAR: "https://www.emaar.com/",
  EMPIRE: "https://empiredevelopments.ae/",
  GB: "https://goldenbridgeuae.com/",
  "GULF LAND": "https://www.gulflandproperty.com/",
  HRE: "https://hredev.com/",
  IMTIAZ: "https://imtiaz.ae/",
  LAYA: "https://layadevelopers.com/",
  MAK: "https://makdevelopers.com/",
  OCTA: "https://www.octaproperties.com/",
  OMNIYAT: "https://www.omniyat.com/",
  PANTHEON: "https://pantheondevelopment.ae/",
  RABDAN: "https://rabdan.ae/",
  REEF: "https://reefdevelopments.ae/",
  REPORTAGE: "https://reportageuae.com/",
  RIJAS: "https://rijasdubai.com/",
  SAAS: "https://saasproperties.com/",
  SAMANA: "https://www.samanadevelopers.com/",
  SELECT: "https://www.select-group.ae/",
  SOBHA: "https://www.sobhaproperties.co/",
  THOE: "https://thoe.com/",
  WELLINGTON: "https://wellingtondevelopments.ae/",
  ZED: "https://zedcapital.ae/",
};

// Helper function to get website URL by company name
const getWebsiteUrl = (name: string): string | undefined => {
  const normalizedName = name.toUpperCase();
  return (
    companyUrls[normalizedName] ||
    companyUrls[normalizedName.replace(/\s+/g, " ")]
  );
};

export const DeveloperPartners = () => {
  const partners = [
    { id: 1, img: EMAAR, name: "Emaar" },
    { id: 2, img: Damac, name: "Damac" },
    { id: 3, img: SOBHA, name: "Sobha" },
    { id: 4, img: AZIZI, name: "Azizi" },
    { id: 5, img: Binghatti, name: "Binghatti" },
    { id: 6, img: SAMANA, name: "Samana" },
    { id: 7, img: REEF, name: "Reef" },
    { id: 8, img: OCTA, name: "Octa" },
    { id: 9, img: AVENEW, name: "Avenew" },
    { id: 10, img: AARK, name: "Aark" },
    { id: 11, img: Empire, name: "Empire" },
    { id: 12, img: GulfLand, name: "Gulf Land" },
    { id: 13, img: Select, name: "Select" },
    { id: 14, img: Wellington, name: "Wellington" },
    { id: 15, img: ZED, name: "Zed" },
    { id: 16, img: Dar, name: "Dar" },
    { id: 17, img: Reportage, name: "Reportage" },
    { id: 18, img: Rijas, name: "Rijas" },
    { id: 19, img: SAAS, name: "Saas" },
    { id: 20, img: thoe, name: "Thoe" },
    { id: 21, img: AjmalMakan, name: "Ajmal Makan" },
    { id: 22, img: AYS, name: "Ays" },
    { id: 23, img: Acube, name: "Acube" },
    { id: 24, img: AHS, name: "Ahs" },
    { id: 25, img: Bamx, name: "Bamx" },
    { id: 26, img: Condor, name: "Condor" },
    { id: 27, img: DevCore, name: "DevCore" },
    { id: 28, img: Dugasta, name: "Dugasta" },
    { id: 29, img: Ellington, name: "Ellington" },
    { id: 30, img: gbLogo, name: "GB" },
    { id: 31, img: HRE, name: "HRE" },
    { id: 32, img: imtiaz, name: "Imtiaz" },
    { id: 33, img: LAYA, name: "Laya" },
    { id: 34, img: MAK, name: "Mak" },
    { id: 35, img: MIRA, name: "Mira" },
    { id: 36, img: Omniyat, name: "Omniyat" },
  ];

  // Add website URL to each partner
  return partners.map((partner) => ({
    ...partner,
    website: getWebsiteUrl(partner.name),
  }));
};
