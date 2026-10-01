"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, BookOpen, Users, Sparkles, X } from "lucide-react";

import WriteCTA from "@/components/shared/WriteCTA";
import { getContributorsApi, IContributor } from "@/lib/api";
import { authors as fallbackAuthors } from "@/constants/home";

function AuthorCardSkeleton() {
    return (
        <div className="relative flex min-h-[310px] flex-col justify-between overflow-hidden rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm animate-pulse">
            <div className="flex items-start justify-between">
                <div className="size-16 rounded-2xl bg-foreground/15" />
                <div className="h-3 w-8 rounded bg-foreground/10" />
            </div>

            <div className="mt-6 space-y-2">
                <div className="h-3 w-20 rounded bg-foreground/10" />
                <div className="h-6 w-3/4 rounded-lg bg-foreground/20" />
                <div className="h-4 w-1/2 rounded bg-foreground/10" />
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-foreground/10 pt-4">
                <div className="space-y-1">
                    <div className="h-6 w-10 rounded bg-foreground/20" />
                    <div className="h-2.5 w-16 rounded bg-foreground/10" />
                </div>
                <div className="h-4 w-20 rounded bg-foreground/10" />
            </div>
        </div>
    );
}

export default function AuthorsPage() {
    const [contributors, setContributors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDomain, setSelectedDomain] = useState<string>("All");
    const [sortBy, setSortBy] = useState<"articles" | "name">("articles");

    useEffect(() => {
        let isCancelled = false;
        const fetchAuthors = async () => {
            setIsLoading(true);
            try {
                const res = await getContributorsApi(50);
                if (!isCancelled && res.success && res.data && res.data.length > 0) {
                    setContributors(res.data);
                } else if (!isCancelled) {
                    setContributors(fallbackAuthors);
                }
            } catch (err) {
                if (!isCancelled) {
                    console.warn("Could not fetch authors, using fallbacks:", err);
                    setContributors(fallbackAuthors);
                }
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        };

        fetchAuthors();
        return () => {
            isCancelled = true;
        };
    }, []);

    // Extract unique domains/tags for the filter chips
    const domains = useMemo(() => {
        const set = new Set<string>();
        contributors.forEach((a) => {
            const d = a.primaryDomain || a.role || a.title;
            if (d) set.add(d.split(" ")[0]); // take first keyword or clean token
        });
        return ["All", ...Array.from(set).slice(0, 6)];
    }, [contributors]);

    // Filtered and sorted authors
    const filteredAuthors = useMemo(() => {
        return contributors
            .filter((author) => {
                const name = (author.name || "").toLowerCase();
                const role = (author.title || author.role || "").toLowerCase();
                const domain = (author.primaryDomain || "").toLowerCase();
                const query = searchQuery.trim().toLowerCase();

                const matchesSearch =
                    !query || name.includes(query) || role.includes(query) || domain.includes(query);

                const authorDomain = (author.primaryDomain || author.role || author.title || "");
                const matchesDomain =
                    selectedDomain === "All" ||
                    authorDomain.toLowerCase().includes(selectedDomain.toLowerCase());

                return matchesSearch && matchesDomain;
            })
            .sort((a, b) => {
                if (sortBy === "articles") {
                    const countA = a.totalArticles ?? a.posts ?? 0;
                    const countB = b.totalArticles ?? b.posts ?? 0;
                    return countB - countA;
                }
                return (a.name || "").localeCompare(b.name || "");
            });
    }, [contributors, searchQuery, selectedDomain, sortBy]);

    return (
        <>
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-primary/[0.04] pt-24 pb-14 md:pt-32 md:pb-20 border-b border-foreground/5">
                <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

                <div className="container relative mx-auto px-6 lg:px-8 max-w-6xl">
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                            <Sparkles className="size-3 text-accent" />
                            Community / Writers & Architects
                        </span>

                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
                            Meet the minds building in public.
                        </h1>

                        <p className="text-base sm:text-lg text-foreground/60 leading-relaxed max-w-2xl mx-auto">
                            Discover engineers, architects, and open-source creators sharing in-depth
                            technical breakdowns and production lessons.
                        </p>
                    </div>

                    {/* SEARCH & FILTER CONTROLS */}
                    <div className="mt-10 max-w-2xl mx-auto">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 size-5 text-foreground/40 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search authors by name, specialty, or domain..."
                                className="w-full rounded-2xl border border-foreground/10 bg-background py-4 pl-12 pr-10 text-sm shadow-sm outline-none transition-all placeholder:text-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/10"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 text-foreground/40 hover:text-foreground cursor-pointer"
                                    aria-label="Clear search"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>

                        {/* DOMAIN TAGS & SORT */}
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                                {domains.map((dom) => (
                                    <button
                                        key={dom}
                                        onClick={() => setSelectedDomain(dom)}
                                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${selectedDomain === dom
                                                ? "bg-foreground text-background shadow-xs"
                                                : "border border-foreground/10 bg-background text-foreground/60 hover:text-foreground hover:border-foreground/20"
                                            }`}
                                    >
                                        {dom}
                                    </button>
                                ))}
                            </div>

                            {/* SORT DROPDOWN */}
                            <div className="flex items-center gap-2 text-xs font-bold text-foreground/60 ml-auto">
                                <span>Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as "articles" | "name")}
                                    className="rounded-lg border border-foreground/10 bg-background px-2.5 py-1 text-xs font-semibold text-foreground outline-none cursor-pointer focus:border-primary"
                                >
                                    <option value="articles">Most Articles</option>
                                    <option value="name">Name (A-Z)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AUTHORS GRID */}
            <section className="py-16 md:py-24 container mx-auto px-6 lg:px-8 max-w-7xl">
                {/* STATS HEADER */}
                <div className="mb-8 flex items-center justify-between border-b border-foreground/10 pb-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground/60">
                        <Users className="size-4 text-accent" />
                        <span>
                            Showing <strong className="text-foreground">{filteredAuthors.length}</strong>{" "}
                            {filteredAuthors.length === 1 ? "author" : "authors"}
                        </span>
                    </div>

                    {(searchQuery || selectedDomain !== "All") && (
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedDomain("All");
                            }}
                            className="text-xs font-bold text-accent hover:underline cursor-pointer"
                        >
                            Reset filters
                        </button>
                    )}
                </div>

                {/* CARDS LIST */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, i) => <AuthorCardSkeleton key={i} />)
                    ) : filteredAuthors.length > 0 ? (
                        filteredAuthors.map((author, i) => {
                            const authorId = author._id || author.name;
                            const authorAvatar =
                                author.avatar ||
                                author.img ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(author.name)}`;
                            const authorTitle = author.title || author.role || "Technical Contributor";
                            const articlesCount =
                                author.totalArticles !== undefined ? author.totalArticles : author.posts || 0;
                            const domain = author.primaryDomain || "Contributor";

                            return (
                                <Link
                                    key={`${authorId}-${i}`}
                                    href={`/author/${authorId}`}
                                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/10"
                                >
                                    <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[4rem] bg-primary/[0.06] transition-colors group-hover:bg-accent/15" />

                                    <div>
                                        {/* Top Row: Avatar & Index */}
                                        <div className="relative flex items-start justify-between">
                                            <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-4 ring-primary/10 transition-transform duration-300 group-hover:scale-105">
                                                <Image
                                                    src={authorAvatar}
                                                    alt={author.name}
                                                    fill
                                                    sizes="64px"
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                            <span className="font-mono text-[10px] font-bold tracking-widest text-foreground/35">
                                                #{String(i + 1).padStart(2, "0")}
                                            </span>
                                        </div>

                                        {/* Middle Info */}
                                        <div className="mt-6">
                                            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                                                {domain}
                                            </span>
                                            <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                                                {author.name}
                                            </h3>
                                            <p className="mt-1 text-xs text-foreground/60 line-clamp-2 leading-relaxed">
                                                {authorTitle}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bottom Stats & Action */}
                                    <div className="mt-8 flex items-end justify-between border-t border-foreground/10 pt-4">
                                        <div>
                                            <span className="block text-2xl font-extrabold leading-none text-primary">
                                                {articlesCount}
                                            </span>
                                            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/45">
                                                {articlesCount === 1 ? "Article shared" : "Articles shared"}
                                            </span>
                                        </div>
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-foreground/60 transition-colors group-hover:text-accent">
                                            Profile
                                            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="col-span-full rounded-3xl border border-dashed border-foreground/15 bg-foreground/2 p-12 text-center">
                            <Users className="mx-auto size-8 text-foreground/30 mb-3" />
                            <h3 className="text-base font-bold text-foreground">No authors found</h3>
                            <p className="mt-1 text-xs text-foreground/50 max-w-sm mx-auto">
                                No contributors match &ldquo;{searchQuery}&rdquo;. Try another search term or domain filter.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedDomain("All");
                                }}
                                className="mt-4 rounded-xl bg-foreground px-4 py-2 text-xs font-bold text-background transition-opacity hover:opacity-90 cursor-pointer"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CALL TO ACTION */}
            <WriteCTA />
        </>
    );
}