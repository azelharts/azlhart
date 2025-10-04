interface HeaderProps {
  headline: string;
  number: number;
  subText: string;
}

const Header = ({ headline, number, subText }: HeaderProps) => {
  return (
    <div className="custom-grid tablet:text-sm border-b border-white/25 pb-3 text-xs font-light">
      <h2 className="col-span-2 col-start-1">
        &quot;{headline.toUpperCase()}&quot;
      </h2>
      <p className="tablet:block desktop:col-start-5 col-start-4 hidden text-white/50">
        &#91;AZL® — {number}&#93;
      </p>
      <p className="tablet:col-end-9 desktop:col-end-13 col-span-2 col-end-5 justify-self-end text-white/50">
        {subText.toUpperCase()}
      </p>
    </div>
  );
};

export default Header;
