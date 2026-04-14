// TODO: [Firebase] Replace mock data with Firestore collection query

export const events = [
  {
    id: 'e1',
    title: '2026 서울 피클볼 오픈 토너먼트',
    location: '강남 피클볼 아레나',
    district: '강남구',
    date: '2026-05-10',
    type: 'tournament',
    participants: 24,
    maxParticipants: 32,
    fee: 50000,
    description: '서울 최대 규모의 피클볼 토너먼트. 남녀 단식, 복식, 혼합 복식 부문 운영.',
    organizer: '서울 피클볼 협회'
  },
  {
    id: 'e2',
    title: '피클볼 초보자 클리닉',
    location: '마포 스포츠센터 피클볼',
    district: '마포구',
    date: '2026-04-25',
    type: 'clinic',
    participants: 8,
    maxParticipants: 12,
    fee: 30000,
    description: '피클볼을 처음 접하는 분들을 위한 전문 코치 클리닉. 기초 스트로크부터 서브까지.',
    organizer: '마포 스포츠센터'
  },
  {
    id: 'e3',
    title: '한강 소셜 피클볼 모임',
    location: '서초 한강 피클볼 클럽',
    district: '서초구',
    date: '2026-04-27',
    type: 'social',
    participants: 15,
    maxParticipants: 20,
    fee: 10000,
    description: '주말 오후 한강 뷰와 함께하는 캐주얼 피클볼 모임. 실력 무관 누구나 환영!',
    organizer: '한강 피클볼 클럽'
  },
  {
    id: 'e4',
    title: '직장인 피클볼 리그 시즌 2',
    location: '성동 왕십리 피클볼장',
    district: '성동구',
    date: '2026-05-03',
    type: 'tournament',
    participants: 16,
    maxParticipants: 24,
    fee: 40000,
    description: '매주 토요일 저녁 진행되는 직장인 리그. 6주 시즌제 운영, 팀 단위 참가.',
    organizer: '왕십리 피클볼 클럽'
  },
  {
    id: 'e5',
    title: '여성 피클볼 입문 프로그램',
    location: '송파 올림픽 피클볼장',
    district: '송파구',
    date: '2026-05-01',
    type: 'clinic',
    participants: 6,
    maxParticipants: 10,
    fee: 25000,
    description: '여성 전용 피클볼 입문 프로그램. 여성 코치가 친절하게 지도합니다.',
    organizer: '올림픽 스포츠 센터'
  },
  {
    id: 'e6',
    title: '강서 지역 친선 피클볼 대회',
    location: '강서 발산 피클볼 센터',
    district: '강서구',
    date: '2026-05-17',
    type: 'tournament',
    participants: 20,
    maxParticipants: 32,
    fee: 35000,
    description: '강서구 주민 대상 친선 피클볼 대회. 초급, 중급, 고급 부문 분리 진행.',
    organizer: '강서구 체육회'
  }
]

export const communityGroups = [
  {
    id: 'g1',
    name: '서울 피클볼 클럽',
    description: '서울 전 지역 피클볼 애호가 모임. 매주 다른 코트에서 만납니다.',
    members: 234,
    district: '서울 전체',
    level: '전체',
    meetingFrequency: '매주 주말'
  },
  {
    id: 'g2',
    name: '강남 피클볼 패밀리',
    description: '강남구 피클볼 동호회. 초중급 위주, 가족 단위 환영.',
    members: 87,
    district: '강남구',
    level: '초중급',
    meetingFrequency: '매주 토요일'
  },
  {
    id: 'g3',
    name: '직장인 피클볼 연합',
    description: '바쁜 직장인을 위한 저녁 피클볼 모임. 평일 저녁 운영.',
    members: 156,
    district: '마포구/용산구',
    level: '전체',
    meetingFrequency: '평일 저녁'
  },
  {
    id: 'g4',
    name: '시니어 피클볼 모임',
    description: '50대 이상을 위한 건강한 피클볼 모임. 건강과 친목을 함께.',
    members: 45,
    district: '노원구',
    level: '초급',
    meetingFrequency: '매주 화, 목'
  }
]
