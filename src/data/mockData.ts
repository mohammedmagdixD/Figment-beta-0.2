export const profileData = {
  name: "Alex Rivera",
  handle: "@arivera",
  bio: "Design systems, sci-fi, and matcha lattes. Curating my digital life.",
  avatar: "https://picsum.photos/seed/alex/200/200",
  socials: [
    { platform: "Twitter", url: "#", icon: "twitter" },
    { platform: "Instagram", url: "#", icon: "instagram" },
    { platform: "GitHub", url: "#", icon: "github" },
    { platform: "Website", url: "#", icon: "link" }
  ],
  sections: [
    {
      id: "movies",
      title: "Favorite Films",
      type: "movie",
      aspectRatio: "portrait", // 2:3
      items: [
        { id: "693134", title: "Dune: Part Two", subtitle: "Denis Villeneuve", image: "https://picsum.photos/seed/dune/300/450" },
        { id: "157336", title: "Interstellar", subtitle: "Christopher Nolan", image: "https://picsum.photos/seed/interstellar/300/450" },
        { id: "329865", title: "Arrival", subtitle: "Denis Villeneuve", image: "https://picsum.photos/seed/arrival/300/450" },
        { id: "335984", title: "Blade Runner 2049", subtitle: "Denis Villeneuve", image: "https://picsum.photos/seed/br2049/300/450" },
      ]
    },
    {
      id: "tvshows",
      title: "TV Shows",
      type: "tv",
      aspectRatio: "portrait", // 2:3
      items: [
        { id: "1396", title: "Breaking Bad", subtitle: "Vince Gilligan", image: "https://picsum.photos/seed/breakingbad/300/450" },
        { id: "76331", title: "Succession", subtitle: "Jesse Armstrong", image: "https://picsum.photos/seed/succession/300/450" },
        { id: "95396", title: "Severance", subtitle: "Dan Erickson", image: "https://picsum.photos/seed/severance/300/450" },
      ]
    },
    {
      id: "music",
      title: "Heavy Rotation",
      type: "music",
      aspectRatio: "square", // 1:1
      items: [
        { id: "1146195725", title: "White Ferrari", subtitle: "Frank Ocean", image: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/45/68/bb4568f3-68cd-619d-fbcb-4e179916545d/BlondCover-Final.jpg/600x600bb.jpg", previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/86/5a/d1/865ad14f-f77e-3b9c-b108-930af566864d/mzaf_286153466120868843.plus.aac.p.m4a" },
        { id: "1636790292", title: "CUFF IT", subtitle: "Beyoncé", image: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/fe/ba/43/feba43be-99e8-ad8c-9fad-1bfdea7a4e98/196589344267.jpg/600x600bb.jpg", previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/6a/7b/37/6a7b37bc-435f-efab-6543-3c3b51226bee/mzaf_9803062496289730536.plus.aac.p.m4a" },
        { id: "1463409349", title: "IGOR'S THEME", subtitle: "Tyler, The Creator", image: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/0c/06/05/0c060581-6242-6a2a-a677-20170f2cf8da/886447710180.jpg/600x600bb.jpg", previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/cb/2a/78/cb2a7894-a257-a72d-6140-8eab6be34e2c/mzaf_4097190174951026750.plus.aac.p.m4a" },
        { id: "1440838708", title: "New Person, Same Old Mistakes", subtitle: "Tame Impala", image: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a8/2e/b4/a82eb490-f30a-a321-461a-0383c88fec95/15UMGIM23316.rgb.jpg/600x600bb.jpg", previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/97/09/a4/9709a4b8-e341-a702-0623-e71744f9b1d9/mzaf_8872976146459825084.plus.aac.p.m4a" },
      ]
    },
    {
      id: "books",
      title: "Currently Reading",
      type: "book",
      aspectRatio: "portrait",
      items: [
        { id: "b1", title: "The Three-Body Problem", subtitle: "Cixin Liu", image: "https://picsum.photos/seed/threebody/300/450" },
        { id: "b2", title: "Neuromancer", subtitle: "William Gibson", image: "https://picsum.photos/seed/neuromancer/300/450" },
        { id: "b3", title: "Snow Crash", subtitle: "Neal Stephenson", image: "https://picsum.photos/seed/snowcrash/300/450" },
      ]
    },
    {
      id: "anime",
      title: "Top Anime",
      type: "anime",
      aspectRatio: "landscape", // 16:9
      items: [
        { id: "a1", title: "Cowboy Bebop", subtitle: "Shinichirō Watanabe", image: "https://picsum.photos/seed/bebop/400/225" },
        { id: "a2", title: "Neon Genesis Evangelion", subtitle: "Hideaki Anno", image: "https://picsum.photos/seed/eva/400/225" },
        { id: "a3", title: "Akira", subtitle: "Katsuhiro Otomo", image: "https://picsum.photos/seed/akira/400/225" },
      ]
    },
    {
      id: "manga",
      title: "Manga Collection",
      type: "manga",
      aspectRatio: "portrait",
      items: [
        { id: "ma1", title: "Berserk", subtitle: "Kentaro Miura", image: "https://picsum.photos/seed/berserk/300/450" },
        { id: "ma2", title: "Vagabond", subtitle: "Takehiko Inoue", image: "https://picsum.photos/seed/vagabond/300/450" },
      ]
    },
    {
      id: "webnovel",
      title: "Webnovels",
      type: "webnovel",
      aspectRatio: "portrait",
      items: [
        { id: "w1", title: "Omniscient Reader's Viewpoint", subtitle: "Sing Shong", image: "https://picsum.photos/seed/orv/300/450" },
        { id: "w2", title: "The Beginning After The End", subtitle: "TurtleMe", image: "https://picsum.photos/seed/tbate/300/450" },
      ]
    },
    {
      id: "podcasts",
      title: "Podcasts",
      type: "podcast",
      aspectRatio: "square",
      items: [
        { id: "p1", title: "Lex Fridman Podcast", subtitle: "Lex Fridman", image: "https://picsum.photos/seed/lex/300/300" },
        { id: "p2", title: "Huberman Lab", subtitle: "Andrew Huberman", image: "https://picsum.photos/seed/huberman/300/300" },
      ]
    }
  ],
  gallery: [
    "https://picsum.photos/seed/g1/400/400",
    "https://picsum.photos/seed/g2/400/500",
    "https://picsum.photos/seed/g3/400/300",
    "https://picsum.photos/seed/g4/400/600",
    "https://picsum.photos/seed/g5/400/400",
    "https://picsum.photos/seed/g6/400/400",
  ],
  blocks: [
    { id: "b1", type: "text", content: "“The details are not the details. They make the design.”\n\n– Charles Eames" },
    { id: "b2", type: "image", image: "https://picsum.photos/seed/arena1/400/500", title: "Architecture Reference" },
    { id: "b3", type: "link", title: "The Future of Interaction Design", description: "Exploring spatial computing and beyond.", domain: "uxdesign.cc", url: "#", thumbnail: "https://picsum.photos/seed/ux/400/300" },
    { id: "b4", type: "image", image: "https://picsum.photos/seed/arena2/400/300", title: "Typography" },
    { id: "b5", type: "channel", title: "Cyberpunk Aesthetics", count: 128 },
    { id: "b6", type: "text", content: "Note to self: explore more brutalist web design patterns for the new portfolio." },
    { id: "b7", type: "link", title: "Figma to Code", description: "Bridging the gap between design and engineering.", domain: "figma.com", url: "#" },
    { id: "b8", type: "image", image: "https://picsum.photos/seed/arena3/400/600", title: "Poster Design" },
  ]
};

export const diaryData = [
  {
    id: "d1",
    date: "2026-03-18",
    rating: 5,
    media: { id: "693134", title: "Dune: Part Two", subtitle: "Denis Villeneuve", image: "https://picsum.photos/seed/dune/300/450", type: "movie" }
  },
  {
    id: "d2",
    date: "2026-03-15",
    rating: 4,
    media: { id: "b1", title: "The Three-Body Problem", subtitle: "Cixin Liu", image: "https://picsum.photos/seed/threebody/300/450", type: "book" }
  },
  {
    id: "d3",
    date: "2026-03-10",
    rating: 5,
    media: { id: "a1", title: "Cowboy Bebop", subtitle: "Shinichirō Watanabe", image: "https://picsum.photos/seed/bebop/400/225", type: "anime" }
  },
  {
    id: "d4",
    date: "2026-03-05",
    rating: 4,
    media: { id: "p1", title: "Lex Fridman Podcast", subtitle: "Lex Fridman", image: "https://picsum.photos/seed/lex/300/300", type: "podcast" }
  }
];
