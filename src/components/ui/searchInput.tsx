import { Command, Search } from 'lucide-react';

import { Input } from './input';

export function SearchInput() {
  return (
    <div className="relative w-full flex items-center bg-muted rounded-lg">
      <Search size={16} className="absolute left-3 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search page"
        className="w-full h-7 text-sm bg-transparent pl-10 pr-10 placeholder:text-muted-foreground focus:outline-none border-none"
      />

      <div className="absolute right-3 flex items-center space-x-1">
        <Command size={16} className="text-muted-foreground" />
        <div className="text-muted-foreground text-sm">/</div>
      </div>
    </div>
  );
}
