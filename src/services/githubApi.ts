import {
  GitHubRepo,
  GitHubIssue,
  GitHubCommit,
  GitHubUser,
  GitHubContentItem
} from '../types/github';

const GITHUB_API_BASE = 'https://api.github.com';

function getHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
  if (token && token.trim().length > 0) {
    headers['Authorization'] = `Bearer ${token.trim()}`;
  }
  return headers;
}

export async function verifyGitHubToken(token: string): Promise<GitHubUser> {
  const res = await fetch(`${GITHUB_API_BASE}/user`, {
    headers: getHeaders(token),
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Token inválido o expirado. Verificá los permisos del Personal Access Token.');
    }
    throw new Error(`Error al verificar token (${res.status}): ${res.statusText}`);
  }
  return res.json();
}

export async function getRepository(
  owner: string,
  repo: string,
  token?: string | null
): Promise<GitHubRepo> {
  const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
    headers: getHeaders(token),
  });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Repositorio "${owner}/${repo}" no encontrado. Si es privado, asegurate de proporcionar un token con acceso.`);
    }
    throw new Error(`Error al consultar repositorio (${res.status}): ${res.statusText}`);
  }
  return res.json();
}

export async function getIssues(
  owner: string,
  repo: string,
  token?: string | null,
  state: 'all' | 'open' | 'closed' = 'all'
): Promise<GitHubIssue[]> {
  const res = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=${state}&sort=created&direction=desc&per_page=100`,
    {
      headers: getHeaders(token),
    }
  );
  if (!res.ok) {
    throw new Error(`Error al cargar issues (${res.status}): ${res.statusText}`);
  }
  const issues: GitHubIssue[] = await res.json();
  // Filter out Pull Requests (GitHub issues API includes PRs with a pull_request key)
  return issues.filter((item) => !(item as unknown as { pull_request?: object }).pull_request);
}

export async function createIssue(
  owner: string,
  repo: string,
  token: string,
  data: {
    title: string;
    body: string;
    labels?: string[];
  }
): Promise<GitHubIssue> {
  if (!token) {
    throw new Error('Se requiere un Personal Access Token para crear issues en GitHub.');
  }
  const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const msg = errorData?.message || res.statusText;
    throw new Error(`Error al crear issue (${res.status}): ${msg}`);
  }
  return res.json();
}

export async function updateIssue(
  owner: string,
  repo: string,
  token: string,
  issueNumber: number,
  data: {
    title?: string;
    body?: string;
    state?: 'open' | 'closed';
    labels?: string[];
  }
): Promise<GitHubIssue> {
  if (!token) {
    throw new Error('Se requiere un Personal Access Token para modificar issues.');
  }
  const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(`Error al actualizar issue (${res.status}): ${errorData?.message || res.statusText}`);
  }
  return res.json();
}

export async function addIssueComment(
  owner: string,
  repo: string,
  token: string,
  issueNumber: number,
  commentBody: string
): Promise<{ id: number; body: string; created_at: string }> {
  if (!token) {
    throw new Error('Se requiere un token para comentar.');
  }
  const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ body: commentBody }),
  });
  if (!res.ok) {
    throw new Error(`Error al enviar comentario (${res.status}): ${res.statusText}`);
  }
  return res.json();
}

export async function getIssueComments(
  owner: string,
  repo: string,
  token: string | null | undefined,
  issueNumber: number
): Promise<Array<{ id: number; body: string; created_at: string; user: GitHubUser }>> {
  const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
    headers: getHeaders(token),
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getCommits(
  owner: string,
  repo: string,
  token?: string | null
): Promise<GitHubCommit[]> {
  try {
    const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=30`, {
      headers: getHeaders(token),
    });
    if (!res.ok) {
      // Empty repos return 409 Conflict when querying commits
      return [];
    }
    return res.json();
  } catch {
    return [];
  }
}

export async function getRepoContents(
  owner: string,
  repo: string,
  path = '',
  token?: string | null
): Promise<GitHubContentItem[]> {
  try {
    const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`, {
      headers: getHeaders(token),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [data];
  } catch {
    return [];
  }
}

export async function createOrUpdateFile(
  owner: string,
  repo: string,
  token: string,
  filePath: string,
  commitMessage: string,
  fileContent: string,
  branch = 'main',
  existingSha?: string
): Promise<{ content: GitHubContentItem; commit: { sha: string; html_url: string } }> {
  if (!token) {
    throw new Error('Se requiere un Personal Access Token para subir cambios a GitHub.');
  }

  // UTF-8 to base64 encoding safe for unicode strings
  const utf8Bytes = new TextEncoder().encode(fileContent);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  const base64Content = btoa(binary);

  const payload: {
    message: string;
    content: string;
    branch?: string;
    sha?: string;
  } = {
    message: commitMessage,
    content: base64Content,
    branch,
  };

  if (existingSha) {
    payload.sha = existingSha;
  }

  const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${filePath}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(`Error al comitear archivo (${res.status}): ${err?.message || res.statusText}`);
  }

  return res.json();
}
