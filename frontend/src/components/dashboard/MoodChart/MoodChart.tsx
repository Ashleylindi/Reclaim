type Mood = {
  date: string;
  mood: string;
};

type Props = {
  moods: Mood[];
};

export default function MoodChart({ moods }: Props) {
  return (
    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
      <h2 className="text-lg font-semibold mb-3">Mood Trend</h2>

      <div className="space-y-2">
        {moods.slice(-5).map((m, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-slate-400">{m.date}</span>
            <span className="text-white">{m.mood}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
