import './ButtonPill.scss';

interface XpmButtonV2Props {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export function ButtonPill({ text, onClick }: XpmButtonV2Props) {
  return (
    <button className="ButtonPill" onClick={onClick}>
      {text}
    </button>
  );
}
