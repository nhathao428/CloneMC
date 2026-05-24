# Remote Agent Update Prompt

You are updating the LN/Manga/WN tracker repository. The repo has been cloned for you.

## Steps

1. **Load tool**: `ToolSearch select:WebFetch`
2. **Read** `sources.json` (config) and `data.js` (current entries)
3. **For each source** in `sources.sources`:
   - `type: "monthly_schedule"`: fetch URL with `{M}` = current month (no pad) and `{YYYY}` = current year. Also try month+1. If 404, try `fallbackUrl`.
   - `type: "catalog"`: fetch URL directly
   - `type: "aggregator"` or `type: "wn_ranking"`: fetch URL
4. **Parse releases** from each response. Apply these rules STRICTLY:
   - **MUST have** at least one of: `romance`, `yuri`, `yuri-hint` in genres → else SKIP
   - Skip if any blacklist genre matches: BL, boylove, yaoi, webtoon, manhwa, manhua
   - Skip if title matches `titleBlacklist` (or its aliases): currently `Classroom of the Elite`, `Mushoku Tensei`
   - Skip if JP origin year < 2016 AND VN vol ≤ 5 (newly licensed old series) — see `ageCutoff`. Need to know JP start year; do a quick web search to verify.
   - If genre matches `genreDeprioritize` (ecchi, harem, reverse-harem): KEEP but tag the genre, don't skip
   - `titleJp` must be **romanji** (Hepburn). If only kanji available, romanize it. Never store kanji.
   - For WN sources (Syosetu/Kakuyomu): prioritize JP origin only, no Trung/Hàn
5. **CRITICAL — extract coverUrl**: với mỗi release, fetch URL ảnh BÌA (cover art). User dùng tracker chủ yếu để LẤY ẢNH đăng TikTok (content text-only ngán). Nếu không có coverUrl, entry gần như vô dụng. Cách lấy:
   - Catalog page (IPM/AMAK/Thái Hà/Nhã Nam): mỗi product card có `<img src="...">` — extract URL ảnh chính
   - Schedule page (Kim Đồng): có thể không có ảnh trực tiếp, follow link vào product page hoặc search
   - Yen Press: product detail page có cover
   - Nếu source page không có cover, làm WebSearch `"<title>" cover art light novel` hoặc `"<title>" book cover` và lấy URL ảnh đầu (ưu tiên anilist.co, myanimelist.net, vndb.org, publisher domain)
   - Ưu tiên ảnh chất lượng cao (≥400px width)
6. **Dedupe**: compare new entries against existing `window.LN_DATA` by `id`. Skip if id exists.
7. **Append** new entries to `data.js` (don't delete old). Format:
   ```js
   {
     id: "<kebab-case-title-vol>",
     title: "<VN title or original>",
     titleJp: "<romanji>",
     publisher: "<one of: Wingbooks, IPM, AMAK, Thái Hà, Tsuki, Nhã Nam, Yen Press, Seven Seas, Tokyopop, Syosetu, Kakuyomu, Khác>",
     format: "LN" | "Manga" | "WN",
     volume: <number or string>,
     status: "upcoming" | "ongoing" | "completed" | "rumored",
     genres: [...],
     nextDate: "YYYY-MM-DD" | "[verify]" | "—",
     price: <number, 0 nếu không có>,
     sourceUrl: "<URL>",
     coverUrl: "<URL ảnh bìa - BẮT BUỘC nếu có thể fetch>",
     notes: "<short note in Vietnamese>",
     addedAt: "<today YYYY-MM-DD>"
   }
   ```
8. **Update** comment on line 2 of `data.js`: `// Last updated: YYYY-MM-DD`
9. **Commit**: `git add -A && git commit -m "Weekly update YYYY-MM-DD: +N entries"`
10. **Push**: `git push origin main`
11. **Report** (last message): bao nhiêu entry mới mỗi publisher, source nào fail, có entry nào skip do rules, **bao nhiêu entry có coverUrl vs không có**

## Critical

- KHÔNG xóa entries cũ trong data.js
- KHÔNG modify index.html / sources.json
- Nếu source fail, log và continue, không bỏ cuộc cả task
- Nếu không có entry mới nào sau khi dedupe: vẫn commit empty message để biết đã chạy, hoặc skip commit và report "no new releases this week"
