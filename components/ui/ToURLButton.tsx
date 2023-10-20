export type Props = {
  className: string;
  text: string;
  url: string;
  newTab?: boolean;
};

export default function ToURLButton(props: Props) {
  const { className, text, url, newTab = true, ...others } = props;

  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        window.open(url ?? '', newTab ? '_blank' : '_self');
      }}
      {...others}
    >
      {text ?? ''}
    </button>
  );
}
