import { Dispatch, SetStateAction } from "react";

interface Props {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

export default function SearchBar({ search, setSearch }: Props) {
  return (
    <input
      type="text"
      placeholder="키워드를 검색하세요"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full p-4 mb-10 rounded-lg bg-purple-800 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow transition duration-200"
      style={{ minHeight: "56px" }}
    />
  );
}
