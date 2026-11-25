import type { ProjectItem } from '../data/portfolioData';

/**
 * Extracts a YouTube video ID from any YouTube URL (watch, youtu.be, shorts, embed) or raw 11-char ID.
 */
export function extractYouTubeId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const vParam = url.searchParams.get('v');
    if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) return vParam;

    const parts = url.pathname.split('/').filter(Boolean);
    for (const seg of [...parts].reverse()) {
      if (/^[a-zA-Z0-9_-]{11}$/.test(seg)) return seg;
    }
  } catch {
    const match = trimmed.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }

  return '';
}

/**
 * Converts a Google Sheet URL or raw Sheet ID into the public GViz JSON endpoint.
 */
function buildSheetFeedUrl(sheetUrlOrId: string): string | null {
  const trimmed = sheetUrlOrId.trim();
  if (!trimmed) return null;

  const idMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const sheetId = idMatch ? idMatch[1] : /^[a-zA-Z0-9-_]{20,}$/.test(trimmed) ? trimmed : null;
  if (!sheetId) return null;

  const gidMatch = trimmed.match(/[#&?]gid=(\d+)/);
  const gidParam = gidMatch ? `&gid=${gidMatch[1]}` : '';
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json${gidParam}`;
}

function normalizeCategory(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return 'Video Editing';
  const v = trimmed.toLowerCase();
  if (v === 'vfx' || v === 'vfx & cgi' || v === 'cgi & gaming' || v === 'bollywood') {
    return 'VFX & CGI';
  }
  if (v === 'video' || v === 'video editing' || v === 'reels' || v === 'commercials') {
    return 'Video Editing';
  }
  return trimmed;
}

interface GvizCell {
  v?: string | number | boolean | null;
  f?: string;
}

interface GvizResponse {
  table?: {
    cols?: Array<{ label?: string }>;
    rows?: Array<{ c?: Array<GvizCell | null> }>;
  };
}

/**
 * Fetches live project rows from a publicly viewable Google Sheet.
 * Returns null if unconfigured or unavailable so the caller can keep fallback data.
 */
export async function fetchProjectsFromGoogleSheet(
  sheetUrlOrId: string,
  signal?: AbortSignal
): Promise<ProjectItem[] | null> {
  const feedUrl = buildSheetFeedUrl(sheetUrlOrId);
  if (!feedUrl) return null;

  const res = await fetch(feedUrl, { signal, cache: 'no-store' });
  if (!res.ok) return null;

  const text = await res.text();
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd <= jsonStart) return null;

  const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as GvizResponse;
  const cols = (parsed.table?.cols || []).map((c) => (c.label || '').trim().toLowerCase());
  const rows = parsed.table?.rows || [];

  const getCell = (cells: Array<GvizCell | null>, keys: string[], fallbackIdx: number): string => {
    for (const k of keys) {
      const idx = cols.findIndex((c) => c === k || c.includes(k));
      if (idx !== -1) {
        const cell = cells[idx];
        const raw = cell?.f ?? cell?.v;
        if (raw !== null && raw !== undefined) return String(raw).trim();
      }
    }
    const fallbackCell = cells[fallbackIdx];
    const fallbackRaw = fallbackCell?.f ?? fallbackCell?.v;
    return fallbackRaw !== null && fallbackRaw !== undefined ? String(fallbackRaw).trim() : '';
  };

  const projects: ProjectItem[] = [];

  rows.forEach((row, index) => {
    const cells = row.c || [];
    const active = getCell(cells, ['active', 'show', 'visible', 'publish'], 99).toLowerCase();
    if (active === 'false' || active === 'no' || active === '0' || active === 'hide') return;

    const title = getCell(cells, ['title', 'name', 'project'], 0);
    const youtubeRaw = getCell(cells, ['youtube', 'video', 'url', 'link'], 4);
    const youtubeId = extractYouTubeId(youtubeRaw);
    if (!title || !youtubeId) return;

    const categoryRaw = getCell(cells, ['category', 'group', 'type'], 1) || 'video';
    const categoryLabel = getCell(cells, ['categorylabel', 'label', 'tag'], 2) || (normalizeCategory(categoryRaw) === 'CGI & Gaming' ? 'VFX & CGI' : 'Video Editing');
    const year = getCell(cells, ['year', 'date'], 3) || String(new Date().getFullYear());
    const description = getCell(cells, ['description', 'desc', 'summary', 'details'], 5);
    const toolsRaw = getCell(cells, ['tools', 'software'], 6);
    const role = getCell(cells, ['role'], 7) || 'Editor & Artist';

    projects.push({
      id: `sheet-${index + 1}-${youtubeId}`,
      title,
      category: normalizeCategory(categoryRaw),
      categoryLabel,
      youtubeId,
      youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
      year,
      description,
      tools: toolsRaw
        ? toolsRaw.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Premiere Pro', 'After Effects'],
      role,
    });
  });

  return projects.length > 0 ? projects : null;
}
