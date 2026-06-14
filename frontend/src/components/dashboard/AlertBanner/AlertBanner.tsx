type Props = {
  level: string;
  message: string;
};

export default function AlertBanner({ level, message }: Props) {
  if (level === 'low') return null;

  const color =
    level === 'critical' ? 'bg-red-600' : 'bg-yellow-600';

  return (
    <div className={`${color} p-4 rounded-xl text-white font-medium`}>
      ⚠ {message}
    </div>
  );
}
