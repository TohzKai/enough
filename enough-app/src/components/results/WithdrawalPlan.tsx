import { useTranslation } from "react-i18next";
import { Card } from "../ui";
import { GapCloser } from "../GapCloser";
import { FundingSequence } from "../FundingSequence";
import { ProtectionReferral } from "../ProtectionReferral";
import type { ResultViewModel } from "./resultModel";

interface WithdrawalPlanProps {
  vm: ResultViewModel;
}

/**
 * "Withdrawal Plan" — the third Results tab. Action-oriented: guardrail,
 * gap-closing, funding sequence, protection referrals. Provider names
 * sit inside a collapsed "Illustrative licensed providers" section so the
 * default view is not a product list.
 */
export function WithdrawalPlan({ vm }: WithdrawalPlanProps) {
  const { t } = useTranslation();
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-enough-navy safe-break">
        {t("results.tabAction")}
      </h2>
      <p className="readable text-sm text-enough-slate">
        {t("results.optionsToExploreNote")}
      </p>
      <GapCloser inputs={vm.inputs} gap={vm.gap} />
      <FundingSequence inputs={vm.inputs} centralSpend={vm.saferCentral} />
      <ProtectionReferral inputs={vm.inputs} />
      <Card>
        <h3 className="text-base font-bold text-enough-navy mb-2">
          {t("results.optionsToExplore")}
        </h3>
        <p className="text-sm text-enough-slate">
          {t("results.optionsToExploreNote")}
        </p>
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-semibold text-enough-navy">
            {t("results.providersHeading")}
          </summary>
          <p className="text-xs text-enough-slate mt-1">
            {t("results.providersNote")}
          </p>
        </details>
      </Card>
    </section>
  );
}
