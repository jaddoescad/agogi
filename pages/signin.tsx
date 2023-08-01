import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Logo from 'components/icons/Logo';
import { getURL } from '@/utils/helpers';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import {Box,Text, Button}  from '@chakra-ui/react';
import Spinner from '@/components/ui/Spinner';

const SignIn = () => {
  const router = useRouter();
  const user = useUser();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (user) {
      router.replace('/account');
    }
  }, [user]);

  if (!user)
    return (
      <Box pt={"10"} w="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
         <Logo width="64px" height="64px" />
        <Auth
            supabaseClient={supabaseClient}
            providers={['google']}
            redirectTo={getURL()}
            magicLink={false}
            appearance={{
              theme: ThemeSupa,
              // style: {
              //   button: { background: 'black', color: 'white',borderColor:'green.500', borderRadius: '8px' ,borderWidth:'2px'},
              //   container:{minWidth:'280px'},
              //   input : { borderRadius: '8px'}
              // },
              // variables: {
              //   default: {
              //     colors: {
              //       brand: 'green.500',
              //       brandAccent: 'lightgreen'
              //     }
              //   }
              // }
            }}
          />
       </Box>
    );

  return (
    <div className="m-6">
      <Spinner />
    </div>
  );
};

export default SignIn;
