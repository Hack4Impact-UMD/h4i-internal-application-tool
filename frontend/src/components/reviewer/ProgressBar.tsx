type Props = {
  finalized: number,
  total: number
}

const ProgressBar: React.FC<Props> = ({ finalized, total }: Props) => {
  const percentage = (finalized / total) * 100;

  const progressStyle = {
    width: `${percentage}%`,
    background: 'linear-gradient(to right, #C2E0FB, #C6EBF7, #CBF9F3)',
  };

  return (
    <div className="w-[56%] bg-[#e5e7eb] rounded-full h-3 ml-auto mr-[0.75rem] mb-[] shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
      <div className="rounded-full h-full" style={progressStyle}></div>
    </div>
  );
};

export default ProgressBar;
