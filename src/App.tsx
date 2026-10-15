import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { RepoHeader } from './components/RepoHeader';
import { IssuesList } from './components/IssuesList';
import { CreateIssueModal } from './components/CreateIssueModal';
import { IssueDetailModal } from './components/IssueDetailModal';
import { GitSyncPanel } from './components/GitSyncPanel';
import { CommitsList } from './components/CommitsList';
import { TokenModal } from './components/TokenModal';
import { CliGuideModal } from './components/CliGuideModal';
import { MvpIssuesManager } from './components/MvpIssuesManager';
import { SolutionExplorer } from './components/SolutionExplorer';
import { MvpLivePreview } from './components/MvpLivePreview';
import { SwaggerLivePreview } from './components/SwaggerLivePreview';
import {
  getRepository,
  getIssues,
  getCommits,
  verifyGitHubToken
} from './services/githubApi';
import { GitHubRepo, GitHubIssue, GitHubCommit, GitHubUser } from './types/github';
import {
  AlertCircle,
  ChevronDown,
  Tag,
  Terminal,
  CircleDot,
  FolderGit2,
  UploadCloud,
  GitBranch,
  LayoutTemplate
} from 'lucide-react';

const DEFAULT_OWNER = 'JoaquinRiveroAlvarez';
const DEFAULT_REPO = 'OfertasProgramacionIII';
const TOKEN_STORAGE_KEY = 'gh_token_prog3';
const REPO_STORAGE_KEY = 'gh_active_repo_prog3';
const REPO_COLLAPSED_KEY = 'repo_header_collapsed_v1';

