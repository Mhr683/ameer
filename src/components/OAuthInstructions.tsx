import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Info, ShieldCheck, KeyRound } from 'lucide-react';

interface OAuthInstructionsProps {
  devCallbackUrl: string;
  sharedCallbackUrl: string;
  hasClientId: boolean;
  hasClientSecret: boolean;
}

export const OAuthInstructions: React.FC<OAuthInstructionsProps> = ({
  devCallbackUrl,
  sharedCallbackUrl,
  hasClientId,
  hasClientSecret,
}) => {
  const [copiedDev, setCopiedDev] = useState(false);
  const [copiedShared, setCopiedShared] = useState(false);
  const [copiedOrigin, setCopiedOrigin] = useState(false);

  const copyToClipboard = (text: string, type: 'dev' | 'shared' | 'origin') => {
    navigator.clipboard.writeText(text);
    if (type === 'dev') {
      setCopiedDev(true);
      setTimeout(() => setCopiedDev(false), 2000);
    } else if (type === 'shared') {
      setCopiedShared(true);
      setTimeout(() => setCopiedShared(false), 2000);
    } else {
      setCopiedOrigin(true);
      setTimeout(() => setCopiedOrigin(false), 2000);
    }
  };

  const isConfigured = hasClientId && hasClientSecret;

  return (
    <div id="oauth-instructions-card" className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
            <KeyRound className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">OAuth Setup Guide</h3>
            <p className="text-xs text-zinc-500">Configure your GitHub Developer application for authentication</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap ${
              isConfigured
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                : 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'
            }`}
          >
            {isConfigured ? '✓ Credentials Detected' : 'Setup Required in Settings'}
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-4 text-xs text-zinc-600">
        <div className="rounded-lg border border-zinc-100 bg-zinc-50/75 p-3.5">
          <div className="flex items-start gap-2.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <div className="space-y-1">
              <p className="font-medium text-zinc-900">Step 1: Register an OAuth App on GitHub</p>
              <p className="text-zinc-600">
                Go to GitHub Developer Settings to create a new OAuth Application.
              </p>
              <a
                id="github-dev-settings-link"
                href="https://github.com/settings/developers"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700 hover:underline pt-0.5"
              >
                <span>Open GitHub Developer Settings</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-zinc-900">Step 2: Enter Application URLs</p>
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between pb-1">
                <span className="font-medium text-zinc-700">Homepage URL</span>
                <button
                  onClick={() => copyToClipboard(window.location.origin, 'origin')}
                  className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900"
                >
                  {copiedOrigin ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  {copiedOrigin ? 'Copied' : 'Copy'}
                </button>
              </div>
              <code className="block w-full overflow-x-auto rounded-md border border-zinc-200 bg-zinc-100/75 px-2.5 py-1.5 font-mono text-[11px] text-zinc-800">
                {window.location.origin}
              </code>
            </div>

            <div>
              <div className="flex items-center justify-between pb-1">
                <span className="font-medium text-zinc-700">Authorization Callback URL (Development)</span>
                <button
                  id="copy-dev-callback-btn"
                  onClick={() => copyToClipboard(devCallbackUrl, 'dev')}
                  className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900"
                >
                  {copiedDev ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  {copiedDev ? 'Copied' : 'Copy'}
                </button>
              </div>
              <code className="block w-full overflow-x-auto rounded-md border border-zinc-200 bg-zinc-100/75 px-2.5 py-1.5 font-mono text-[11px] text-zinc-800">
                {devCallbackUrl}
              </code>
            </div>

            {sharedCallbackUrl && sharedCallbackUrl !== devCallbackUrl && (
              <div>
                <div className="flex items-center justify-between pb-1">
                  <span className="font-medium text-zinc-700">Authorization Callback URL (Shared / Production)</span>
                  <button
                    id="copy-shared-callback-btn"
                    onClick={() => copyToClipboard(sharedCallbackUrl, 'shared')}
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900"
                  >
                    {copiedShared ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    {copiedShared ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <code className="block w-full overflow-x-auto rounded-md border border-zinc-200 bg-zinc-100/75 px-2.5 py-1.5 font-mono text-[11px] text-zinc-800">
                  {sharedCallbackUrl}
                </code>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-100 bg-zinc-50/75 p-3.5 space-y-2">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <div className="space-y-1">
              <p className="font-medium text-zinc-900">Step 3: Add Client Credentials in AI Studio</p>
              <p className="text-zinc-600">
                Once created on GitHub, configure these variables in the AI Studio Settings / Secrets panel:
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-zinc-700">
                <li><code className="rounded bg-zinc-200/80 px-1 py-0.5 text-[11px]">GITHUB_CLIENT_ID</code></li>
                <li><code className="rounded bg-zinc-200/80 px-1 py-0.5 text-[11px]">GITHUB_CLIENT_SECRET</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
