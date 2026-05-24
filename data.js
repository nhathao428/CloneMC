// LN + Manga Tracker data - tự động update bởi Claude weekly
// Last updated: 2026-05-24
// Format: { id, title, titleJp, publisher, format: "LN"|"Manga", volume, status, genres, nextDate, price, sourceUrl, notes, addedAt }
// Scope: cả LN VÀ Manga, cả bộ cũ continuing VÀ bộ mới debut (vol 1)

window.LN_DATA = [
  // ===== Wings Books / Kim Đồng - May 2026 schedule =====
  {
    id: "nisekoi-v15", title: "Nisekoi - Cặp đôi giả tạo", titleJp: "Nisekoi",
    publisher: "Wingbooks", format: "Manga", volume: 15, status: "upcoming",
    genres: ["romance", "comedy", "school", "harem"],
    nextDate: "2026-05-11", price: 40000,
    sourceUrl: "https://nxbkimdong.com.vn/lich-phat-hanh-sach-dinh-ki-thang-5-2026",
    notes: "Romance comedy harem.", addedAt: "2026-05-24"
  },
  {
    id: "nisekoi-v16", title: "Nisekoi - Cặp đôi giả tạo", titleJp: "Nisekoi",
    publisher: "Wingbooks", format: "Manga", volume: 16, status: "upcoming",
    genres: ["romance", "comedy", "school", "harem"],
    nextDate: "2026-05-25", price: 40000,
    sourceUrl: "https://nxbkimdong.com.vn/lich-phat-hanh-sach-dinh-ki-thang-5-2026",
    notes: "", addedAt: "2026-05-24"
  },
{
    id: "yona-v40", title: "Yona - Công chúa bình minh", titleJp: "Akatsuki no Yona",
    publisher: "Wingbooks", format: "Manga", volume: 40, status: "upcoming",
    genres: ["romance", "fantasy", "drama"],
    nextDate: "2026-05-15", price: 25000,
    sourceUrl: "https://nxbkimdong.com.vn/lich-phat-hanh-sach-dinh-ki-thang-5-2026",
    notes: "Fantasy romance, dài tập.", addedAt: "2026-05-24"
  },
  {
    id: "yona-v41", title: "Yona - Công chúa bình minh", titleJp: "Akatsuki no Yona",
    publisher: "Wingbooks", format: "Manga", volume: 41, status: "upcoming",
    genres: ["romance", "fantasy", "drama"],
    nextDate: "2026-05-29", price: 25000,
    sourceUrl: "https://nxbkimdong.com.vn/lich-phat-hanh-sach-dinh-ki-thang-5-2026",
    notes: "", addedAt: "2026-05-24"
  },

  // ===== AMAK - LN catalog hiện hành =====
  {
    id: "date-a-live-another-route", title: "Date A Live Another Route",
    titleJp: "Date A Live Another Route",
    publisher: "AMAK", volume: "?", status: "ongoing",
    genres: ["romance", "harem", "supernatural"],
    nextDate: "[verify]", price: 158000,
    sourceUrl: "https://amak.vn/en/book_cat/light-novel/",
    notes: "Spin-off Date A Live.", addedAt: "2026-05-24"
  },
  {
    id: "magical-rev-princess-v1", title: "The Magical Revolution of the Reincarnated Princess and the Genius Young Lady",
    titleJp: "Tensei Oujo to Tensai Reijou no Mahou Kakumei",
    publisher: "AMAK", volume: 1, status: "ongoing",
    genres: ["yuri", "fantasy", "romance"],
    nextDate: "[verify]", price: 168000,
    sourceUrl: "https://amak.vn/en/book_cat/light-novel/",
    notes: "Yuri fantasy nổi tiếng — content TikTok ngách yuri rất ăn.", addedAt: "2026-05-24"
  },
  {
    id: "elaina-v16", title: "Wandering Witch: The Journey of Elaina",
    titleJp: "Majo no Tabitabi",
    publisher: "AMAK", volume: 16, status: "ongoing",
    genres: ["fantasy", "slice-of-life", "drama"],
    nextDate: "[verify]", price: 148000,
    sourceUrl: "https://amak.vn/en/book_cat/light-novel/",
    notes: "Du ký phù thủy. Có yếu tố yuri nhẹ.", addedAt: "2026-05-24"
  },
  {
    id: "villainess-v4", title: "I'm In Love With The Villainess",
    titleJp: "Watashi no Oshi wa Akuyaku Reijou",
    publisher: "AMAK", volume: 4, status: "ongoing",
    genres: ["yuri", "romance", "fantasy", "isekai"],
    nextDate: "[verify]", price: 145000,
    sourceUrl: "https://amak.vn/en/book_cat/light-novel/",
    notes: "Yuri isekai, fanbase mạnh.", addedAt: "2026-05-24"
  },
  {
    id: "otaku-girlfriend-v5", title: "Guide To The Perfect Otaku Girlfriend: Roomies And Romance",
    titleJp: "Otaku ni Yasashii Gal wa Inai!?",
    publisher: "AMAK", volume: 5, status: "ongoing",
    genres: ["romance", "comedy", "slice-of-life"],
    nextDate: "[verify]", price: 118000,
    sourceUrl: "https://amak.vn/en/book_cat/light-novel/",
    notes: "Romcom otaku x gal.", addedAt: "2026-05-24"
  },
  {
    id: "saijo-osewa-v1", title: "Saijo no Osewa", titleJp: "Saijou no Osewa",
    publisher: "AMAK", volume: 1, status: "ongoing",
    genres: ["romance", "school", "slice-of-life"],
    nextDate: "[verify]", price: 138000,
    sourceUrl: "https://amak.vn/en/book_cat/light-novel/",
    notes: "Romance học đường mới.", addedAt: "2026-05-24"
  },
  {
    id: "saijo-osewa-v2", title: "Saijo no Osewa", titleJp: "Saijou no Osewa",
    publisher: "AMAK", volume: 2, status: "upcoming",
    genres: ["romance", "school", "slice-of-life"],
    nextDate: "[verify]", price: 0,
    sourceUrl: "https://amak.vn/en/book_cat/light-novel/",
    notes: "Giá chưa công bố.", addedAt: "2026-05-24"
  },

  // ===== IPM - LN catalog =====
  {
    id: "86-alter-2", title: "86 - Eighty Six", titleJp: "Hachi-Roku - Eighty Six",
    publisher: "IPM", volume: "Alter 2", status: "ongoing",
    genres: ["romance", "drama", "military", "sci-fi"],
    nextDate: "[verify]", price: 113100,
    sourceUrl: "https://ipm.vn/collections/light-novel",
    notes: "Bộ romance + chiến tranh. Anime nổi tiếng.", addedAt: "2026-05-24"
  },
  {
    id: "sao-v28", title: "Sword Art Online", titleJp: "Sword Art Online",
    publisher: "IPM", volume: 28, status: "ongoing",
    genres: ["romance", "action", "fantasy", "isekai"],
    nextDate: "[verify]", price: 100000,
    sourceUrl: "https://ipm.vn/collections/light-novel",
    notes: "Kirito x Asuna là OTP kinh điển.", addedAt: "2026-05-24"
  },
  {
    id: "musubu-sach", title: "Musubu Và Sách", titleJp: "Musubu to Hon",
    publisher: "IPM", volume: "Single", status: "completed",
    genres: ["romance", "slice-of-life", "drama"],
    nextDate: "—", price: 89250,
    sourceUrl: "https://ipm.vn/collections/light-novel",
    notes: "Single volume slice-of-life.", addedAt: "2026-05-24"
  },

  // ===== Legacy seeds - bộ kinh điển user theo dõi =====
  {
    id: "tnnb", title: "Thiên sứ nhà bên ngày nào cũng làm hư tôi",
    titleJp: "Otonari no Tenshi-sama ni Itsunomanika Dame Ningen ni Sareteita Ken",
    publisher: "Wingbooks", volume: "?", status: "ongoing",
    genres: ["romance", "slice-of-life", "school"],
    nextDate: "[verify]",
    sourceUrl: "https://nxbkimdong.com.vn/tap-le-thien-su-nha-ben-light-novel",
    notes: "Flagship romance của Wingbooks. JP đã >10 vol, VN đang ra. Bộ HOT nhất để làm content.", addedAt: "2026-05-24"
  },
  {
    id: "bunny-senpai", title: "Bunny Girl Senpai (Seishun Buta Yarou)",
    titleJp: "Seishun Buta Yarou wa Bunny Girl Senpai no Yume wo Minai",
    publisher: "Wingbooks", volume: "?", status: "ongoing",
    genres: ["romance", "drama", "supernatural"],
    nextDate: "[verify]", sourceUrl: "",
    notes: "Romance + supernatural. Sakuta x Mai.", addedAt: "2026-05-24"
  },
  {
    id: "oregairu", title: "Oregairu (Thanh xuân tôi sai lầm như mong đợi)",
    titleJp: "Yahari Ore no Seishun Love Comedy wa Machigatteiru",
    publisher: "IPM", volume: "?", status: "ongoing",
    genres: ["romance", "drama", "school"],
    nextDate: "[verify]", sourceUrl: "",
    notes: "Tâm lý học đường. Hachiman x Yukino.", addedAt: "2026-05-24"
  },
  {
    id: "rezero", title: "Re:Zero", titleJp: "Re:Zero kara Hajimeru Isekai Seikatsu",
    publisher: "IPM", volume: "?", status: "ongoing",
    genres: ["romance", "fantasy", "isekai", "drama"],
    nextDate: "[verify]", sourceUrl: "",
    notes: "Subaru x Emilia/Rem. Drama nặng.", addedAt: "2026-05-24"
  },
  {
    id: "yagakimi", title: "Bloom Into You", titleJp: "Yagate Kimi ni Naru",
    publisher: "Khác", format: "Manga", volume: "?", status: "completed",
    genres: ["yuri", "romance", "drama", "school"],
    nextDate: "—", sourceUrl: "",
    notes: "Yuri kinh điển. Check publisher VN cụ thể.", addedAt: "2026-05-24"
  },

  // ===== Thái Hà / Hikari Light Novel =====
  {
    id: "unnamed-memory-v5", title: "Unnamed Memory - Hồi ức không tên",
    titleJp: "Unnamed Memory",
    publisher: "Thái Hà", volume: 5, status: "ongoing",
    genres: ["romance", "fantasy", "drama"],
    nextDate: "[verify]", price: 159200,
    sourceUrl: "https://nhasachthaiha.vn/collections/light-novel",
    notes: "Romance fantasy dark. Anime đã ra. 💡 Bộ romance ít người biết → easy viral.",
    addedAt: "2026-05-24"
  },

  {
    id: "spyroom-v9-sp", title: "Spy Room - Lớp học điệp viên (Đặc biệt)",
    titleJp: "Spy Kyoushitsu",
    publisher: "Thái Hà", volume: 9, status: "ongoing",
    genres: ["yuri-hint", "school", "drama", "action"],
    nextDate: "[verify]", price: 143200,
    sourceUrl: "https://nhasachthaiha.vn/collections/light-novel",
    notes: "Bản đặc biệt. Spy thriller — có yuri hint giữa các nữ chính (Klaus's team), fanbase ship nhiều.",
    addedAt: "2026-05-24"
  },

  // ===== Nhã Nam =====
  {
    id: "nhan-gui-tat-ca", title: "Nhắn gửi tất cả các em, những người tôi đã yêu",
    titleJp: "",
    publisher: "Nhã Nam", volume: "Single", status: "ongoing",
    genres: ["romance", "drama", "school"],
    nextDate: "[verify]", price: 108800,
    sourceUrl: "https://nhanam.vn/light-novel",
    notes: "YA romance. Tone nhẹ nhàng — phù hợp audience nữ.",
    addedAt: "2026-05-24"
  },
  {
    id: "nhat-ky-am-ap", title: "Nhật ký ấm áp",
    titleJp: "", publisher: "Nhã Nam", volume: "?", status: "ongoing",
    genres: ["romance", "slice-of-life"],
    nextDate: "[verify]", price: 102000,
    sourceUrl: "https://nhanam.vn/light-novel",
    notes: "Slice-of-life ấm.",
    addedAt: "2026-05-24"
  },
  {
    id: "loi-noi-dua-v2", title: "Lời nói đùa",
    titleJp: "", publisher: "Nhã Nam", volume: 2, status: "ongoing",
    genres: ["romance", "drama"],
    nextDate: "[verify]", price: 148750,
    sourceUrl: "https://nhanam.vn/light-novel",
    notes: "Romance drama.",
    addedAt: "2026-05-24"
  },

  // ===== Wings Books - April 2026 (verified từ Kim Đồng blog) =====
  {
    id: "dau-an-hoang-gia-v45", title: "Dấu ấn Hoàng gia",
    titleJp: "Akagami no Shirayuki-hime",
    publisher: "Wingbooks", format: "Manga", volume: 45, status: "ongoing",
    genres: ["romance", "fantasy", "drama"],
    nextDate: "2026-04-03", sourceUrl: "https://nxbkimdong.com.vn/lich-phat-hanh-sach-dinh-ki-thang-4-2026",
    notes: "Reverse romance fantasy (Snow White with the Red Hair). Vol 45+46 ra cùng ngày.",
    addedAt: "2026-05-24"
  },
  {
    id: "komi-v31", title: "Komi - 'Nữ thần' sợ giao tiếp",
    titleJp: "Komi-san wa, Comyushou desu",
    publisher: "Wingbooks", format: "Manga", volume: 31, status: "upcoming",
    genres: ["romance", "comedy", "school", "slice-of-life"],
    nextDate: "2026-05-04", sourceUrl: "https://nxbkimdong.com.vn/lich-phat-hanh-sach-dinh-ki-thang-5-2026",
    notes: "💡 BỘ HOT cho TikTok — cute, viral easy, audience rộng.",
    addedAt: "2026-05-24"
  },

  // ===== JP/EN sources (Yen Press, Seven Seas, Tokyopop) =====
  // Leading indicators: bộ nào được dịch EN trước → 6-18 tháng sau VN có thể mua bản quyền
  {
    id: "jp-chitose-ramune-v8", title: "Chitose Is in the Ramune Bottle",
    titleJp: "Chitose-kun wa Ramune Bin no Naka",
    publisher: "Yen Press", volume: 8, status: "upcoming",
    genres: ["romance", "slice-of-life", "school"],
    nextDate: "2026-05-12", region: "JP-EN",
    sourceUrl: "https://yenpress.com/calendar",
    notes: "Romcom học đường JP hot, chưa có bản VN. 💡 Leading indicator để săn idea sớm.",
    addedAt: "2026-05-24"
  },
  {
    id: "jp-tnnb-v3-audio", title: "The Angel Next Door Spoils Me Rotten (Audiobook EN)",
    titleJp: "Otonari no Tenshi-sama", publisher: "Yen Press", volume: 3, status: "upcoming",
    genres: ["romance", "comedy", "slice-of-life", "school"],
    nextDate: "2026-05-19", region: "JP-EN",
    sourceUrl: "https://yenpress.com/calendar",
    notes: "Audiobook EN của Thiên sứ nhà bên. VN đã có bản giấy — dùng để cross-reference.",
    addedAt: "2026-05-24"
  },
  {
    id: "jp-happy-marriage-v7", title: "My Happy Marriage (Audiobook EN)",
    titleJp: "Watashi no Shiawase na Kekkon",
    publisher: "Yen Press", volume: 7, status: "upcoming",
    genres: ["romance", "drama", "fantasy"],
    nextDate: "2026-05-19", region: "JP-EN",
    sourceUrl: "https://yenpress.com/calendar",
    notes: "Romance fantasy josei, anime nổi. VN có thể mua bản quyền sớm.",
    addedAt: "2026-05-24"
  },
  // From yuri.guide
  {
    id: "jp-magical-rev-en", title: "The Magical Revolution of the Reincarnated Princess and the Genius Young Lady (EN LN)",
    titleJp: "Tensei Oujo to Tensai Reijou no Mahou Kakumei",
    publisher: "Yen Press", volume: "?", status: "upcoming",
    genres: ["yuri", "fantasy", "romance"],
    nextDate: "2026-06-09", region: "JP-EN",
    sourceUrl: "https://yuri.guide/upcoming",
    notes: "Bản EN. VN (AMAK) đã có vol 1 — track để biết bộ này có tiếp ra VN không.",
    addedAt: "2026-05-24"
  },
  {
    id: "jp-rollover-die", title: "ROLL OVER AND DIE",
    titleJp: "Korosareru Tabi ni Heroine ga...",
    publisher: "Seven Seas", volume: "?", status: "upcoming",
    genres: ["yuri", "fantasy", "action", "drama"],
    nextDate: "2026-06-30", region: "JP-EN",
    sourceUrl: "https://yuri.guide/upcoming",
    notes: "Yuri dark fantasy. Chưa có bản VN — content niche hiếm.",
    addedAt: "2026-05-24"
  },
  {
    id: "jp-gushing-mg", title: "Gushing over Magical Girls",
    titleJp: "Mahou Shoujo ni Akogarete",
    publisher: "Yen Press", format: "Manga", volume: "?", status: "upcoming",
    genres: ["yuri", "magical-girl", "comedy"],
    nextDate: "2026-07-14", region: "JP-EN",
    sourceUrl: "https://yuri.guide/upcoming",
    notes: "Yuri magical girl, anime 2024 controversy. Niche edgy.",
    addedAt: "2026-05-24"
  },
  {
    id: "jp-ugly-girls", title: "Ugly Girls",
    titleJp: "Busu-tachi", publisher: "Tokyopop", format: "Manga", volume: "?", status: "upcoming",
    genres: ["yuri", "drama"],
    nextDate: "2026-09-29", region: "JP-EN",
    sourceUrl: "https://yuri.guide/upcoming",
    notes: "Yuri drama.",
    addedAt: "2026-05-24"
  },

  // ===== WN (Web Novel) - ưu tiên JP origin (Syosetu/Kakuyomu) =====
  // Leading indicator XA: WN hot → 1-2 năm thành LN → 1-2 năm nữa đến VN. Tracking thủ công chủ yếu.
{
    id: "wn-rezero", title: "Re:Zero (WN gốc)",
    titleJp: "Re:Zero kara Hajimeru Isekai Seikatsu",
    publisher: "Syosetu", format: "WN", volume: "Ongoing", status: "ongoing",
    genres: ["romance", "fantasy", "isekai", "drama", "psychological"], region: "JP",
    nextDate: "[ongoing]",
    sourceUrl: "https://ncode.syosetu.com/n2267be/",
    notes: "WN Re:Zero vẫn đang update. LN chỉ tới Arc 7-8, WN xa hơn. Spoiler heavy.",
    addedAt: "2026-05-24"
  },
  {
    id: "wn-tnnb", title: "Thiên sứ nhà bên (WN gốc)",
    titleJp: "Otonari no Tenshi-sama ni Itsunomanika Dame Ningen ni Sareteita Ken",
    publisher: "Kakuyomu", format: "WN", volume: "Ongoing", status: "ongoing",
    genres: ["romance", "comedy", "slice-of-life", "school"], region: "JP",
    nextDate: "[ongoing]",
    sourceUrl: "https://kakuyomu.jp/works/1177354054892870906",
    notes: "WN gốc của bộ HOT Wings Books. Tác giả Saekisan vẫn đăng tiếp.",
    addedAt: "2026-05-24"
  }
];
