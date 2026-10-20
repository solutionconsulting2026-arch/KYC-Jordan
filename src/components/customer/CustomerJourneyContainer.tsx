import React from 'react';
import { OnboardingStep, GeneratedAccount, PnbProduct } from '../../types/banking.types';
import { DemoScenario } from '../../data/scenarios';
import { LandingScreen } from './LandingScreen';
import { IntakeScreen } from './IntakeScreen';
import { RecommendationScreen } from './RecommendationScreen';
import { DocumentIntelScreen } from './DocumentIntelScreen';
import { KycScreen } from './KycScreen';
import { AmlScreen } from './AmlScreen';
import { RiskScreen } from './RiskScreen';
import { ReviewScreen } from './ReviewScreen';
import { ConsentScreen } from './ConsentScreen';
import { AccountOpeningScreen } from './AccountOpeningScreen';
import { ActivationScreen } from './ActivationScreen';
import { CustomerDashboardScreen } from './CustomerDashboardScreen';
import { NextBestActionScreen } from './NextBestActionScreen';

interface CustomerJourneyContainerProps {
  currentStep: OnboardingStep;
  scenario: DemoScenario;
  selectedProduct: PnbProduct;
  onSelectProduct: (prod: PnbProduct) => void;
  account: GeneratedAccount;
  onStepChange: (step: OnboardingStep) => void;
  speed: 'normal' | 'fast';
  onTriggerHITL: () => void;
  onExploreProduct: (name: string) => void;
}

export const CustomerJourneyContainer: React.FC<CustomerJourneyContainerProps> = ({
  currentStep,
  scenario,
  selectedProduct,
  onSelectProduct,
  account,
  onStepChange,
  speed,
  onTriggerHITL,
  onExploreProduct,
}) => {
  switch (currentStep) {
    case 'landing':
      return (
        <LandingScreen
          onStart={() => onStepChange('intake')}
          onExploreProducts={() => onStepChange('recommendation')}
        />
      );

    case 'intake':
      return (
        <IntakeScreen
          customer={scenario.customer}
          initialQuery={scenario.intakeText}
          onProceed={() => onStepChange('recommendation')}
          speed={speed}
        />
      );

    case 'recommendation':
      return (
        <RecommendationScreen
          customer={scenario.customer}
          selectedProduct={selectedProduct}
          onSelectProduct={onSelectProduct}
          onProceed={() => onStepChange('documents')}
        />
      );

    case 'documents':
      return (
        <DocumentIntelScreen
          scenario={scenario}
          onProceed={() => onStepChange('kyc')}
          speed={speed}
        />
      );

    case 'kyc':
      return (
        <KycScreen
          scenario={scenario}
          onProceed={() => onStepChange('aml')}
          speed={speed}
        />
      );

    case 'aml':
      return (
        <AmlScreen
          scenario={scenario}
          onProceed={() => onStepChange('risk')}
          speed={speed}
        />
      );

    case 'risk':
      return (
        <RiskScreen
          scenario={scenario}
          onProceed={() => onStepChange('review')}
          speed={speed}
          onTriggerHITL={onTriggerHITL}
        />
      );

    case 'review':
      return (
        <ReviewScreen
          customer={scenario.customer}
          product={selectedProduct}
          onConfirm={() => onStepChange('consent')}
          onEdit={() => onStepChange('intake')}
        />
      );

    case 'consent':
      return (
        <ConsentScreen
          onSubmit={() => onStepChange('account_opening')}
        />
      );

    case 'account_opening':
      return (
        <AccountOpeningScreen
          customer={scenario.customer}
          product={selectedProduct}
          account={account}
          onProceed={() => onStepChange('activation')}
          speed={speed}
        />
      );

    case 'activation':
      return (
        <ActivationScreen
          customer={scenario.customer}
          account={account}
          onProceedToDashboard={() => onStepChange('dashboard')}
        />
      );

    case 'dashboard':
      return (
        <CustomerDashboardScreen
          customer={scenario.customer}
          product={selectedProduct}
          account={account}
          onExploreNextBestAction={() => onStepChange('next_best_action')}
        />
      );

    case 'next_best_action':
      return (
        <NextBestActionScreen
          customer={scenario.customer}
          onBackToDashboard={() => onStepChange('dashboard')}
          onExploreProduct={onExploreProduct}
        />
      );

    default:
      return (
        <LandingScreen
          onStart={() => onStepChange('intake')}
          onExploreProducts={() => onStepChange('recommendation')}
        />
      );
  }
};
