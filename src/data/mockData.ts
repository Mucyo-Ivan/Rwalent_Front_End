
export interface Talent {
  id: string;
  name: string;
  category: string;
  location: string;
  profileImage: string;
  bio: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  services: Service[];
  reviews: Review[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

// Mock categories
export const categories: Category[] = [
  { id: "cat1", name: "Music", icon: "🎵", count: 24 },
  { id: "cat2", name: "Photography", icon: "📸", count: 18 },
  { id: "cat3", name: "Art", icon: "🎨", count: 15 },
  { id: "cat4", name: "Dance", icon: "💃", count: 12 },
  { id: "cat5", name: "Events", icon: "🎉", count: 20 },
  { id: "cat6", name: "Makeup", icon: "💄", count: 16 },
  { id: "cat7", name: "Tutoring", icon: "📚", count: 14 },
  { id: "cat8", name: "DJ", icon: "🎧", count: 10 }
];

// Real Rwandan talent data
export const talents: Talent[] = [
  // {
  //   id: "t1",
  //   name: "Meddy",
  //   category: "Music",
  //   location: "Kigali",
  //   profileImage: "https://i0.wp.com/rwandashowbiz.com/wp-content/uploads/2021/08/Meddy.jpg",
  //   bio: "Ngabo Médard, known professionally as Meddy, is a Rwandan R&B and Afrobeats singer known for hits like 'Slowly', 'Adi Top', and 'Holy Spirit'. After building his career in Rwanda, he moved to the US and has since become one of the most recognized Rwandan artists internationally.",
  //   isVerified: true,
  //   rating: 4.9,
  //   reviewCount: 156,
  //   services: [
  //     {
  //       id: "s1",
  //       name: "Live Concert Performance",
  //       description: "Full concert performance with band (2-3 hours)",
  //       price: 5000,
  //     },
  //     {
  //       id: "s2",
  //       name: "Private Event Performance",
  //       description: "Performance at weddings, corporate events (1 hour)",
  //       price: 3500,
  //     }
  //   ],
  //   reviews: [
  //     {
  //       id: "r1",
  //       userName: "Patrick M.",
  //       rating: 5,
  //       comment: "Meddy performed at our corporate event and was absolutely incredible. Professional, on time, and kept everyone dancing!",
  //       date: "2023-12-15"
  //     },
  //     {
  //       id: "r2",
  //       userName: "Clarisse K.",
  //       rating: 5,
  //       comment: "Best performance I've seen. His voice is even better live than on recordings!",
  //       date: "2023-11-20"
  //     }
  //   ]
  // },
  // {
  //   id: "t2",
  //   name: "The Ben",
  //   category: "Music",
  //   location: "Kigali",
  //   profileImage: "https://www.newtimes.co.rw/uploads/imported_images/files/main/articles/2022/06/08/the%20ben%20picture.jpg",
  //   bio: "Benjamin Mugisha, known as The Ben, is a Rwandan singer, songwriter and entrepreneur. He's one of Rwanda's most popular artists, known for hits like 'Fine Girl', 'Habibi', and collaborations with artists across East Africa. The Ben blends R&B with traditional Rwandan musical elements.",
  //   isVerified: true,
  //   rating: 4.8,
  //   reviewCount: 142,
  //   services: [
  //     {
  //       id: "s3",
  //       name: "Concert Performance",
  //       description: "Full concert with live band and dancers",
  //       price: 6000,
  //     },
  //     {
  //       id: "s4",
  //       name: "Wedding Performance",
  //       description: "Special wedding performance package including custom song",
  //       price: 4500,
  //     }
  //   ],
  //   reviews: [
  //     {
  //       id: "r3",
  //       userName: "Jean-Paul N.",
  //       rating: 5,
  //       comment: "The Ben performed at my sister's wedding and created memories we'll cherish forever. Absolute professional!",
  //       date: "2023-10-05"
  //     },
  //     {
  //       id: "r4",
  //       userName: "Ange I.",
  //       rating: 4,
  //       comment: "Amazing performance that had everyone on their feet. Would book again in a heartbeat!",
  //       date: "2023-09-18"
  //     }
  //   ]
  // },
  // {
  //   id: "t3",
  //   name: "Bruce Melodie",
  //   category: "Music",
  //   location: "Kigali",
  //   profileImage: "https://cdn.ktpress.rw/wp-content/uploads/2023/12/Bruce-Melodie-727x485.jpeg",
  //   bio: "Itahiwacu Bruce, known professionally as Bruce Melodie, is a Rwandan Afrobeat and R&B artist. He rose to prominence with hits like 'Katerina', 'Saa Moya', and 'Ikinya'. His unique vocal style and catchy melodies have made him one of Rwanda's most streamed artists internationally.",
  //   isVerified: true,
  //   rating: 4.9,
  //   reviewCount: 128,
  //   services: [
  //     {
  //       id: "s5",
  //       name: "Live Performance",
  //       description: "Full performance with band and backup singers",
  //       price: 4500,
  //     },
  //     {
  //       id: "s6",
  //       name: "Corporate Event",
  //       description: "Performance for corporate events and product launches",
  //       price: 3800,
  //     }
  //   ],
  //   reviews: [
  //     {
  //       id: "r5",
  //       userName: "Robert K.",
  //       rating: 5,
  //       comment: "Bruce Melodie's energy is contagious! Had our entire company event dancing and singing along. Worth every penny!",
  //       date: "2023-11-12"
  //     },
  //     {
  //       id: "r6",
  //       userName: "Diane M.",
  //       rating: 5,
  //       comment: "Incredible performer who goes above and beyond. The crowd was mesmerized!",
  //       date: "2023-10-22"
  //     }
  //   ]
  // },
  // {
  //   id: "t4",
  //   name: "Butera Knowless",
  //   category: "Music",
  //   location: "Kigali",
  //   profileImage: "https://i0.wp.com/www.rwandamazima.com/wp-content/uploads/2024/01/Knowless-butera.webp",
  //   bio: "Jeanne d'Arc Butera, known professionally as Butera Knowless, is a Rwandan singer, songwriter and entrepreneur. As one of Rwanda's most successful female artists, she's known for hits like 'Umuruho', 'Sibyo', and 'Inzora'. Her music blends Afrobeat and traditional Rwandan rhythms with contemporary R&B.",
  //   isVerified: true,
  //   rating: 4.8,
  //   reviewCount: 117,
  //   services: [
  //     {
  //       id: "s7",
  //       name: "Concert Performance",
  //       description: "Full concert with band and dancers (2 hours)",
  //       price: 4000,
  //     },
  //     {
  //       id: "s8",
  //       name: "Private Performance",
  //       description: "Intimate performance for private gatherings",
  //       price: 2800,
  //     }
  //   ],
  //   reviews: [
  //     {
  //       id: "r7",
  //       userName: "Patricia M.",
  //       rating: 5,
  //       comment: "Knowless performed at our wedding and created the perfect atmosphere. Her voice is even more beautiful live!",
  //       date: "2023-10-28"
  //     },
  //     {
  //       id: "r8",
  //       userName: "Eric N.",
  //       rating: 4,
  //       comment: "Great performance and very professional. Everyone at our event was impressed!",
  //       date: "2023-09-15"
  //     }
  //   ]
  // },
  // {
  //   id: "t5",
  //   name: "Element Eléeh",
  //   category: "Music",
  //   location: "Kigali",
  //   profileImage: "https://cdn.ktpress.rw/wp-content/uploads/2023/01/Element-Elee-768x497.jpg",
  //   bio: "Éloi Mugabo, better known as Element Eléeh, is a Rwandan rapper, singer and record producer. Known for his dynamic flow and thoughtful lyrics, he has become one of Rwanda's leading hip-hop artists with tracks like 'Tears', 'Cloud 9', and 'Money'.",
  //   isVerified: true,
  //   rating: 4.7,
  //   reviewCount: 94,
  //   services: [
  //     {
  //       id: "s9",
  //       name: "Live Performance",
  //       description: "Full rap performance with DJ",
  //       price: 3500,
  //     },
  //     {
  //       id: "s10",
  //       name: "Music Workshop",
  //       description: "Hip-hop and music production workshop (3-4 hours)",
  //       price: 1200,
  //     }
  //   ],
  //   reviews: [
  //     {
  //       id: "r9",
  //       userName: "Jean B.",
  //       rating: 5,
  //       comment: "Element brought incredible energy to our university event. Students were amazed by his performance and insights during the Q&A.",
  //       date: "2023-09-05"
  //     },
  //     {
  //       id: "r10",
  //       userName: "Marie K.",
  //       rating: 4,
  //       comment: "Great performer who connects well with the audience. His workshop was educational and inspiring!",
  //       date: "2023-08-22"
  //     }
  //   ]
  // },
  // {
  //   id: "t6",
  //   name: "DJ Infinity",
  //   category: "DJ",
  //   location: "Kigali",
  //   profileImage: "https://wallpaper.xiazii.com/path/20190428/00kggv0xldu.jpg",
  //   bio: "DJ Infinity is one of Rwanda's premier DJs, known for energetic sets that blend afrobeats, hip-hop, R&B, and traditional Rwandan music. He has performed at major festivals and clubs across East Africa and Europe, bringing Rwandan sounds to international audiences.",
  //   isVerified: true,
  //   rating: 4.8,
  //   reviewCount: 121,
  //   services: [
  //     {
  //       id: "s11",
  //       name: "Wedding DJ",
  //       description: "Full DJ services for wedding ceremony and reception",
  //       price: 800,
  //     },
  //     {
  //       id: "s12",
  //       name: "Club/Party DJ",
  //       description: "DJ services for nightclubs and private parties",
  //       price: 650,
  //     }
  //   ],
  //   reviews: [
  //     {
  //       id: "r11",
  //       userName: "Sandra K.",
  //       rating: 5,
  //       comment: "DJ Infinity kept the dance floor packed all night at our wedding! Great selection and read the crowd perfectly.",
  //       date: "2023-11-25"
  //     },
  //     {
  //       id: "r12",
  //       userName: "Patrick M.",
  //       rating: 5,
  //       comment: "Booked DJ Infinity for a corporate event and he was fantastic. Professional, punctual and kept the energy high.",
  //       date: "2023-10-18"
  //     }
  //   ]
  // },
  // {
  //   id: "t7",
  //   name: "Christian Gakombe",
  //   category: "Photography",
  //   location: "Kigali",
  //   profileImage: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS-rS5VJ6FyUTI8qYwRo4TS-NBZnCyEAHZaJkF4HrAgQbU3Lahv",
  //   bio: "Christian Gakombe is one of Rwanda's most sought-after photographers, specializing in portrait, fashion, and documentary photography. His work has been featured in international publications, and he's known for capturing Rwanda's beauty, culture, and people with a unique artistic vision.",
  //   isVerified: true,
  //   rating: 4.9,
  //   reviewCount: 108,
  //   services: [
  //     {
  //       id: "s13",
  //       name: "Wedding Photography",
  //       description: "Full day wedding coverage with edited photos",
  //       price: 1200,
  //     },
  //     {
  //       id: "s14",
  //       name: "Portrait Session",
  //       description: "Professional portrait photography session (2 hours)",
  //       price: 300,
  //     }
  //   ],
  //   reviews: [
  //     {
  //       id: "r13",
  //       userName: "Diane N.",
  //       rating: 5,
  //       comment: "Christian captured our wedding day perfectly. His eye for detail and ability to capture emotion is unmatched.",
  //       date: "2023-12-05"
  //     },
  //     {
  //       id: "r14",
  //       userName: "Jean-Paul K.",
  //       rating: 5,
  //       comment: "Amazing photographer! The portraits he took for our family are beautiful and will be treasured forever.",
  //       date: "2023-11-12"
  //     }
  //   ]
  // },
  // {
  //   id: "t8",
  //   name: "Arthur Nkusi",
  //   category: "Events",
  //   location: "Kigali",
  //   profileImage: "https://cdn.ktpress.rw/wp-content/uploads/2023/07/Arthur-Nkusi-1-768x576.jpg",
  //   bio: "Arthur Nkusi is a renowned Rwandan radio presenter, MC, comedian, and actor. As one of Rwanda's most recognized entertainers, he brings charisma and energy to every event. He has hosted major shows, corporate events, and weddings across East Africa.",
  //   isVerified: true,
  //   rating: 4.9,
  //   reviewCount: 142,
  //   services: [
  //     {
  //       id: "s15",
  //       name: "Event MC",
  //       description: "Professional MC services for weddings, corporate events",
  //       price: 1500,
  //     },
  //     {
  //       id: "s16",
  //       name: "Comedy Show",
  //       description: "Stand-up comedy performance (45-60 minutes)",
  //       price: 2000,
  //     }
  //   ],
  //   reviews: [
  //     {
  //       id: "r15",
  //       userName: "Marie C.",
  //       rating: 5,
  //       comment: "Arthur MCed our wedding and was absolutely fantastic! He kept everything flowing smoothly and had everyone laughing.",
  //       date: "2023-10-15"
  //     },
  //     {
  //       id: "r16",
  //       userName: "Robert N.",
  //       rating: 5,
  //       comment: "Incredible MC for our corporate event. Professional, funny, and kept everything on schedule.",
  //       date: "2023-09-28"
  //     }
  //   ]
  // }
];
