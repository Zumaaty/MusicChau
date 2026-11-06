export interface Song {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  streamUrl: string;
  duration: number;
  mood: 'chill' | 'energy' | 'focus' | 'sad' | 'workout' | 'romance' | 'night' | 'coffee';
  genre: string;
  lyrics?: { time: number; text: string }[];
}

export const VIETNAMESE_SONGS: Song[] = [
  {
    id: 'vn-1',
    title: 'Nước Mắt Cá Sấu (Lofi Chill)',
    artist: 'Hà Anh Tuấn x Chillies Style',
    albumCover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    duration: 160,
    mood: 'chill',
    genre: 'V-Pop / Lofi',
    lyrics: [
      { time: 0, text: "🎵 Nốt nhạc bắt đầu..." },
      { time: 10, text: "Gió nhẹ lay cành lá ngả nghiêng chiều thu" },
      { time: 20, text: "Tách cà phê đắng gạt đi từng âu lo" },
      { time: 35, text: "Thành phố lên đèn cùng muôn ngàn ánh sao" },
      { time: 50, text: "Gửi nỗi nhớ này theo làn gió bay xa..." },
      { time: 70, text: "Đêm nay yên bình một góc phố quen" },
      { time: 90, text: "Giai điệu dịu êm vỗ về giấc mơ" }
    ]
  },
  {
    id: 'vn-2',
    title: 'Cà Phê Sáng Phố Cổ',
    artist: 'Vũ. (Indie Việt)',
    albumCover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
    duration: 210,
    mood: 'coffee',
    genre: 'Indie Việt',
    lyrics: [
      { time: 0, text: "☕ Tiếng thìa khuấy cà phê rộn ràng..." },
      { time: 15, text: "Hà Nội sương mờ đón nắng ban mai" },
      { time: 30, text: "Góc phố quen thuộc mình ta ngồi lặng lẽ" },
      { time: 55, text: "Những hoài niệm xưa ùa về trong ký ức" },
      { time: 80, text: "Tách cà phê phin giọt đắng ngọt ngào" }
    ]
  },
  {
    id: 'vn-3',
    title: 'Chạy Ngay Đi (Night Club Remix)',
    artist: 'Sơn Tùng M-TP Style',
    albumCover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792ce.mp3',
    duration: 185,
    mood: 'energy',
    genre: 'Rap / EDM Việt',
    lyrics: [
      { time: 0, text: "🔥 Năng lượng cực cháy!" },
      { time: 12, text: "Chạy ngay đi trước khi mọi chuyện dần xấu hơn" },
      { time: 28, text: "Không gian xung quanh như bùng cháy" },
      { time: 45, text: "Âm nhạc vang lên quẩy hết mình đêm nay" }
    ]
  },
  {
    id: 'vn-4',
    title: 'Chiều Thu Hà Nội (Acoustic Guitar)',
    artist: 'Đen Vâu x Đạt G Style',
    albumCover: 'https://images.unsplash.com/photo-1499209974431-9dac3ea0027f?w=600&q=80',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
    duration: 195,
    mood: 'sad',
    genre: 'Acoustic Việt',
    lyrics: [
      { time: 0, text: "🎸 Tiếng guitar mộc mạc..." },
      { time: 14, text: "Lá vàng rơi ngập lối thu về" },
      { time: 32, text: "Nét trầm tư hiện trên từng khuôn mặt" },
      { time: 60, text: "Nắng hoàng hôn khuất sau dải mây chiều" }
    ]
  },
  {
    id: 'vn-5',
    title: 'Đêm Đô Thị Slownotion',
    artist: 'GREY D x Hoàng Thùy Linh',
    albumCover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c3501a31d7.mp3',
    duration: 220,
    mood: 'night',
    genre: 'R&B Việt',
    lyrics: [
      { time: 0, text: "🌙 Đêm đô thị rực rỡ ánh đèn..." },
      { time: 18, text: "Bước chân lang thang qua từng con đường" },
      { time: 40, text: "Tai nghe giai điệu ngọt ngào xoa dịu tâm hồn" }
    ]
  },
  {
    id: 'vn-6',
    title: 'Tập Luyện Bứt Phá (Workout Bass Boosted)',
    artist: 'V-Fitness Beats',
    albumCover: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6af3c15.mp3',
    duration: 175,
    mood: 'workout',
    genre: 'EDM / Dance',
    lyrics: [
      { time: 0, text: "💪 Sẵn sàng cho buổi tập!" },
      { time: 10, text: "Đẩy hết sức mình, phá vỡ mọi giới hạn!" }
    ]
  }
];
