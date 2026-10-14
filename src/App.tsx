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
import {
  getRepository,
  getIssues,
  getCommits,
  verifyGitHubToken
} from './services/githubApi';
import { GitHubRepo, GitHubIssue, GitHubCommit, GitHubUser } from './types/github';
import { AlertCircle, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';

const REPO_OWNER = 'JoaquinRiveroAlvarez';
const REPO_NAME = 'ProgramacionIII';
const TOKEN_STORAGE_KEY = 'gh_token_prog3';

export default function App() {
  const [token, setToken] = useState<string>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  });
  const [currentUser, setCurrentUser] = useState<GitHubUser | null>(null);

  const [repo, setRepo] = useState<GitHubRepo | null>(null);
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);

  const [activeTab, setActiveTab] = useState<'mvp-issues' | 'solution' | 'issues' | 'sync' | 'commits'>('mvp-issues');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

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

  const loadData = useCallback(async (authToken: string) => {
    setIsRefreshing(true);
    setFetchError(null);

    try {
      // 1. Fetch Repository details
      const repoData = await getRepository(REPO_OWNER, REPO_NAME, authToken);
      setRepo(repoData);

      // 2. Fetch Issues
      const issuesData = await getIssues(REPO_OWNER, REPO_NAME, authToken, 'all');
      setIssues(issuesData);

      // 3. Fetch Commits
      const commitsData = await getCommits(REPO_OWNER, REPO_NAME, authToken);
      setCommits(commitsData);
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : 'Error al cargar datos del repositorio');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData(token);
  }, [loadData, token]);

  const handleSaveToken = (newToken: string, user: GitHubUser | null) => {
    setToken(newToken);
    setCurrentUser(user);
    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    loadData(newToken);
  };

  const handleIssueCreated = (newIssue: GitHubIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
    // Also update repo issues count
    if (repo) {
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
    loadData(token);
  };

  const isEmptyRepo = repo ? commits.length === 0 : false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        repo={repo}
        user={currentUser}
        hasToken={Boolean(token)}
        onOpenTokenModal={() => setIsTokenModalOpen(true)}
        onRefresh={() => loadData(token)}
        isRefreshing={isRefreshing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Error notification banner if any */}
        {fetchError && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={() => loadData(token)}
              className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Global Repository Banner Header */}
        <RepoHeader
          repo={repo}
          issuesCount={issues.length}
          commitsCount={commits.length}
          hasToken={Boolean(token)}
          onOpenCreateIssue={() => setIsCreateModalOpen(true)}
          onOpenTokenModal={() => setIsTokenModalOpen(true)}
          onOpenCliGuide={() => setIsCliGuideOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isEmptyRepo={isEmptyRepo}
        />

        {/* Tab Content */}
        {activeTab === 'mvp-issues' && (
          <MvpIssuesManager
            token={token}
            onOpenTokenModal={() => setIsTokenModalOpen(true)}
            onIssuePublished={handleIssueCreated}
            onBatchPublished={handleBatchCreated}
            existingIssues={issues}
          />
        )}

        {activeTab === 'solution' && (
          <SolutionExplorer
            token={token}
            onOpenTokenModal={() => setIsTokenModalOpen(true)}
            onSolutionCommitted={handleCommitSuccess}
          />
        )}

        {activeTab === 'issues' && (
          <IssuesList
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
            Repositorio:{' '}
            <a
              href="https://github.com/JoaquinRiveroAlvarez/ProgramacionIII"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-400 font-mono underline"
            >
              JoaquinRiveroAlvarez/ProgramacionIII
            </a>
          </p>
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sincronizador activo con GitHub REST API v3</span>
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
