import { useDebounce } from '@/src/hooks/useDebounce';
import { XIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Input } from '../ui/input';

const MINIMUM_QUERY_LENGTH = 1;

interface SearchBarProps {
    query: string;
    fetchFunction: (query: string) => void;
    clearSearch: () => void;
}

export default function SearchBar({ fetchFunction, query, clearSearch }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState(query);
    const debouncedTerm = useDebounce(searchTerm);

    const onSearch = useCallback(() => {
        fetchFunction(debouncedTerm);
    }, [debouncedTerm, fetchFunction]);

    useEffect(() => {
        onSearch();
    }, [onSearch]);

    const handleClearSearch = useCallback(() => {
        setSearchTerm('');
        clearSearch();
    }, [clearSearch]);

    return (
        <div className="relative">
            <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar"
            />
            <XIcon
                className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={handleClearSearch}
            />
        </div>
    );
}
