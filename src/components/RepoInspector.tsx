import React, { useState } from 'react';
import {
  FolderGit2,
  Search,
  FileText,
  Folder,
  ChevronRight,
  GitCommit,
  ExternalLink,
  Code2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { GitHubRepo } from '../types';

interface RepoInspectorProps {
  onRepoLoaded?: (repo: GitHubRepo) => void;
}

interface RepoData {
  repo: GitHubRepo;
  readme: string;
  contents: Array<{
    name: string;
    path: string;
    type: 'file' | 'dir';
    size: number;
    html_url: string;
  }>;
  commits: Array<{
    sha: string;
    commit: {
      message: string;
      author: { name: string; date: string };
    };
    html_url: string;
  }>;
}

export const RepoInspector: React.FC<RepoInspectorProps> = () => {
  const [repoInput, setRepoInput] = useState('');
  const [personalToken, setPersonalToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repoData, setRepoData] = useState<RepoData | null>(null);

  const [selectedFile, setSelectedFile] = useState<{ path: string; content: string } | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleInspect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!repoInput.trim()) {
      setError('Please enter a repository name (e.g. username/repo) or GitHub URL.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSelectedFile(null);

    try {
      const res = await fetch('/api/github/inspect-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo: repoInput.trim(),
          token: personalToken.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to inspect repository.');
      }

      setRepoData(data);
    } catch (err: any) {
      setError(err?.message || 'Unable to load repository data.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFileContent = async (filePath: string) => {
    if (!repoData) return;
    setIsLoadingFile(true);
    try {
      const res = await fetch('/api/github/file-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo: repoData.repo.full_name,
          path: filePath,
          token: personalToken.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedFile({ path: filePath, content: data.content });
      } else {
        setError(data.error || 'Failed to load file');
      }
    } catch (err: any) {
      setError(err?.message || 'Error loading file content');
    } finally {
      setIsLoadingFile(false);
    }
  };

  const copyCode = () => {
    if (selectedFile?.content) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div id="repo-inspector-card" className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm">
          <FolderGit2 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Direct Project & Repo Inspector</h3>
          <p className="text-xs text-zinc-500">
            Paste any GitHub repository link or username/repo to inspect files, structure, and code
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleInspect} className="mt-4 space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              id="repo-url-input"
              type="text"
              placeholder="e.g. facebook/react or https://github.com/owner/my-project"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-9 pr-4 text-xs font-mono text-zinc-900 placeholder:font-sans placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <button
            id="inspect-repo-btn"
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Reading Project...</span>
              </>
            ) : (
              <>
                <FolderGit2 className="h-3.5 w-3.5" />
                <span>Inspect Project</span>
              </>
            )}
          </button>
        </div>

        {/* Optional Token input for private repo */}
        <div className="flex items-center gap-2 pt-1 text-xs">
          <span className="text-zinc-400">Private repo?</span>
          <input
            type="password"
            placeholder="GitHub Personal Access Token (optional)"
            value={personalToken}
            onChange={(e) => setPersonalToken(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500 w-64"
          />
        </div>
      </form>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          <p>{error}</p>
        </div>
      )}

      {/* Loaded Project Overview */}
      {repoData && (
        <div className="mt-6 space-y-5 border-t border-zinc-100 pt-5">
          {/* Repo Header */}
          <div className="flex flex-col gap-2 rounded-xl bg-zinc-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-zinc-900">{repoData.repo.full_name}</h4>
                <span className="rounded-full bg-zinc-200/70 px-2 py-0.5 text-[10px] font-semibold text-zinc-700">
                  {repoData.repo.private ? 'Private' : 'Public'}
                </span>
                {repoData.repo.language && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                    {repoData.repo.language}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-zinc-600">
                {repoData.repo.description || 'No description provided.'}
              </p>
            </div>
            <a
              href={repoData.repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 self-start rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 sm:self-center"
            >
              <span>View on GitHub</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Dual Panel: Files Tree & Code/Readme Viewer */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Left column: Root files & structure */}
            <div className="rounded-xl border border-zinc-200 bg-white p-3 lg:col-span-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <span className="text-xs font-semibold text-zinc-800">Repository Files</span>
                <span className="text-[11px] text-zinc-400">{repoData.contents.length} items</span>
              </div>
              <div className="mt-2 max-h-80 space-y-1 overflow-y-auto pr-1 text-xs">
                {repoData.contents.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => item.type === 'file' && loadFileContent(item.path)}
                    disabled={item.type === 'dir'}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition ${
                      selectedFile?.path === item.path
                        ? 'bg-zinc-900 text-white'
                        : item.type === 'file'
                        ? 'text-zinc-700 hover:bg-zinc-100'
                        : 'text-zinc-400 cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {item.type === 'dir' ? (
                        <Folder className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                      ) : (
                        <FileText className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                      )}
                      <span className="truncate font-mono text-[11px]">{item.name}</span>
                    </div>
                    {item.type === 'file' && (
                      <ChevronRight className="h-3 w-3 shrink-0 opacity-40" />
                    )}
                  </button>
                ))}
              </div>

              {/* Recent commits snippet */}
              {repoData.commits.length > 0 && (
                <div className="mt-4 border-t border-zinc-100 pt-3">
                  <span className="text-xs font-semibold text-zinc-800">Recent Commits</span>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {repoData.commits.slice(0, 4).map((c) => (
                      <div key={c.sha} className="flex items-start gap-1.5 text-[11px]">
                        <GitCommit className="mt-0.5 h-3 w-3 shrink-0 text-zinc-400" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-zinc-800">
                            {c.commit.message.split('\n')[0]}
                          </p>
                          <span className="font-mono text-[10px] text-zinc-400">
                            {c.sha.slice(0, 7)} by {c.commit.author.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column: Selected File Code / README preview */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-950 p-4 text-zinc-100 lg:col-span-8">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-emerald-400" />
                  <span className="font-mono text-xs font-semibold text-zinc-200">
                    {selectedFile ? selectedFile.path : 'README.md Preview'}
                  </span>
                </div>
                {(selectedFile?.content || repoData.readme) && (
                  <button
                    onClick={copyCode}
                    className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 hover:bg-zinc-700"
                  >
                    {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              <div className="mt-3 max-h-96 overflow-auto">
                {isLoadingFile ? (
                  <div className="flex h-40 items-center justify-center text-xs text-zinc-400">
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Loading file content...
                  </div>
                ) : selectedFile ? (
                  <pre className="font-mono text-[11px] leading-relaxed text-zinc-200 whitespace-pre-wrap">
                    {selectedFile.content}
                  </pre>
                ) : repoData.readme ? (
                  <pre className="font-mono text-[11px] leading-relaxed text-zinc-300 whitespace-pre-wrap">
                    {repoData.readme}
                  </pre>
                ) : (
                  <div className="py-12 text-center text-xs text-zinc-500">
                    Click any file on the left to inspect its code.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
