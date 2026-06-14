type Props = {
  summary: string;
  encouragement?: string;
};

export default function AIInsightCard({ summary, encouragement }: Props) {
  return (
    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
      <h2 className="text-lg font-semibold mb-2">AI Insight</h2>

      <p className="text-slate-300 whitespace-pre-wrap">
        {summary}
      </p>

      {encouragement && (
        <p className="mt-3 text-green-400 font-medium">
          {encouragement}
        </p>
      )}
    </div>
  );
}
