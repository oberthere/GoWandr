interface OptionCardProps {
  icon: string;
  title: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}

function OptionCard({ icon, title, desc, selected, onClick }: OptionCardProps) {
  return (
    <div
      role='button'
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow
        ${selected ? 'border-black shadow-lg' : 'border-gray-200'}`}
    >
      <div className='text-4xl'>{icon}</div>
      <h2 className='font-bold text-lg mt-2'>{title}</h2>
      <p className='text-sm text-gray-500'>{desc}</p>
    </div>
  );
}

export default OptionCard;
