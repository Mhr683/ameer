import React, { useState, useMemo } from 'react';
import {
  Search,
  Star,
  GitFork,
  BookOpen,
  ExternalLink,
  Lock,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { GitHubRepo } from '../types';

interface RepositoriesListProps {
  repos: GitHubRepo[];
  isLoading: boolean;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Rust: '#dea584',
  Go: '#00ADD8',
  'C++': '#f34b7d',
  C: '#555555',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Vue: '#41b883',
  Jupyter: '#DA5B0B',
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  return `${Math.floor(diffInMonths / 12)}y ago`;
}

export const RepositoriesList: React.FC<RepositoriesListProps> = ({ repos, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'sources' | 'forks'>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'stars' | 'name'>('updated');

  // Available languages
  const languages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((r) => {
      if (r.language) langs.add(r.language);
    });
    return Array.from(langs).sort();
  }, [repos]);

  // Filtered & sorted repos
  const filteredRepos = useMemo(() => {
    return repos
      .filter((repo) => {
        // Search filter
        const matchesSearch =
          repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        // Language filter
        if (selectedLanguage !== 'all' && repo.language !== selectedLanguage) {
          return false;
        }

        // Type filter
        if (selectedType === 'sources' && repo.fork) return false;
        if (selectedType === 'forks' && !repo.fork) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'updated') {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        }
        if (sortBy === 'stars') {
          return b.stargazers_count - a.stargazers_count;
        }
        return a.name.localeCompare(b.name);
      });
  }, [repos, searchTerm, selectedLanguage, selectedType, sortBy]);

  return (
    <div id="repositories-section" className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            id="repo-search-input"
            type="text"
            placeholder="Search repositories by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Language select */}
          <select
            id="repo-language-select"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 focus:border-zinc-900 focus:outline-none"
          >
            <option value="all">All Languages</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          {/* Type select */}
          <select
            id="repo-type-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 focus:border-zinc-900 focus:outline-none"
          >
            <option value="all">All Repositories</option>
            <option value="sources">Sources Only</option>
            <option value="forks">Forks Only</option>
          </select>

          {/* Sort select */}
          <select
            id="repo-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 focus:border-zinc-900 focus:outline-none"
          >
            <option value="updated">Recently Updated</option>
            <option value="stars">Most Stars</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Repositories Count */}
      <div className="flex items-center justify-between px-1 text-xs text-zinc-500">
        <span>
          Showing <strong className="font-semibold text-zinc-800">{filteredRepos.length}</strong> of{' '}
          {repos.length} repositories
        </span>
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedLanguage('all');
              setSelectedType('all');
            }}
            className="text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Repositories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-zinc-200 bg-white p-5 space-y-3"
            >
              <div className="h-5 w-2/3 rounded bg-zinc-200" />
              <div className="h-4 w-full rounded bg-zinc-100" />
              <div className="flex gap-3 pt-2">
                <div className="h-3 w-16 rounded bg-zinc-200" />
                <div className="h-3 w-12 rounded bg-zinc-200" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredRepos.length === 0 ? (
        <div
          id="no-repos-found"
          className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 py-12 text-center"
        >
          <BookOpen className="mx-auto h-8 w-8 text-zinc-400" />
          <h3 className="mt-2 text-sm font-semibold text-zinc-800">No repositories found</h3>
          <p className="mt-1 text-xs text-zinc-500">
            {searchTerm || selectedLanguage !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'This user has not created or contributed to any repositories yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredRepos.map((repo) => {
            const langColor = repo.language ? (LANGUAGE_COLORS[repo.language] || '#6b7280') : null;

            return (
              <div
                key={repo.id}
                id={`repo-card-${repo.name}`}
                className="group flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300 hover:shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <BookOpen className="h-4 w-4 shrink-0 text-zinc-500" />
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-sm font-semibold text-blue-600 group-hover:underline"
                        title={repo.name}
                      >
                        {repo.name}
                      </a>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="inline-flex items-center gap-0.5 rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                        {repo.private ? (
                          <>
                            <Lock className="h-2.5 w-2.5 text-amber-600" />
                            <span>Private</span>
                          </>
                        ) : (
                          <>
                            <Globe className="h-2.5 w-2.5 text-zinc-400" />
                            <span>Public</span>
                          </>
                        )}
                      </span>
                      {repo.fork && (
                        <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600">
                          Fork
                        </span>
                      )}
                    </div>
                  </div>

                  {repo.description ? (
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-600">
                      {repo.description}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs italic text-zinc-400">No description provided</p>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3 text-[11px] text-zinc-500">
                  <div className="flex items-center gap-3">
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: langColor || '#6b7280' }}
                        />
                        <span className="font-medium text-zinc-700">{repo.language}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-zinc-400" />
                      <span>{repo.stargazers_count}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <GitFork className="h-3 w-3 text-zinc-400" />
                      <span>{repo.forks_count}</span>
                    </div>
                  </div>

                  <div className="text-zinc-400">
                    Updated {formatRelativeTime(repo.pushed_at || repo.updated_at)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
