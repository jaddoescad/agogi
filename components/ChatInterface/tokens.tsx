// import { Suspense } from 'react'

// import { useState, useEffect } from 'react';

// type InternalProps = {
//   reader: ReadableStreamDefaultReader;
// }

// function RecursiveTokens({ reader }: InternalProps) {
//   const [text, setText] = useState<string | null>(null);

//   useEffect(() => {
//     let cancelled = false;
    
//     const readStream = async () => {
//       const { done, value } = await reader.read();
      
//       if (!cancelled) {
//         if (done) {
//           setText(null);
//         } else {
//           setText(new TextDecoder().decode(value));
//         }
//       }
//     };

//     readStream();

//     return () => {
//       cancelled = true;
//     };
//   }, [reader]);

//   if (text === null) {
//     return null;
//   }

//   return (
//     <>
//       {text}
//       <Suspense fallback={null}>
//         <RecursiveTokens reader={reader} />
//       </Suspense>
//     </>
//   );
// }
