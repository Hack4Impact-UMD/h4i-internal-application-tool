type Props = {
  finalized: number,
  total: number
}

const ProgressBar: React.FC<Props> = ({ finalized, total }: Props) => {
  const percentage = (finalized / total) * 100;

  const containerStyle = {
    width: '56%',
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    height: '0.5rem',
    margin: '1rem 0',
    marginLeft: 'auto',
    marginRight: '10px',
    marginTop: '-0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const progressStyle = {
    width: `${percentage}%`,
    background: 'linear-gradient(to right, #C2E0FB, #C6EBF7, #CBF9F3)',
    borderRadius: '9999px',
    height: '100%',
  };

  return (
    <div style={containerStyle}>
      <div style={progressStyle}></div>
    </div>
  );
};

export default ProgressBar;
