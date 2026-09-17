import {
  ShieldCheck,
  FileCheck,
  IndianRupee,
  BadgeCheck,
  Clock3,
} from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";

const items = [
  { icon: <ShieldCheck size={15} />, key: "inspectedBadgeTitle" },
  { icon: <FileCheck size={15} />, key: "rcBadgeTitle" },
  { icon: <IndianRupee size={15} />, key: "priceBadgeTitle" },
  { icon: <BadgeCheck size={15} />, key: "verifiedTagline" },
  { icon: <Clock3 size={15} />, key: "readyForDelivery" },
] as const;

const TrustTicker = () => {
  const { t } = useLanguage();

  const renderRow = () => (
    <>
      {items.map((item) => (
        <span
          key={item.key}
          className="flex shrink-0 items-center gap-2 px-6 text-xs font-bold tracking-wide text-moss sm:text-sm"
        >
          <span className="text-maroon-600">{item.icon}</span>
          <span>{t(item.key)}</span>
          <span className="ml-6 h-1 w-1 rounded-full bg-maroon-300" />
        </span>
      ))}
    </>
  );

  return (
    <div className="marquee marquee-mask border-y border-hairedge/80 bg-paper-soft py-3">
      <div className="marquee-track">
        <div className="flex items-center">{renderRow()}</div>
        <div className="flex items-center" aria-hidden="true">
          {renderRow()}
        </div>
      </div>
    </div>
  );
};

export default TrustTicker;