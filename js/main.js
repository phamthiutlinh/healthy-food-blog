import fallbackImage from '../assets/images/recipe-placeholder.svg';
import healthyBreakfastImage from '../assets/images/articles/healthy-breakfast-editorial.png';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const imageSrc = (src) => src === 'assets/images/articles/healthy-breakfast-editorial.png' ? healthyBreakfastImage : src || fallbackImage;
const imageFallback = `onerror="this.onerror=null;this.src='${fallbackImage}'"`;
const parseArticleDate = (value) => {
  const [day, month, year] = (value || '00.00.0000').split('.').map(Number);
  return Date.UTC(year, month - 1, day);
};
const fmt = (r) =>
  `<article class="card"><a href="recipe-detail.html?id=${r.id}" class="block"><div class="overflow-hidden"><img class="h-[235px] w-full object-cover" src="${imageSrc(r.image)}" ${imageFallback} loading="lazy" decoding="async" alt="${r.title}"></div><div class="p-5"><span class="chip">${r.category}</span><h3 class="mt-[10px] mb-[8px] font-['Playfair_Display'] text-[22px] leading-[1.18] line-clamp-2">${r.title}</h3><p class="text-[14px] text-[#565a52] line-clamp-2">${r.description}</p><div class="mt-3 flex flex-wrap items-center gap-x-[12px] gap-y-1 text-[12px] text-[#74776f] border-t border-[#f0ede8] pt-3"><span>⏱ ${r.prepTime + r.cookTime} phút</span><span>🔥 ${r.calories} kcal</span></div></div></a></article>`;
const art = (a) =>
  `<article class="card"><a href="article-detail.html?id=${a.id}" class="block"><div class="overflow-hidden"><img class="h-[235px] w-full object-cover" src="${imageSrc(a.image)}" ${imageFallback} loading="lazy" decoding="async" alt="${a.title}"></div><div class="p-5"><span class="chip">${a.category}</span><h3 class="mt-[10px] mb-[8px] font-['Playfair_Display'] text-[22px] leading-[1.18] line-clamp-2">${a.title}</h3><p class="text-[14px] text-[#565a52] line-clamp-2">${a.excerpt}</p><div class="mt-3 flex flex-wrap items-center gap-x-[12px] gap-y-1 text-[12px] text-[#74776f] border-t border-[#f0ede8] pt-3"><span>📅 ${a.date}</span><span>📖 ${a.readTime}</span></div></div></a></article>`;

function setupInfiniteScroll({ container, sentinel, renderItem, batchSize = 6 }) {
  let currentIndex = 0;
  let items = [];
  let observer = null;

  const loadMore = () => {
    if (currentIndex >= items.length) return;
    const nextBatch = items.slice(currentIndex, currentIndex + batchSize);
    const fragment = document.createDocumentFragment();
    nextBatch.forEach((item) => {
      const temp = document.createElement('div');
      temp.innerHTML = renderItem(item);
      if (temp.firstElementChild) {
        fragment.appendChild(temp.firstElementChild);
      }
    });
    container.appendChild(fragment);
    currentIndex += nextBatch.length;

    if (currentIndex >= items.length) {
      if (sentinel) sentinel.style.display = 'none';
      if (observer) observer.disconnect();
    } else {
      if (sentinel) sentinel.style.display = 'flex';
    }
  };

  const reset = (newItems) => {
    items = newItems;
    currentIndex = 0;
    container.innerHTML = '';

    if (items.length === 0) {
      if (sentinel) sentinel.style.display = 'none';
      return;
    }

    loadMore();

    if (observer) observer.disconnect();
    if (sentinel && currentIndex < items.length) {
      sentinel.style.display = 'flex';
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        { rootMargin: '200px' }
      );
      observer.observe(sentinel);
    }
  };

  return { reset, loadMore };
}

function createSentinel(id, labelText, container) {
  let sentinel = $('#' + id);
  if (!sentinel && container && container.parentNode) {
    sentinel = document.createElement('div');
    sentinel.id = id;
    sentinel.className = 'col-span-full py-8 text-center text-sm text-[#78966c] flex items-center justify-center gap-2 font-medium';
    sentinel.innerHTML = `
      <svg class="w-5 h-5 animate-spin text-[#78966c]" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>${labelText}</span>
    `;
    container.parentNode.insertBefore(sentinel, container.nextSibling);
  }
  return sentinel;
}

