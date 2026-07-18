import { useTranslation } from "react-i18next";
import { Card, SectionTitle, Disclaimer, Pill } from "../components/ui";

export function Business() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <SectionTitle
        kicker={t("partners.kicker")}
        title={t("partners.title")}
        subtitle={t("partners.subtitle")}
      />

      {/* The honest position: wedge, not moat (yet) */}
      <Card className="bg-enough-navy text-white border-0">
        <h3 className="text-white text-xl font-bold">
          {t("partners.wedgeTitle")}
        </h3>
        <p className="readable text-white/85 mt-2 leading-relaxed">
          {t("partners.wedgeBody")}
        </p>
      </Card>

      {/* Problem + Why now + Why wins */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Block titleKey="partners.problemTitle" tone="red">
          <p>{t("partners.problemBody")}</p>
        </Block>
        <Block titleKey="partners.whyNowTitle" tone="amber">
          <ul className="list-disc pl-4 space-y-1">
            <li>{t("partners.whyNow1")}</li>
            <li>{t("partners.whyNow2")}</li>
            <li>{t("partners.whyNow3")}</li>
            <li>{t("partners.whyNow4")}</li>
          </ul>
        </Block>
        <Block titleKey="partners.threeTitle" tone="emerald">
          <ul className="list-disc pl-4 space-y-1">
            <li>{t("partners.three1")}</li>
            <li>{t("partners.three2")}</li>
            <li>{t("partners.three3")}</li>
          </ul>
        </Block>
      </div>

      {/* Business model — non-bank B2B2C led + family tier */}
      <Card>
        <h3 className="text-lg font-bold text-enough-navy mb-1">
          {t("partners.channelTitle")}
        </h3>
        <p className="readable text-sm text-enough-slate mb-3">
          {t("partners.channelBody")}
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <Channel
            nameKey="partners.channelWellnessName"
            tone="emerald"
            lineKeys={[
              "partners.channelWellness1",
              "partners.channelWellness2",
              "partners.channelWellness3",
              "partners.channelWellness4",
            ]}
          />
          <Channel
            nameKey="partners.channelIfaName"
            tone="amber"
            lineKeys={[
              "partners.channelIfa1",
              "partners.channelIfa2",
              "partners.channelIfa3",
            ]}
          />
          <Channel
            nameKey="partners.channelInsurerName"
            tone="navy"
            lineKeys={[
              "partners.channelInsurer1",
              "partners.channelInsurer2",
              "partners.channelInsurer3",
            ]}
          />
        </div>
        <p className="text-xs text-enough-slate mt-3">
          {t("partners.channelNote")}
        </p>
      </Card>

      {/* Regulatory + Pilot ask */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Block titleKey="partners.regTitle" tone="emerald">
          <ul className="space-y-1.5">
            <li>{t("partners.reg1")}</li>
            <li>{t("partners.reg2")}</li>
            <li>{t("partners.reg3")}</li>
            <li>{t("partners.reg4")}</li>
          </ul>
        </Block>
        <Block titleKey="partners.pilotTitle" tone="navy">
          <ul className="space-y-1.5">
            <li>{t("partners.pilot1")}</li>
            <li>{t("partners.pilot2")}</li>
            <li>{t("partners.pilot3")}</li>
            <li>{t("partners.pilot4")}</li>
          </ul>
        </Block>
      </div>

      <Card className="bg-enough-navy text-white border-0 text-center">
        <div className="text-xl md:text-2xl font-bold text-enough-emerald safe-break">
          {t("partners.closerTitle")}
        </div>
        <p className="readable mx-auto text-white/70 text-sm mt-2">
          {t("partners.closerBody")}
        </p>
      </Card>

      <Disclaimer tone="soft">{t("partners.disclaimer")}</Disclaimer>
    </div>
  );
}

function Block({
  titleKey,
  tone,
  children,
}: {
  titleKey: string;
  tone: "emerald" | "amber" | "red" | "navy";
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <Card>
      <Pill tone={tone}>{t(titleKey)}</Pill>
      <div className="mt-3 text-sm text-enough-ink space-y-1.5">{children}</div>
    </Card>
  );
}

function Channel({
  nameKey,
  tone,
  lineKeys,
}: {
  nameKey: string;
  tone: "emerald" | "amber" | "navy";
  lineKeys: string[];
}) {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl2 border border-enough-line p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="text-base font-extrabold text-enough-navy safe-break">
          {t(nameKey)}
        </div>
        <Pill tone={tone}>{t("common.channel")}</Pill>
      </div>
      <ul className="mt-2 space-y-1 text-sm text-enough-ink">
        {lineKeys.map((k) => (
          <li key={k} className="flex gap-2">
            <span className="text-enough-emerald">•</span>
            <span className="leading-snug">{t(k)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
