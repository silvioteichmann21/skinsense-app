/** Report detail copy keyed by concern id — merged into `report.detail` in locale catalogs. */
export const reportDetailEn = {
  hydration: {
    whatIs:
      'Skin dehydration is a condition where your skin lacks water. Unlike dry skin, which lacks natural oils, dehydration can affect any skin type and often results in a dull complexion and fine lines.',
    yourResult:
      'Based on your latest high-precision scan, mild dehydration was detected around your cheeks and orbital bone. Your skin\'s moisture retention levels are slightly below the optimal clinical range for your age group.',
    highlightPhrase: 'cheeks and orbital bone',
    libraryTopic: 'dehydration',
    causes: {
      environment: 'Environment',
      diet: 'Diet & Intake',
      wrongProducts: 'Wrong Products',
      genetics: 'Genetics',
    },
    improvements: {
      step1: {
        title: 'Increase cellular hydration',
        body: 'Drink at least 2 liters of water daily and include water-rich foods like cucumber or watermelon in your diet.',
      },
      step2: {
        title: 'Use powerful humectants',
        body: 'Apply serums containing Hyaluronic Acid or Glycerin to damp skin to trap moisture effectively.',
      },
      step3: {
        title: 'Seal with an occlusive',
        body: 'Finish your routine with a cream or oil to create a physical barrier that prevents trans-epidermal water loss.',
      },
    },
  },
  acne: {
    whatIs:
      'Acne develops when pores become clogged with oil and dead skin cells. Mild breakouts often respond to consistent cleansing and targeted actives without aggressive scrubbing.',
    yourResult:
      'Your scan shows low-grade congestion primarily along the chin and jawline. Inflammation levels are mild, suggesting early intervention with a balanced routine should be effective.',
    highlightPhrase: 'chin and jawline',
    libraryTopic: 'acne',
    causes: {
      hormones: 'Hormones',
      comedogenic: 'Comedogenic products',
      stress: 'Stress',
      sleep: 'Poor sleep',
    },
    improvements: {
      step1: {
        title: 'Cleanse gently twice daily',
        body: 'Use a non-stripping cleanser morning and night to remove buildup without damaging your barrier.',
      },
      step2: {
        title: 'Introduce salicylic acid gradually',
        body: 'Start with a 0.5–2% BHA treatment 2–3 nights per week and increase only if your skin tolerates it.',
      },
      step3: {
        title: 'Avoid picking and over-exfoliating',
        body: 'Physical irritation can worsen post-inflammatory marks and prolong healing time.',
      },
    },
  },
  texture: {
    whatIs:
      'Skin texture describes how smooth and even the surface appears. Uneven texture often reflects a mix of dead-cell buildup, sun exposure, and inconsistent hydration.',
    yourResult:
      'Fine textural irregularities were noted on the forehead and nose. Overall smoothness is good, with room to improve through gentle exfoliation and daily SPF.',
    highlightPhrase: 'forehead and nose',
    libraryTopic: 'skin texture',
    causes: {
      sun: 'Sun exposure',
      dehydration: 'Dehydration',
      buildup: 'Cell buildup',
      aging: 'Aging',
    },
    improvements: {
      step1: {
        title: 'Exfoliate mildly 1–2× weekly',
        body: 'Choose a low-strength AHA or PHA to refine surface texture without compromising your barrier.',
      },
      step2: {
        title: 'Keep SPF in your morning routine',
        body: 'UV protection prevents further unevenness and supports long-term clarity.',
      },
      step3: {
        title: 'Moisturize on damp skin',
        body: 'Layering hydration immediately after cleansing helps plump the surface and soften the look of pores.',
      },
    },
  },
  barrier: {
    whatIs:
      'Your skin barrier is the outer layer that locks in moisture and shields against irritants. A resilient barrier keeps skin comfortable, balanced, and less reactive.',
    yourResult:
      'Your barrier indices are strong across all facial zones. Continue your current gentle approach to maintain stability and support long-term resilience.',
    libraryTopic: 'skin barrier',
    causes: {
      harshActives: 'Harsh actives',
      climate: 'Climate stress',
      overCleansing: 'Over-cleansing',
      overload: 'Product overload',
    },
    improvements: {
      step1: {
        title: 'Maintain a gentle core routine',
        body: 'Stick with mild cleansers and avoid stacking multiple strong actives on the same night.',
      },
      step2: {
        title: 'Prioritize barrier lipids',
        body: 'Look for ceramides, cholesterol, and fatty acids in your moisturizer to reinforce the lipid matrix.',
      },
      step3: {
        title: 'Patch-test new products',
        body: 'Introduce one new item at a time so you can spot irritation before it affects your whole routine.',
      },
    },
  },
} as const;

