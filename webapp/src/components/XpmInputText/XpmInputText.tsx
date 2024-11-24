import './XpmInputText.scss';

interface XpmInputTextProps {
  value: string;
}

export function XpmInputText({
  value,
}: React.PropsWithChildren<XpmInputTextProps>) {
  return (
    <div className="XpmInputText">
      <input type="text" value={value} />
      <fieldset>
        <legend>Legend</legend>
      </fieldset>
    </div>
  );
}
