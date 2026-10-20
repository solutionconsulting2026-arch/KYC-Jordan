import { AgentExecutionState, AgentId, AuditLogEntry, SupervisorState } from '../types/agent.types';
import { DemoScenario } from '../data/scenarios';
import { AGENT_DEFINITIONS, AGENT_PIPELINE_ORDER } from './agentDefinitions';

export function buildAgentStatesForScenario(
  scenario: DemoScenario,
  completedUpToAgentIndex: number
): Record<AgentId, AgentExecutionState> {
  const baseTime = new Date('2026-09-03T12:01:04Z');

  const states: Record<string, AgentExecutionState> = {};

  AGENT_PIPELINE_ORDER.forEach((agentId, index) => {
    const isCompleted = index <= completedUpToAgentIndex;
    const isRunning = index === completedUpToAgentIndex + 1;
    const isPending = index > completedUpToAgentIndex + 1;

    let status: AgentExecutionState['status'] = 'idle';
    if (isCompleted) {
      if (scenario.id === 'aml_exception' && (agentId === 'aml' || agentId === 'risk')) {
        status = 'escalated';
      } else if (scenario.id === 'doc_exception' && agentId === 'document') {
        status = 'completed'; // completed with self-healing flag
      } else {
        status = 'completed';
      }
    } else if (isRunning) {
      status = 'running';
    }

    const startSeconds = index * 12;
    const endSeconds = startSeconds + 6;
    const startTime = new Date(baseTime.getTime() + startSeconds * 1000).toLocaleTimeString();
    const endTime = new Date(baseTime.getTime() + endSeconds * 1000).toLocaleTimeString();

    switch (agentId) {
      case 'intake':
        states[agentId] = {
          id: agentId,
          status,
          startTime,
          endTime: isCompleted ? endTime : undefined,
          durationMs: AGENT_DEFINITIONS.intake.typicalLatencyMs,
          inputs: {
            userQuery: scenario.intakeText,
            customerProfile: {
              name: scenario.customer.name,
              income: scenario.customer.monthlyIncome,
              occupation: scenario.customer.occupation,
              location: scenario.customer.location,
            },
          },
          decision: isCompleted
            ? {
                outcome: 'Intent: Savings Account Opening | Customer: New-to-PNB',
                confidence: 98,
                reason: 'Customer inquiry aligns with retail savings opening. High intent confidence.',
                recommendedAction: 'Recommend PNB Select Saving Account based on ₹1.2L income bracket.',
                metrics: { 'Intent Score': '98.4%', 'Profile Tier': 'Select Salaried' },
              }
            : undefined,
          explanation:
            'Natural Language Understanding classified customer request as Retail Savings Account opening. Identified customer as New-to-PNB.',
          logs: [
            'Parsed natural language intent token stream',
            'Checked de-duplication cache: No existing CIF found for mobile +91 98XXXXXX21',
            'Mapped income ₹1,20,000/mo to PNB Select Saving Scheme eligibility matrix',
            'Yielded recommendation payload to Supervisor',
          ],
          nextAction: 'Invoke Document Intelligence Agent (PNB-DOCINTEL-02)',
        };
        break;

      case 'document':
        states[agentId] = {
          id: agentId,
          status,
          startTime,
          endTime: isCompleted ? endTime : undefined,
          durationMs: AGENT_DEFINITIONS.document.typicalLatencyMs,
          inputs: {
            documents: ['PAN_CARD_FRONT', 'AADHAAR_FRONT_BACK'],
            panNumber: scenario.customer.pan,
            aadhaarMasked: scenario.customer.aadhaarMasked,
          },
          decision: isCompleted
            ? {
                outcome: scenario.docIntelResult.hasDiscrepancy
                  ? 'Name Variation Reconciled via CKYCR'
                  : 'Documents Authenticated & Validated',
                confidence: scenario.docIntelResult.similarity,
                reason: scenario.docIntelResult.decision,
                recommendedAction: scenario.docIntelResult.actionTaken,
                flags: scenario.docIntelResult.hasDiscrepancy ? ['MINOR_NAME_MISMATCH_RESOLVED'] : [],
                metrics: {
                  'PAN OCR': '100% Validated',
                  'Aadhaar Masking': 'Enforced (XXXX-XXXX-4582)',
                  'Name Similarity': `${scenario.docIntelResult.similarity}%`,
                },
              }
            : undefined,
          explanation: scenario.docIntelResult.decision,
          logs: [
            'Vision OCR extracted PAN: ABCDE1234F, Name: ' + scenario.docIntelResult.panName,
            'Vision OCR extracted Aadhaar: ' + scenario.docIntelResult.aadhaarName,
            'Applied 8-digit masking to Aadhaar image per UIDAI guidelines',
            `Fuzzy name similarity calculated at ${scenario.docIntelResult.similarity}%`,
            scenario.docIntelResult.hasDiscrepancy
              ? 'Self-healing triggered: Corroborated with CKYCR database'
              : 'Cross-document validation passed with zero material error',
          ],
          nextAction: 'Invoke KYC Orchestration Agent (PNB-KYC-03)',
        };
        break;

      case 'kyc':
        states[agentId] = {
          id: agentId,
          status,
          startTime,
          endTime: isCompleted ? endTime : undefined,
          durationMs: AGENT_DEFINITIONS.kyc.typicalLatencyMs,
          inputs: {
            pan: scenario.customer.pan,
            name: scenario.customer.name,
            dob: scenario.customer.dob,
          },
          decision: isCompleted
            ? {
                outcome: `Selected Route: ${scenario.kycRoute.recommended}`,
                confidence: 97,
                reason: scenario.kycRoute.reason,
                recommendedAction: 'Proceed with Digital KYC without scheduling Video KYC call.',
                metrics: {
                  'CKYC Registry': scenario.kycRoute.ckycrStatus,
                  'Biometric Liveness': '98.2% Verified',
                  'Geo-tag Check': 'Valid (New Delhi, India)',
                },
              }
            : undefined,
          explanation:
            'Queried Central KYC Records Registry (CERSAI). Active verified record identified, enabling rapid Digital KYC bypass.',
          logs: [
            'Connected to CERSAI CKYCR gateway using PAN ABCDE1234F',
            'Received 14-digit KIN: 400192849201 with verified OVD documents',
            'Validated digital signature token on KYC record',
            'Confirmed customer physical presence via India IP and GPS telemetry',
          ],
          nextAction: 'Invoke AML Screening Agent (PNB-AML-04)',
        };
        break;

      case 'aml':
        states[agentId] = {
          id: agentId,
          status,
          startTime,
          endTime: isCompleted ? endTime : undefined,
          durationMs: AGENT_DEFINITIONS.aml.typicalLatencyMs,
          inputs: {
            fullName: scenario.customer.name,
            aliases: [scenario.docIntelResult.panName, scenario.docIntelResult.aadhaarName],
            dob: scenario.customer.dob,
            pan: scenario.customer.pan,
            nationality: 'Indian',
          },
          decision: isCompleted
            ? {
                outcome: scenario.amlResult.sanctionsMatch ? 'AML Alert: Potential Watchlist Match' : 'AML Screening: CLEAR',
                confidence: scenario.amlResult.confidenceScore,
                reason: scenario.amlResult.summary,
                recommendedAction: scenario.amlResult.resolution,
                flags: scenario.amlResult.sanctionsMatch ? ['WATCHLIST_POTENTIAL_HIT_84%'] : [],
                metrics: {
                  'UN Sanctions': scenario.amlResult.sanctionsMatch ? 'Flagged' : 'Clear',
                  'RBI Caution List': 'Clear',
                  'PEP Status': 'Not Politically Exposed',
                  'Fuzzy Match Score': `${scenario.amlResult.confidenceScore}%`,
                },
              }
            : undefined,
          explanation: scenario.amlResult.details,
          logs: [
            'Queried UN Security Council consolidated list (Resolution 1267/1989)',
            'Queried RBI Domestic Caution Advice Registry and CBI fugitives list',
            'Evaluated PEP database for government/legislative connections',
            scenario.amlResult.sanctionsMatch
              ? 'ALERT: Name collision 84% detected with Ministry of Home Affairs flagged entity'
              : 'Cleared: No adverse media or sanctions collisions detected',
          ],
          nextAction: scenario.amlResult.sanctionsMatch
            ? 'Escalate to Compliance Supervisor for Human-in-the-Loop review'
            : 'Invoke Risk Assessment Agent (PNB-RISK-05)',
        };
        break;

      case 'risk':
        states[agentId] = {
          id: agentId,
          status,
          startTime,
          endTime: isCompleted ? endTime : undefined,
          durationMs: AGENT_DEFINITIONS.risk.typicalLatencyMs,
          inputs: {
            customerProfile: scenario.customer,
            cibilScore: scenario.riskResult.cibilScore,
            fraudScore: scenario.riskResult.fraudPropensity,
            amlOutcome: scenario.amlResult.sanctionsMatch ? 'FLAGGED' : 'CLEAR',
          },
          decision: isCompleted
            ? {
                outcome: `Risk Tier: ${scenario.riskResult.riskTier} | ${scenario.riskResult.recommendation}`,
                confidence: scenario.riskResult.confidence,
                reason: scenario.riskResult.rationale,
                recommendedAction:
                  scenario.riskResult.riskTier === 'HIGH'
                    ? 'Halt autonomous processing. Dispatch dossier to Principal Compliance Officer.'
                    : 'Authorize Straight-Through Account Opening.',
                flags: scenario.riskResult.riskTier === 'HIGH' ? ['HIGH_RISK_FLAG'] : [],
                metrics: {
                  'CIBIL Bureau Score': scenario.riskResult.cibilScore,
                  'Fraud Propensity': `${(scenario.riskResult.fraudPropensity * 100).toFixed(1)}%`,
                  'Composite Health': `${scenario.riskResult.compositeScore}/100`,
                },
              }
            : undefined,
          explanation: scenario.riskResult.rationale,
          logs: [
            `Pulled TransUnion CIBIL score: ${scenario.riskResult.cibilScore} (Prime tier)`,
            `Calculated multi-factor fraud propensity score: ${scenario.riskResult.fraudPropensity}`,
            'Checked velocity checks: 1 application from IP/device in last 90 days',
            scenario.riskResult.riskTier === 'HIGH'
              ? 'Supervisor halted STP: Threshold exceeded for autonomous opening'
              : 'Green channel authorized: Straight-Through Processing approved',
          ],
          nextAction:
            scenario.riskResult.riskTier === 'HIGH'
              ? 'Await Human Underwriter Review'
              : 'Invoke Account Opening Agent (PNB-ACCOUNT-06)',
        };
        break;

      case 'account':
        states[agentId] = {
          id: agentId,
          status,
          startTime,
          endTime: isCompleted ? endTime : undefined,
          durationMs: AGENT_DEFINITIONS.account.typicalLatencyMs,
          inputs: {
            customerCifRequest: {
              fullName: scenario.customer.name,
              pan: scenario.customer.pan,
              mobile: scenario.customer.mobile,
            },
            schemeCode: 'SBGEN - PNB Select Savings',
            branchSolId: '0182',
          },
          decision: isCompleted
            ? {
                outcome: 'Finacle 10.x CBS Account Generated: 0182000100829145',
                confidence: 99,
                reason: 'Customer Information File (CIF) and Savings Account created atomically.',
                recommendedAction: 'Link UPI handle and dispatch welcome credentials.',
                metrics: {
                  'Finacle CIF': 'PNB774910281',
                  'Account Number': 'XXXX XXXX 4582',
                  'IFSC Code': 'PUNB0018200',
                  'CBS Host Latency': '780ms',
                },
              }
            : undefined,
          explanation:
            'Successfully orchestrated Infosys Finacle 10.x Core Banking API call. Generated Customer ID and active account ledger.',
          logs: [
            'Issued CIF creation payload to Finacle REST Gateway',
            'Received CIF ID: PNB774910281 with KYC compliance tag Y',
            'Instantiated Savings Account under Scheme Code SBGEN at Parliament St Branch (0182)',
            'Generated Account Number: 0182000100829145 (Status: ACTIVE)',
            'Reserved UPI VPA: rahul.mehta@pnb with NPCI gateway',
          ],
          nextAction: 'Invoke Welcome & Activation Agent (PNB-ACTIVATION-07)',
        };
        break;

      case 'activation':
        states[agentId] = {
          id: agentId,
          status,
          startTime,
          endTime: isCompleted ? endTime : undefined,
          durationMs: AGENT_DEFINITIONS.activation.typicalLatencyMs,
          inputs: {
            cifId: 'PNB774910281',
            accountNumber: '0182000100829145',
            mobile: scenario.customer.mobile,
            email: scenario.customer.email,
          },
          decision: isCompleted
            ? {
                outcome: 'Digital Banking Activated | Virtual RuPay Card Tokenized',
                confidence: 100,
                reason: 'Customer digital credentials ready. Welcome communication dispatched.',
                recommendedAction: 'Render customer dashboard and present Next Best Action.',
                metrics: {
                  'PNB ONE App': 'Provisioned',
                  'RuPay Platinum': 'Tokenized Active',
                  'WhatsApp Alert': 'Sent',
                  'Email Letter': 'Dispatched',
                },
              }
            : undefined,
          explanation:
            'Omni-channel welcome kit delivered. PNB ONE credentials enabled with one-click MPIN setup, and virtual RuPay Platinum card issued.',
          logs: [
            'Provisioned virtual RuPay Platinum debit card: 6521 88XX XXXX 7109',
            'Created PNB ONE digital user profile and linked mobile +91 98XXXXXX21',
            'Dispatched official PNB Welcome letter to rahul.mehta@example.com',
            'Generated personalized Next-Best-Action recommendation (PNB Select Credit Card)',
          ],
          nextAction: 'Complete - Transition customer to PNB Digital Dashboard',
        };
        break;
    }
  });

  return states as Record<AgentId, AgentExecutionState>;
}

