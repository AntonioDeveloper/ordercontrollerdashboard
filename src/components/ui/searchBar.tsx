interface SearchBarProps {
  placeholder: string;
}

export default function SearchBar({placeholder}: SearchBarProps) {
  return (
    <input className="w-full px-2 py-2 rounded-[8px] text-black" type="text" placeholder={placeholder} />
  )
}