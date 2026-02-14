import sanitizeHtml from "sanitize-html";

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function slugifyLite(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&[a-z]+;/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripTags(input: string) {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function hasHtml(input: string) {
  return /<[^>]+>/.test(input);
}

function sanitize(input: string) {
  return sanitizeHtml(input, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "p",
      "br",
      "hr",
      "blockquote",
      "ul",
      "ol",
      "li",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "a",
      "pre",
      "code",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "span",
      "div"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      code: ["class"],
      pre: ["class"],
      h1: ["id"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      span: ["class"],
      div: ["class"],
      table: ["class"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"]
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    enforceHtmlBoundary: true,
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href || "";
        const isExternal = /^https?:\/\//i.test(href);
        const rel = attribs.rel || (isExternal ? "noreferrer noopener" : "noopener");
        const target = attribs.target || (isExternal ? "_blank" : undefined);
        return {
          tagName,
          attribs: {
            ...attribs,
            rel,
            ...(target ? { target } : {})
          }
        };
      },
      img: (tagName, attribs) => {
        return {
          tagName,
          attribs: {
            ...attribs,
            loading: attribs.loading || "lazy"
          }
        };
      }
    }
  });
}

function addHeadingIds(html: string) {
  const usedIds = new Set<string>();
  const toc: TocItem[] = [];

  const out = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, levelRaw, attrsRaw, innerRaw) => {
    const level = Number(levelRaw) as 2 | 3;
    const hasId = /\sid\s*=\s*["'][^"']+["']/i.test(attrsRaw);
    const text = stripTags(innerRaw);
    if (!text) return match;

    let id = slugifyLite(text);
    if (!id) return match;

    if (usedIds.has(id)) {
      let i = 2;
      while (usedIds.has(`${id}-${i}`)) i += 1;
      id = `${id}-${i}`;
    }

    usedIds.add(id);
    toc.push({ id, text, level });

    if (hasId) {
      return match;
    }

    return `<h${level}${attrsRaw} id="${id}">${innerRaw}</h${level}>`;
  });

  return { html: out, toc };
}

function wrapPlainText(input: string) {
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return "";

  return lines.map((line) => `<p>${sanitizeHtml(line)}</p>`).join("");
}

export function prepareRichText(input: string) {
  const raw = (input || "").trim();
  if (!raw) return { html: "", toc: [] as TocItem[] };

  const sanitized = sanitize(hasHtml(raw) ? raw : wrapPlainText(raw));
  return addHeadingIds(sanitized);
}

