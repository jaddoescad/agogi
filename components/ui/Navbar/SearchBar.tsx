import { Input, Box } from "@chakra-ui/react";
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (searchTerm.trim() === '') {
      return;
    }

    router.push(`/search/${searchTerm}`);
  };

  return (
    <Box as="form" display="flex" justifyContent="center" alignItems="center"
    w={{base:'100%', md:'70%'}}
    
    
    onSubmit={handleSearch}>
      <Input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        variant="outline"
        focusBorderColor="purple.500"
        borderRadius="full"
        px={3}
        py={2}
      />
    </Box>
  );
}