export function generateAuditLogsForScenario(
  scenario: DemoScenario,
  completedUpToAgentIndex: number
): AuditLogEntry[] {
  const allLogs: AuditLogEntry[] = [
    {
      id: 'AUD-001',
      timestamp: '12:01:04',
      agentId: 'intake',
      agentName: 'Customer Intake Agent',
      action: 'Intent Classification & Product Match',
      inputSummary: `Query: "${scenario.intakeText}" | Profile: ${scenario.customer.occupation}`,
      decision: 'Classified: Savings Account | Recommended: PNB Select Saving',
      confidence: '98%',
      systemApi: 'PNB Natural Language Classifier v2.4',
      humanIntervention: 'None',
      status: 'SUCCESS',
    },
    {
      id: 'AUD-002',
      timestamp: '12:01:12',
      agentId: 'document',
      agentName: 'Document Intelligence Agent',
      action: 'OCR Extraction & UIDAI 8-Digit Masking',
      inputSummary: `PAN: ${scenario.customer.pan} | Aadhaar: ${scenario.customer.aadhaarMasked}`,
      decision: scenario.docIntelResult.hasDiscrepancy
        ? 'Name variation resolved with CKYCR corroboration'
        : 'PAN & Aadhaar cross-validated (96% similarity)',
      confidence: `${scenario.docIntelResult.similarity}%`,
      systemApi: 'UIDAI Masking Engine + NSDL Verification API',
      humanIntervention: 'None',
      status: scenario.docIntelResult.hasDiscrepancy ? 'WARNING' : 'SUCCESS',
    },
    {
      id: 'AUD-003',
      timestamp: '12:01:31',
      agentId: 'kyc',
      agentName: 'KYC Agent',
      action: 'CKYCR Central Registry & Liveness Verification',
      inputSummary: `CKYC Query: PAN ${scenario.customer.pan}`,
      decision: `Digital KYC selected (CERSAI KIN 400192849201 active)`,
      confidence: '97%',
      systemApi: 'CERSAI CKYCR Central Gateway',
      humanIntervention: 'None',
      status: 'SUCCESS',
    },
    {
      id: 'AUD-004',
      timestamp: '12:01:43',
      agentId: 'aml',
      agentName: 'AML Screening Agent',
      action: 'Sanctions, PEP & Adverse Media Screening',
      inputSummary: `Entity: ${scenario.customer.name} | DOB: ${scenario.customer.dob}`,
      decision: scenario.amlResult.sanctionsMatch
        ? 'ALERT: Potential Watchlist collision (84% score)'
        : 'CLEAR: UN Sanctions, RBI Caution List & PEP Clear',
      confidence: `${scenario.amlResult.confidenceScore}%`,
      systemApi: 'FATF / UN Sanctions & RBI Caution Index',
      humanIntervention: scenario.amlResult.sanctionsMatch ? 'Required' : 'None',
      status: scenario.amlResult.sanctionsMatch ? 'ALERT' : 'SUCCESS',
    },
    {
      id: 'AUD-005',
      timestamp: '12:02:02',
      agentId: 'risk',
      agentName: 'Risk Assessment Agent',
      action: 'Composite Risk & Straight-Through Decisioning',
      inputSummary: `CIBIL: ${scenario.riskResult.cibilScore} | Fraud Propensity: ${scenario.riskResult.fraudPropensity}`,
      decision: scenario.riskResult.recommendation,
      confidence: `${scenario.riskResult.confidence}%`,
      systemApi: 'TransUnion CIBIL Gateway & PNB Underwriting Matrix',
      humanIntervention: scenario.riskResult.riskTier === 'HIGH' ? 'Required' : 'None',
      status: scenario.riskResult.riskTier === 'HIGH' ? 'ALERT' : 'SUCCESS',
    },
    {
      id: 'AUD-006',
      timestamp: '12:02:10',
      agentId: 'account',
      agentName: 'Account Opening Agent',
      action: 'Infosys Finacle 10.x CBS Provisioning',
      inputSummary: 'Scheme: SBGEN | Branch SolId: 0182 Parliament Street',
      decision: 'Generated CIF: PNB774910281 | Account: 0182000100829145',
      confidence: '99%',
      systemApi: 'Infosys Finacle 10.x REST CBS Service',
      humanIntervention: 'None',
      status: 'SUCCESS',
    },
    {
      id: 'AUD-007',
      timestamp: '12:02:22',
      agentId: 'activation',
      agentName: 'Welcome & Activation Agent',
      action: 'Virtual RuPay Tokenization & Omni-Channel Welcome',
      inputSummary: `Customer ID: PNB774910281 | Mobile: ${scenario.customer.mobile}`,
      decision: 'Activated PNB ONE, Virtual Card, UPI handle',
      confidence: '100%',
      systemApi: 'NPCI RuPay Host & PNB ONE Gateway',
      humanIntervention: 'None',
      status: 'SUCCESS',
    },
  ];

  return allLogs.slice(0, completedUpToAgentIndex + 1);
}
