# LN Tracker - Cách update data

## Auto (cron weekly)

Đã setup cron weekly tự fire. **Lưu ý**: cron Claude Code có giới hạn 7 ngày, nên cron sẽ chỉ fire 1 lần rồi expire. Mỗi vài tuần cần re-run setup.

## Manual update (bất cứ lúc nào)

Mở Claude Code, paste prompt sau:

```
Update LN tracker (C:/Users/Admin/ln-tracker/).

Steps:
1. Load tool: ToolSearch query "select:WebFetch"
2. Read C:/Users/Admin/ln-tracker/sources.json để lấy URL list
3. Read C:/Users/Admin/ln-tracker/data.js để biết entries hiện có (lưu ý id format)
4. Với mỗi source trong sources.json:
   - Nếu type="monthly_schedule": fetch URL của tháng hiện tại + tháng sau theo urlPattern (thay {M} = số tháng không pad, {YYYY} = năm). Nếu 404, fetch fallbackUrl
   - Nếu type="catalog": fetch URL trực tiếp
5. Parse mỗi response → trích LN/manga romance, comedy, yuri (loại BL/boylove/yaoi)
6. So sánh với entries trong data.js (theo id). Skip nếu đã có.
7. Append entries mới vào array window.LN_DATA trong data.js. Format:
   { id, title, titleJp, publisher, volume, status, genres, nextDate, price, sourceUrl, notes, addedAt: "YYYY-MM-DD" }
8. Update comment "Last updated:" ở dòng 2 data.js
9. Report ngắn: bao nhiêu entry mới mỗi publisher, source nào fail

Hôm nay: dùng new Date(). Không hỏi confirm, tự làm.
```

## Re-run cron weekly

Mỗi 1-2 tuần, paste:

```
Re-setup cron weekly update LN tracker. Schedule chạy thứ Hai 9h sáng, prompt = nội dung trong C:/Users/Admin/ln-tracker/UPDATE.md (section "Manual update").
```

## Thêm publisher mới

Edit `sources.json` thêm entry mới với `publisher`, `type`, `url`. Nếu publisher mới chưa có badge color, edit `index.html` thêm class CSS `.badge-{name}` và update `pubBadge()` function.

## Genre filter

Mặc định loại BL. Genre primary: romance, comedy, yuri. Preset "💕 Hot 3" filter cả 3 cùng lúc (OR).
