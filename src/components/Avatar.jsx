export default function Avatar({ name, color = '#2563eb', size = 8 }) {
  const initials = name
    ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '??';
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ background: color, fontSize: size * 1.5 }}
    >
      {initials}
    </div>
  );
}
