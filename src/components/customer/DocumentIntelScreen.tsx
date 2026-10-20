import React, { useState } from 'react';
import { PNBButton } from '../common/PNBButton';
import { DemoScenario } from '../../data/scenarios';
import { Upload, CheckCircle2, ShieldCheck, Sparkles, FileText, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

interface DocumentIntelScreenProps {
  scenario: DemoScenario;
  onProceed: () => void;
  speed: 'normal' | 'fast';
}

export const DocumentIntelScreen: React.FC<DocumentIntelScreenProps> = ({
  scenario,
  onProceed,
  speed,
}) => {
  const [panUploaded, setPanUploaded] = useState(true);
  const [aadhaarUploaded, setAadhaarUploaded] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  const docData = scenario.docIntelResult;

  const handleSimulateReupload = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, speed === 'fast' ? 500 : 1200);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4">
      {/* Onboarding Stage Indicator */}
      <div className="mb-6 flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
            ✓
          </span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
            ✓
          </span>
          <span className="w-5 h-5 rounded-full bg-[#A21D22] text-white flex items-center justify-center text-[10px]">
            3
          </span>
          <span className="text-[#A21D22]">2. Documents</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-slate-400">
          <span>3. KYC</span>
          <span>4. Verification</span>
          <span>5. Account</span>
          <span>6. Activation</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-pnb overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                Let's verify your documents
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Upload your Permanent Account Number (PAN) and Aadhaar card for instant digital verification.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>UIDAI Masking Active</span>
            </div>
          </div>

          {/* Upload Cards Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* PAN Card Upload & Extraction */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#A21D22]" />
                    PAN Card (NSDL Verified)
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Validated
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Extracted Name:</span>
                    <span className="font-bold text-slate-800">{docData.panName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date of Birth:</span>
                    <span className="font-semibold text-slate-700">{scenario.customer.dob}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PAN Number:</span>
                    <span className="font-mono font-bold text-[#A21D22]">
                      {scenario.customer.pan}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tamper & Hologram:</span>
                    <span className="font-medium text-emerald-600">Passed (99.4%)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Document quality: Optimal</span>
                <button
                  onClick={handleSimulateReupload}
                  className="text-[#A21D22] font-semibold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Re-scan
                </button>
              </div>
            </div>

            {/* Aadhaar Card Upload & Extraction */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#A21D22]" />
                    Aadhaar Card (OVD)
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Validated
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Extracted Name:</span>
                    <span className="font-bold text-slate-800">{docData.aadhaarName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date of Birth:</span>
                    <span className="font-semibold text-slate-700">{scenario.customer.dob}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Aadhaar (UIDAI Masked):</span>
                    <span className="font-mono font-bold text-slate-900">
                      {scenario.customer.aadhaarMasked}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">QR Code Integrity:</span>
                    <span className="font-medium text-emerald-600">Digitally Verified</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-between items-center text-[11px]">
                <span className="text-slate-500">First 8 digits masked per RBI mandate</span>
                <button
                  onClick={handleSimulateReupload}
                  className="text-[#A21D22] font-semibold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Re-scan
                </button>
              </div>
            </div>
          </div>

          {/* Document Intelligence Agent Reasoning Moment */}
          <div className="mt-6 p-5 rounded-xl border border-slate-200 bg-gradient-to-br from-[#FDF8F8] to-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#A21D22] text-[#FDB913] flex items-center justify-center font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#7B1013]">
                  DOCUMENT INTELLIGENCE AGENT (REASONING)
                </h4>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
                Cross-Document Confidence: {docData.similarity}%
              </span>
            </div>

            {/* Checklist of Agent Checks */}
            <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>PAN detected</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Identity extracted</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>DOB match (14-08-1994)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Quality acceptable</span>
              </div>
            </div>

            {/* Agent Narrative Explanation */}
            <div className="mt-4 p-3.5 rounded-lg bg-white border border-slate-200 text-xs">
              <div className="flex items-start gap-2">
                {docData.hasDiscrepancy ? (
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-slate-900">
                    Cross-Document Comparison: {docData.similarity}% Name Alignment
                  </div>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    <strong>Decision:</strong> "{docData.decision}"
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    <strong>Self-Healing Corroboration:</strong> {docData.actionTaken}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 flex justify-end">
            <PNBButton
              variant="primary"
              size="lg"
              onClick={onProceed}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to KYC Verification
            </PNBButton>
          </div>
        </div>
      </div>
    </div>
  );
};
