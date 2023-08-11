// 'use client';

// import {
//   searchQuizzes,
//   paginateSearchQuizzes
// } from '../../utils/supabase-client';
// import { QuizCard } from 'components/QuizCards/QuizCard';
// import Head from 'next/head';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import {
//   Box,
//   Heading,
//   Button,
//   Flex,
//   Image,
//   useColorModeValue,
//   Text,
//   VStack
// } from '@chakra-ui/react';
// import va from '@vercel/analytics';

// type Quiz = { id: string; title: string; };

// const Search: React.FC = () => {
//   const [searchResults, setSearchResults] = useState<Quiz[]>([]);
//   const [page, setPage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const router = useRouter();
//   const { searchTerm } = router.query as { searchTerm: string };

//   const initLoad = async () => {
//     setLoading(true);

//     if (searchTerm === undefined || searchTerm === null) {
//       return;
//     }

//     const initialQuizzes = await searchQuizzes(searchTerm);
//     if (initialQuizzes.length === 0) {
//       setHasMore(false);
//     } else {
//       setSearchResults(initialQuizzes);
//       setPage(2);
//     }
//     setLoading(false);
//   };

//   const loadMore = async () => {
//     setLoading(true);

//     if (searchTerm === undefined || searchTerm === null) {
//       return;
//     }

//     const newQuizzes = await paginateSearchQuizzes(searchTerm, page);

//     if (newQuizzes.length === 0) {
//       setHasMore(false);
//     } else {
//       setSearchResults([...searchResults, ...newQuizzes]);
//       setPage(page + 1);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     initLoad();
//   }, []);

//   //track search

//   useEffect(() => {
//     if (searchTerm === undefined || searchTerm === null) {
//       return;
//     }

//     va.track('search');
//   }, [searchTerm]);

//   return (
//     <Box minHeight="100vh" pb="10">
//       <VStack alignItems="center">
//         <Head>
//           <title>Search Quizzes</title>
//         </Head>

//         <Flex
//           alignItems="center"
//           justifyContent="center"
//           width={['full', 'full', 'full', 'xl']}
//         >
//           <Box
//             mt="10"
//             display="flex"
//             maxW="6xl"
//             flexWrap="wrap"
//             justifyContent="center"
//             fontWeight="semibold"
//           >
//             {searchResults.map((quiz) => (
//               <QuizCard quiz={quiz} />
//             ))}
//             {hasMore && !loading && (
//               <Flex w="full" justifyContent="center">
//                 <Button mt={4} colorScheme="blue" onClick={loadMore}>
//                   Load More
//                 </Button>
//               </Flex>
//             )}
//           </Box>
//         </Flex>
//       </VStack>
//     </Box>
//   );
// };

// export default Search;
