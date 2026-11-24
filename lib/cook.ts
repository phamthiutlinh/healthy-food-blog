/**
 * Nội dung "Chế độ nấu" (Cook Mode) — dữ liệu thuần, dùng được ở cả server và client.
 * Chỉ một vài công thức tiêu biểu có lesson; trang chi tiết chỉ hiện nút khi có.
 */

export type SceneId =
  | 'board'
  | 'knife'
  | 'bowl'
  | 'sauce'
  | 'pan'
  | 'flame'
  | 'steam'
  | 'plate'
  | 'lime';

export type Heat = 'low' | 'medium' | 'high';

export type CookStep = {
  title: string;
  instruction: string;
  /** Tab "Giải thích" — vì sao bước này lại quan trọng. */
  why: string;
  /** Tab "Dấu hiệu đạt" — làm sao biết mình đã làm đúng. */
  cue: string;
  timerSeconds?: number;
  temperature?: { label: string; heat: Heat };
  focus: SceneId[];
  chips?: { label: string; x: number; y: number; tone?: 'note' | 'fire' }[];
};

export type CookLesson = {
  slug: string;
  /** Màu nguyên liệu chính trên khay bếp. */
  protein: 'chicken' | 'salmon' | 'veg';
  equipment: string;
  totalMinutes: number;
  steps: CookStep[];
};

