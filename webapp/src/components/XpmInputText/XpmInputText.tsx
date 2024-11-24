import './XpmInputText.scss';

interface XpmInputTextProps {
  name: string;
  value: string;
}

export function XpmInputText({
  name,
  value,
}: React.PropsWithChildren<XpmInputTextProps>) {
  return (
    <div className="XpmInputText">
      <input type="text" value={value} />
      <fieldset>
        <legend>{name}</legend>
      </fieldset>
    </div>
  );
}
