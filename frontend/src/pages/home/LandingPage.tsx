import { HeroSection } from '../../components/landing/HeroSection';
import { SpecsStrip } from '../../components/landing/SpecsStrip';
import { PillarsRow } from '../../components/landing/PillarsRow';
import { StackStrip } from '../../components/landing/StackStrip';
import { ProductOfferings } from '../../components/landing/ProductOfferings';
import { DeepDiveSection } from '../../components/landing/DeepDiveSection';
import { IngestionPanelMock } from '../../components/landing/IngestionPanelMock';
import { KpiPanelDemo } from '../../components/landing/KpiPanelDemo';
import { WorkspacePanelMock } from '../../components/landing/WorkspacePanelMock';
import { FaqAccordion } from '../../components/landing/FaqAccordion';
import { ClosingCta } from '../../components/landing/ClosingCta';
import { ChartIcon, GridIcon, UploadIcon } from '../../components/landing/icons';
import { useAuth } from '../../hooks/useAuth';

export function LandingPage() {
  const { status } = useAuth();
  const isAuthenticated = status === 'authenticated';

  return (
    <div className="flex flex-col">
      <div className="theme-landing">
        <HeroSection />
      </div>

      <SpecsStrip />
      <PillarsRow />
      <StackStrip />
      <ProductOfferings />

      <div className="theme-landing">
        <DeepDiveSection
          id="ingestion"
          icon={UploadIcon}
          eyebrow="Ingestion"
          title="Every upload is validated before it's stored"
          description="Sales exports rarely arrive clean. Business Dashboard checks extension, MIME type and size the moment a file lands, so bad uploads fail fast instead of silently breaking a report."
          bullets={[
            '.csv and .xlsx, up to 15MB per file',
            'Files are validated before they ever reach storage',
            'A clear status — uploaded, processing, ready, or failed — for every dataset',
          ]}
          visual={<IngestionPanelMock />}
        />

        <DeepDiveSection
          id="kpis"
          icon={ChartIcon}
          eyebrow="Analysis"
          title="From raw rows to a boardroom-ready number"
          description="Once a dataset finishes processing, the numbers that actually drive decisions are computed automatically — no spreadsheet formulas, no manual pivot tables."
          bullets={[
            'Total revenue, average ticket and total orders at a glance',
            'Top-selling product surfaced automatically',
            'Monthly revenue trends, ready to chart',
          ]}
          visual={<KpiPanelDemo />}
          reverse
        />

        <DeepDiveSection
          id="workspaces"
          icon={GridIcon}
          eyebrow="Workspaces"
          title="Run every company from one account"
          description="Manage a portfolio of businesses without mixing their data. Each company keeps its own datasets, currency and history, isolated from every other workspace you own."
          bullets={[
            'Create as many company workspaces as you need',
            'Each one keeps its own currency, industry and dataset history',
            'Switch between businesses in a single click',
          ]}
          visual={<WorkspacePanelMock />}
        />

        <FaqAccordion />
        {!isAuthenticated && <ClosingCta />}
      </div>
    </div>
  );
}
