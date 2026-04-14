import { useState } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import { events, communityGroups as groups } from "../../data/events.js";
import "./CommunityScreen.css";

const programs = [
  { id: "p1", title: "초급 피클볼 클리닉", coach: "박지훈 코치", schedule: "매주 토요일 10:00", location: "강남 피클볼 센터", price: 35000, spots: 4 },
  { id: "p2", title: "중급 드릴 트레이닝", coach: "이수연 코치", schedule: "매주 수요일 19:00", location: "마포 스포츠 파크", price: 40000, spots: 2 },
  { id: "p3", title: "주말 오픈 플레이", coach: "운영팀", schedule: "토/일 08:00", location: "송파 실내 피클볼장", price: 15000, spots: 8 },
];

const typeColor = {
  tournament: { bg: "#FFF0EB", text: "#FF6B35", label: "토너먼트" },
  clinic: { bg: "#EFF6FF", text: "#3B82F6", label: "클리닉" },
  social: { bg: "#F0FDF4", text: "#10B981", label: "소셜" },
};

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState("groups");
  const [joinedGroups, setJoinedGroups] = useState({});
  const [joinedEvents, setJoinedEvents] = useState({});

  const toggleGroup = (id) => setJoinedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleEvent = (id) => setJoinedEvents((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <Layout title="커뮤니티">
      <div className="community-screen">
        {/* Tabs */}
        <div className="community-tabs">
          {[
            { key: "groups", label: "그룹" },
            { key: "programs", label: "프로그램" },
            { key: "events", label: "이벤트" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`community-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Groups */}
        {activeTab === "groups" && (
          <div className="tab-content">
            <p className="tab-description">서울 피클볼 동호회에 참여해 보세요</p>
            {groups.map((group) => (
              <div key={group.id} className="group-card">
                <div className="group-emoji">🏓</div>
                <div className="group-info">
                  <h3 className="group-name">{group.name}</h3>
                  <p className="group-description">{group.description}</p>
                  <div className="group-meta">
                    <span className="group-district-tag">{group.district}</span>
                    <span className="group-members">👥 {group.members.toLocaleString()}명</span>
                  </div>
                </div>
                <button
                  className={`join-btn ${joinedGroups[group.id] ? "joined" : ""}`}
                  onClick={() => toggleGroup(group.id)}
                >
                  {joinedGroups[group.id] ? "참여중" : "참여"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Programs */}
        {activeTab === "programs" && (
          <div className="tab-content">
            <p className="tab-description">전문 코치와 함께하는 피클볼 프로그램</p>
            {programs.map((prog) => (
              <div key={prog.id} className="program-card">
                <div className="program-header">
                  <h3 className="program-title">{prog.title}</h3>
                  <span className="program-price">{prog.price.toLocaleString()}원</span>
                </div>
                <p className="program-coach">👤 {prog.coach}</p>
                <p className="program-schedule">📅 {prog.schedule}</p>
                <p className="program-location">📍 {prog.location}</p>
                <div className="program-footer">
                  <span className="program-spots">잔여 {prog.spots}자리</span>
                  <button className="program-register-btn">신청하기</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Events */}
        {activeTab === "events" && (
          <div className="tab-content">
            <p className="tab-description">다가오는 피클볼 이벤트에 참여하세요</p>
            {events.map((event) => {
              const type = typeColor[event.type] || typeColor.social;
              const pct = Math.round((event.participants / event.maxParticipants) * 100);
              return (
                <div key={event.id} className="event-card">
                  <div className="event-header">
                    <span
                      className="event-type-badge"
                      style={{ background: type.bg, color: type.text }}
                    >
                      {type.label}
                    </span>
                    {joinedEvents[event.id] && (
                      <span className="event-joined-badge">참가 완료 ✓</span>
                    )}
                  </div>
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-meta">
                    <span>📅 {event.date}</span>
                    <span>📍 {event.location}</span>
                  </div>
                  <div className="event-participants">
                    <div className="participants-bar-bg">
                      <div
                        className="participants-bar-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="participants-text">
                      {event.participants}/{event.maxParticipants}명
                    </span>
                  </div>
                  <div className="event-footer">
                    <span className="event-fee">
                      {event.fee === 0 ? "무료" : `${event.fee.toLocaleString()}원`}
                    </span>
                    <button
                      className={`join-btn ${joinedEvents[event.id] ? "joined" : ""}`}
                      onClick={() => toggleEvent(event.id)}
                    >
                      {joinedEvents[event.id] ? "참가 취소" : "참가하기"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
