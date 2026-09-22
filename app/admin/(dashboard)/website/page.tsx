"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  ExternalLink,
  Eye,
  FileClock,
  Globe2,
  ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Send,
  Trash2,
  Upload,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { selectCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useAppSelector } from "@/src/redux/hooks";
import { useUploadFileMutation } from "@/src/redux/features/assets/assetsApi";
import {
  useCreateWebsiteMediaMutation,
  useCreateWebsitePreviewTokenMutation,
  useDeleteWebsiteMediaMutation,
  useGetWebsiteAdminQuery,
  useGetWebsiteMediaQuery,
  useGetWebsiteRevisionsQuery,
  usePublishWebsiteMutation,
  useResetWebsiteDraftMutation,
  useRestoreWebsiteRevisionMutation,
  useSaveWebsiteDraftMutation,
} from "@/src/redux/features/website/websiteApi";
import type {
  WebsiteFaq,
  WebsiteHomepageSection,
  WebsiteServiceArea,
  WebsiteSnapshot,
  WebsiteTeamMember,
  WebsiteTestimonial,
} from "@/src/redux/features/website/types";

const tabs = [
  ["home", "Home & brand"],
  ["sections", "Homepage sections"],
  ["about", "About & team"],
  ["proof", "Testimonials & FAQ"],
  ["contact", "Contact & areas"],
  ["policies", "Policies"],
  ["seo", "SEO & media"],
  ["history", "History"],
] as const;
type Tab = (typeof tabs)[number][0];

const id = (prefix: string) =>
  `${prefix}-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now().toString(36)}`;
const errorText = (error: any) =>
  error?.data?.message || error?.data?.errors?.[0]?.message || error?.message || "Something went wrong";
