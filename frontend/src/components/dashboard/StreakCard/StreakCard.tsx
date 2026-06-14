type Props = {
  daysSober: number;
};

export default function StreakCard({ daysSober }: Props) {
  return (
    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
      <h2 className="text-lg font-semibold mb-2">Streak</h2>

      <p className="text-3xl font-bold text-green-400">
        {daysSober} days
      </p>

      <p className="text-slate-400">
        Keep going — consistency builds recovery
      </p>
    </div>
  );
}
