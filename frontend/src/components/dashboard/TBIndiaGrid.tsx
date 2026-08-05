import React, { useState, useEffect } from 'react';
import { BarChart2, Shield, HeartHandshake, Building2, BookOpen, GraduationCap, MessageSquare, HelpCircle } from 'lucide-react';
import { soundService } from '../../services/soundService';
import { ArticleData } from './ArticleModal';
import { supabaseData } from '../../services/supabaseData';
import tbMuktBharatBanner from '../../assets/tb_mukt_bharat_banner.png';
import defaultNikshayBanner from '../../assets/nikshay_mitra_banner.png';
import defaultNtepBanner from '../../assets/ntep_banner.png';
import defaultAwarenessBanner from '../../assets/awareness_banner.png';

interface TBIndiaGridProps {
  onOpenArticle: (article: ArticleData) => void;
  onOpenQuickLink?: (linkId: string) => void;
}

export default function TBIndiaGrid({ onOpenArticle, onOpenQuickLink }: TBIndiaGridProps) {
  const [bannerUrl, setBannerUrl] = useState<string>(tbMuktBharatBanner);

  // NI-KSHAY MITRA Card State
  const [nikshayCard, setNikshayCard] = useState({
    title: 'NI-KSHAY MITRA',
    category: 'Community Support',
    description: 'Community support initiative for people affected by TB. Together, we can end TB stigma and support patients.',
    imageUrl: defaultNikshayBanner,
    btnText: 'READ ARTICLE',
    btnLink: ''
  });
  const [nikshayImageError, setNikshayImageError] = useState(false);

  // NTEP Card State
  const [ntepCard, setNtepCard] = useState({
    title: 'NATIONAL TB ELIMINATION PROGRAMME',
    category: 'Government Programme',
    description: "Government of India's flagship program for TB control and elimination.",
    imageUrl: defaultNtepBanner,
    btnText: 'EXPLORE NTEP',
    btnLink: 'https://tbcindia.gov.in'
  });
  const [ntepImageError, setNtepImageError] = useState(false);

  // Awareness Card State
  const [awarenessCardState, setAwarenessCardState] = useState({
    title: 'TB AWARENESS – 2026',
    category: 'Awareness Campaign',
    description: "Learn about India's current TB initiatives and how you can contribute.",
    imageUrl: defaultAwarenessBanner,
    btnText: 'READ ARTICLE',
    btnLink: ''
  });
  const [awarenessImageError, setAwarenessImageError] = useState(false);

  useEffect(() => {
    async function loadData() {
      // 1. Fetch live dashboard card data from Supabase DB table `dashboard_cards`
      try {
        const cards = await supabaseData.fetchDashboardCards();
        if (cards) {
          if (cards['nikshay']) {
            const item = cards['nikshay'];
            setNikshayCard({
              title: item.title || 'NI-KSHAY MITRA',
              category: item.category || 'Community Support',
              description: item.description || 'Community support initiative for people affected by TB. Together, we can end TB stigma and support patients.',
              imageUrl: item.imageUrl || defaultNikshayBanner,
              btnText: item.btnText || 'READ ARTICLE',
              btnLink: item.btnLink || ''
            });
            setNikshayImageError(false);
          }

          if (cards['ntep']) {
            const item = cards['ntep'];
            setNtepCard({
              title: item.title || 'NATIONAL TB ELIMINATION PROGRAMME',
              category: item.category || 'Government Programme',
              description: item.description || "Government of India's flagship program for TB control and elimination.",
              imageUrl: item.imageUrl || defaultNtepBanner,
              btnText: item.btnText || 'EXPLORE NTEP',
              btnLink: item.btnLink || ''
            });
            setNtepImageError(false);
          }

          if (cards['awareness']) {
            const item = cards['awareness'];
            setAwarenessCardState({
              title: item.title || 'TB AWARENESS – 2026',
              category: item.category || 'Awareness Campaign',
              description: item.description || "Learn about India's current TB initiatives and how you can contribute.",
              imageUrl: item.imageUrl || defaultAwarenessBanner,
              btnText: item.btnText || 'READ ARTICLE',
              btnLink: item.btnLink || ''
            });
            setAwarenessImageError(false);
          }
        }
      } catch (err) {
        console.warn('Note loading dashboard cards:', err);
      }
    }

    loadData();

    // 2. Realtime Listener
    const unsubscribe = supabaseData.subscribeDashboardCards((cards) => {
      if (cards) {
        if (cards['nikshay']) {
          const item = cards['nikshay'];
          setNikshayCard({
            title: item.title || 'NI-KSHAY MITRA',
            category: item.category || 'Community Support',
            description: item.description || 'Community support initiative for people affected by TB. Together, we can end TB stigma and support patients.',
            imageUrl: item.imageUrl || '',
            btnText: item.btnText || 'READ ARTICLE',
            btnLink: item.btnLink || ''
          });
          setNikshayImageError(false);
        }

        if (cards['ntep']) {
          const item = cards['ntep'];
          setNtepCard({
            title: item.title || 'NATIONAL TB ELIMINATION PROGRAMME',
            category: item.category || 'Government Programme',
            description: item.description || "Government of India's flagship program for TB control and elimination.",
            imageUrl: item.imageUrl || '',
            btnText: item.btnText || 'EXPLORE NTEP',
            btnLink: item.btnLink || ''
          });
          setNtepImageError(false);
        }

        if (cards['awareness']) {
          const item = cards['awareness'];
          setAwarenessCardState({
            title: item.title || 'TB AWARENESS – 2026',
            category: item.category || 'Awareness Campaign',
            description: item.description || "Learn about India's current TB initiatives and how you can contribute.",
            imageUrl: item.imageUrl || '',
            btnText: item.btnText || 'READ ARTICLE',
            btnLink: item.btnLink || ''
          });
          setAwarenessImageError(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const leftCards = [
    {
      id: 'stats',
      icon: BarChart2,
      iconBg: 'bg-purple-600 text-white',
      titleColor: 'text-purple-700',
      title: 'TB STATISTICS',
      btnColor: 'bg-purple-600 hover:bg-purple-700 text-white',
      btnText: 'EXPLORE STATISTICS',
      graphic: (
        <div className="w-full h-28 rounded-[12px] bg-slate-50 border border-slate-200/80 p-2 flex flex-col items-center justify-center relative overflow-hidden text-center">
          <svg viewBox="0 0 200 90" className="w-full h-full opacity-30 absolute inset-0">
            <path
              d="M 10 30 Q 30 10 50 30 T 90 20 T 130 40 T 170 20 T 190 50"
              stroke="#64748b"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 4"
            />
            <circle cx="125" cy="40" r="10" fill="#ef4444" opacity="0.3" />
            <circle cx="125" cy="40" r="4" fill="#dc2626" />
          </svg>
          <div className="relative z-10 space-y-0.5">
            <p className="text-[10px] text-slate-500 font-semibold">In 2024, an estimated</p>
            <p className="text-xs font-black text-slate-900 leading-none">10.7 MILLION</p>
            <p className="text-[9px] text-slate-500 font-medium">people developed TB globally.</p>
          </div>
        </div>
      ),
      description: "India accounted for approximately 25 % of the world's estimated incident TB cases.",
      onClick: () => {
        onOpenArticle({
          title: 'Global Tuberculosis Report & India Epidemiological Data',
          category: 'STATISTICS',
          readTime: '3 min',
          content: [
            'According to recent WHO epidemiological estimates, 10.7 million people fell ill with tuberculosis worldwide in 2024.',
            'India carries the highest TB burden globally, representing roughly 25% of incident cases.',
            'Treatment success rates in India under the National TB Elimination Programme exceed 86%.'
          ],
          keyHighlights: [
            'Global TB burden: 10.7 Million cases.',
            'India proportion: ~25% incident cases.',
            'High treatment success rate under NTEP.'
          ]
        });
      }
    },
    {
      id: 'mukt-bharat',
      icon: Shield,
      iconBg: 'bg-emerald-600 text-white',
      titleColor: 'text-emerald-700',
      title: 'TB MUKT BHARAT ABHIYAN 2026',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      btnText: 'READ ARTICLE',
      graphic: (
        <div className="w-full h-32 rounded-[12px] bg-slate-950/30 border border-[#D8E9FF] overflow-hidden relative shadow-xs flex items-center justify-center group">
          <img
            src={tbMuktBharatBanner}
            onError={() => setBannerUrl('/tb_mukt_bharat_banner.png')}
            alt="TB Mukt Bharat Abhiyaan 2026 Official Banner"
            loading="lazy"
            className="w-full h-full object-contain rounded-[12px] group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ),
      description: 'Learn about the TB Mukt Bharat Abhiyan 2026 initiative, its objectives, public awareness activities, early detection programs, community participation, and the Government of India\'s mission to eliminate Tuberculosis.',
      onClick: () => {
        onOpenArticle({
          title: 'TB Mukt Bharat Abhiyan 2026: National Tuberculosis Elimination Awareness Campaign',
          category: 'NATIONAL CAMPAIGN',
          readTime: '4 min',
          image: '/tb_mukt_bharat_banner.png',
          content: [
            'Overview of TB Mukt Bharat Abhiyan 2026: Jan Jan Ka Rakhe Dhyaan - TB-Mukt Bharat Abhiyaan is a 100 Days Intensified TB Elimination Campaign led by the Government of India, Ministry of Health and Family Welfare, and district TB control societies nationwide.',
            'Campaign Objectives: Intensified door-to-door active case finding, high-speed molecular diagnostic coverage (CBNAAT / Truenat), and daily fixed-dose combination anti-TB drug regimens for all registered patients to achieve complete elimination of Tuberculosis.',
            'Key Awareness & Community Participation: Engaging Ni-kshay Mitras, medical colleges, youth forums (Mera Yuva Bharat), and community leaders to support adopted patients with monthly nutritional baskets, diagnostic aid, and vocational guidance while eliminating societal stigma.',
            'Early Diagnosis & Treatment Information: Under the Ni-kshay Poshan Yojana, monthly financial direct benefit transfers (DBT) and free diagnostic testing ensure high treatment adherence and zero financial catastrophic cost for affected families.',
            'Government & NTEP Initiatives: Aligning national health infrastructure and local block health centers towards eliminating Tuberculosis across all rural and urban blocks in India by 2025-2026.'
          ],
          keyHighlights: [
            '100 Days Intensified Campaign across rural and urban blocks.',
            'Upfront molecular diagnostics (CBNAAT/Truenat) for all presumptive cases.',
            'Community adoption & monthly nutritional support under Ni-kshay Mitra.',
            'Government of India\'s mission to eliminate Tuberculosis by 2025-2026.'
          ]
        });
      }
    },
    {
      id: 'nikshay',
      icon: HeartHandshake,
      iconBg: 'bg-amber-600 text-white',
      titleColor: 'text-amber-700',
      title: nikshayCard.title,
      btnColor: 'bg-amber-600 hover:bg-amber-700 text-white',
      btnText: nikshayCard.btnText,
      graphic: (
        <div className="w-full h-28 rounded-[12px] bg-slate-900 border border-amber-200/60 overflow-hidden relative shadow-xs">
          {nikshayCard.imageUrl && !nikshayImageError ? (
            <img
              src={nikshayCard.imageUrl}
              onError={() => setNikshayImageError(true)}
              alt="NI-KSHAY MITRA Official Banner"
              className="w-full h-full object-cover rounded-[12px] hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full rounded-[12px] bg-gradient-to-br from-amber-700 to-amber-900 p-2 flex flex-col items-center justify-center text-white text-center">
              <p className="text-[10px] font-bold tracking-wider text-amber-200 uppercase">NI-KSHAY MITRA</p>
              <p className="text-[9px] text-amber-300 font-medium">Community Support Initiative</p>
            </div>
          )}
        </div>
      ),
      description: nikshayCard.description,
      onClick: () => {
        if (nikshayCard.btnLink) {
          window.open(nikshayCard.btnLink, '_blank');
        } else {
          onOpenArticle({
            title: nikshayCard.title,
            category: nikshayCard.category,
            readTime: '3 min',
            content: [
              nikshayCard.description,
              'NI-KSHAY MITRA is a Government of India initiative that encourages individuals, organizations, institutions, and corporate partners to adopt and support TB patients.'
            ],
            keyHighlights: [
              'Monthly nutritional basket support for adopted patients.',
              'Diagnostic and vocational support during treatment.'
            ]
          });
        }
      }
    },
    {
      id: 'ntep',
      icon: Building2,
      iconBg: 'bg-blue-600 text-white',
      titleColor: 'text-blue-700',
      title: ntepCard.title,
      btnColor: 'bg-blue-600 hover:bg-blue-700 text-white',
      btnText: ntepCard.btnText,
      graphic: (
        <div className="w-full h-28 rounded-[12px] bg-slate-900 border border-blue-200/60 overflow-hidden relative shadow-xs">
          {ntepCard.imageUrl && !ntepImageError ? (
            <img
              src={ntepCard.imageUrl}
              onError={() => setNtepImageError(true)}
              alt="NTEP Official Banner"
              className="w-full h-full object-cover rounded-[12px] hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full rounded-[12px] bg-gradient-to-br from-blue-700 to-blue-950 p-2 flex flex-col items-center justify-center text-white text-center">
              <p className="text-[10px] font-bold tracking-wider text-blue-200 uppercase">NTEP PROGRAMME</p>
            </div>
          )}
        </div>
      ),
      description: ntepCard.description,
      onClick: () => {
        if (ntepCard.btnLink) {
          window.open(ntepCard.btnLink, '_blank');
        } else {
          onOpenArticle({
            title: ntepCard.title,
            category: ntepCard.category,
            readTime: '4 min',
            content: [
              ntepCard.description,
              "The National TB Elimination Programme (NTEP) provides free high-quality rapid molecular testing (CBNAAT/Truenat) and daily fixed-dose combination anti-TB regimens across India."
            ],
            keyHighlights: [
              'Free rapid molecular diagnostics (CBNAAT / Truenat).',
              'Ni-kshay Poshan Yojana monthly financial support.'
            ]
          });
        }
      }
    }
  ];

  const quickLinks = [
    { id: 'intro', label: 'TB Introduction', icon: BookOpen },
    { id: 'resources', label: 'Learning Resources', icon: GraduationCap },
    { id: 'forum', label: 'Discussion Forum', icon: MessageSquare },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  return (
    <div className="space-y-6">
      {/* Section Header with Centered Horizontal Lines */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-3">
          <span className="h-0.5 bg-gradient-to-r from-transparent to-[#0F6FFF] w-12 sm:w-20 rounded-full" />
          <h2 className="text-base sm:text-lg font-black text-[#1E293B] uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0F6FFF] animate-pulse" />
            <span>TB IN INDIA – 2026</span>
          </h2>
          <span className="h-0.5 bg-gradient-to-l from-transparent to-[#0F6FFF] w-12 sm:w-20 rounded-full" />
        </div>
        <p className="text-[#64748B] text-xs font-medium">
          Explore current statistics, government initiatives and awareness programs
        </p>
      </div>

      {/* Main Grid: 4 Left Cards + Right 2 Cards Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left 4 Cards (Span 9 columns on desktop) */}
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {leftCards.map((card) => {
            const IconComp = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white border border-[#D8E9FF] rounded-2xl p-4 shadow-[0_10px_30px_rgba(15,111,255,0.06)] hover:shadow-[0_20px_40px_rgba(15,111,255,0.12)] hover:border-[#0F6FFF]/35 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-3 group"
              >
                {/* Header Icon + Title */}
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl bg-[#F2F8FD] text-[#0F6FFF] border border-[#D8E9FF] shrink-0`}>
                    <IconComp size={16} />
                  </div>
                  <h3 className={`text-xs font-extrabold uppercase leading-tight text-[#1E293B]`}>
                    {card.title}
                  </h3>
                </div>

                {/* Banner Image / Graphic */}
                {card.graphic}

                {/* Description */}
                <p className="text-xs text-[#64748B] leading-relaxed font-medium line-clamp-3">
                  {card.description}
                </p>

                {/* Pill Action Button */}
                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    card.onClick();
                  }}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-[#0F6FFF] to-[#2563EB] hover:from-[#0D62E0] hover:to-[#1D4ED8] text-white font-bold rounded-xl text-[11px] uppercase tracking-wider transition-all text-center shadow-md shadow-blue-500/20 hover:scale-[1.02] cursor-pointer"
                >
                  {card.btnText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Column: TB AWARENESS - 2026 + QUICK LINKS (Span 3 columns on desktop) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Right: TB AWARENESS - 2026 Card */}
          <div className="bg-white border border-[#D8E9FF] rounded-2xl p-4 shadow-[0_10px_30px_rgba(15,111,255,0.06)] hover:shadow-[0_20px_40px_rgba(15,111,255,0.12)] hover:border-[#0F6FFF]/35 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-3 group">
            <h3 className="text-xs font-extrabold uppercase text-[#0F6FFF] text-center tracking-wider flex items-center justify-center gap-1.5">
              <span>✨</span>
              <span>{awarenessCardState.title}</span>
            </h3>

            {/* Banner Image */}
            <div className="w-full h-32 rounded-xl bg-slate-900 border border-[#D8E9FF] overflow-hidden relative shadow-xs">
              {awarenessCardState.imageUrl && !awarenessImageError ? (
                <img
                  src={awarenessCardState.imageUrl}
                  onError={() => setAwarenessImageError(true)}
                  alt="TB Awareness Official Banner"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#0F6FFF] to-[#2563EB] p-2 flex flex-col items-center justify-center text-white text-center">
                  <p className="text-[10px] font-bold text-blue-200">WORLD TB DAY 2026</p>
                  <h4 className="text-sm font-black text-white my-0.5">Yes! We Can End TB</h4>
                </div>
              )}
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed font-medium text-center line-clamp-3">
              {awarenessCardState.description}
            </p>

            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                if (awarenessCardState.btnLink) {
                  window.open(awarenessCardState.btnLink, '_blank');
                } else {
                  onOpenArticle({
                    title: awarenessCardState.title,
                    category: awarenessCardState.category,
                    readTime: '3 min',
                    content: [
                      awarenessCardState.description,
                      'World TB Day is commemorated each year to raise public awareness about the health, social, and economic consequences of tuberculosis.'
                    ],
                    keyHighlights: [
                      'Public awareness campaigns across all local blocks.',
                      'Youth and medical student involvement in screening campaigns.'
                    ]
                  });
                }
              }}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-[#0F6FFF] to-[#2563EB] hover:from-[#0D62E0] hover:to-[#1D4ED8] text-white font-bold rounded-xl text-[11px] uppercase tracking-wider transition-all text-center shadow-md shadow-blue-500/20 hover:scale-[1.02] cursor-pointer"
            >
              {awarenessCardState.btnText}
            </button>
          </div>

          {/* Bottom Right: QUICK LINKS Card */}
          <div className="bg-white border border-[#D8E9FF] rounded-2xl p-4 shadow-[0_10px_30px_rgba(15,111,255,0.06)] space-y-3">
            <h3 className="text-xs font-extrabold uppercase text-[#1E293B] tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F6FFF]" />
              <span>QUICK LINKS</span>
            </h3>

            <div className="space-y-1.5">
              {quickLinks.map((link) => {
                const IconComp = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      soundService.playClick();
                      if (onOpenQuickLink) onOpenQuickLink(link.id);
                    }}
                    className="w-full p-2.5 bg-[#F2F8FD] hover:bg-[#EBF3FE] border border-[#D8E9FF] rounded-xl text-left font-bold text-xs text-[#0F6FFF] flex items-center gap-2.5 transition-all group cursor-pointer"
                  >
                    <IconComp size={15} className="text-[#0F6FFF] group-hover:scale-110 transition-transform" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
