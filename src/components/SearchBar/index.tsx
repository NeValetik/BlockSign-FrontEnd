'use client';

import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Input } from "../Form/Input";

import useDebounce from "@/hooks/useDebounce";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  href: string;
}

const SearchBar: FC<SearchBarProps> = ( props ) => {
  const { className = '', href, ...rest } = props;
  const [ search, setSearch ] = useState('');
  const [ isFocused, setIsFocused ] = useState(false);
  const debouncedSearch = useDebounce( search, 300 );

  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  useEffect(()=> {
    if (!debouncedSearch && !isFocused) {
      return;
    }
    const currentSearch = new URLSearchParams(window.location.search);
    currentSearch.delete('search');
    if (isFocused && !debouncedSearch) {
      router.push(`${href}?${currentSearch.toString()}`);
      return;
    }
    router.push(`${href}?search=${debouncedSearch}&${currentSearch.toString()}`);
  }, [debouncedSearch, href, router, isFocused]);

  return (
    <div className={ className }>
      <Input 
        { ...rest } 
        value={search} 
        onChange={handleSearchChange} 
        onFocus={()=>setIsFocused(true)} 
        onBlur={()=>setIsFocused(false)}
      />
    </div>
  );
};

export default SearchBar;