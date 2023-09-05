import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import { Image } from '@chakra-ui/react';
import {
  Box,
  Container,
  Heading,
  Stack,
  useBreakpointValue,
  useColorModeValue
} from '@chakra-ui/react';
import * as React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { FieldErrorsImpl, useForm, UseFormRegister } from 'react-hook-form';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { uploadImage } from 'utils/storage';
import { getQuizInfo, publishQuiz } from 'utils/supabase-client';
import Navbar from 'components/ui/Navbar';
import { useGetQuizInfo } from 'hooks/useGetQuizInfo';
import { useUpdateQuizTitleMutation } from 'hooks/useUpdateQuizTitle';
import { useUpdateQuizImage } from 'hooks/useUpdateQuizImage';
import {default_unpublished_img} from 'utils/constants'

import { withPageAuth } from '@/utils/supabase-server';

const IndexPage = () => {
  const router = useRouter();
  const user = useUser();
  const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  // const [quizData, setQuizData] = React.useState(null);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const updateQuizTitle = useUpdateQuizTitleMutation();
  const updateQuizImage = useUpdateQuizImage();

  const titleFormSchema = Yup.object().shape({
    // // name
    title: Yup.string().required('Title is required')
  });

  const imageFormSchema = Yup.object().shape({
    // // name
    picture: Yup.mixed()
      .test('required', 'You need to provide a file', (value) => {
        return value && value.length;
      })
      .test('fileSize', 'The file is too large', (value, context) => {
        return value && value[0] && value[0].size <= 1000000;
      })
      .test('fileFormat', 'Unsupported file format', (value) => {
        return value && value[0] && supportedImageTypes.includes(value[0].type);
      })
  });

  const [previewImage, setPreviewImage] = React.useState(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const {
    handleSubmit: handleTitleSubmit,
    register: registerTitle,
    watch: watchTitle,
    trigger: triggerTitle,
    setValue: setTitleValue,
    formState: { errors: errorsTitle, isSubmitting: isSubmittingTitle }
  } = useForm<PublishFormValues>({
    mode: 'onTouched',
    resolver: yupResolver(titleFormSchema)
  });

  const {
    handleSubmit: handleImageSubmit,
    register: registerImage,
    watch: watchImage,
    trigger: triggerImage,
    setValue: setImageValue,
    formState: { errors: errorsImage, isSubmitting: isSubmittingImage }
  } = useForm<PublishFormValues>({
    mode: 'onTouched',
    resolver: yupResolver(imageFormSchema)
  });

  const { data, isLoading, isError } = useGetQuizInfo(
    router?.query?.quizId as string
  ) as { data: any; isLoading: boolean; isError: boolean };

  React.useEffect(() => {
    if (data?.image_url) {
      setPreviewImage(data.image_url);
    }
  }, [data]);


  React.useEffect(() => {
    if (!data) return;
    if (data.title) {
      setTitleValue('title', data.title);
    }
  }, [data]);

  return (
    <Box>
      <Head>
        <title>Home</title>
      </Head>
      <Navbar logo />
      <Container
        maxW="lg"
        py={{ base: '12', md: '24' }}
        px={{ base: '0', sm: '8' }}
      >
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={useBreakpointValue({ base: 'md', md: 'md' })}>
                Publish Your Course
              </Heading>
            </Stack>
          </Stack>

          <Box
            py={{ base: '0', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg={useBreakpointValue({
              base: 'transparent',
              sm: 'bg-surface'
            })}
            boxShadow={{
              base: 'none',
              sm: useColorModeValue('md', 'md-dark')
            }}
            borderRadius={{ base: 'none', sm: 'xl' }}
          >
            <Stack spacing="6">
              <Stack spacing="5">
                <form
                  onSubmit={handleTitleSubmit(async () => {
                    await updateQuizTitle.mutateAsync({
                      quizId: router?.query?.quizId as string,
                      quizTitle: watchTitle('title')
                    });
                  })}
                >
                  <InputFormControl
                    errors={errorsTitle}
                    register={registerTitle}
                    label="Title"
                    name="title"
                    type="name"
                    placeholder="Title"
                  />
                  <Button
                    mt={4}
                    colorScheme="teal"
                    isLoading={isSubmittingTitle}
                    type="submit"
                    isDisabled={
                      !watchTitle('title') ||
                      watchTitle('title') === data?.title
                    }
                  >
                    Update Title
                  </Button>
                </form>
                <form
                  onSubmit={handleImageSubmit(async () => {
                    try {
                      const imageUrl = await uploadImage(
                        watchImage('picture')?.[0],
                        router?.query?.quizId as string,
                        user?.id
                      );

                      if (imageUrl) {
                        await updateQuizImage.mutateAsync({
                          quizId: router?.query?.quizId as string,
                          imageUrl
                        });
                        // await uploadImageUrl(
                        //   imageUrl,
                        //   router?.query?.quizId as string
                        // );
                      }
                      setImageValue('picture', null);
                    } catch (error) {
                      alert(error.message);
                    }
                  })}
                >
                  <Image
                    w={'100%'}
                    height={'200px'}
                    objectFit="cover"
                    src={previewImage ? previewImage : default_unpublished_img}
                    alt="preview"
                  />
                  <FormControl isInvalid={Boolean(errorsImage?.picture)}>
                    <Input
                      type="file"
                      name="picture"
                      cursor={'pointer'}
                      multiple={false}
                      accept=".jpg, .jpeg, .png"
                      {...registerImage('picture', {
                        onChange: (e) => onChange(e)
                      })}
                      sx={{
                        '::file-selector-button': {
                          height: 10,
                          padding: 0,
                          mr: 4,
                          background: 'none',
                          border: 'none',
                          fontWeight: 'bold'
                        }
                      }}
                    />
                    <FormErrorMessage>
                      {errorsImage['picture'] && errorsImage['picture'].message}
                    </FormErrorMessage>
                  </FormControl>
                  <Button
                    mt={4}
                    colorScheme="teal"
                    isLoading={isSubmittingImage}
                    type="submit"
                    //disable if no change
                    disabled={!watchImage('picture')?.[0]}
                  >
                    Update Image
                  </Button>
                </form>
              </Stack>
            </Stack>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isPublishing}
              isDisabled={!data?.title || !data?.image_url}
              onClick={async () => {
                setIsPublishing(true);
                try {
                  await publishQuiz(router?.query?.quizId as string);
                  alert('Course published!');
                } catch (error) {
                  alert(error.message);
                } finally {
                  setIsPublishing(false);
                }
              }}
            >
              Publish Course
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default IndexPage;

function InputFormControl({
  errors,
  register,
  label,
  name,
  type,
  placeholder,
  value
}: {
  errors: Partial<FieldErrorsImpl<PublishFormValues>>;
  register: UseFormRegister<PublishFormValues>;
  label: string;
  name: keyof PublishFormValues;
  type: string;
  placeholder: string;
  value?: string;
}) {
  return (
    <FormControl isInvalid={Boolean(errors?.[name])}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        id={name}
        type={type}
        value={value}
        placeholder={placeholder}
        {...register(name)}
      />
      <FormErrorMessage>
        {errors[name] && errors[name].message}
      </FormErrorMessage>
    </FormControl>
  );
}

export const getServerSideProps = withPageAuth(
  { redirectTo: '/signin' },
  async (ctx, supabaseServerClient) => {
    return {
      props: {}
    };
  }
);

export type PublishFormValues = {
  title?: string;
  picture?: File[];
};
