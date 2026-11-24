/**
 * Nội dung "Chế độ nấu" (Cook Mode) — dữ liệu thuần, dùng được ở cả server và client.
 * Chỉ một vài công thức tiêu biểu có lesson; trang chi tiết chỉ hiện nút khi có.
 */

export type Heat = 'low' | 'medium' | 'high';

/** Nguyên liệu / dụng cụ có icon hoạt hình riêng ở app/components/cook-icons.tsx */
export type IngredientId =
  | 'chicken'
  | 'salmon'
  | 'board'
  | 'knife'
  | 'towel'
  | 'sauce'
  | 'spoon'
  | 'honey'
  | 'bowl'
  | 'salad-bowl'
  | 'timer'
  | 'pan'
  | 'flame'
  | 'oil'
  | 'broccoli'
  | 'steam'
  | 'rice-bowl'
  | 'salt'
  | 'lemon'
  | 'tongs'
  | 'asparagus'
  | 'lettuce'
  | 'avocado'
  | 'tomato';

export type CookStepItem = {
  icon: IngredientId;
  label: string;
};

/**
 * Công đoạn của một bước nấu — mỗi loại ứng với một GIF minh họa trong
 * public/assets/images/cook/clips/{motion}.gif (cắt từ video Pexels).
 */
export type CookMotion =
  | 'chop'
  | 'slice'
  | 'cut'
  | 'pat'
  | 'score'
  | 'season'
  | 'wash'
  | 'stir'
  | 'marinate'
  | 'hot-pan'
  | 'sear'
  | 'steam'
  | 'rest'
  | 'toss'
  | 'drizzle'
  | 'plate';

export type CookStep = {
  title: string;
  instruction: string;
  /** Tab "Giải thích" — vì sao bước này lại quan trọng. */
  why: string;
  /** Tab "Dấu hiệu đạt" — làm sao biết mình đã làm đúng. */
  cue: string;
  timerSeconds?: number;
  temperature?: { label: string; heat: Heat };
  /** Ảnh thật của bước, nằm trong public/assets/images/cook. */
  photo: string;
  photoAlt: string;
  /** Minh họa động của công đoạn, phát lặp trên nền ảnh thật. */
  motion: CookMotion;
  /** Nguyên liệu & dụng cụ của bước, mỗi thứ một icon hoạt hình. */
  items: CookStepItem[];
};

