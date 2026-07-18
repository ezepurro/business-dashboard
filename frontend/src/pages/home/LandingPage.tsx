import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          eyebrow={t('landing.deepDive.ingestion.eyebrow')}
          title={t('landing.deepDive.ingestion.title')}
          description={t('landing.deepDive.ingestion.description')}
          bullets={t('landing.deepDive.ingestion.bullets', { returnObjects: true }) as string[]}
          visual={<IngestionPanelMock />}
        />

        <DeepDiveSection
          id="kpis"
          icon={ChartIcon}
          eyebrow={t('landing.deepDive.kpis.eyebrow')}
          title={t('landing.deepDive.kpis.title')}
          description={t('landing.deepDive.kpis.description')}
          bullets={t('landing.deepDive.kpis.bullets', { returnObjects: true }) as string[]}
          visual={<KpiPanelDemo />}
          reverse
        />

        <DeepDiveSection
          id="workspaces"
          icon={GridIcon}
          eyebrow={t('landing.deepDive.workspaces.eyebrow')}
          title={t('landing.deepDive.workspaces.title')}
          description={t('landing.deepDive.workspaces.description')}
          bullets={t('landing.deepDive.workspaces.bullets', { returnObjects: true }) as string[]}
          visual={<WorkspacePanelMock />}
        />

        <FaqAccordion />
        {!isAuthenticated && <ClosingCta />}
      </div>
    </div>
  );
}