export const reportDetailKo = {
  hydration: {
    whatIs:
      '피부 탈수는 피부에 수분이 부족한 상태를 말합니다. 천연 유분이 부족한 건성 피부와 달리, 탈수는 모든 피부 타입에 영향을 줄 수 있으며 흔히 칙칙한 안색과 잔주름으로 나타납니다.',
    yourResult:
      '최근 고정밀 스캔 결과, 볼과 눈가 주변에서 가벼운 탈수가 감지되었습니다. 수분 유지 수치가 연령대별 최적 임상 범위보다 약간 낮습니다.',
    highlightPhrase: '볼과 눈가',
    libraryTopic: '탈수',
    causes: {
      environment: '환경',
      diet: '식습관·수분 섭취',
      wrongProducts: '부적합한 제품',
      genetics: '유전',
    },
    improvements: {
      step1: {
        title: '세포 수분 공급 늘리기',
        body: '하루 2리터 이상 물을 마시고 오이·수박처럼 수분이 풍부한 음식을 섭취하세요.',
      },
      step2: {
        title: '강력한 보습제 사용',
        body: '히알루론산·글리세린이 들어간 세럼을 촉촉한 피부에 발라 수분을 가두세요.',
      },
      step3: {
        title: '폐쇄제로 마무리',
        body: '크림이나 오일로 마무리해 경피 수분 손실을 막는 물리적 장벽을 만드세요.',
      },
    },
  },
  acne: {
    whatIs:
      '여드름은 모공이 유분과 각질로 막힐 때 생깁니다. 가벼운 트러블은 자극적인 스크럽 없이 꾸준한 클렌징과 타깃 액티브로 개선되는 경우가 많습니다.',
    yourResult:
      '스캔 결과 턱과 턱선을 중심으로 가벼운 모공 막힘이 보입니다. 염증 수준은 낮아, 균형 잡힌 루틴으로 조기 관리하면 효과적일 수 있습니다.',
    highlightPhrase: '턱과 턱선',
    libraryTopic: '여드름',
    causes: {
      hormones: '호르몬',
      comedogenic: '코메도제닉 제품',
      stress: '스트레스',
      sleep: '수면 부족',
    },
    improvements: {
      step1: {
        title: '하루 두 번 순한 클렌징',
        body: '아침·저녁 비자극 클렌저로 각질을 제거하되 장벽은 지키세요.',
      },
      step2: {
        title: '살리실산을 점진적으로 도입',
        body: '0.5–2% BHA를 주 2–3회부터 시작하고, 피부가 견디면 빈도를 늘리세요.',
      },
      step3: {
        title: '짜기·과도한 각질 제거 피하기',
        body: '물리적 자극은 염증 후 색소침착을 악화시키고 회복을 지연시킬 수 있습니다.',
      },
    },
  },
  texture: {
    whatIs:
      '피부 결은 표면이 얼마나 매끄럽고 균일한지를 말합니다. 결 불균형은 각질 축적, 자외선, 수분 불균형이 겹칠 때 흔히 나타납니다.',
    yourResult:
      '이마와 코에서 미세한 결 불균형이 관찰되었습니다. 전반적 매끈함은 양호하며, 순한 각질 제거와 매일 SPF로 개선 여지가 있습니다.',
    highlightPhrase: '이마와 코',
    libraryTopic: '피부 결',
    causes: {
      sun: '자외선 노출',
      dehydration: '탈수',
      buildup: '각질 축적',
      aging: '노화',
    },
    improvements: {
      step1: {
        title: '주 1–2회 순한 각질 제거',
        body: '저농도 AHA·PHA로 표면을 정돈하되 장벽은 해치지 마세요.',
      },
      step2: {
        title: '아침 루틴에 SPF 유지',
        body: '자외선 차단은 추가 불균형을 막고 장기적으로 맑은 피부를 돕습니다.',
      },
      step3: {
        title: '촉촉한 피부에 보습',
        body: '클렌징 직후 수분을 겹쳐 바르면 표면이 탄탄해지고 모공이 덜 도드라져 보일 수 있습니다.',
      },
    },
  },
  barrier: {
    whatIs:
      '피부 장벽은 수분을 가두고 자극을 막는 최외층입니다. 탄탄한 장벽은 피부를 편안하고 균형 있게, 덜 민감하게 유지합니다.',
    yourResult:
      '모든 얼굴 부위에서 장벽 지표가 양호합니다. 현재의 순한 케어를 유지해 안정성과 장기 회복력을 지키세요.',
    libraryTopic: '피부 장벽',
    causes: {
      harshActives: '강한 액티브',
      climate: '기후 스트레스',
      overCleansing: '과도한 클렌징',
      overload: '제품 과다',
    },
    improvements: {
      step1: {
        title: '순한 기본 루틴 유지',
        body: '순한 클렌저를 쓰고, 같은 밤에 여러 강한 액티브를 겹치지 마세요.',
      },
      step2: {
        title: '장벽 지질 우선',
        body: '세라마이드·콜레스테롤·지방산이 들어간 보습제로 지질막을 보강하세요.',
      },
      step3: {
        title: '신제품 패치 테스트',
        body: '한 번에 하나씩 도입해 전체 루틴에 영향을 주기 전에 자극을 확인하세요.',
      },
    },
  },
} as const;

export const concernInsightEn = {
  hydration: {
    mildCheeks: 'Mild dehydration detected around cheeks.',
    cheekDrierThanTzone: 'Cheek zones look drier than your T-zone — extra hydration may help.',
  },
  acne: {
    tzoneOilBreakouts: 'T-zone oiliness may be contributing to breakouts.',
  },
  texture: {
    unevenExfolSpf: 'Uneven texture detected — gentle exfoliation and SPF can help over time.',
  },
  barrier: {
    performingWell: 'Your moisture barrier is performing well.',
  },
} as const;

export const concernInsightKo = {
  hydration: {
    mildCheeks: '볼 주변에 가벼운 탈수가 감지되었습니다.',
    cheekDrierThanTzone: '볼이 T존보다 건조해 보입니다 — 수분 케어를 늘려보세요.',
  },
  acne: {
    tzoneOilBreakouts: 'T존 유분이 트러블에 영향을 줄 수 있습니다.',
  },
  texture: {
    unevenExfolSpf: '결 불균형이 감지되었습니다 — 순한 각질 제거와 SPF가 도움이 됩니다.',
  },
  barrier: {
    performingWell: '수분 장벽이 잘 유지되고 있습니다.',
  },
} as const;
