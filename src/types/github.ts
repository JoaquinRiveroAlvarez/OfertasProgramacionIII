export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  default_branch: string;
  open_issues_count: number;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  created_at: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name?: string;
  email?: string;
}

export interface GitHubLabel {
  id?: number;
  name: string;
  color: string;
  description?: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  html_url: string;
  user: GitHubUser;
  labels: (string | GitHubLabel)[];
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  comments: number;
}

export interface GitHubCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author?: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubContentItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  type: 'file' | 'dir';
  content?: string;
  encoding?: string;
}

export interface IssueTemplate {
  id: string;
  title: string;
  description: string;
  labels: string[];
  defaultTitle: string;
  body: string;
}
