/**
 * 团队成员卡片组件
 *
 * @param {{ member: { id: number, name: string, role: string, bio: string, avatarUrl: string } }} props
 */

function TeamCard({ member }) {
  return (
    <div
      className="group bg-white rounded-2xl p-6 text-center
        shadow-sm hover:shadow-lg transition-all duration-300
        hover:-translate-y-1"
    >
      {/* 头像 */}
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 overflow-hidden">
        <img
          src={member.avatarUrl}
          alt={member.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* 姓名 */}
      <h3 className="text-lg font-semibold text-text-main mb-1">
        {member.name}
      </h3>

      {/* 职责标签 */}
      <span className="inline-block px-3 py-0.5 bg-route-west/10 text-route-west text-xs rounded-full mb-3">
        {member.role}
      </span>

      {/* 简介 */}
      <p className="text-sm text-text-secondary leading-relaxed">
        {member.bio}
      </p>
    </div>
  );
}

export default TeamCard;
