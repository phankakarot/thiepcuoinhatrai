export const wedding = {
  couple: { bride: 'Kim Phụng', groom: 'Đình Chiến' },
  displayDate: '16 · 11 · 2026',
  quote: 'Sau tất cả những cuộc gặp gỡ, điều đẹp nhất là được cùng nhau đi đến cuối hành trình ♡',
  invitation: 'Đến chung vui và chứng kiến khoảnh khắc hai con chúng tôi nên duyên vợ chồng.',
  attendanceMessage: 'Chúng mình rất mong sự hiện diện của bạn để cùng chung vui, sẻ chia niềm hạnh phúc và lưu lại những khoảnh khắc đáng nhớ trong ngày cưới.',
  families: {
    groom: { label: 'Nhà trai', father: 'Phan Đình Thắng', mother: 'Lê Thị Tâm', address: "Phường B'lao - Tỉnh Lâm Đồng" },
    bride: { label: 'Nhà gái', father: 'Võ Văn Thanh', mother: 'Hồ Thị Huyền Nga', address: 'Xã Hồng Thái - Tỉnh Lâm Đồng ' },
  },
  event: {
    isoDate: '2026-11-16T11:00:00+07:00', weekday: 'Thứ Hai', day: 16, month: 11, year: 2026,
    lunarDate: '( Ngày 8 Tháng 10 Năm Bính Ngọ )',
    schedule: [{ time: '11:00', label: 'Đón khách' }, { time: '11:30', label: 'Khai tiệc' }],
  },
  location: { name: 'Tư gia nhà trai', address: '210/103 Trần Hưng Đạo, Phường Blao, Tỉnh Lâm Đồng', mapUrl: 'https://maps.app.goo.gl/QsT4iCLwKaaPdecr6' },
  images: {
    hero: '/images/hero.jpg', opening: '/images/opening.jpg', couple: ['/images/couple-01.jpg','/images/couple-02.jpg'], location: '/images/couple-03.jpg', closing: '/images/couple-04.jpg',
    album: [
      '/images/album-01.jpg', '/images/album-02.jpg', '/images/album-03.jpg', '/images/album-04.jpg',
      '/images/album-09.jpg', '/images/album-05.jpg', '/images/album-06.jpg', '/images/album-07.jpg', '/images/album-08.jpg',
    ],
  },
  music: '/music/wedding.mp3',
  gifts: {
    bride: { bank: 'NGÂN HÀNG BIDV', owner: 'LE THI TAM', number: '6420129375', qr: '/images/bride-qr.png' },
    groom: { bank: 'NGÂN HÀNG TP BANK', owner: 'PHAN DINH CHIEN', number: '89507111999', qr: '/images/groom-qr.png' },
  },
  colors: { accent: '#765b4b', cream: '#f4efe7' },
} as const;