const lessons: CookLesson[] = [
  {
    slug: 'com-ga-teriyaki-brown-rice',
    protein: 'chicken',
    equipment: 'Chảo chống dính · Thớt · Bát trộn',
    totalMinutes: 30,
    steps: [
      {
        title: 'Thấm khô & cắt gà',
        instruction:
          'Dùng khăn giấy thấm thật khô hai mặt miếng ức gà, rồi cắt thành miếng dày 2–3 cm, đều tay.',
        why: 'Mặt thịt còn ướt sẽ làm chảo mất nhiệt: gà chuyển sang luộc trong hơi nước thay vì áp chảo vàng cạnh.',
        cue: 'Bề mặt mờ, không còn vệt ướt bóng và các miếng đều cỡ ngón tay cái.',
        focus: ['board', 'knife'],
        chips: [
          { label: 'THỚT · ức gà 200g', x: 190, y: 380 },
          { label: 'THẤM KHÔ · khăn giấy', x: 200, y: 196 },
        ],
      },
      {
        title: 'Pha sốt teriyaki',
        instruction:
          'Trộn 3 thìa sốt teriyaki + 1 thìa nước ấm + ½ thìa mật ong trong bát, khuấy một chiều cho tan đều.',
        why: 'Pha loãng một chút giúp sốt ngấm vào thịt thay vì cháy đường ở đáy chảo.',
        cue: 'Sốt sánh, phủ lưng thìa một lớp mỏng, không còn hạt đường lợn cợn.',
        timerSeconds: 60,
        focus: ['bowl', 'sauce'],
        chips: [{ label: 'BÁT · sốt teriyaki', x: 640, y: 250 }],
      },
      {
        title: 'Ướp gà 10 phút',
        instruction: 'Cho gà vào bát sốt, trộn nhẹ để từng miếng áo đều. Để yên 10 phút ở nhiệt độ phòng.',
        why: 'Thời gian ngắn vẫn đủ để muối và đường bám vào bề mặt, giúp gà lên màu đẹp khi áp chảo.',
        cue: 'Sốt bám đều, đáy bát chỉ còn lớp ẩm — không có sốt đọng thành vũng.',
        timerSeconds: 600,
        focus: ['bowl', 'board'],
        chips: [{ label: 'TRỘN NHẸ · đừng chà mạnh', x: 620, y: 250 }],
      },
      {
        title: 'Áp chảo lửa vừa',
        instruction:
          'Bật chảo nóng khoảng 1 phút, thêm 1 thìa dầu, xếp gà mặt phẳng xuống. Giữ yên 3 phút rồi mới trở.',
        why: 'Trở sớm làm miếng gà dính và mất lớp vàng đang hình thành ở mặt tiếp xúc.',
        cue: 'Mép gà vàng nâu, nghe tiếng xèo đều — không bắn dầu mạnh.',
        timerSeconds: 300,
        temperature: { label: 'Chảo 190–200°C · lửa vừa', heat: 'medium' },
        focus: ['pan', 'flame'],
        chips: [{ label: 'CHẢO 26cm · lửa vừa', x: 430, y: 470, tone: 'fire' }],
      },
      {
        title: 'Hấp bông cải 4 phút',
        instruction:
          'Cho bông cải vào xửng (hoặc chảo cùng 2 thìa nước), đậy nắp và hấp 4 phút.',
        why: 'Hơi nước dẫn nhiệt đều hơn luộc, giữ được độ ngọt và màu xanh của rau.',
        cue: 'Cuống cắm đũa vào được, màu xanh đậm hơn và rau không bị nhũn.',
        timerSeconds: 240,
        temperature: { label: 'Hơi nước 100°C · lửa vừa', heat: 'medium' },
        focus: ['pan', 'steam'],
        chips: [{ label: 'ĐẬY NẮP · hơi nước', x: 430, y: 205 }],
      },
      {
        title: 'Xếp hộp & rưới sốt',
        instruction: 'Chia cơm lứt, gà và bông cải vào hộp; rưới phần sốt còn lại trong chảo lên gà.',
        why: 'Rưới sốt sau cùng giữ rau không bị ngập nước và cơm không bị nhão khi hâm lại.',
        cue: 'Sốt bóng nhẹ trên mặt gà, đáy hộp không có nước sốt chảy ra.',
        focus: ['plate', 'bowl'],
        chips: [{ label: 'HỘP · cơm + gà + rau', x: 640, y: 455 }],
      },
    ],
  },
  {
    slug: 'ca-hoi-ap-chao-chanh',
    protein: 'salmon',
    equipment: 'Chảo gang hoặc chống dính · Thớt · Kẹp gắp',
    totalMinutes: 25,
    steps: [
      {
        title: 'Thấm khô da cá',
        instruction:
          'Đặt cá hồi lên khăn giấy, thấm cả hai mặt — đặc biệt là mặt da — cho đến khi khăn không còn ẩm.',
        why: 'Da ướt sẽ hấp hơi và dai; da khô là điều kiện bắt buộc để có lớp giòn.',
        cue: 'Da khô hoàn toàn, miết tay thấy hơi ráp, không còn vảy bong.',
        focus: ['board'],
        chips: [{ label: 'DA CÁ · khô hoàn toàn', x: 190, y: 380 }],
      },
      {
        title: 'Khứa da 3 đường',
        instruction:
          'Rạch 3 đường chéo trên mặt da, sâu 3–4 mm, cách nhau khoảng 2 cm. Tay kia giữ miếng cá thật nhẹ.',
        why: 'Da co lại khi gặp nhiệt; khứa giúp miếng cá nằm phẳng thay vì cong vênh khỏi chảo.',
        cue: 'Đường khứa đứt lớp da nhưng không chạm vào phần thịt.',
        focus: ['board', 'knife'],
        chips: [{ label: 'DAO · khứa 3 đường', x: 200, y: 196 }],
      },
      {
        title: 'Nêm muối tiêu 5 phút',
        instruction: 'Rắc muối và tiêu lên cả hai mặt, để yên 5 phút cho cá ra bớt nước mặt.',
        why: 'Muối hút ẩm ra ngoài; nếu bỏ qua, nước đó sẽ làm chảo nguội ngay khi thả cá vào.',
        cue: 'Bề mặt cá hơi se lại, không còn nước đọng quanh miếng cá.',
        timerSeconds: 300,
        focus: ['board', 'bowl'],
        chips: [{ label: 'MUỐI + TIÊU · 2 mặt', x: 200, y: 380 }],
      },
      {
        title: 'Làm nóng chảo đúng nhiệt',
        instruction:
          'Bật lửa lớn 1 phút, thêm 1 thìa dầu ô liu rồi hạ xuống lửa vừa trước khi thả cá.',
        why: 'Chảo chưa đủ nóng là nguyên nhân số một khiến da cá dính và rách.',
        cue: 'Nhỏ vài giọt nước vào chảo: giọt lăn tròn quanh mặt chảo rồi bay hơi.',
        timerSeconds: 120,
        temperature: { label: 'Chảo 200–210°C · lửa lớn rồi hạ vừa', heat: 'high' },
        focus: ['pan', 'flame'],
        chips: [{ label: 'CHẢO NÓNG · thử giọt nước', x: 430, y: 470, tone: 'fire' }],
      },
      {
        title: 'Áp da 5 phút, không lật',
        instruction:
          'Đặt cá mặt da xuống, ấn nhẹ 20 giây bằng kẹp, sau đó để yên 5 phút. Chỉ lật khi da đã vàng giòn.',
        why: 'Ấn nhẹ 20 giây đầu giúp da tiếp xúc phẳng với chảo — đây là mẹo để da giòn đều.',
        cue: 'Da vàng nâu giòn, viền cá chuyển từ hồng sang trắng đục ở cạnh.',
        timerSeconds: 300,
        temperature: { label: 'Mặt chảo 180°C · lửa vừa', heat: 'medium' },
        focus: ['pan', 'flame'],
        chips: [{ label: 'ẤN NHẸ 20 GIÂY · rồi để yên', x: 430, y: 470, tone: 'fire' }],
      },
      {
        title: 'Chanh & măng tây, nghỉ 2 phút',
        instruction:
          'Cho măng tây vào chảo 2 phút, tắt bếp, vắt chanh lên cá và để nghỉ 2 phút trước khi dùng.',
        why: 'Nghỉ sau khi nấu giúp nước thịt tái phân bố, cá mềm và không bị khô khi cắt.',
        cue: 'Thịt cá tách thành thớ mềm, đĩa không có nước chảy ra.',
        timerSeconds: 120,
        focus: ['plate', 'lime'],
        chips: [{ label: 'CHANH · vắt sau khi tắt bếp', x: 690, y: 470 }],
      },
    ],
  },
  {
    slug: 'salad-uc-ga-bo',
    protein: 'veg',
    equipment: 'Chảo · Thớt · Bát trộn lớn',
    totalMinutes: 30,
    steps: [
      {
        title: 'Rửa & quay khô rau',
        instruction:
          'Rửa xà lách dưới vòi nước, sau đó quay thật khô bằng rổ quay hoặc thấm bằng khăn sạch.',
        why: 'Nước còn trên lá sẽ làm loãng sốt và khiến salad bị èo uột sau vài phút.',
        cue: 'Rau ráo, lắc bát không thấy nước đọng ở đáy.',
        focus: ['bowl'],
        chips: [{ label: 'XÀ LÁCH · ráo hoàn toàn', x: 640, y: 250 }],
      },
      {
        title: 'Áp chảo ức gà 10–12 phút',
        instruction:
          'Nêm muối tiêu, áp chảo lửa vừa 5–6 phút mỗi mặt đến khi chín đều và vàng cạnh.',
        why: 'Nhiệt vừa giúp thịt chín tới mà không bị khô cứng ở lớp ngoài.',
        cue: 'Nhiệt kế lõi đạt 74°C; ấn ngón tay thấy thịt đàn hồi nhẹ, không chảy nước hồng.',
        timerSeconds: 660,
        temperature: { label: 'Chảo 190°C · lửa vừa', heat: 'medium' },
        focus: ['pan', 'flame'],
        chips: [{ label: 'CHẢO · 5–6 phút mỗi mặt', x: 430, y: 470, tone: 'fire' }],
      },
      {
        title: 'Nghỉ 5 phút rồi cắt lát',
        instruction: 'Đặt gà ra thớt, nghỉ 5 phút rồi thái lát mỏng khoảng 1 cm ngang thớ.',
        why: 'Cắt ngay khi vừa chín sẽ làm nước thịt chảy hết ra thớt và miếng gà bị khô.',
        cue: 'Khi cắt, nước thịt không chảy thành vũng; lát gà đều và còn độ ẩm bóng.',
        timerSeconds: 300,
        focus: ['board', 'knife'],
        chips: [{ label: 'THỚT · thái ngang thớ', x: 190, y: 380 }],
      },
      {
        title: 'Cắt bơ & cà chua bi',
        instruction: 'Bơ chín cắt miếng 2 cm; cà chua bi bổ đôi. Dùng dao sạch, ấn nhẹ thay vì cưa.',
        why: 'Ấn nhẹ giữ được cạnh miếng bơ — bơ nát sẽ làm sốt salad bị đục và nhớt.',
        cue: 'Miếng bơ còn cạnh sắc, không bị nát hay dính vào lưỡi dao.',
        focus: ['board', 'knife'],
        chips: [{ label: 'BƠ + CÀ CHUA BI', x: 190, y: 300 }],
      },
      {
        title: 'Trộn rau, cà chua và gà',
        instruction:
          'Cho rau vào bát lớn trước, thêm cà chua và gà, trộn nhẹ từ dưới lên bằng hai tay hoặc kẹp.',
        why: 'Trộn từ dưới lên giúp rau không bị dập và nguyên liệu phân bố đều khắp bát.',
        cue: 'Nguyên liệu rải đều, bát không có nước đọng sau khi trộn.',
        focus: ['bowl', 'plate'],
        chips: [{ label: 'BÁT LỚN · trộn từ dưới lên', x: 640, y: 250 }],
      },
      {
        title: 'Rưới dầu ô liu & chanh',
        instruction: 'Vắt nửa quả chanh và rưới 1 thìa dầu ô liu quanh bát, trộn một lần thật nhẹ.',
        why: 'Dầu và chanh cho vào cuối giữ rau giòn và hương thơm tươi, không bị nặng mùi.',
        cue: 'Rau bóng nhẹ vừa đủ, không ướt sũng và không có dầu đọng đáy bát.',
        focus: ['bowl', 'lime'],
        chips: [{ label: 'DẦU Ô LIU + CHANH · cuối cùng', x: 700, y: 470 }],
      },
    ],
  },
];

export function getCookLesson(slug?: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function getCookLessons() {
  return lessons;
}
