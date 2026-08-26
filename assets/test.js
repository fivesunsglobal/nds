const siteHeader = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('primary-nav');

navToggle?.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') !== 'true';
  navToggle.setAttribute('aria-expanded', String(open));
  siteHeader?.classList.toggle('nav-open', open);
});
primaryNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navToggle?.setAttribute('aria-expanded', 'false');
  siteHeader?.classList.remove('nav-open');
}));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal-item');
if (!reducedMotion && 'IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      if (entry.target.classList.contains('studio-model')) entry.target.classList.add('is-active');
      reveal.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
  revealItems.forEach(item => reveal.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
  document.querySelector('.studio-model')?.classList.add('is-active');
}

const stories = {
  caucasus: {
    meta: 'Caucasus Region · 2026 · Applied AI',
    title: 'AI for strategic communications',
    image: 'assets/caucasus-tbilisi.jpg',
    summary: 'Training civil-society professionals to use AI in communications work while making informed choices about accuracy, security, and responsible adoption.',
    context: 'Civic communicators face rising pressure to produce faster and compete in a crowded information environment.',
    action: 'A practical training introduced applied AI workflows for communications alongside judgment about accuracy, privacy, and security.',
    resolution: 'Draft pending: Adam’s account of participant applications and outcomes will complete this story.'
  },
  peru: {
    meta: 'Peru · 2026 · Journalism',
    title: 'Practical AI for journalists',
    image: 'assets/peru-ai-journalists.webp',
    summary: 'A Spanish-language program focused on useful workflows for research, productivity, and communications.',
    context: 'Journalists needed an accessible way to evaluate new AI tools against the realities of reporting work.',
    action: 'The program connected practical workflows with discussion of responsible use, verification, and information risk.',
    resolution: 'Draft pending: participant applications and follow-up outcomes will be added after an interview with Adam.'
  },
  climate: {
    meta: 'Global · 2025–2026 · Organizational capacity',
    title: 'AI adoption for climate organizations',
    image: 'assets/climate-ai-rice-terraces.jpg',
    summary: 'Six cohorts combining practical tools, safeguards, guest expertise, and peer learning for mission-driven teams around the world.',
    context: 'Climate organizations were exploring AI while balancing capacity constraints, sensitive information, and uneven staff experience.',
    action: 'Six cohorts combined demonstrations, applied practice, safeguards, peer exchange, and outside expertise.',
    resolution: 'Draft pending: organization-level changes and representative participant outcomes will be completed with Adam.'
  },
  cambodia: {
    meta: 'Cambodia · 2017–2018 · Design research',
    title: 'Designing around civic organizations',
    image: 'assets/cambodia-workshop-v2.jpg',
    summary: 'Research with Cambodian civil-society organizations used their real communications and technology practices to shape better support.',
    context: 'A membership association serving roughly 170 Cambodian civil-society organizations needed stronger evidence about how its members operated, communicated, and used technology.',
    action: 'A rapid Member Insights process interviewed 48 staff across 20 organizations, examining internal communications, public engagement, operational tools, and data collection.',
    resolution: 'The findings created a grounded basis for improving member outreach and designing more individually tailored training programs.',
    source: 'https://dai-global-digital.com/cambodia-civil-society-facebook.html'
  },
  tanzania: {
    meta: 'East Africa · 2019 · Data for advocacy',
    title: 'Better data for smallholder farmers',
    image: 'assets/tanzania-zanzibar-boat.jpg',
    summary: 'Capacity building helped agricultural advocacy organizations strengthen the collective voice of rural farmers and producers.',
    context: 'Agricultural alliances in Tanzania, Uganda, and Rwanda sought to improve advocacy for cooperatives and smallholder producers and make better use of data.',
    action: 'The partnership used field interviews, focus groups, organizational assessments, and a human-centered design approach to tailor advocacy and data support.',
    resolution: 'Early fieldwork challenged assumptions about existing capabilities and established a bottom-up, adaptive basis for training and advocacy priorities.',
    source: 'https://www.interaction.org/blog/5-questions-about-interactions-work-with-ifad-in-east-africa/'
  },
  rwanda: {
    meta: 'Rwanda · 2017 · Digital research',
    title: 'Evidence before technology',
    image: 'assets/rwanda-yellow-umbrella.jpg',
    summary: 'Research into how rural young people used media, mobile technology, and financial services informed more realistic program choices.',
    context: 'Program teams needed to understand how rural Rwandan youth actually communicated, accessed technology, and interacted with financial institutions.',
    action: 'With a local agribusiness forum, the team interviewed 116 people aged 17–34 in towns and villages outside Kigali and profiled rural financial institutions.',
    resolution: 'The evidence changed assumptions about device access, mobile money, entrepreneurship, and finance—giving future outreach and program design a more realistic foundation.',
    source: 'https://dai-global-digital.com/rwanda-digital-insights.html'
  },
  guatemala: {
    meta: 'Guatemala · 2016 · Civic technology',
    title: 'Citizen evidence guiding app development',
    image: 'assets/guatemala-training.webp',
    summary: 'Citizen research shaped a mobile tool intended to make municipal budgets more transparent and government more accessible.',
    context: 'Chiantla’s newly elected mayor wanted a mobile tool that would support budget transparency, social audit, and communication with a municipality of 75,000 people.',
    action: 'A local civil-society partner was trained to interview 100 residents across urban, peripheral, and rural communities, bringing citizen needs into technology choices from the start.',
    resolution: 'Findings about smartphones, prepaid data, Facebook, WhatsApp, and demand for budget information directly shaped the app’s features and technical direction.',
    source: 'https://dai-global-digital.com/citizen-centered-design-guatemala.html'
  },
  indonesia: {
    meta: 'Indonesia · Design research',
    title: 'Listening before building',
    image: 'assets/indonesia-field.webp',
    summary: 'Local teams used digital survey tools and human-centered research to understand needs before designing programs or services.',
    context: 'The work began with a need to replace assumptions with direct evidence from prospective users and communities.',
    action: 'Local teams were equipped to conduct technology-enabled design research and translate field observations into program decisions.',
    resolution: 'Draft pending: the specific design decision and resulting program outcome will be completed with Adam.'
  },
  honduras: {
    meta: 'Honduras · Field research',
    title: 'Technology for community insight',
    image: 'assets/honduras-field.webp',
    summary: 'Community-based digital research helped translate local perspectives into better program design.',
    context: 'Program teams needed responsible, timely evidence about community experience rather than relying on distant assumptions.',
    action: 'Survey teams used digital research methods to gather and organize community perspectives for decision-makers.',
    resolution: 'Draft pending: the decision influenced by this research and its outcome will be completed with Adam.'
  }
};

const modal = document.getElementById('storyModal');
const fields = {
  meta: document.getElementById('storyMeta'),
  title: document.getElementById('storyTitle'),
  image: document.getElementById('storyImage'),
  summary: document.getElementById('storySummary'),
  context: document.getElementById('storyContext'),
  action: document.getElementById('storyAction'),
  resolution: document.getElementById('storyResolution'),
  source: document.getElementById('storySource')
};
let lastStoryTrigger = null;

document.querySelectorAll('[data-story]').forEach(button => button.addEventListener('click', () => {
  const story = stories[button.dataset.story];
  if (!story || !modal) return;
  lastStoryTrigger = button;
  fields.meta.textContent = story.meta;
  fields.title.textContent = story.title;
  fields.image.src = story.image;
  fields.image.alt = story.title;
  fields.summary.textContent = story.summary;
  fields.context.textContent = story.context;
  fields.action.textContent = story.action;
  fields.resolution.textContent = story.resolution;
  fields.source.hidden = !story.source;
  if (story.source) fields.source.href = story.source;
  modal.showModal();
  document.body.style.overflow = 'hidden';
}));

const closeStory = () => {
  modal?.close();
  document.body.style.overflow = '';
  lastStoryTrigger?.focus();
};
document.querySelector('.story-close')?.addEventListener('click', closeStory);
modal?.addEventListener('click', event => {
  if (event.target === modal) closeStory();
});
modal?.addEventListener('close', () => {
  document.body.style.overflow = '';
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal?.open) closeStory();
});