export default function App() {
  const [token, setToken] = useState<string>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  });
  const [currentUser, setCurrentUser] = useState<GitHubUser | null>(null);

  const [repoOwner] = useState<string>(DEFAULT_OWNER);
  const [repoName, setRepoName] = useState<string>(() => {
    return localStorage.getItem(REPO_STORAGE_KEY) || DEFAULT_REPO;
  });

  const [repo, setRepo] = useState<GitHubRepo | null>(null);
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);

  const [activeTab, setActiveTab] = useState<'preview-feed' | 'preview-api' | 'mvp-issues' | 'solution' | 'issues' | 'sync' | 'commits'>('preview-feed');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Collapsible repo banner state
  const [isRepoCollapsed, setIsRepoCollapsed] = useState<boolean>(() => {
    return localStorage.getItem(REPO_COLLAPSED_KEY) === 'true';
  });

  const handleToggleCollapseRepo = () => {
    setIsRepoCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(REPO_COLLAPSED_KEY, String(next));
      return next;
    });
  };

  // Modals
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCliGuideOpen, setIsCliGuideOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(null);

  // Load user if token exists on mount
  useEffect(() => {
    if (token) {
      verifyGitHubToken(token)
        .then((user) => setCurrentUser(user))
        .catch(() => {
          // Token might have expired or be invalid
        });
    }
  }, [token]);

  const loadData = useCallback(async (authToken: string, targetRepo: string) => {
    setIsRefreshing(true);
    setFetchError(null);

    try {
      // 1. Fetch Repository details
      const repoData = await getRepository(DEFAULT_OWNER, targetRepo, authToken);
      setRepo(repoData);

      // 2. Fetch Issues
      const issuesData = await getIssues(DEFAULT_OWNER, targetRepo, authToken, 'all');
      setIssues(issuesData);

      // 3. Fetch Commits
      const commitsData = await getCommits(DEFAULT_OWNER, targetRepo, authToken);
      setCommits(commitsData);
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : `Error al consultar repositorio ${DEFAULT_OWNER}/${targetRepo}`);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData(token, repoName);
  }, [loadData, token, repoName]);

  const handleChangeRepo = (newRepo: string) => {
    const clean = newRepo.trim();
    if (!clean) return;
    setRepoName(clean);
    localStorage.setItem(REPO_STORAGE_KEY, clean);
    loadData(token, clean);
  };

  const handleSaveToken = (newToken: string, user: GitHubUser | null) => {
    setToken(newToken);
    setCurrentUser(user);
    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    loadData(newToken, repoName);
  };

  const handleIssueCreated = (newIssue: GitHubIssue) => {
    setIssues((prev) => {
      const exists = prev.some((i) => i.id === newIssue.id || i.number === newIssue.number);
      if (exists) {
        return prev.map((i) => (i.id === newIssue.id || i.number === newIssue.number ? newIssue : i));
      }
      return [newIssue, ...prev];
    });

    if (repo && newIssue.state === 'open') {
      setRepo({
        ...repo,
        open_issues_count: repo.open_issues_count + 1,
      });
    }
  };

  const handleBatchCreated = (newIssues: GitHubIssue[]) => {
    setIssues((prev) => [...newIssues, ...prev]);
    if (repo) {
      setRepo({
        ...repo,
        open_issues_count: repo.open_issues_count + newIssues.length,
      });
    }
  };

  const handleIssueUpdated = (updated: GitHubIssue) => {
    setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setSelectedIssue(updated);
  };

  const handleCommitSuccess = () => {
    loadData(token, repoName);
  };

  const isEmptyRepo = repo ? commits.length === 0 : false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar with Cazador de Descuentos Branding and Collapse Trigger */}
      <Navbar
        repo={repo}
        repoOwner={repoOwner}
        repoName={repoName}
        onChangeRepo={handleChangeRepo}
        user={currentUser}
        hasToken={Boolean(token)}
        onOpenTokenModal={() => setIsTokenModalOpen(true)}
        onRefresh={() => loadData(token, repoName)}
        isRefreshing={isRefreshing}
        isRepoCollapsed={isRepoCollapsed}
        onToggleCollapseRepo={handleToggleCollapseRepo}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error notification banner if any */}
        {fetchError && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={() => loadData(token, repoName)}
              className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Global Repository Banner: Collapsed vs Expanded Mode */}
        {isRepoCollapsed ? (
          /* Sleek, minimal toolbar when repo panel is collapsed */
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 backdrop-blur-md">
            {/* Minimal Tab Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
              <button
                onClick={() => setActiveTab('preview-feed')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                  activeTab === 'preview-feed'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>🏷️ Cazador de Descuentos (App)</span>
              </button>

              <button
                onClick={() => setActiveTab('preview-api')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                  activeTab === 'preview-api'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Swagger / API</span>
              </button>

              <button
                onClick={() => setActiveTab('mvp-issues')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                  activeTab === 'mvp-issues'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <CircleDot className="w-3.5 h-3.5 text-amber-400" />
                <span>Issues ({issues.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('solution')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                  activeTab === 'solution'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Solución C#</span>
              </button>

              <button
                onClick={() => setActiveTab('sync')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 ${
                  activeTab === 'sync'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Subir Código</span>
              </button>
            </div>

            {/* Expand Repository Panel Button */}
            <button
              onClick={handleToggleCollapseRepo}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-700/80 transition-colors shrink-0"
              title="Expandir información del repositorio GitHub"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400" />
              <span>Mostrar Panel Repo GitHub</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Full Repository Header when expanded */
          <RepoHeader
            repo={repo}
            repoOwner={repoOwner}
            repoName={repoName}
            issuesCount={issues.length}
            commitsCount={commits.length}
            hasToken={Boolean(token)}
            onOpenCreateIssue={() => setIsCreateModalOpen(true)}
            onOpenTokenModal={() => setIsTokenModalOpen(true)}
            onOpenCliGuide={() => setIsCliGuideOpen(true)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isEmptyRepo={isEmptyRepo}
            onToggleCollapse={handleToggleCollapseRepo}
          />
        )}

        {/* Tab Content */}
        {activeTab === 'preview-feed' && (
          <MvpLivePreview />
        )}

        {activeTab === 'preview-api' && (
          <SwaggerLivePreview />
        )}

        {activeTab === 'mvp-issues' && (
          <MvpIssuesManager
            repoOwner={repoOwner}
            repoName={repoName}
            token={token}
            onOpenTokenModal={() => setIsTokenModalOpen(true)}
            onIssuePublished={handleIssueCreated}
            onBatchPublished={handleBatchCreated}
            existingIssues={issues}
            onRefreshRepo={() => loadData(token, repoName)}
          />
        )}

        {activeTab === 'solution' && (
          <SolutionExplorer
            repoOwner={repoOwner}
            repoName={repoName}
            token={token}
            onOpenTokenModal={() => setIsTokenModalOpen(true)}
            onSolutionCommitted={handleCommitSuccess}
          />
        )}

        {activeTab === 'issues' && (
          <IssuesList
            repoOwner={repoOwner}
            repoName={repoName}
            issues={issues}
            isLoading={isLoading}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            token={token}
            onBatchCreated={handleBatchCreated}
            onOpenTokenModal={() => setIsTokenModalOpen(true)}
          />
        )}

        {activeTab === 'sync' && (
          <GitSyncPanel
            repoOwner={repoOwner}
            repoName={repoName}
            token={token}
            commits={commits}
            onCommitSuccess={handleCommitSuccess}
            onOpenTokenModal={() => setIsTokenModalOpen(true)}
            isEmptyRepo={isEmptyRepo}
          />
        )}

        {activeTab === 'commits' && (
          <CommitsList
            commits={commits}
            isLoading={isLoading}
            onOpenSyncTab={() => setActiveTab('sync')}
            isEmptyRepo={isEmptyRepo}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Cazador de Descuentos • Repositorio GitHub:{' '}
            <a
              href={`https://github.com/${repoOwner}/${repoName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-400 font-mono underline"
            >
              {repoOwner}/{repoName}
            </a>
          </p>
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Compras Online & Delivery en Argentina</span>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        token={token}
        onSaveToken={handleSaveToken}
        currentUser={currentUser}
      />

      <CreateIssueModal
        repoOwner={repoOwner}
        repoName={repoName}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        token={token}
        onIssueCreated={handleIssueCreated}
        onOpenTokenModal={() => {
          setIsCreateModalOpen(false);
          setIsTokenModalOpen(true);
        }}
      />

      <IssueDetailModal
        repoOwner={repoOwner}
        repoName={repoName}
        issue={selectedIssue}
        isOpen={Boolean(selectedIssue)}
        onClose={() => setSelectedIssue(null)}
        token={token}
        onIssueUpdated={handleIssueUpdated}
      />

      <CliGuideModal
        isOpen={isCliGuideOpen}
        onClose={() => setIsCliGuideOpen(false)}
      />
    </div>
  );
}
