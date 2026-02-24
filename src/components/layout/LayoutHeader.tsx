import SearchBar from '../common/SearchBar';

interface LayoutHeaderProps {
    name: string;
    description: string;
    onSearch: (query: string) => void;
    query: string;
    clearSearch: () => void;
    children: React.ReactNode;
}

export default function LayoutHeader({
    name,
    description,
    query,
    onSearch,
    clearSearch,
    children,
}: LayoutHeaderProps) {
    return (
        <div className="md:flex items-center justify-between mb-6  ">
            <div>
                <h2 className="text-2xl font-semibold text-gray-900">{name}</h2>
                <p className="text-gray-600 mt-1">{description}</p>
            </div>
            <div className="flex items-center gap-2 mt-4">
                <SearchBar fetchFunction={onSearch} query={query} clearSearch={clearSearch} />
                {children}
            </div>
        </div>
    );
}