async function data(name) {
  return fetch(`${name}.json`, { cache: 'no-store' }).then((r) => r.json());
}
function layout() {
  const menu = $('.js-menu');
  const navLinks = $('.js-nav-links');
  if (!menu || !navLinks) return;
  const isMobile = () => window.matchMedia('(max-width: 767px)').matches;
  const syncNav = () => {
    if (!isMobile()) {
      navLinks.classList.remove('hidden');
      menu.setAttribute('aria-expanded', 'true');
    } else {
      navLinks.classList.add('hidden');
      menu.setAttribute('aria-expanded', 'false');
    }
  };
  syncNav();
  window.addEventListener('resize', syncNav);
  menu.addEventListener('click', () => {
    if (!isMobile()) return;
    const isOpen = navLinks.classList.toggle('hidden') === false;
    menu.setAttribute('aria-expanded', String(isOpen));
  });
  $$('.js-signup').forEach((f) =>
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      f.innerHTML = '<strong class="text-white mx-auto">Cảm ơn bạn! Hẹn gặp bạn trong bản tin sắp tới. 🌿</strong>';
    })
  );
  // Header scroll shadow
  const header = $('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  initPWA();
}

function initPWA() {
  // Offline status toast
  const toast = document.createElement('div');
  toast.id = 'pwa-offline-toast';
  toast.className =
    'fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-[#eceae4] bg-white px-4 py-3 shadow-xl transition-all duration-300 transform translate-y-12 opacity-0 pointer-events-none';
  toast.innerHTML = `
    <span class="relative flex h-3 w-3">
      <span class="status-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
      <span class="status-dot relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
    </span>
    <span class="toast-msg text-[13px] font-medium text-[#2f342d]">Đang ngoại tuyến</span>
  `;
  document.body.appendChild(toast);

  function updateOnlineStatus() {
    const isOnline = navigator.onLine;
    const msg = toast.querySelector('.toast-msg');
    const ping = toast.querySelector('.status-ping');
    const dot = toast.querySelector('.status-dot');

    if (!isOnline) {
      msg.textContent = 'Bạn đang ngoại tuyến — Xem nội dung đã lưu';
      ping.className = 'status-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping';
      dot.className = 'status-dot relative inline-flex h-3 w-3 rounded-full bg-amber-500';
      toast.classList.remove('translate-y-12', 'opacity-0', 'pointer-events-none');
    } else {
      msg.textContent = 'Đã khôi phục kết nối Internet';
      ping.className = 'status-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75';
      dot.className = 'status-dot relative inline-flex h-3 w-3 rounded-full bg-emerald-500';
      toast.classList.remove('translate-y-12', 'opacity-0', 'pointer-events-none');
      setTimeout(() => {
        if (navigator.onLine) {
          toast.classList.add('translate-y-12', 'opacity-0', 'pointer-events-none');
        }
      }, 3000);
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  if (!navigator.onLine) updateOnlineStatus();

  // App Install Prompt Button
  let deferredPrompt;
  const navContainer = $('.js-nav');
  if (navContainer) {
    const installBtn = document.createElement('button');
    installBtn.id = 'pwa-install-btn';
    installBtn.type = 'button';
    installBtn.className =
      'hidden items-center gap-1.5 rounded-full bg-[#78966c] px-3.5 py-1.5 text-[13px] font-semibold text-white transition hover:bg-[#647f5a] shadow-sm shrink-0 cursor-pointer';
    installBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg><span>Cài ứng dụng</span>`;

    const menuBtn = $('.js-menu');
    if (menuBtn) {
      navContainer.insertBefore(installBtn, menuBtn);
    } else {
      navContainer.appendChild(installBtn);
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installBtn.classList.remove('hidden');
      installBtn.classList.add('inline-flex');
    });

    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        installBtn.classList.add('hidden');
        installBtn.classList.remove('inline-flex');
      }
      deferredPrompt = null;
    });

    window.addEventListener('appinstalled', () => {
      installBtn.classList.add('hidden');
      installBtn.classList.remove('inline-flex');
      deferredPrompt = null;
    });
  }
}

function setSeoMeta({ title, description, image, url = window.location.href, siteName = 'Nhà bếp của Lyn' }) {
  const seoTitle = title ? `${title} — ${siteName}` : siteName;
  const seoDescription =
    description || 'Những bài viết về bữa ăn lành mạnh, meal prep và lối sống khỏe mạnh của Nhà bếp của Lyn.';
  const resolvedUrl = new URL(url, window.location.href).href;
  const resolvedImage = image
    ? (() => {
        try {
          return new URL(image, window.location.href).href;
        } catch {
          return image;
        }
      })()
    : new URL(fallbackImage, window.location.href).href;

  const setMetaTag = (attrName, attrValue, content) => {
    let tag = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attrName, attrValue);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  document.title = seoTitle;
  setMetaTag('name', 'description', seoDescription);
  setMetaTag('property', 'og:title', seoTitle);
  setMetaTag('property', 'og:description', seoDescription);
  setMetaTag('property', 'og:type', 'article');
  setMetaTag('property', 'og:site_name', siteName);
  setMetaTag('property', 'og:image', resolvedImage);
  setMetaTag('property', 'og:url', resolvedUrl);
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', seoTitle);
  setMetaTag('name', 'twitter:description', seoDescription);
  setMetaTag('name', 'twitter:image', resolvedImage);

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = resolvedUrl;
}

async function home() {
  setSeoMeta({
    title: 'Nhà bếp của Lyn — Healthy lifestyle',
    description: 'Những công thức healthy, meal prep và góc sống khỏe cho một nhịp ăn uống tự nhiên hơn.',
    image: 'assets/images/healthy-breakfast-editorial.png'
  });
  const [recipes, articles] = await Promise.all([data('recipes'), data('articles')]);
  const featuredContainer = $('#featured');
  if (featuredContainer) {
    featuredContainer.innerHTML = recipes
      .filter((r) => r.featured)
      .slice(0, 3)
      .map(fmt)
      .join('');
  }
  const latestContainer = $('#latest');
  if (latestContainer) {
    const latestArticles = [...articles]
      .sort((a, b) => parseArticleDate(b.date) - parseArticleDate(a.date))
      .slice(0, 6);

    latestContainer.innerHTML = latestArticles.map(art).join('');
  }
}
async function recipesPage() {
  setSeoMeta({
    title: 'Công thức — Nhà bếp của Lyn',
    description: 'Công thức bữa sáng, bữa trưa, bữa tối và ăn nhẹ giúp bạn nấu nhanh mà vẫn đủ đầy.',
    image: 'assets/images/healthy-breakfast-editorial.png'
  });
  const recipes = await data('recipes');
  const listContainer = $('#recipe-list');
  const sentinel = createSentinel('recipe-sentinel', 'Đang tải thêm công thức...', listContainer);
  const scroller = setupInfiniteScroll({
    container: listContainer,
    sentinel,
    renderItem: fmt,
    batchSize: 6
  });

  const render = () => {
    let x = [...recipes],
      q = $('#search')?.value?.toLowerCase()?.trim() || '',
      c = $('#category')?.value || 'all',
      s = $('#sort')?.value || 'default';
    x = x.filter((r) => (c === 'all' || r.category === c) && (r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)));
    if (s === 'calories') x.sort((a, b) => a.calories - b.calories);
    if (s === 'time') x.sort((a, b) => a.prepTime + a.cookTime - (b.prepTime + b.cookTime));
    
    if ($('#result-count')) $('#result-count').textContent = `${x.length} công thức`;
    
    if (x.length === 0) {
      listContainer.innerHTML = '<p class="col-span-full py-8 text-center text-[#74776f]">Chưa tìm thấy món phù hợp.</p>';
      if (sentinel) sentinel.style.display = 'none';
    } else {
      scroller.reset(x);
    }
  };
  ['search', 'category', 'sort'].forEach((id) =>
    $('#' + id)?.addEventListener(id === 'search' ? 'input' : 'change', render)
  );
  render();
}
function detailDefaults(r) {
  const profile = {
    'Bữa sáng': {
      tags: ['Bữa sáng lành mạnh', 'Năng lượng bền vững'],
      why: ['Dễ chuẩn bị với các nguyên liệu gần gũi trong căn bếp.', `Mỗi phần có ${r.protein}g protein, giúp bạn no lâu hơn vào buổi sáng.`, 'Có thể chuẩn bị trước để buổi sáng bận rộn vẫn ăn uống tử tế.'],
      variations: ['Đổi trái cây hoặc rau củ theo mùa để món ăn luôn mới mẻ.', 'Điều chỉnh lượng gia vị hoặc topping theo khẩu vị của bạn.'],
      serving: 'Dùng ngay khi còn ấm hoặc ăn cùng trái cây tươi và một ly nước. Nếu cần bữa sáng no hơn, thêm một lát bánh mì nguyên cám.',
      tips: ['Chuẩn bị sẵn nguyên liệu từ tối hôm trước để rút ngắn thời gian buổi sáng.', 'Nêm nếm vừa phải để hương vị tự nhiên của nguyên liệu vẫn nổi bật.'],
      faqs: [['Có thể làm trước không?', 'Có. Hãy chia thành từng phần, làm nguội hẳn và giữ trong hộp kín ở ngăn mát.'], ['Có thể thay nguyên liệu không?', 'Hoàn toàn có thể. Chọn nguyên liệu cùng nhóm và điều chỉnh gia vị cho phù hợp.']]
    },
    'Bữa trưa': {
      tags: ['Bữa trưa cân bằng', 'Phù hợp mang đi'],
      why: ['Kết hợp rau củ, tinh bột và protein trong một phần ăn cân bằng.', `Với ${r.calories} kcal mỗi phần, món ăn phù hợp cho một buổi trưa đủ năng lượng.`, 'Dễ chia hộp để mang đi học hoặc đi làm.'],
      variations: ['Thay loại rau bằng nguyên liệu theo mùa để giữ độ tươi ngon.', 'Dùng cơm gạo lứt, quinoa hoặc khoai lang tùy nhu cầu năng lượng.'],
      serving: 'Chia món thành từng hộp riêng. Khi mang đi, để phần sốt hoặc topping giòn trong hộp nhỏ và trộn ngay trước khi ăn.',
      tips: ['Để các nguyên liệu nóng nguội bớt trước khi đóng hộp để tránh làm rau bị úng.', 'Nếm lại phần sốt sau khi bảo quản vì gia vị có thể dịu đi khi để lạnh.'],
      faqs: [['Có thể meal prep bao lâu?', 'Phần lớn món trưa ngon nhất trong 2–3 ngày khi bảo quản lạnh đúng cách.'], ['Hâm nóng thế nào?', 'Chỉ hâm phần cơm hoặc protein; rau tươi và sốt nên thêm sau khi hâm.']]
    },
    'Bữa tối': {
      tags: ['Bữa tối đủ đầy', 'Dễ nấu tại nhà'],
      why: ['Hương vị ấm áp, dễ ăn và phù hợp cho một bữa tối tại nhà.', `Cung cấp ${r.protein}g protein mỗi phần để bữa ăn vẫn đủ chất mà không nặng bụng.`, 'Các bước làm rõ ràng, không cần kỹ thuật nấu nướng phức tạp.'],
      variations: ['Thay rau củ bằng các loại rau đang có sẵn trong tủ lạnh.', 'Tăng hoặc giảm lượng tinh bột theo mức độ vận động trong ngày.'],
      serving: 'Dùng nóng ngay sau khi nấu. Ghép cùng một phần rau xanh hoặc salad chua nhẹ để hương vị cân bằng hơn.',
      tips: ['Chuẩn bị và cắt sẵn toàn bộ nguyên liệu trước khi bật bếp.', 'Nấu vừa chín tới để rau củ còn màu sắc và độ giòn tự nhiên.'],
      faqs: [['Có thể nấu trước không?', 'Có. Để nguội hoàn toàn rồi bảo quản trong hộp kín; hâm nóng nhẹ trước khi dùng.'], ['Làm sao để món không bị khô?', 'Không hâm quá lâu và thêm một thìa nước, nước dùng hoặc sốt khi cần.']]
    },
    'Ăn nhẹ': {
      tags: ['Ăn nhẹ lành mạnh', 'Nhanh gọn'],
      why: ['Phần ăn nhỏ gọn, phù hợp giữa hai bữa chính hoặc sau khi vận động.', 'Nguyên liệu đơn giản, dễ chuẩn bị và dễ mang theo.', `Mỗi phần khoảng ${r.calories} kcal, vừa đủ để nạp thêm năng lượng.`],
      variations: ['Đổi hạt, trái cây hoặc topping để tạo hương vị mới.', 'Giảm vị ngọt bằng cách dùng trái cây chín tự nhiên thay cho đường.'],
      serving: 'Dùng như món ăn nhẹ giữa buổi. Ghép cùng trà nóng, cà phê không đường hoặc sữa chua để no lâu hơn.',
      tips: ['Chia sẵn thành từng phần nhỏ để dễ kiểm soát khẩu phần.', 'Ưu tiên hộp kín để món giữ được độ tươi, giòn hoặc mềm đúng ý.'],
      faqs: [['Có thể mang đi không?', 'Có. Chọn hộp kín hoặc túi giữ lạnh nếu món có sữa chua, trái cây hay thành phần tươi.'], ['Có thể thay topping không?', 'Có. Dùng hạt, trái cây hoặc gia vị có sẵn, nhưng nên giữ khẩu phần vừa phải.']]
    }
  }[r.category];
  return {
    tags: r.tags || profile.tags,
    intro: r.intro || `${r.title} là một lựa chọn ${r.category.toLowerCase()} tươi ngon, được xây dựng từ ${r.ingredients.slice(0, 2).join(' và ').toLowerCase()}. ${r.description} Món ăn phù hợp với nhịp sống bận rộn nhưng vẫn ưu tiên nguyên liệu thật và khẩu phần cân bằng.`,
    why: r.whyItWorks || profile.why,
    variations: r.variations || profile.variations,
    storage: r.storage || 'Để món ăn nguội hoàn toàn trước khi cất trong hộp kín. Bảo quản ngăn mát 2–3 ngày; với món có rau tươi hoặc trái cây, nên dùng sớm để giữ độ ngon.',
    notes: r.notes || 'Chuẩn bị sẵn nguyên liệu và nêm nếm từng chút một. Điều này giúp bạn dễ kiểm soát cả hương vị lẫn độ chín của món.',
    serving: r.servingSuggestions || profile.serving,
    tips: r.tips || profile.tips,
    faqs: r.faqs || profile.faqs
  };
}
async function recipeDetail() {
  const recipes = await data('recipes'), r = recipes.find((x) => x.id == new URLSearchParams(location.search).get('id')) || recipes[0], d = detailDefaults(r);
  document.title = `${r.title} — Nhà bếp của Lyn`;
  const list = (items) => `<ul>${items.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  $('#recipe-detail').innerHTML =
    `<p class="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--color-fern-500)]">${r.category} · ${r.difficulty || 'Dễ làm'} · ${r.prepTime + r.cookTime} phút</p><h1 class="font-['Playfair_Display'] text-[clamp(42px,6vw,76px)] leading-[1.12]">${r.title}</h1><p class="text-[19px] text-[#565a52]">${r.description}</p><div class="mt-5 flex flex-wrap gap-2">${d.tags.map((tag) => `<span class="chip">${tag}</span>`).join('')}</div><img class="my-[30px] h-[280px] w-full object-cover md:h-[450px] rounded-md" src="${imageSrc(r.image)}" ${imageFallback} alt="${r.title}"><div class="my-[30px] grid grid-cols-2 bg-white md:grid-cols-4"><div class="border-r border-[#e7e5df] p-[18px] text-center"><b class="block font-['Playfair_Display'] text-[24px] text-[var(--color-fern-500)]">${r.prepTime}'</b>chuẩn bị</div><div class="p-[18px] text-center md:border-r md:border-[#e7e5df]"><b class="block font-['Playfair_Display'] text-[24px] text-[var(--color-fern-500)]">${r.cookTime}'</b>nấu</div><div class="border-r border-[#e7e5df] p-[18px] text-center"><b class="block font-['Playfair_Display'] text-[24px] text-[var(--color-fern-500)]">${r.servings}</b>khẩu phần</div><div class="p-[18px] text-center"><b class="block font-['Playfair_Display'] text-[24px] text-[var(--color-fern-500)]">${r.calories}</b>kcal / phần</div></div><div class="grid gap-6 md:grid-cols-[1fr_270px] md:gap-[68px]"><div class="[&_h2]:mt-10 [&_h2]:font-['Playfair_Display'] [&_h2]:text-[30px] [&_li]:mb-[10px]"><h2 class="!mt-0">Về món này</h2><p>${d.intro}</p><h2>Vì sao bạn sẽ thích</h2>${list(d.why)}<h2>Nguyên liệu bạn cần</h2><p>Ưu tiên nguyên liệu tươi; bạn có thể thay thế linh hoạt nhưng nên giữ tỷ lệ tương tự để món vẫn cân bằng.</p>${list(r.ingredients)}<h2>Hướng dẫn từng bước</h2><ol>${r.steps.map((x, i) => `<li><b>Bước ${i + 1}: </b>${x}</li>`).join('')}</ol><h2>Biến tấu theo ý thích</h2>${list(d.variations)}<h2>Gợi ý dùng món</h2><p>${d.serving}</p><h2>Mẹo để món ngon hơn</h2>${list(d.tips)}<h2>Meal prep, bảo quản & hâm nóng</h2>${list(r.mealPrepTips)}<p>${d.storage}</p><div class="mt-8 rounded-xl bg-[#f1f4ed] p-5"><b class="text-[var(--color-fern-600)]">Lưu ý từ Lyn</b><p class="mt-2">${d.notes}</p></div><h2>Câu hỏi thường gặp</h2><div class="space-y-3">${d.faqs.map(([question, answer]) => `<details class="rounded-lg border border-[#e7e5df] bg-white px-4 py-3"><summary class="cursor-pointer font-semibold">${question}</summary><p class="mt-2 text-[#565a52]">${answer}</p></details>`).join('')}</div></div><aside class="h-max rounded-xl bg-[#e8dfd0] p-[25px] md:sticky md:top-24"><span class="text-[11px] font-bold uppercase tracking-[.12em] text-[var(--color-fern-500)]">Dinh dưỡng tham khảo</span><p><b>${r.protein}g</b> protein<br><b>${r.carbs}g</b> carbs<br><b>${r.fat}g</b> chất béo</p><p>Con số mang tính tham khảo và có thể thay đổi theo nguyên liệu bạn dùng.</p></aside></div>`;
}
async function articlesPage() {
  setSeoMeta({
    title: 'Góc sống khỏe — Nhà bếp của Lyn',
    description: 'Bài viết về lối sống khỏe, thói quen ăn uống và cảm hứng meal prep cho ngày thường.',
    image: 'assets/images/healthy-breakfast-editorial.png'
  });
  const articles = await data('articles');
  const filters = ['Tất cả', ...new Set(articles.map((a) => a.category))];
  const filterWrap = $('#article-filters');
  let active = 'Tất cả';

  const listContainer = $('#article-list');
  const sentinel = createSentinel('article-sentinel', 'Đang tải thêm bài viết...', listContainer);
  const scroller = setupInfiniteScroll({
    container: listContainer,
    sentinel,
    renderItem: art,
    batchSize: 6
  });

  const render = () => {
    const visible = active === 'Tất cả' ? articles : articles.filter((a) => a.category === active);
    if ($('#article-count')) {
      $('#article-count').textContent = `${visible.length} bài viết để bạn đọc chậm, lưu lại và áp dụng theo cách riêng.`;
    }
    if (filterWrap) {
      filterWrap.querySelectorAll('button').forEach((button) => {
        const selected = button.dataset.filter === active;
        button.className = `rounded-full border px-3 py-1.5 text-[13px] font-semibold transition ${selected ? 'border-[#4f7d56] bg-[#4f7d56] text-white' : 'border-[#cfd9cb] bg-white text-[#4f7d56] hover:border-[#4f7d56]'}`;
        button.setAttribute('aria-pressed', String(selected));
      });
    }

    if (visible.length === 0) {
      listContainer.innerHTML = '<p class="col-span-full py-8 text-center text-[#74776f]">Chưa có bài viết trong mục này.</p>';
      if (sentinel) sentinel.style.display = 'none';
    } else {
      scroller.reset(visible);
    }
  };

  if (filterWrap) {
    filterWrap.innerHTML = filters.map((filter) => `<button type="button" data-filter="${filter}" aria-pressed="false">${filter}</button>`).join('');
    filterWrap.addEventListener('click', (event) => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      active = button.dataset.filter;
      render();
    });
  }
  render();
}
async function articleDetail() {
  const articles = await data('articles'),
    a = articles.find((x) => x.id == new URLSearchParams(location.search).get('id')) || articles[0];
  setSeoMeta({
    title: a.seoTitle || a.title,
    description: a.seoDescription || a.excerpt || a.intro,
    image: a.seoThumbnail || a.seoImage || a.image,
    url: `${window.location.pathname}?id=${a.id}`
  });
  const sections = a.sections || [{ heading: 'Gợi ý thực hành', body: a.content, tips: [] }];
  const sectionMarkup = sections
    .map(
      (section) => `<section><h2>${section.heading}</h2><p>${section.body}</p>${section.tips?.length ? `<ul class="mt-4 space-y-2 rounded-xl bg-[#f1f4ed] p-5 text-[#42483f]">${section.tips.map((tip) => `<li class="flex gap-2"><span class="text-[#4f7d56]">✓</span><span>${tip}</span></li>`).join('')}</ul>` : ''}</section>`
    )
    .join('');
  $('#article-detail').innerHTML =
    `<p class="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--color-fern-500)]">${a.category} · ${a.readTime} · ${a.date}</p><h1 class="font-['Playfair_Display'] text-[clamp(42px,6vw,76px)] leading-[1.12]">${a.title}</h1><p class="text-[19px] text-[#565a52]">${a.excerpt}</p><img class="my-[30px] h-[280px] w-full object-cover md:h-[450px] rounded-md" src="${imageSrc(a.image)}" ${imageFallback} alt="${a.title}"><div class="article-prose"><p class="article-lead">${a.intro || a.content}</p>${sectionMarkup}<aside class="my-9 rounded-2xl border border-[#d5e2d2] bg-[#f1f6ef] p-6"><p class="eyebrow">Ghi nhớ</p><p class="mt-3 text-[17px] font-semibold text-[#3b5e41]">${a.takeaway || 'Bắt đầu bằng một thay đổi vừa sức và lặp lại theo nhịp của bạn.'}</p></aside>${a.video ? `<section class="my-10 overflow-hidden rounded-2xl border border-[#e7e5df] bg-white p-3 shadow-sm"><div class="mb-3 flex items-center gap-2 px-2 pt-1"><span class="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f0e4] text-sm">▶</span><div><p class="text-sm font-bold">Xem thêm bằng video</p><p class="text-xs text-[#74776f]">Một góc cảm hứng để cùng vào bếp</p></div></div><div class="aspect-video overflow-hidden rounded-xl bg-[#e8dfd0]"><iframe class="h-full w-full" src="${a.video}" title="Video về ${a.title}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></section>` : ''}<h2>Điều quan trọng là sự đều đặn</h2><p>Hãy bắt đầu bằng lựa chọn vừa sức với lịch sống của bạn. Một bữa ăn được chuẩn bị sẵn, một chai nước trên bàn làm việc hoặc 10 phút đi bộ cũng là những bước nhỏ đáng giá.</p></div>`;
}
async function prep() {
  setSeoMeta({
    title: 'Meal prep — Nhà bếp của Lyn',
    description: 'Thực đơn meal prep và danh sách mua sắm để bạn chuẩn bị bữa ăn cả tuần dễ dàng.',
    image: 'assets/images/healthy-breakfast-editorial.png'
  });
  const plans = await data('meal-plans');
  const picker = $('#plan-picker');
  const previous = $('#plan-previous');
  const next = $('#plan-next');
  const planFromUrl = Number(new URLSearchParams(location.search).get('plan'));
  let activePlan = Number.isInteger(planFromUrl) && plans[planFromUrl] ? planFromUrl : plans.length - 1;

  const render = () => {
    const p = plans[activePlan];
    const rawDays = Array.isArray(p.days) ? p.days : [];
    const days = rawDays.map((d) =>
      Array.isArray(d)
        ? d
        : d && typeof d === 'object'
        ? [d.day || '—', d.breakfast || '—', d.lunch || '—', d.dinner || '—', d.calories ?? null, d.protein ?? null]
        : [String(d)]
    );
    const hasNutrition = days.some((d) => d[4] != null || d[5] != null);
    const columns = hasNutrition ? 'grid-cols-[90px_repeat(3,1fr)_80px_80px]' : 'grid-cols-[90px_repeat(3,1fr)]';
    const headers = hasNutrition ? '<span>Calories</span><span>Protein</span>' : '';

    $('#plan-title').textContent = p.title;
    $('#plan-desc').textContent = p.description;
    $('#shopping').innerHTML = p.shopping.map((x) => `<li>${x}</li>`).join('');
    $('#plan-table').innerHTML =
      `<div class="grid min-w-[530px] ${columns} gap-3 border-b border-[#e7e5df] py-[17px] text-[13px] font-bold"><span>Ngày</span><span>Bữa sáng</span><span>Bữa trưa</span><span>Bữa tối</span>${headers}</div>` +
      days.map((d) => `<div class="grid min-w-[530px] ${columns} gap-3 border-b border-[#e7e5df] py-[17px] text-[13px] rounded-lg px-2 cursor-default">${d.map((x, j) => `<span class="${j === 0 ? 'font-semibold text-[var(--color-fern-600)]' : ''}">${j === 4 && x != null ? `${x} kcal` : x || '—'}</span>`).join('')}</div>`).join('');
    $('#plan-tips').innerHTML = p.tips?.length
      ? `<p class="eyebrow">🌿 Mẹo nhỏ</p><ul class="mt-4 text-left [&_li]:mb-2 [&_li]:pl-5 [&_li]:relative [&_li:before]:content-['•'] [&_li:before]:absolute [&_li:before]:left-0 [&_li:before]:text-[var(--color-fern-500)]">${p.tips.map((tip) => `<li>${tip}</li>`).join('')}</ul>`
      : '';
    picker.querySelectorAll('[data-plan]').forEach((button, index) => {
      const selected = index === activePlan;
      button.classList.toggle('plan-card--selected', selected);
      button.setAttribute('aria-current', selected ? 'true' : 'false');
    });
  };

  const selectPlan = (index, scrollToCard = false) => {
    if (!plans[index] || index === activePlan && !scrollToCard) return;
    activePlan = index;
    history.replaceState(null, '', `${location.pathname}?plan=${activePlan}`);
    render();
    if (scrollToCard) picker.querySelector(`[data-plan="${activePlan}"]`).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  picker.innerHTML = plans.map((p, index) => `<button type="button" data-plan="${index}" class="plan-card min-w-[260px] snap-center rounded-2xl border border-[#e7e5df] bg-white p-5 text-left shadow-[0_4px_16px_rgba(47,52,45,.07)] transition hover:-translate-y-0.5 hover:border-[#78966c] md:min-w-[310px]"><span class="text-[11px] font-bold uppercase tracking-[.14em] text-[var(--color-fern-500)]">Thực đơn ${index + 1} · 7 ngày</span><span class="mt-2 block font-['Playfair_Display'] text-[22px] leading-[1.2]">${p.title}</span><span class="mt-2 block text-[13px] leading-relaxed text-[#74776f]">${p.description}</span><span class="mt-4 block text-[12px] font-semibold text-[var(--color-fern-600)]">${p.shopping.length} nguyên liệu · Xem thực đơn →</span></button>`).join('');
  picker.addEventListener('click', (event) => {
    const button = event.target.closest('[data-plan]');
    if (!button) return;
    selectPlan(Number(button.dataset.plan));
    const target = $('#plan-schedule') || $('#plan-table');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  previous.addEventListener('click', () => selectPlan(Math.max(0, activePlan - 1), true));
  next.addEventListener('click', () => selectPlan(Math.min(plans.length - 1, activePlan + 1), true));
  let scrollFrame;
  picker.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      const center = picker.getBoundingClientRect().left + picker.clientWidth / 2;
      const closest = [...picker.querySelectorAll('[data-plan]')].reduce((best, card) => Math.abs(card.getBoundingClientRect().left + card.offsetWidth / 2 - center) < Math.abs(best.getBoundingClientRect().left + best.offsetWidth / 2 - center) ? card : best);
      selectPlan(Number(closest.dataset.plan));
    });
  }, { passive: true });
  render();
  requestAnimationFrame(() => picker.querySelector(`[data-plan="${activePlan}"]`).scrollIntoView({ block: 'nearest', inline: 'center' }));
}

layout();
(
  ({ home, recipesPage, recipeDetail, articlesPage, articleDetail, prep })[
    document.body.dataset.page
  ] || (() => {})
)();
