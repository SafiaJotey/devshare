"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowDownAZ,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  FileText,
  Globe2,
  LayoutList,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteBlogApi,
  getMyBlogsApi,
  IBlog,
  IPaginationMeta,
  updateBlogStatusApi,
} from "@/lib/api";

const categories = ["All", "Frontend", "Backend", "DevOps", "AI & Data", "Security"];
const statuses = ["All", "Published", "Draft", "Archived"] as const;
const statusStyle: Record<IBlog["status"], string> = {
  Published: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Draft: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Archived: "border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400",
};
const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));

export default function MyBlogsDashboard() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [meta, setMeta] = useState<IPaginationMeta>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState<string[]>([]);

  const loadBlogs = useCallback(async (manual = false) => {
    manual ? setIsRefreshing(true) : setIsLoading(true);
    const sortParams = sort === "oldest"
      ? { sortBy: "createdAt", sortOrder: "asc" }
      : sort === "views"
        ? { sortBy: "views", sortOrder: "desc" }
        : { sortBy: "createdAt", sortOrder: "desc" };
    try {
      const response = await getMyBlogsApi({
        page, limit: 10, search: search.trim() || undefined,
        status: status === "All" ? undefined : status,
        category: category === "All" ? undefined : category,
        ...sortParams,
      });
      if (response.success) {
        setBlogs(response.data || []);
        setMeta(response.meta || { total: 0, page: 1, limit: 10, totalPages: 0 });
        setSelected([]);
      }
    } catch (error) {
      console.warn("Could not load publications:", error);
      toast.error("Could not load your publications");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [category, page, search, sort, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => loadBlogs(), 250);
    return () => window.clearTimeout(timer);
  }, [loadBlogs]);

  const changeFilter = (update: () => void) => {
    update();
    setPage(1);
  };
  const toggleBusy = (id: string, loading: boolean) =>
    setBusy((items) => loading ? [...items, id] : items.filter((item) => item !== id));

  const deleteOne = async (id: string, title: string) => {
    if (!window.confirm("Delete “" + title + "”? This cannot be undone.")) return;
    toggleBusy(id, true);
    try {
      await deleteBlogApi(id);
      setBlogs((items) => items.filter((blog) => blog._id !== id));
      setSelected((items) => items.filter((item) => item !== id));
      setMeta((current) => ({ ...current, total: Math.max(0, current.total - 1) }));
      toast.success("Publication deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete publication");
    } finally {
      toggleBusy(id, false);
    }
  };

  const deleteSelected = async () => {
    if (!selected.length || !window.confirm("Delete " + selected.length + " selected publication(s)? This cannot be undone.")) return;
    setBusy((items) => [...items, ...selected]);
    const outcomes = await Promise.allSettled(selected.map((id) => deleteBlogApi(id)));
    const deleted = selected.filter((_, index) => outcomes[index].status === "fulfilled");
    setBlogs((items) => items.filter((blog) => !deleted.includes(blog._id)));
    setMeta((current) => ({ ...current, total: Math.max(0, current.total - deleted.length) }));
    setSelected([]);
    setBusy((items) => items.filter((id) => !selected.includes(id)));
    if (deleted.length) toast.success(deleted.length + " publication(s) deleted");
    if (deleted.length !== selected.length) toast.error("Some publications could not be deleted");
  };

  const updateStatus = async (blog: IBlog, nextStatus: IBlog["status"]) => {
    toggleBusy(blog._id, true);
    try {
      await updateBlogStatusApi(blog._id, nextStatus);
      const remainsInView = status === "All" || status === nextStatus;
      setBlogs((items) => remainsInView
        ? items.map((item) => item._id === blog._id ? { ...item, status: nextStatus, updatedAt: new Date().toISOString() } : item)
        : items.filter((item) => item._id !== blog._id));
      if (!remainsInView) {
        setMeta((current) => ({ ...current, total: Math.max(0, current.total - 1) }));
      }
      toast.success(nextStatus === "Published" ? "Article published to DevShare" : "Article archived");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update publication");
    } finally {
      toggleBusy(blog._id, false);
    }
  };

  const copyLink = async (blog: IBlog) => {
    try {
      await navigator.clipboard.writeText(window.location.origin + "/blogs/" + (blog.slug || blog._id));
      toast.success("Public link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  };

  const allSelected = blogs.length > 0 && blogs.every((blog) => selected.includes(blog._id));
  const pageViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
  const pageLikes = blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);

  return (
    <div className="space-y-6 pb-16">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary"><Globe2 size={14} /> DevShare Studio</p>
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">Your publications</h1>
          <p className="mt-2 max-w-xl text-sm text-foreground/55">Create, publish, and keep track of the technical knowledge you share with the community.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => loadBlogs(true)} disabled={isLoading || isRefreshing} className="size-11 rounded-xl border-foreground/10" aria-label="Refresh publications"><RefreshCw size={17} className={isRefreshing ? "animate-spin" : ""} /></Button>
          <Button asChild className="h-11 rounded-xl px-5 font-bold shadow-lg shadow-primary/20"><Link href="/dashboard/create-blog"><Plus size={17} /> Write an article</Link></Button>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Publication overview">
        <Summary icon={LayoutList} label="Matching articles" value={meta.total} detail="in this view" />
        <Summary icon={Eye} label="Page views" value={pageViews} detail="on this page" />
        <Summary icon={Users} label="Community likes" value={pageLikes} detail="on this page" />
      </section>

      <section className="overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-sm">
        <div className="border-b border-foreground/10 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
              <Input value={search} onChange={(event) => changeFilter(() => setSearch(event.target.value))} placeholder="Search titles and summaries" className="h-11 rounded-xl border-foreground/10 bg-foreground/[0.02] pl-10" />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <Select value={category} onValueChange={(value) => changeFilter(() => setCategory(value))}>
                <SelectTrigger className="h-11 w-full rounded-xl border-foreground/10 sm:w-36"><SelectValue placeholder="Topic" /></SelectTrigger>
                <SelectContent>{categories.map((item) => <SelectItem value={item} key={item}>{item === "All" ? "All topics" : item}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={sort} onValueChange={(value) => changeFilter(() => setSort(value))}>
                <SelectTrigger className="h-11 w-full rounded-xl border-foreground/10 sm:w-36"><ArrowDownAZ size={15} /><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="newest">Newest first</SelectItem><SelectItem value="oldest">Oldest first</SelectItem><SelectItem value="views">Most viewed</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter by publication status">
            {statuses.map((item) => <button key={item} onClick={() => changeFilter(() => setStatus(item))} className={["rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors", status === item ? "bg-primary text-primary-foreground" : "bg-foreground/[0.04] text-foreground/60 hover:bg-foreground/[0.08]"].join(" ")}>{item}</button>)}
          </div>
        </div>

        {selected.length > 0 && <div className="flex items-center justify-between gap-3 border-b border-primary/15 bg-primary/5 px-4 py-3 sm:px-5"><p className="text-sm font-semibold text-foreground">{selected.length} selected</p><Button variant="ghost" onClick={deleteSelected} disabled={busy.length > 0} className="h-8 rounded-lg px-2.5 text-xs font-semibold text-red-600 hover:bg-red-500/10 hover:text-red-600"><Trash2 size={14} /> Delete selected</Button></div>}

        <Table>
          <TableHeader className="bg-foreground/[0.025]"><TableRow className="hover:bg-transparent">
            <TableHead className="w-12 px-4 sm:px-5"><Checkbox checked={allSelected} onCheckedChange={(checked) => setSelected(checked ? blogs.map((blog) => blog._id) : [])} aria-label="Select all articles" /></TableHead>
            <TableHead className="min-w-[300px] py-4 text-xs font-bold text-foreground/50">ARTICLE</TableHead>
            <TableHead className="hidden py-4 text-xs font-bold text-foreground/50 md:table-cell">STATUS</TableHead>
            <TableHead className="hidden py-4 text-xs font-bold text-foreground/50 lg:table-cell">REACH</TableHead>
            <TableHead className="hidden py-4 text-xs font-bold text-foreground/50 xl:table-cell">UPDATED</TableHead>
            <TableHead className="w-16 py-4 text-right text-xs font-bold text-foreground/50">ACTIONS</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {isLoading ? <LoadingRow /> : blogs.length ? blogs.map((blog) => <BlogRow key={blog._id} blog={blog} selected={selected.includes(blog._id)} busy={busy.includes(blog._id)} onSelect={(checked) => setSelected((items) => checked ? [...items, blog._id] : items.filter((id) => id !== blog._id))} onDelete={deleteOne} onStatus={updateStatus} onCopy={copyLink} />) : <EmptyRow activeFilter={Boolean(search || status !== "All" || category !== "All")} onClear={() => { setSearch(""); setStatus("All"); setCategory("All"); setPage(1); }} />}
          </TableBody>
        </Table>

        {meta.total > 0 && <footer className="flex flex-col gap-3 border-t border-foreground/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><p className="text-xs text-foreground/50">Showing <strong className="text-foreground">{blogs.length}</strong> of <strong className="text-foreground">{meta.total}</strong> articles</p><div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={page <= 1 || isLoading} onClick={() => setPage((current) => current - 1)} className="rounded-lg"><ChevronLeft size={15} /> Previous</Button><span className="px-2 text-xs font-medium text-foreground/60">Page {page} of {Math.max(meta.totalPages, 1)}</span><Button variant="outline" size="sm" disabled={page >= meta.totalPages || isLoading} onClick={() => setPage((current) => current + 1)} className="rounded-lg">Next <ChevronRight size={15} /></Button></div></footer>}
      </section>
    </div>
  );
}

function Summary({ icon: Icon, label, value, detail }: { icon: typeof Eye; label: string; value: number; detail: string }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-4"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={19} /></span><div><p className="text-xl font-black tracking-tight text-foreground">{value.toLocaleString()}</p><p className="text-xs text-foreground/55">{label} <span className="text-foreground/35">· {detail}</span></p></div></div>;
}

function BlogRow({ blog, selected, busy, onSelect, onDelete, onStatus, onCopy }: { blog: IBlog; selected: boolean; busy: boolean; onSelect: (checked: boolean) => void; onDelete: (id: string, title: string) => void; onStatus: (blog: IBlog, status: IBlog["status"]) => void; onCopy: (blog: IBlog) => void }) {
  const publicHref = "/blogs/" + (blog.slug || blog._id);
  const editHref = "/dashboard/create-blog?edit=" + encodeURIComponent(blog._id);
  return <TableRow data-state={selected ? "selected" : undefined} className="group border-foreground/8">
    <TableCell className="px-4 py-4 sm:px-5"><Checkbox checked={selected} onCheckedChange={(checked) => onSelect(checked === true)} aria-label={"Select " + blog.title} /></TableCell>
    <TableCell className="py-4"><div className="flex min-w-0 items-start gap-3"><span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileText size={17} /></span><div className="min-w-0"><Link href={blog.status === "Published" ? publicHref : editHref} className="block truncate text-sm font-bold text-foreground transition-colors hover:text-primary">{blog.title}</Link><p className="mt-1 line-clamp-1 text-xs text-foreground/50">{blog.description}</p><div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-foreground/45"><span className="rounded-md bg-foreground/[0.05] px-1.5 py-0.5 font-medium">{blog.category}</span><span>{blog.readTime || "Quick read"}</span><span className="md:hidden"><StatusPill status={blog.status} /></span></div></div></div></TableCell>
    <TableCell className="hidden py-4 md:table-cell"><StatusPill status={blog.status} /></TableCell>
    <TableCell className="hidden py-4 lg:table-cell"><div className="flex gap-3 text-xs text-foreground/60"><span className="flex items-center gap-1"><Eye size={13} />{(blog.views || 0).toLocaleString()}</span><span className="flex items-center gap-1"><Users size={13} />{(blog.likes || 0).toLocaleString()}</span></div></TableCell>
    <TableCell className="hidden py-4 text-xs text-foreground/55 xl:table-cell">{formatDate(blog.updatedAt || blog.createdAt)}</TableCell>
    <TableCell className="py-4 pr-4 text-right sm:pr-5"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" disabled={busy} className="size-8 rounded-lg"><MoreHorizontal size={18} /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52 rounded-xl !border-emerald-400/25 !bg-[#06130e] p-1.5 text-foreground shadow-[0_20px_50px_rgba(0,0,0,0.65)]"><DropdownMenuLabel className="px-2.5 text-xs text-foreground/50">Actions</DropdownMenuLabel><DropdownMenuItem asChild><Link href={editHref}><Pencil size={15} /> Edit article</Link></DropdownMenuItem>{blog.status === "Published" && <><DropdownMenuItem asChild><Link href={publicHref}><Eye size={15} /> View live article</Link></DropdownMenuItem><DropdownMenuItem onClick={() => onCopy(blog)}><Copy size={15} /> Copy public link</DropdownMenuItem></>}{blog.status !== "Published" && <DropdownMenuItem onClick={() => onStatus(blog, "Published")}><Send size={15} /> {blog.status === "Archived" ? "Republish article" : "Publish now"}</DropdownMenuItem>}{blog.status === "Published" && <DropdownMenuItem onClick={() => onStatus(blog, "Draft")}><Pencil size={15} /> Move to draft</DropdownMenuItem>}{blog.status === "Archived" && <DropdownMenuItem onClick={() => onStatus(blog, "Draft")}><Pencil size={15} /> Restore as draft</DropdownMenuItem>}{blog.status !== "Archived" && <DropdownMenuItem onClick={() => onStatus(blog, "Archived")}><Archive size={15} /> Archive article</DropdownMenuItem>}<DropdownMenuSeparator className="bg-emerald-50/10" /><DropdownMenuItem onClick={() => onDelete(blog._id, blog.title)} className="text-red-500 focus:bg-red-500/10 focus:text-red-400"><Trash2 size={15} /> Delete article</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>
  </TableRow>;
}

function StatusPill({ status }: { status: IBlog["status"] }) {
  return <span className={["inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold", statusStyle[status]].join(" ")}><span className="size-1.5 rounded-full bg-current" />{status}</span>;
}

function LoadingRow() {
  return <TableRow><TableCell colSpan={6} className="h-72 text-center"><div className="flex flex-col items-center gap-3 text-foreground/45"><Loader2 className="animate-spin text-primary" size={25} /><span className="text-sm">Loading your articles…</span></div></TableCell></TableRow>;
}

function EmptyRow({ activeFilter, onClear }: { activeFilter: boolean; onClear: () => void }) {
  return <TableRow><TableCell colSpan={6} className="py-20 text-center"><div className="mx-auto max-w-sm"><span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><FileText size={22} /></span><h2 className="mt-4 font-bold text-foreground">{activeFilter ? "No matching articles" : "Your writing space is ready"}</h2><p className="mt-2 text-sm leading-6 text-foreground/55">{activeFilter ? "Try a different search or filter to find an article." : "Publish a technical walkthrough, lesson, or project story for the DevShare community."}</p>{activeFilter ? <Button variant="outline" onClick={onClear} className="mt-5 rounded-lg">Clear filters</Button> : <Button asChild className="mt-5 rounded-lg"><Link href="/dashboard/create-blog"><Plus size={16} /> Write your first article</Link></Button>}</div></TableCell></TableRow>;
}
