# LN + Manga Tracker

Personal tracker theo dõi LN/Manga/WN release từ các nxb VN + JP/EN, focus romance/yuri/school/slice-of-life.

## Files

- `index.html` — UI, mở bằng browser local
- `data.js` — data (auto-updated weekly bởi remote agent)
- `sources.json` — config: URL sources, blacklists, rules
- `UPDATE_PROMPT.md` — prompt cho remote agent
- `UPDATE.md` — hướng dẫn manual update

## Workflow

1. **Remote agent** chạy weekly (Monday Saigon time), fetch sources, parse, commit + push
2. **Local user** pull về:
   ```bash
   cd C:/Users/Admin/ln-tracker
   git pull
   ```
   rồi mở `index.html` xem bộ mới

## Genre rules (xem sources.json)

- **Bắt buộc**: romance OR yuri OR yuri-hint
- **Primary**: romance, yuri, yuri-hint, school, slice-of-life
- **Warning ⚠**: ecchi, harem, reverse-harem (vẫn add, tag warning)
- **Cấm**: BL/yaoi, webtoon/manhwa/manhua
- **Age cutoff**: skip bộ JP < 2016 mà VN mới thầu
- **Blacklist titles**: Classroom of the Elite, Mushoku Tensei
