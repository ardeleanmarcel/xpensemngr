import './XpmButtonV2.scss';

interface XpmButtonV2Props {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export function XpmButtonV2({ text, onClick }: XpmButtonV2Props) {
  return (
    <button className="XpmButtonV2" onClick={onClick}>
      {text}
    </button>
  );
}
