"use client";

import { createElement, useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useGetContentsQuery } from "@/store/api";
import { Container, PageHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { LEGAL_IS_DRAFT } from "@/lib/config";

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "blockquote", "a",
]);

const TAG_CLASSES = {
  p: "mt-4 leading-7 text-muted",
  ul: "mt-4 list-disc space-y-2 pl-6 leading-7 text-muted",
  ol: "mt-4 list-decimal space-y-2 pl-6 leading-7 text-muted",
  li: "pl-1",
  h1: "mt-8 font-display text-3xl text-ink",
  h2: "mt-8 font-display text-2xl text-ink",
  h3: "mt-6 font-display text-xl text-ink",
  h4: "mt-5 font-semibold text-ink",
  blockquote: "mt-4 border-l-2 border-brass pl-4 italic text-muted",
  a: "font-medium text-ink underline underline-offset-4",
};

function safeContentNodes(html) {
  const document = new DOMParser().parseFromString(html, "text/html");

  const renderNode = (node, key) => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const tag = node.tagName.toLowerCase();
    const children = Array.from(node.childNodes).map((child, index) => renderNode(child, `${key}-${index}`));
    if (!ALLOWED_TAGS.has(tag)) return children;

    const props = { key, className: TAG_CLASSES[tag] };
    if (tag === "a") {
      const href = node.getAttribute("href");
      try {
        const url = new URL(href, window.location.origin);
        if (["http:", "https:", "mailto:"].includes(url.protocol)) props.href = href;
      } catch {
        // Render unsafe or malformed links as plain text.
      }
      if (!props.href) return children;
      props.rel = "noopener noreferrer";
    }

    return createElement(tag, props, ...children);
  };

  return Array.from(document.body.childNodes).map((node, index) => renderNode(node, `content-${index}`));
}

function LegalContent({ html }) {
  const [nodes, setNodes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setNodes(safeContentNodes(html)), 0);
    return () => clearTimeout(timer);
  }, [html]);

  if (!nodes) return <p role="status" className="text-muted">Loading legal document…</p>;
  return <article className="break-words">{nodes}</article>;
}

export function LegalPage({ title, contentKey }) {
  const { data, error, isLoading, refetch } = useGetContentsQuery();
  const html = data?.[contentKey];

  return (
    <>
      <PageHeader eyebrow="Legal" title={title} />
      <Container className="max-w-3xl py-14 sm:py-20">
        {LEGAL_IS_DRAFT && (
          <div role="note" className="mb-10 flex gap-3 rounded-xl border border-tight/30 bg-tight-soft p-4 text-sm text-tight">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>Legal text is provided for review. Please consult a qualified legal professional before relying on it.</p>
          </div>
        )}
        {isLoading ? (
          <p role="status" className="text-muted">Loading {title.toLowerCase()}…</p>
        ) : error ? (
          <div role="alert" className="rounded-2xl border border-no/20 bg-no-soft p-6 text-no">
            <p>{error.message || `Could not load the ${title.toLowerCase()}.`}</p>
            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={refetch}>Try again</Button>
          </div>
        ) : typeof html === "string" && html.trim() ? (
          <LegalContent html={html} />
        ) : (
          <p role="alert" className="text-muted">The {title.toLowerCase()} is not available right now.</p>
        )}
      </Container>
    </>
  );
}