export type CookLesson = {
  slug: string;
  /** Màu nguyên liệu chính — dùng cho các điểm nhấn nhỏ. */
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
        photo: '/assets/images/cook/teriyaki-1-chicken-board.jpg',
        photoAlt: 'Ức gà sống đặt trên thớt gỗ, cạnh khăn giấy và dao',
        motion: 'chop',
        items: [
          { icon: 'chicken', label: 'Ức gà 200g' },
          { icon: 'towel', label: 'Khăn giấy' },
          { icon: 'board', label: 'Thớt' },
          { icon: 'knife', label: 'Dao' },
        ],
      },
      {
        title: 'Pha sốt teriyaki',
        instruction:
          'Trộn 3 thìa sốt teriyaki + 1 thìa nước ấm + ½ thìa mật ong trong bát, khuấy một chiều cho tan đều.',
        why: 'Pha loãng một chút giúp sốt ngấm vào thịt thay vì cháy đường ở đáy chảo.',
        cue: 'Sốt sánh, phủ lưng thìa một lớp mỏng, không còn hạt đường lợn cợn.',
        timerSeconds: 60,
        photo: '/assets/images/cook/teriyaki-2-sauce.jpg',
        photoAlt: 'Bát sốt teriyaki màu nâu sẫm đặt trên chiếu tre',
        motion: 'stir',
        items: [
          { icon: 'sauce', label: 'Sốt teriyaki 3 thìa' },
          { icon: 'spoon', label: 'Nước ấm 1 thìa' },
          { icon: 'honey', label: 'Mật ong ½ thìa' },
          { icon: 'bowl', label: 'Bát trộn' },
        ],
      },
      {
        title: 'Ướp gà 10 phút',
        instruction:
          'Cho gà vào bát sốt, trộn nhẹ để từng miếng áo đều. Để yên 10 phút ở nhiệt độ phòng.',
        why: 'Thời gian ngắn vẫn đủ để muối và đường bám vào bề mặt, giúp gà lên màu đẹp khi áp chảo.',
        cue: 'Sốt bám đều, đáy bát chỉ còn lớp ẩm — không có sốt đọng thành vũng.',
        timerSeconds: 600,
        photo: '/assets/images/cook/teriyaki-3-marinate.jpg',
        photoAlt: 'Thịt gà đã ướp cùng hương thảo trên thớt',
        motion: 'marinate',
        items: [
          { icon: 'chicken', label: 'Gà áo sốt' },
          { icon: 'bowl', label: 'Bát trộn' },
          { icon: 'timer', label: '10 phút' },
        ],
      },
      {
        title: 'Áp chảo lửa vừa',
        instruction:
          'Bật chảo nóng khoảng 1 phút, thêm 1 thìa dầu, xếp gà mặt phẳng xuống. Giữ yên 3 phút rồi mới trở.',
        why: 'Trở sớm làm miếng gà dính và mất lớp vàng đang hình thành ở mặt tiếp xúc.',
        cue: 'Mép gà vàng nâu, nghe tiếng xèo đều — không bắn dầu mạnh.',
        timerSeconds: 300,
        temperature: { label: 'Chảo 190–200°C · lửa vừa', heat: 'medium' },
        photo: '/assets/images/cook/teriyaki-4-sear.jpg',
        photoAlt: 'Miếng gà áp chảo vàng nâu trong chảo',
        motion: 'sear',
        items: [
          { icon: 'pan', label: 'Chảo 26cm' },
          { icon: 'oil', label: 'Dầu 1 thìa' },
          { icon: 'flame', label: 'Lửa vừa' },
        ],
      },
      {
        title: 'Hấp bông cải 4 phút',
        instruction: 'Cho bông cải vào xửng (hoặc chảo cùng 2 thìa nước), đậy nắp và hấp 4 phút.',
        why: 'Hơi nước dẫn nhiệt đều hơn luộc, giữ được độ ngọt và màu xanh của rau.',
        cue: 'Cuống cắm đũa vào được, màu xanh đậm hơn và rau không bị nhũn.',
        timerSeconds: 240,
        temperature: { label: 'Hơi nước 100°C · lửa vừa', heat: 'medium' },
        photo: '/assets/images/cook/teriyaki-5-broccoli.jpg',
        photoAlt: 'Bông cải xanh vừa hấp trong chảo đen',
        motion: 'steam',
        items: [
          { icon: 'broccoli', label: 'Bông cải 150g' },
          { icon: 'steam', label: 'Hơi nước' },
          { icon: 'timer', label: '4 phút' },
        ],
      },
      {
        title: 'Xếp hộp & rưới sốt',
        instruction:
          'Chia cơm lứt, gà và bông cải vào hộp; rưới phần sốt còn lại trong chảo lên gà.',
        why: 'Rưới sốt sau cùng giữ rau không bị ngập nước và cơm không bị nhão khi hâm lại.',
        cue: 'Sốt bóng nhẹ trên mặt gà, đáy hộp không có nước sốt chảy ra.',
        photo: '/assets/images/cook/teriyaki-6-bowl.jpg',
        photoAlt: 'Bát cơm gà teriyaki rưới sốt bóng, rắc vừng',
        motion: 'plate',
        items: [
          { icon: 'rice-bowl', label: 'Cơm lứt' },
          { icon: 'chicken', label: 'Gà teriyaki' },
          { icon: 'broccoli', label: 'Bông cải' },
          { icon: 'sauce', label: 'Sốt rưới' },
        ],
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
        photo: '/assets/images/cook/salmon-1-dry-skin.jpg',
        photoAlt: 'Miếng cá hồi tươi còn da nằm trên thớt',
        motion: 'pat',
        items: [
          { icon: 'salmon', label: 'Cá hồi 2 miếng' },
          { icon: 'towel', label: 'Khăn giấy' },
          { icon: 'board', label: 'Thớt' },
        ],
      },
      {
        title: 'Khứa da 3 đường',
        instruction:
          'Rạch 3 đường chéo trên mặt da, sâu 3–4 mm, cách nhau khoảng 2 cm. Tay kia giữ miếng cá thật nhẹ.',
        why: 'Da co lại khi gặp nhiệt; khứa giúp miếng cá nằm phẳng thay vì cong vênh khỏi chảo.',
        cue: 'Đường khứa đứt lớp da nhưng không chạm vào phần thịt.',
        photo: '/assets/images/cook/salmon-2-score.jpg',
        photoAlt: 'Miếng cá hồi còn nguyên da, mặt da nhìn rõ thớ',
        motion: 'score',
        items: [
          { icon: 'salmon', label: 'Mặt da' },
          { icon: 'knife', label: 'Khứa 3 đường' },
        ],
      },
      {
        title: 'Nêm muối tiêu 5 phút',
        instruction: 'Rắc muối và tiêu lên cả hai mặt, để yên 5 phút cho cá ra bớt nước mặt.',
        why: 'Muối hút ẩm ra ngoài; nếu bỏ qua, nước đó sẽ làm chảo nguội ngay khi thả cá vào.',
        cue: 'Bề mặt cá hơi se lại, không còn nước đọng quanh miếng cá.',
        timerSeconds: 300,
        photo: '/assets/images/cook/salmon-3-season.jpg',
        photoAlt: 'Cá hồi rắc muối hạt, tiêu và chanh',
        motion: 'season',
        items: [
          { icon: 'salt', label: 'Muối + tiêu' },
          { icon: 'lemon', label: 'Chanh' },
          { icon: 'timer', label: '5 phút' },
        ],
      },
      {
        title: 'Làm nóng chảo đúng nhiệt',
        instruction:
          'Bật lửa lớn 1 phút, thêm 1 thìa dầu ô liu rồi hạ xuống lửa vừa trước khi thả cá.',
        why: 'Chảo chưa đủ nóng là nguyên nhân số một khiến da cá dính và rách.',
        cue: 'Nhỏ vài giọt nước vào chảo: giọt lăn tròn quanh mặt chảo rồi bay hơi.',
        timerSeconds: 120,
        temperature: { label: 'Chảo 200–210°C · lửa lớn rồi hạ vừa', heat: 'high' },
        photo: '/assets/images/cook/salmon-4-hot-pan.jpg',
        photoAlt: 'Chảo gang nóng trên bếp với miếng cá hồi',
        motion: 'hot-pan',
        items: [
          { icon: 'pan', label: 'Chảo gang' },
          { icon: 'oil', label: 'Dầu ô liu' },
          { icon: 'flame', label: 'Lửa lớn → vừa' },
        ],
      },
      {
        title: 'Áp da 5 phút, không lật',
        instruction:
          'Đặt cá mặt da xuống, ấn nhẹ 20 giây bằng kẹp, sau đó để yên 5 phút. Chỉ lật khi da đã vàng giòn.',
        why: 'Ấn nhẹ 20 giây đầu giúp da tiếp xúc phẳng với chảo — đây là mẹo để da giòn đều.',
        cue: 'Da vàng nâu giòn, viền cá chuyển từ hồng sang trắng đục ở cạnh.',
        timerSeconds: 300,
        temperature: { label: 'Mặt chảo 180°C · lửa vừa', heat: 'medium' },
        photo: '/assets/images/cook/salmon-5-skin-sear.jpg',
        photoAlt: 'Cá hồi áp mặt da trong chảo, da vàng giòn',
        motion: 'sear',
        items: [
          { icon: 'salmon', label: 'Mặt da xuống' },
          { icon: 'tongs', label: 'Ấn nhẹ 20 giây' },
          { icon: 'flame', label: 'Lửa vừa' },
        ],
      },
      {
        title: 'Chanh & măng tây, nghỉ 2 phút',
        instruction:
          'Cho măng tây vào chảo 2 phút, tắt bếp, vắt chanh lên cá và để nghỉ 2 phút trước khi dùng.',
        why: 'Nghỉ sau khi nấu giúp nước thịt tái phân bố, cá mềm và không bị khô khi cắt.',
        cue: 'Thịt cá tách thành thớ mềm, đĩa không có nước chảy ra.',
        timerSeconds: 120,
        photo: '/assets/images/cook/salmon-6-plated.jpg',
        photoAlt: 'Cá hồi áp chảo ăn cùng măng tây, chanh và khoai',
        motion: 'rest',
        items: [
          { icon: 'salmon', label: 'Cá hồi' },
          { icon: 'asparagus', label: 'Măng tây' },
          { icon: 'lemon', label: 'Chanh' },
        ],
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
        photo: '/assets/images/cook/salad-1-wash-greens.jpg',
        photoAlt: 'Hai tay rửa xà lách tươi dưới vòi nước',
        motion: 'wash',
        items: [
          { icon: 'lettuce', label: 'Xà lách 100g' },
          { icon: 'bowl', label: 'Rổ quay' },
          { icon: 'towel', label: 'Khăn sạch' },
        ],
      },
      {
        title: 'Áp chảo ức gà 10–12 phút',
        instruction:
          'Nêm muối tiêu, áp chảo lửa vừa 5–6 phút mỗi mặt đến khi chín đều và vàng cạnh.',
        why: 'Nhiệt vừa giúp thịt chín tới mà không bị khô cứng ở lớp ngoài.',
        cue: 'Nhiệt kế lõi đạt 74°C; ấn ngón tay thấy thịt đàn hồi nhẹ, không chảy nước hồng.',
        timerSeconds: 660,
        temperature: { label: 'Chảo 190°C · lửa vừa', heat: 'medium' },
        photo: '/assets/images/cook/salad-2-chicken-pan.jpg',
        photoAlt: 'Thịt gà vàng cạnh đang áp chảo trong chảo',
        motion: 'sear',
        items: [
          { icon: 'chicken', label: 'Ức gà' },
          { icon: 'pan', label: 'Chảo' },
          { icon: 'flame', label: 'Lửa vừa' },
          { icon: 'timer', label: '10–12 phút' },
        ],
      },
      {
        title: 'Nghỉ 5 phút rồi cắt lát',
        instruction: 'Đặt gà ra thớt, nghỉ 5 phút rồi thái lát mỏng khoảng 1 cm ngang thớ.',
        why: 'Cắt ngay khi vừa chín sẽ làm nước thịt chảy hết ra thớt và miếng gà bị khô.',
        cue: 'Khi cắt, nước thịt không chảy thành vũng; lát gà đều và còn độ ẩm bóng.',
        timerSeconds: 300,
        photo: '/assets/images/cook/salad-3-sliced.jpg',
        photoAlt: 'Ức gà áp chảo thái lát xếp trên thớt',
        motion: 'slice',
        items: [
          { icon: 'chicken', label: 'Gà chín' },
          { icon: 'knife', label: 'Lát 1cm' },
          { icon: 'timer', label: 'Nghỉ 5 phút' },
        ],
      },
      {
        title: 'Cắt bơ & cà chua bi',
        instruction:
          'Bơ chín cắt miếng 2 cm; cà chua bi bổ đôi. Dùng dao sạch, ấn nhẹ thay vì cưa.',
        why: 'Ấn nhẹ giữ được cạnh miếng bơ — bơ nát sẽ làm sốt salad bị đục và nhớt.',
        cue: 'Miếng bơ còn cạnh sắc, không bị nát hay dính vào lưỡi dao.',
        photo: '/assets/images/cook/salad-4-avocado.jpg',
        photoAlt: 'Quả bơ chín bổ đôi trên thớt gỗ',
        motion: 'cut',
        items: [
          { icon: 'avocado', label: 'Bơ chín' },
          { icon: 'tomato', label: 'Cà chua bi' },
          { icon: 'knife', label: 'Dao sạch' },
        ],
      },
      {
        title: 'Trộn rau, cà chua và gà',
        instruction:
          'Cho rau vào bát lớn trước, thêm cà chua và gà, trộn nhẹ từ dưới lên bằng hai tay hoặc kẹp.',
        why: 'Trộn từ dưới lên giúp rau không bị dập và nguyên liệu phân bố đều khắp bát.',
        cue: 'Nguyên liệu rải đều, bát không có nước đọng sau khi trộn.',
        photo: '/assets/images/cook/salad-5-toss.jpg',
        photoAlt: 'Đĩa salad gà, bơ và cà chua đã trộn đều',
        motion: 'toss',
        items: [
          { icon: 'salad-bowl', label: 'Bát lớn' },
          { icon: 'lettuce', label: 'Rau' },
          { icon: 'tomato', label: 'Cà chua bi' },
          { icon: 'chicken', label: 'Gà' },
        ],
      },
      {
        title: 'Rưới dầu ô liu & chanh',
        instruction: 'Vắt nửa quả chanh và rưới 1 thìa dầu ô liu quanh bát, trộn một lần thật nhẹ.',
        why: 'Dầu và chanh cho vào cuối giữ rau giòn và hương thơm tươi, không bị nặng mùi.',
        cue: 'Rau bóng nhẹ vừa đủ, không ướt sũng và không có dầu đọng đáy bát.',
        photo: '/assets/images/cook/salad-6-dressing.jpg',
        photoAlt: 'Bát salad rưới dầu ô liu và chanh, còn tươi rói',
        motion: 'drizzle',
        items: [
          { icon: 'oil', label: 'Dầu ô liu 1 thìa' },
          { icon: 'lemon', label: 'Nửa quả chanh' },
          { icon: 'salad-bowl', label: 'Trộn nhẹ' },
        ],
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
