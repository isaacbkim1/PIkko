import { useState } from 'react'
import { events, communityGroups } from '../../data/events'
import Layout from '../../components/Layout/Layout'
import Badge from '../../components/UI/Badge'
import './CommunityScreen.css'

// TODO: [Backend API] GET /api/community/events, /api/community/groups, /api/community/programs

const PROGRAMS = [
  {
    id: 'p1',
    title: '초급 피클볼 클리닉',
    coach: '박지훈 코치',
    schedule: '매주 토요일 10:00',
    location: '강남 피클볼 아레나',
    price: 35000,
    spots: 4,
  },
  {
    id: 'p2',
    title: '중급 드릴 트레이닝',
    coach: '이수연 코치',
    schedule: '매주 수요일 19:00',
    location: '마포 스포츠센터 피클볼',
    price: 40000,
    spots: 2,
  },
  {
    id: 'p3',
    title: '주말 오픈 플레이',
    coach: '운영팀',
    schedule: '토/일 08:00~12:00',
    location: '송파 올림픽 피클볼장',
    price: 15000,
    spots: 8,
  },
]

const EVENT_TYPE_META = {
  tournament: { label: '토너먼트', variant: 'tournament' },
  clinic:     { label: '클리닉',   variant: 'clinic'     },
  social:     { label: '소셜',     variant: 'social'     },
}

// ── Sub-components ────────────────────────────────────────────────────────────

function GroupCard({ group, joined, onToggle }) {
  return (
    <div className="community-group-card">
      <div className="community-group-emoji">🏓</div>
      <div className="community-group-info">
        <h3 className="community-group-name">{group.name}</h3>
        <p className="community-group-desc">{group.description}</p>
        <div className="community-group-meta">
          <span className="community-group-district">{group.district}</span>
          <span className="community-group-members">👥 {group.members.toLocaleString()}명</span>
        </div>
      </div>
      <button
        className={`community-join-btn ${joined ? 'community-join-btn--joined' : ''}`}
        onClick={onToggle}
      >
        {joined ? '참여중' : '참여'}
      </button>
    </div>
  )
}

function ProgramCard({ prog }) {
  return (
    <div className="community-program-card">
      <div className="community-program-header">
        <h3 className="community-program-title">{prog.title}</h3>
        <span className="community-program-price">{prog.price.toLocaleString()}원</span>
      </div>
      <p className="community-program-detail">👤 {prog.coach}</p>
      <p className="community-program-detail">📅 {prog.schedule}</p>
      <p className="community-program-detail">📍 {prog.location}</p>
      <div className="community-program-footer">
        <span className="community-program-spots">잔여 {prog.spots}자리</span>
        <button className="community-program-register-btn">신청하기</button>
      </div>
    </div>
  )
}

function EventCard({ event, joined, onToggle }) {
  const meta = EVENT_TYPE_META[event.type] ?? EVENT_TYPE_META.social
  const pct  = Math.round((event.participants / event.maxParticipants) * 100)

  return (
    <div className="community-event-card">
      <div className="community-event-header">
        <Badge variant={meta.variant} size="sm">{meta.label}</Badge>
        {joined && (
          <span className="community-event-joined-badge">참가 완료 ✓</span>
        )}
      </div>
      <h3 className="community-event-title">{event.title}</h3>
      <p className="community-event-detail">📅 {event.date}</p>
      <p className="community-event-detail">📍 {event.location}</p>
      <div className="community-event-progress">
        <div className="community-progress-track">
          <div
            className="community-progress-fill"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <span className="community-progress-label">
          {event.participants}/{event.maxParticipants}명
        </span>
      </div>
      <div className="community-event-footer">
        <span className="community-event-fee">
          {event.fee === 0 ? '무료' : `${event.fee.toLocaleString()}원`}
        </span>
        <button
          className={`community-join-btn ${joined ? 'community-join-btn--joined' : ''}`}
          onClick={onToggle}
        >
          {joined ? '참가 취소' : '참가하기'}
        </button>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function CommunityScreen() {
  const [activeTab,    setActiveTab]    = useState('groups')
  const [joinedGroups, setJoinedGroups] = useState({})
  const [joinedEvents, setJoinedEvents] = useState({})

  const toggleGroup = (id) =>
    setJoinedGroups((prev) => ({ ...prev, [id]: !prev[id] }))
  const toggleEvent = (id) =>
    setJoinedEvents((prev) => ({ ...prev, [id]: !prev[id] }))

  const TABS = [
    { key: 'groups',   label: '그룹'     },
    { key: 'programs', label: '프로그램'  },
    { key: 'events',   label: '이벤트'   },
  ]

  return (
    <Layout title="커뮤니티">
      <div className="community-screen">

        {/* ── Tabs ── */}
        <div className="community-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`community-tab ${activeTab === t.key ? 'community-tab--active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Groups ── */}
        {activeTab === 'groups' && (
          <div className="community-tab-content">
            <p className="community-tab-desc">서울 피클볼 동호회에 참여해 보세요</p>
            {communityGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                joined={!!joinedGroups[group.id]}
                onToggle={() => toggleGroup(group.id)}
              />
            ))}
          </div>
        )}

        {/* ── Programs ── */}
        {activeTab === 'programs' && (
          <div className="community-tab-content">
            <p className="community-tab-desc">전문 코치와 함께하는 피클볼 프로그램</p>
            {PROGRAMS.map((prog) => (
              <ProgramCard key={prog.id} prog={prog} />
            ))}
          </div>
        )}

        {/* ── Events ── */}
        {activeTab === 'events' && (
          <div className="community-tab-content">
            <p className="community-tab-desc">다가오는 피클볼 이벤트에 참여하세요</p>
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                joined={!!joinedEvents[event.id]}
                onToggle={() => toggleEvent(event.id)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