const deepClone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export default function WebsiteAdminPage() {
  const user = useAppSelector(selectCurrentUser);
  const canEdit = Boolean(user && ["owner", "admin", "manager"].includes(user.role));
  const { data, isLoading, isError, refetch } = useGetWebsiteAdminQuery();
  const { data: mediaResponse } = useGetWebsiteMediaQuery();
  const { data: revisionsResponse } = useGetWebsiteRevisionsQuery();
  const [saveDraft, saveState] = useSaveWebsiteDraftMutation();
  const [publish, publishState] = usePublishWebsiteMutation();
  const [resetDraft, resetState] = useResetWebsiteDraftMutation();
  const [createPreview] = useCreateWebsitePreviewTokenMutation();
  const [restoreRevision] = useRestoreWebsiteRevisionMutation();
  const [uploadFile, uploadState] = useUploadFileMutation();
  const [createMedia] = useCreateWebsiteMediaMutation();
  const [deleteMedia] = useDeleteWebsiteMediaMutation();
  const [draft, setDraft] = useState<WebsiteSnapshot | null>(null);
  const [tab, setTab] = useState<Tab>("home");
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!data?.data?.draft) return;
    setDraft(deepClone(data.data.draft));
    setDirty(false);
  }, [data?.data?.draftRevision]);

  const update = (recipe: (next: WebsiteSnapshot) => void) => {
    setDraft((current) => {
      if (!current) return current;
      const next = deepClone(current);
      recipe(next);
      return next;
    });
    setDirty(true);
    setNotice(null);
  };

  const doSave = async () => {
    if (!draft || !canEdit) return;
    try {
      await saveDraft(draft).unwrap();
      setDirty(false);
      setNotice({ type: "success", text: "Draft saved. Public content is unchanged until you publish." });
    } catch (error) {
      setNotice({ type: "error", text: errorText(error) });
      throw error;
    }
  };

  const doPreview = async () => {
    if (!draft || !canEdit) return;
    try {
      if (dirty) await saveDraft(draft).unwrap();
      setDirty(false);
      const result = await createPreview().unwrap();
      window.open(`/preview/${result.data.token}`, "_blank", "noopener,noreferrer");
    } catch (error) {
      setNotice({ type: "error", text: errorText(error) });
    }
  };

  const doPublish = async () => {
    if (!draft || !canEdit) return;
    try {
      if (dirty) await saveDraft(draft).unwrap();
      await publish({ note: `Published from Website workspace by ${user?.name || "admin"}` }).unwrap();
      setDirty(false);
      setNotice({ type: "success", text: "Website published successfully." });
    } catch (error) {
      setNotice({ type: "error", text: errorText(error) });
    }
  };

  const doReset = async () => {
    if (!canEdit || !confirm("Discard the current draft and restore the currently published website?")) return;
    try {
      await resetDraft().unwrap();
      setNotice({ type: "success", text: "Draft reset to the current published revision." });
    } catch (error) {
      setNotice({ type: "error", text: errorText(error) });
    }
  };

  const uploadMedia = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canEdit) return;
    try {
      const body = new FormData();
      body.append("file", file);
      const uploaded: any = await uploadFile(body).unwrap();
      const url = uploaded?.data?.url || uploaded?.url;
      if (!url) throw new Error("Upload did not return a URL");
      await createMedia({
        url,
        altText: file.name.replace(/\.[^.]+$/, ""),
        label: file.name,
        kind: file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : "document",
      }).unwrap();
      setNotice({ type: "success", text: "Media uploaded to the website library." });
      event.target.value = "";
    } catch (error) {
      setNotice({ type: "error", text: errorText(error) });
    }
  };

  const sortedSections = useMemo(
    () => [...(draft?.homepageSections || [])].sort((a, b) => a.order - b.order),
    [draft?.homepageSections]
  );
  const media = mediaResponse?.data || [];
  const revisions = revisionsResponse?.data || [];

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-emerald-950/10 bg-white p-10 text-center text-sm font-semibold text-muted-foreground">
        <Loader2 className="mr-2 inline h-4 w-4 animate-spin text-emerald-700" />
        Loading website workspace…
      </div>
    );
  }
  if (isError || !draft) {
    return (
      <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 text-sm font-semibold text-destructive">
        Website CMS could not be loaded.{" "}
        <button onClick={() => refetch()} className="underline font-bold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Spruce Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#7CE337]/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7CE337]">
                Website Content Management
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Manage the public website
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-emerald-100/80">
              Edit a private draft, preview safely with a secure token, and publish the complete revision with one click.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {dirty ? (
              <span className="rounded-full bg-amber-500/20 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-200">
                Unsaved changes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#7CE337]/20 px-3 py-1 text-xs font-bold text-[#7CE337]">
                <Check className="h-3.5 w-3.5" /> Draft saved
              </span>
            )}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Live site
            </a>
            {canEdit ? (
              <>
                <button
                  onClick={doReset}
                  disabled={resetState.isLoading}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Reset
                </button>
                <button
                  onClick={doPreview}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </button>
                <button
                  onClick={doSave}
                  disabled={!dirty || saveState.isLoading}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 disabled:opacity-40"
                >
                  <Save className="h-3.5 w-3.5" /> Save draft
                </button>
                <button
                  onClick={doPublish}
                  disabled={publishState.isLoading}
                  className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-5 py-2 text-xs font-bold text-[#0C3629] shadow-md transition-all hover:bg-[#8eed49] active:scale-95 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" /> Publish
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* Tab Navigation Pill Row */}
        <div className="relative z-10 mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          {tabs.map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                tab === value ? "bg-[#7CE337] text-[#0C3629] shadow-sm" : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative z-10 mt-3 text-xs text-emerald-100/70">
          Draft revision <b className="text-white">{data?.data.draftRevision}</b> · Published revision{" "}
          <b className="text-white">{data?.data.publishedRevision}</b>
          {data?.data.publishedAt ? ` · Last published ${new Date(data.data.publishedAt).toLocaleString()}` : ""}
        </div>
      </section>

      {notice ? (
        <div
          role={notice.type === "error" ? "alert" : "status"}
          className={`flex items-center gap-2.5 rounded-2xl p-4 text-sm font-semibold ${
            notice.type === "error"
              ? "border border-rose-500/20 bg-rose-50 text-rose-900"
              : "border border-emerald-500/20 bg-emerald-50 text-emerald-900"
          }`}
        >
          {notice.type === "error" ? (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          ) : (
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          )}
          <span>{notice.text}</span>
        </div>
      ) : null}

      {!canEdit ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-900">
          Your role has read-only Website access. Owners, admins and managers can change drafts and publish.
        </div>
      ) : null}

      {/* Tab Panels */}
      {tab === "home" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Brand identity" description="Site name, tagline and shared logo used across navigation and footer.">
            <Field label="Site name">
              <input
                className="field-control"
                value={draft.branding.siteName}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.branding.siteName = e.target.value; })}
              />
            </Field>
            <Field label="Tagline">
              <input
                className="field-control"
                value={draft.branding.tagline}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.branding.tagline = e.target.value; })}
              />
            </Field>
            <Field label="Logo URL">
              <input
                className="field-control"
                value={draft.branding.logoUrl}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.branding.logoUrl = e.target.value; })}
              />
            </Field>
            <Field label="Favicon URL">
              <input
                className="field-control"
                value={draft.branding.faviconUrl}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.branding.faviconUrl = e.target.value; })}
              />
            </Field>
          </Panel>

          <Panel title="Announcement bar" description="Optional site-wide message above the navigation.">
            <Toggle
              checked={draft.announcement.enabled}
              disabled={!canEdit}
              onChange={(value) => update((n) => { n.announcement.enabled = value; })}
              label="Show announcement"
            />
            <Field label="Message">
              <input
                className="field-control"
                value={draft.announcement.text}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.announcement.text = e.target.value; })}
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Link label">
                <input
                  className="field-control"
                  value={draft.announcement.linkLabel}
                  disabled={!canEdit}
                  onChange={(e) => update((n) => { n.announcement.linkLabel = e.target.value; })}
                />
              </Field>
              <Field label="Link URL">
                <input
                  className="field-control"
                  value={draft.announcement.linkUrl}
                  disabled={!canEdit}
                  onChange={(e) => update((n) => { n.announcement.linkUrl = e.target.value; })}
                />
              </Field>
            </div>
          </Panel>

          <Panel title="Hero" description="The primary conversion message and hero media.">
            <Field label="Eyebrow">
              <input
                className="field-control"
                value={draft.hero.eyebrow}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.hero.eyebrow = e.target.value; })}
              />
            </Field>
            <Field label="Headline">
              <textarea
                className="field-control min-h-24"
                value={draft.hero.title}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.hero.title = e.target.value; })}
              />
            </Field>
            <Field label="Description">
              <textarea
                className="field-control min-h-24"
                value={draft.hero.description}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.hero.description = e.target.value; })}
              />
            </Field>
            <Field label="Hero media URL">
              <input
                className="field-control"
                value={draft.hero.mediaUrl}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.hero.mediaUrl = e.target.value; })}
              />
            </Field>
            <Field label="Media alt text">
              <input
                className="field-control"
                value={draft.hero.mediaAlt}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.hero.mediaAlt = e.target.value; })}
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Primary CTA">
                <input
                  className="field-control"
                  value={draft.hero.primaryCta.label}
                  disabled={!canEdit}
                  onChange={(e) => update((n) => { n.hero.primaryCta.label = e.target.value; })}
                />
              </Field>
              <Field label="Primary URL">
                <input
                  className="field-control"
                  value={draft.hero.primaryCta.url}
                  disabled={!canEdit}
                  onChange={(e) => update((n) => { n.hero.primaryCta.url = e.target.value; })}
                />
              </Field>
              <Field label="Secondary CTA">
                <input
                  className="field-control"
                  value={draft.hero.secondaryCta.label}
                  disabled={!canEdit}
                  onChange={(e) => update((n) => { n.hero.secondaryCta.label = e.target.value; })}
                />
              </Field>
              <Field label="Secondary URL">
                <input
                  className="field-control"
                  value={draft.hero.secondaryCta.url}
                  disabled={!canEdit}
                  onChange={(e) => update((n) => { n.hero.secondaryCta.url = e.target.value; })}
                />
              </Field>
            </div>
            <ListEditor
              values={draft.hero.trustItems}
              disabled={!canEdit}
              label="Trust items"
              onChange={(values) => update((n) => { n.hero.trustItems = values; })}
            />
          </Panel>

          <Panel title="Statistics" description="Animated homepage counters.">
            <div className="space-y-3">
              {draft.statistics.map((stat, index) => (
                <div
                  key={stat.id}
                  className="grid gap-2 rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-3.5 sm:grid-cols-[1fr_110px_80px_80px_auto]"
                >
                  <input
                    aria-label="Statistic label"
                    className="field-control"
                    value={stat.label}
                    disabled={!canEdit}
                    onChange={(e) => update((n) => { n.statistics[index].label = e.target.value; })}
                  />
                  <input
                    aria-label="Statistic value"
                    type="number"
                    step="0.1"
                    className="field-control"
                    value={stat.value}
                    disabled={!canEdit}
                    onChange={(e) => update((n) => { n.statistics[index].value = Number(e.target.value); })}
                  />
                  <input
                    aria-label="Statistic suffix"
                    className="field-control"
                    value={stat.suffix}
                    disabled={!canEdit}
                    onChange={(e) => update((n) => { n.statistics[index].suffix = e.target.value; })}
                  />
                  <input
                    aria-label="Decimal places"
                    type="number"
                    min="0"
                    max="3"
                    className="field-control"
                    value={stat.decimals}
                    disabled={!canEdit}
                    onChange={(e) => update((n) => { n.statistics[index].decimals = Number(e.target.value); })}
                  />
                  {canEdit ? (
                    <button
                      className="rounded-full p-2 text-rose-600 hover:bg-rose-50"
                      aria-label="Remove statistic"
                      onClick={() => update((n) => { n.statistics.splice(index, 1); })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              ))}
              {canEdit ? (
                <button
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50"
                  onClick={() =>
                    update((n) => {
                      n.statistics.push({ id: id("stat"), label: "New statistic", value: 0, decimals: 0, suffix: "" });
                    })
                  }
                >
                  <Plus className="h-4 w-4 text-emerald-700" /> Add statistic
                </button>
              ) : null}
            </div>
          </Panel>
        </div>
      ) : null}

      {tab === "sections" ? (
        <Panel
          title="Homepage sections"
          description="Control which sections appear, their order, and editable section headings. Services content itself comes from Services."
        >
          <div className="mb-4 flex items-center justify-between rounded-2xl bg-[#F4FAF5] p-4">
            <div>
              <div className="font-bold text-brand-dark text-sm">Services remain the single source of truth</div>
              <p className="text-xs text-muted-foreground">Pricing, descriptions, extras and booking configuration stay in Services.</p>
            </div>
            <a
              href="/admin/services"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-3.5 py-1.5 text-xs font-bold text-brand-dark hover:bg-emerald-50"
            >
              Open Services <ExternalLink className="h-3.5 w-3.5 text-emerald-700" />
            </a>
          </div>

          <div className="space-y-3">
            {sortedSections.map((section, sortedIndex) => {
              const realIndex = draft.homepageSections.findIndex((item) => item.id === section.id);
              return (
                <div key={section.id} className="rounded-2xl border border-emerald-950/10 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    <Toggle
                      checked={section.enabled}
                      disabled={!canEdit}
                      onChange={(value) => update((n) => { n.homepageSections[realIndex].enabled = value; })}
                      label={section.type.replaceAll("_", " ")}
                    />
                    <span className="text-xs text-muted-foreground">Order {section.order}</span>
                    <div className="ml-auto flex gap-1">
                      {canEdit ? (
                        <>
                          <button
                            className="rounded-full p-1.5 text-brand-dark hover:bg-emerald-50 disabled:opacity-30"
                            disabled={sortedIndex === 0}
                            onClick={() => moveSection(draft, section.id, -1, update)}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            className="rounded-full p-1.5 text-brand-dark hover:bg-emerald-50 disabled:opacity-30"
                            disabled={sortedIndex === sortedSections.length - 1}
                            onClick={() => moveSection(draft, section.id, 1, update)}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <Field label="Eyebrow">
                      <input
                        className="field-control"
                        value={section.eyebrow || ""}
                        disabled={!canEdit}
                        onChange={(e) => update((n) => { n.homepageSections[realIndex].eyebrow = e.target.value; })}
                      />
                    </Field>
                    <Field label="Title">
                      <input
                        className="field-control"
                        value={section.title || ""}
                        disabled={!canEdit}
                        onChange={(e) => update((n) => { n.homepageSections[realIndex].title = e.target.value; })}
                      />
                    </Field>
                    <Field label="Subtitle">
                      <textarea
                        className="field-control min-h-20"
                        value={section.subtitle || ""}
                        disabled={!canEdit}
                        onChange={(e) => update((n) => { n.homepageSections[realIndex].subtitle = e.target.value; })}
                      />
                    </Field>
                    <Field label="Media URL">
                      <input
                        className="field-control"
                        value={section.mediaUrl || ""}
                        disabled={!canEdit}
                        onChange={(e) => update((n) => { n.homepageSections[realIndex].mediaUrl = e.target.value; })}
                      />
                    </Field>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      ) : null}

      {tab === "about" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="About page" description="Story, mission, vision and values.">
            <Field label="Eyebrow">
              <input
                className="field-control"
                value={draft.about.eyebrow}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.about.eyebrow = e.target.value; })}
              />
            </Field>
            <Field label="Page title">
              <input
                className="field-control"
                value={draft.about.title}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.about.title = e.target.value; })}
              />
            </Field>
            <Field label="Intro">
              <textarea
                className="field-control min-h-20"
                value={draft.about.intro}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.about.intro = e.target.value; })}
              />
            </Field>
            <Field label="Story heading">
              <input
                className="field-control"
                value={draft.about.storyTitle}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.about.storyTitle = e.target.value; })}
              />
            </Field>
            <ListEditor
              label="Story paragraphs"
              values={draft.about.storyParagraphs}
              disabled={!canEdit}
              multiline
              onChange={(values) => update((n) => { n.about.storyParagraphs = values; })}
            />
            <Field label="Mission">
              <textarea
                className="field-control min-h-24"
                value={draft.about.mission}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.about.mission = e.target.value; })}
              />
            </Field>
            <Field label="Vision">
              <textarea
                className="field-control min-h-24"
                value={draft.about.vision}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.about.vision = e.target.value; })}
              />
            </Field>
            <Field label="Story image URL">
              <input
                className="field-control"
                value={draft.about.mediaUrl}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.about.mediaUrl = e.target.value; })}
              />
            </Field>
          </Panel>

          <Panel title="Public team" description="Marketing team profiles for the public site.">
            <Field label="Section title">
              <input
                className="field-control"
                value={draft.team.title}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.team.title = e.target.value; })}
              />
            </Field>
            <Field label="Intro">
              <textarea
                className="field-control min-h-20"
                value={draft.team.intro}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.team.intro = e.target.value; })}
              />
            </Field>
            <div className="space-y-3">
              {[...draft.team.members]
                .sort((a, b) => a.order - b.order)
                .map((member) => {
                  const index = draft.team.members.findIndex((m) => m.id === member.id);
                  return (
                    <TeamEditor
                      key={member.id}
                      member={member}
                      disabled={!canEdit}
                      onChange={(patch) => update((n) => Object.assign(n.team.members[index], patch))}
                      onDelete={() => update((n) => { n.team.members.splice(index, 1); })}
                    />
                  );
                })}
              {canEdit ? (
                <button
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50"
                  onClick={() =>
                    update((n) =>
                      n.team.members.push({
                        id: id("team"),
                        name: "New team member",
                        role: "Team",
                        bio: "",
                        imageUrl: "",
                        visible: true,
                        order: n.team.members.length * 10 + 10,
                      })
                    )
                  }
                >
                  <Plus className="h-4 w-4 text-emerald-700" /> Add team member
                </button>
              ) : null}
            </div>
          </Panel>
        </div>
      ) : null}

      {tab === "proof" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Testimonials" description="Customer reviews and quotes for the public site.">
            <Field label="Section title">
              <input
                className="field-control"
                value={draft.testimonials.title}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.testimonials.title = e.target.value; })}
              />
            </Field>
            <div className="space-y-3">
              {[...draft.testimonials.items]
                .sort((a, b) => a.order - b.order)
                .map((item) => {
                  const index = draft.testimonials.items.findIndex((m) => m.id === item.id);
                  return (
                    <TestimonialEditor
                      key={item.id}
                      item={item}
                      disabled={!canEdit}
                      onChange={(patch) => update((n) => Object.assign(n.testimonials.items[index], patch))}
                      onDelete={() => update((n) => { n.testimonials.items.splice(index, 1); })}
                    />
                  );
                })}
              {canEdit ? (
                <button
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50"
                  onClick={() =>
                    update((n) =>
                      n.testimonials.items.push({
                        id: id("testimonial"),
                        name: "Customer",
                        role: "",
                        quote: "",
                        rating: 5,
                        imageUrl: "",
                        videoUrl: "",
                        visible: true,
                        order: n.testimonials.items.length * 10 + 10,
                      })
                    )
                  }
                >
                  <Plus className="h-4 w-4 text-emerald-700" /> Add testimonial
                </button>
              ) : null}
            </div>
          </Panel>

          <Panel title="FAQs" description="Frequently asked questions for homepage and contact page.">
            <Field label="Section title">
              <input
                className="field-control"
                value={draft.faqs.title}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.faqs.title = e.target.value; })}
              />
            </Field>
            <div className="space-y-3">
              {[...draft.faqs.items]
                .sort((a, b) => a.order - b.order)
                .map((item) => {
                  const index = draft.faqs.items.findIndex((m) => m.id === item.id);
                  return (
                    <FaqEditor
                      key={item.id}
                      item={item}
                      disabled={!canEdit}
                      onChange={(patch) => update((n) => Object.assign(n.faqs.items[index], patch))}
                      onDelete={() => update((n) => { n.faqs.items.splice(index, 1); })}
                    />
                  );
                })}
              {canEdit ? (
                <button
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50"
                  onClick={() =>
                    update((n) =>
                      n.faqs.items.push({
                        id: id("faq"),
                        question: "New question",
                        answer: "",
                        visible: true,
                        order: n.faqs.items.length * 10 + 10,
                      })
                    )
                  }
                >
                  <Plus className="h-4 w-4 text-emerald-700" /> Add FAQ
                </button>
              ) : null}
            </div>
          </Panel>
        </div>
      ) : null}

      {tab === "contact" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Contact information" description="Shared by Contact page, headers and footers.">
            <Field label="Heading">
              <input
                className="field-control"
                value={draft.contact.heading}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.contact.heading = e.target.value; })}
              />
            </Field>
            <Field label="Intro">
              <textarea
                className="field-control min-h-20"
                value={draft.contact.intro}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.contact.intro = e.target.value; })}
              />
            </Field>
            <Field label="Phone">
              <input
                className="field-control"
                value={draft.contact.phone}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.contact.phone = e.target.value; })}
              />
            </Field>
            <Field label="Email">
              <input
                className="field-control"
                type="email"
                value={draft.contact.email}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.contact.email = e.target.value; })}
              />
            </Field>
            <Field label="Business hours">
              <input
                className="field-control"
                value={draft.contact.hours}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.contact.hours = e.target.value; })}
              />
            </Field>
            <Field label="Address">
              <textarea
                className="field-control min-h-20"
                value={draft.contact.address}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.contact.address = e.target.value; })}
              />
            </Field>
            <Field label="Service-area summary">
              <input
                className="field-control"
                value={draft.contact.serviceAreaSummary}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.contact.serviceAreaSummary = e.target.value; })}
              />
            </Field>
            <Field label="Map embed URL">
              <input
                className="field-control"
                value={draft.contact.mapEmbedUrl}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.contact.mapEmbedUrl = e.target.value; })}
              />
            </Field>
          </Panel>

          <Panel title="Service areas & social links" description="Marketed locations and public social links.">
            <div className="space-y-3">
              {[...draft.serviceAreas]
                .sort((a, b) => a.order - b.order)
                .map((area) => {
                  const index = draft.serviceAreas.findIndex((m) => m.id === area.id);
                  return (
                    <AreaEditor
                      key={area.id}
                      area={area}
                      disabled={!canEdit}
                      onChange={(patch) => update((n) => Object.assign(n.serviceAreas[index], patch))}
                      onDelete={() => update((n) => { n.serviceAreas.splice(index, 1); })}
                    />
                  );
                })}
              {canEdit ? (
                <button
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50"
                  onClick={() =>
                    update((n) =>
                      n.serviceAreas.push({
                        id: id("area"),
                        name: "New service area",
                        description: "",
                        visible: true,
                        order: n.serviceAreas.length * 10 + 10,
                      })
                    )
                  }
                >
                  <Plus className="h-4 w-4 text-emerald-700" /> Add service area
                </button>
              ) : null}
            </div>

            <hr className="my-6 border-border" />

            <div className="space-y-3">
              {draft.socialLinks.map((social, index) => (
                <div
                  key={`${social.platform}-${index}`}
                  className="grid gap-2 rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-3 sm:grid-cols-[130px_1fr_1fr_auto]"
                >
                  <input
                    className="field-control"
                    placeholder="Platform"
                    value={social.platform}
                    disabled={!canEdit}
                    onChange={(e) => update((n) => { n.socialLinks[index].platform = e.target.value; })}
                  />
                  <input
                    className="field-control"
                    placeholder="Label"
                    value={social.label}
                    disabled={!canEdit}
                    onChange={(e) => update((n) => { n.socialLinks[index].label = e.target.value; })}
                  />
                  <input
                    className="field-control"
                    placeholder="https://…"
                    value={social.url}
                    disabled={!canEdit}
                    onChange={(e) => update((n) => { n.socialLinks[index].url = e.target.value; })}
                  />
                  {canEdit ? (
                    <button
                      className="rounded-full p-2 text-rose-600 hover:bg-rose-50"
                      onClick={() => update((n) => { n.socialLinks.splice(index, 1); })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              ))}
              {canEdit ? (
                <button
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50"
                  onClick={() => update((n) => n.socialLinks.push({ platform: "Instagram", label: "Instagram", url: "" }))}
                >
                  <Plus className="h-4 w-4 text-emerald-700" /> Add social link
                </button>
              ) : null}
            </div>
          </Panel>
        </div>
      ) : null}

      {tab === "policies" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <PolicyEditor
            title="Privacy Policy"
            value={draft.policies.privacy}
            disabled={!canEdit}
            onChange={(value) => update((n) => { n.policies.privacy = value; })}
          />
          <PolicyEditor
            title="Terms & Conditions"
            value={draft.policies.terms}
            disabled={!canEdit}
            onChange={(value) => update((n) => { n.policies.terms = value; })}
          />
          <PolicyEditor
            title="Cancellation & Rescheduling"
            value={draft.policies.cancellation}
            disabled={!canEdit}
            onChange={(value) => update((n) => { n.policies.cancellation = value; })}
          />
          <PolicyEditor
            title="Accessibility"
            value={draft.policies.accessibility}
            disabled={!canEdit}
            onChange={(value) => update((n) => { n.policies.accessibility = value; })}
          />
        </div>
      ) : null}

      {tab === "seo" ? (
        <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
          <Panel title="Search & sharing" description="Default metadata used by public pages.">
            <Field label="Site title">
              <input
                className="field-control"
                value={draft.seo.siteTitle}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.seo.siteTitle = e.target.value; })}
              />
            </Field>
            <Field label="Title template">
              <input
                className="field-control"
                value={draft.seo.titleTemplate}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.seo.titleTemplate = e.target.value; })}
              />
              <p className="mt-1 text-xs text-muted-foreground">Use %s where the page title should appear.</p>
            </Field>
            <Field label="Default description">
              <textarea
                className="field-control min-h-24"
                value={draft.seo.defaultDescription}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.seo.defaultDescription = e.target.value; })}
              />
            </Field>
            <Field label="Open Graph image URL">
              <input
                className="field-control"
                value={draft.seo.ogImageUrl}
                disabled={!canEdit}
                onChange={(e) => update((n) => { n.seo.ogImageUrl = e.target.value; })}
              />
            </Field>
            <ListEditor
              label="SEO keywords"
              values={draft.seo.keywords}
              disabled={!canEdit}
              onChange={(values) => update((n) => { n.seo.keywords = values; })}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Toggle
                label="Allow indexing"
                checked={draft.seo.robotsIndex}
                disabled={!canEdit}
                onChange={(value) => update((n) => { n.seo.robotsIndex = value; })}
              />
              <Toggle
                label="Allow link following"
                checked={draft.seo.robotsFollow}
                disabled={!canEdit}
                onChange={(value) => update((n) => { n.seo.robotsFollow = value; })}
              />
            </div>
          </Panel>

          <Panel title="Media library" description="Upload assets and reuse URLs across pages.">
            <label
              className={`inline-flex items-center gap-2 rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-xs font-bold text-brand-dark mb-5 ${
                !canEdit ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-emerald-50"
              }`}
            >
              <Upload className="h-4 w-4 text-emerald-700" />
              {uploadState.isLoading ? "Uploading…" : "Upload media"}
              <input
                type="file"
                accept="image/*,video/*,.pdf"
                className="sr-only"
                disabled={!canEdit || uploadState.isLoading}
                onChange={uploadMedia}
              />
            </label>

            {media.length ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {media.map((item) => (
                  <article key={item._id} className="overflow-hidden rounded-2xl border border-emerald-950/10 bg-white">
                    <div className="grid aspect-video place-items-center bg-[#F4FAF5]">
                      {item.kind === "image" ? (
                        <img src={item.url} alt={item.altText} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-emerald-700" />
                      )}
                    </div>
                    <div className="p-3">
                      <div className="truncate text-xs font-bold text-brand-dark">{item.label || item.altText}</div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        <button
                          className="inline-flex items-center gap-1 rounded-full border border-emerald-950/15 bg-white px-2 py-0.5 text-[10px] font-bold text-brand-dark hover:bg-emerald-50"
                          onClick={() => navigator.clipboard?.writeText(item.url)}
                        >
                          <Copy className="h-3 w-3" /> Copy
                        </button>
                        {canEdit && item.kind === "image" ? (
                          <>
                            <button
                              className="rounded-full border border-emerald-950/15 bg-white px-2 py-0.5 text-[10px] font-bold text-brand-dark hover:bg-emerald-50"
                              onClick={() => update((n) => { n.hero.mediaUrl = item.url; })}
                            >
                              Hero
                            </button>
                            <button
                              className="rounded-full border border-emerald-950/15 bg-white px-2 py-0.5 text-[10px] font-bold text-brand-dark hover:bg-emerald-50"
                              onClick={() => update((n) => { n.about.mediaUrl = item.url; })}
                            >
                              About
                            </button>
                            <button
                              className="rounded-full border border-emerald-950/15 bg-white px-2 py-0.5 text-[10px] font-bold text-brand-dark hover:bg-emerald-50"
                              onClick={() => update((n) => { n.seo.ogImageUrl = item.url; })}
                            >
                              OG
                            </button>
                          </>
                        ) : null}
                        {canEdit ? (
                          <button
                            className="rounded-full p-1 text-rose-600 hover:bg-rose-50"
                            onClick={async () => {
                              if (confirm("Remove this item from the CMS media library? The uploaded file itself is not deleted.")) {
                                await deleteMedia(item._id);
                              }
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-emerald-950/15 p-8 text-center text-xs text-muted-foreground">
                No website media has been registered yet.
              </div>
            )}
          </Panel>
        </div>
      ) : null}

      {tab === "history" ? (
        <Panel
          title="Published revisions"
          description="Publishing saves revision history. Restoring a revision creates a new draft; it does not change the live website until you publish again."
        >
          {revisions.length ? (
            <div className="space-y-2.5">
              {revisions.map((revision) => (
                <div
                  key={revision.revision}
                  className="flex flex-col gap-3 rounded-2xl border border-emerald-950/10 p-4 sm:flex-row sm:items-center hover:bg-[#F4FAF5]/40 transition-colors"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <FileClock className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-brand-dark text-sm">Revision {revision.revision}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(revision.publishedAt).toLocaleString()} ·{" "}
                      {revision.publishedBy?.name || revision.publishedBy?.email || "System"}
                    </div>
                    {revision.note ? <div className="mt-1 text-xs text-muted-foreground">{revision.note}</div> : null}
                  </div>
                  {canEdit ? (
                    <button
                      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-3.5 py-1.5 text-xs font-bold text-brand-dark hover:bg-emerald-50"
                      onClick={async () => {
                        if (!confirm(`Restore revision ${revision.revision} into the draft?`)) return;
                        try {
                          await restoreRevision(revision.revision).unwrap();
                          setNotice({ type: "success", text: `Revision ${revision.revision} restored to draft.` });
                        } catch (error) {
                          setNotice({ type: "error", text: errorText(error) });
                        }
                      }}
                    >
                      Restore to draft
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-emerald-950/15 p-8 text-center text-xs text-muted-foreground">
              Revision history begins with the next CMS publish.
            </div>
          )}
        </Panel>
      ) : null}
    </div>
  );
}

function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 border-b border-border/60 pb-4">
        <h2 className="text-xl font-extrabold text-brand-dark">{title}</h2>
        {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <label className={`inline-flex items-center gap-2 text-xs font-bold text-brand-dark ${disabled ? "opacity-60" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
      />
      {label}
    </label>
  );
}

function ListEditor({
  label,
  values,
  onChange,
  disabled,
  multiline = false,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
  multiline?: boolean;
}) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            {multiline ? (
              <textarea
                className="field-control min-h-20"
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(values.map((item, i) => (i === index ? e.target.value : item)))}
              />
            ) : (
              <input
                className="field-control"
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(values.map((item, i) => (i === index ? e.target.value : item)))}
              />
            )}
            {!disabled ? (
              <button
                type="button"
                className="rounded-full p-2 text-rose-600 hover:bg-rose-50 shrink-0"
                onClick={() => onChange(values.filter((_, i) => i !== index))}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        ))}
        {!disabled ? (
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-emerald-950/15 bg-white px-3 py-1.5 text-xs font-bold text-brand-dark hover:bg-emerald-50"
            onClick={() => onChange([...values, ""])}
          >
            <Plus className="h-3.5 w-3.5 text-emerald-700" /> Add item
          </button>
        ) : null}
      </div>
    </Field>
  );
}

function TeamEditor({
  member,
  onChange,
  onDelete,
  disabled,
}: {
  member: WebsiteTeamMember;
  onChange: (patch: Partial<WebsiteTeamMember>) => void;
  onDelete: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
      <div className="flex items-center justify-between">
        <Toggle label="Visible on public site" checked={member.visible} disabled={disabled} onChange={(visible) => onChange({ visible })} />
        {!disabled ? (
          <button className="rounded-full p-1.5 text-rose-600 hover:bg-rose-50" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        <input
          className="field-control"
          placeholder="Name"
          value={member.name}
          disabled={disabled}
          onChange={(e) => onChange({ name: e.target.value })}
        />
        <input
          className="field-control"
          placeholder="Role"
          value={member.role}
          disabled={disabled}
          onChange={(e) => onChange({ role: e.target.value })}
        />
        <input
          className="field-control sm:col-span-2"
          placeholder="Image URL"
          value={member.imageUrl}
          disabled={disabled}
          onChange={(e) => onChange({ imageUrl: e.target.value })}
        />
        <textarea
          className="field-control min-h-20 sm:col-span-2"
          placeholder="Bio"
          value={member.bio}
          disabled={disabled}
          onChange={(e) => onChange({ bio: e.target.value })}
        />
        <input
          className="field-control"
          type="number"
          placeholder="Display order"
          value={member.order}
          disabled={disabled}
          onChange={(e) => onChange({ order: Number(e.target.value) })}
        />
      </div>
    </div>
  );
}

function TestimonialEditor({
  item,
  onChange,
  onDelete,
  disabled,
}: {
  item: WebsiteTestimonial;
  onChange: (patch: Partial<WebsiteTestimonial>) => void;
  onDelete: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
      <div className="flex items-center justify-between">
        <Toggle label="Visible on public site" checked={item.visible} disabled={disabled} onChange={(visible) => onChange({ visible })} />
        {!disabled ? (
          <button className="rounded-full p-1.5 text-rose-600 hover:bg-rose-50" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        <input
          className="field-control"
          placeholder="Customer name"
          value={item.name}
          disabled={disabled}
          onChange={(e) => onChange({ name: e.target.value })}
        />
        <input
          className="field-control"
          placeholder="Role / location"
          value={item.role}
          disabled={disabled}
          onChange={(e) => onChange({ role: e.target.value })}
        />
        <textarea
          className="field-control min-h-20 sm:col-span-2"
          placeholder="Quote"
          value={item.quote}
          disabled={disabled}
          onChange={(e) => onChange({ quote: e.target.value })}
        />
        <input
          className="field-control"
          placeholder="Image URL"
          value={item.imageUrl}
          disabled={disabled}
          onChange={(e) => onChange({ imageUrl: e.target.value })}
        />
        <input
          className="field-control"
          placeholder="Video embed URL"
          value={item.videoUrl}
          disabled={disabled}
          onChange={(e) => onChange({ videoUrl: e.target.value })}
        />
        <input
          className="field-control"
          type="number"
          min="1"
          max="5"
          placeholder="Rating (1-5)"
          value={item.rating}
          disabled={disabled}
          onChange={(e) => onChange({ rating: Number(e.target.value) })}
        />
        <input
          className="field-control"
          type="number"
          placeholder="Display order"
          value={item.order}
          disabled={disabled}
          onChange={(e) => onChange({ order: Number(e.target.value) })}
        />
      </div>
    </div>
  );
}

function FaqEditor({
  item,
  onChange,
  onDelete,
  disabled,
}: {
  item: WebsiteFaq;
  onChange: (patch: Partial<WebsiteFaq>) => void;
  onDelete: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
      <div className="flex items-center justify-between">
        <Toggle label="Visible" checked={item.visible} disabled={disabled} onChange={(visible) => onChange({ visible })} />
        {!disabled ? (
          <button className="rounded-full p-1.5 text-rose-600 hover:bg-rose-50" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <input
        className="field-control mt-3"
        placeholder="Question"
        value={item.question}
        disabled={disabled}
        onChange={(e) => onChange({ question: e.target.value })}
      />
      <textarea
        className="field-control mt-2 min-h-24"
        placeholder="Answer"
        value={item.answer}
        disabled={disabled}
        onChange={(e) => onChange({ answer: e.target.value })}
      />
    </div>
  );
}

function AreaEditor({
  area,
  onChange,
  onDelete,
  disabled,
}: {
  area: WebsiteServiceArea;
  onChange: (patch: Partial<WebsiteServiceArea>) => void;
  onDelete: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
      <div className="flex items-center justify-between">
        <Toggle label="Visible" checked={area.visible} disabled={disabled} onChange={(visible) => onChange({ visible })} />
        {!disabled ? (
          <button className="rounded-full p-1.5 text-rose-600 hover:bg-rose-50" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-[1fr_100px]">
        <input
          className="field-control"
          placeholder="Area name"
          value={area.name}
          disabled={disabled}
          onChange={(e) => onChange({ name: e.target.value })}
        />
        <input
          className="field-control"
          type="number"
          placeholder="Order"
          value={area.order}
          disabled={disabled}
          onChange={(e) => onChange({ order: Number(e.target.value) })}
        />
        <textarea
          className="field-control min-h-20 sm:col-span-2"
          placeholder="Public description"
          value={area.description}
          disabled={disabled}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>
    </div>
  );
}

function PolicyEditor({
  title,
  value,
  onChange,
  disabled,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <Panel title={title} description="Plain text is rendered safely with paragraph and line breaks preserved.">
      <textarea
        className="field-control min-h-[360px] font-mono text-xs leading-6"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </Panel>
  );
}

function moveSection(
  draft: WebsiteSnapshot,
  sectionId: string,
  direction: -1 | 1,
  update: (recipe: (next: WebsiteSnapshot) => void) => void
) {
  const sorted = [...draft.homepageSections].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((item) => item.id === sectionId);
  const target = sorted[index + direction];
  if (!target) return;
  const current = sorted[index];
  update((next) => {
    const a = next.homepageSections.find((item) => item.id === current.id);
    const b = next.homepageSections.find((item) => item.id === target.id);
    if (a && b) {
      const order = a.order;
      a.order = b.order;
      b.order = order;
    }
  });
}
