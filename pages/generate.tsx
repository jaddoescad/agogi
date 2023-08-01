import {
  Box,
  Button,
  Text,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Spinner,
  Flex,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody
} from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { postData } from '@/utils/helpers';
import React, { useState } from 'react';
import { useUser } from 'utils/useUser';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import va from '@vercel/analytics';

export default function Generate() {
  const models = ['GPT 3.5'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const types = ['True/False'];
  const numberOfQuestions = ['5', '10'];

  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(models[0]);
  const [difficulty, setDifficulty] = useState(difficulties[2]);
  const [type, setType] = useState(types[0]);
  const [questions, setQuestions] = useState(numberOfQuestions[0]);
  const [descriptionError, setDescriptionError] = useState('');
  const [isOverlayVisible, setIsOverlayVisible] = useState(false); // New state for Overlay visibility

  const { user, isLoading, subscription } = useUser();

  const router = useRouter();
  const toast = useToast();

  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) return;

    if (description.trim() === '') {
      setDescriptionError('Description is required.');
      return;
    } else {
      setDescriptionError('');
    }

    console.log('triggered');

    setLoading(true);
    setIsOverlayVisible(true); // Show overlay when loading

    try {
      const response = await postData({
        url: '/api/create-quiz',
        data: {
          description,
          model,
          difficulty,
          type,
          numberOfQuestions: questions
        }
      });

      if (response.quizId) {
        va.track('generate-quiz', {
          model: model,
          difficulty: difficulty,
          type: type
          //
        });
        router.push(`/quiz/${response.quizId}`);
      } else if (response.error) {
        console.log(response.error);
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: 'Error.',
        description: String(error),
        status: 'error',
        duration: 9000,
        isClosable: true
      });
    } finally {
      setLoading(false);
      setIsOverlayVisible(false); // Hide overlay when done loading
    }
  };

  return (
    <>
      <Flex justifyContent="center">
        <Box
          textAlign="center"
          rounded="lg"
          w="full"
          maxW="md"
          px={10}
          py={5}
          borderColor={'purple.600'}
          borderWidth={2}
          mt={10}
          m={2}
        >
          <form onSubmit={handleGenerate}>
            <Text
              as="h1"
              fontSize="3xl"
              fontWeight="bold"
              color="purple.600"
              mb={6}
            >
              Generate Your Quiz
            </Text>
            <Flex justifyContent="space-between" my={4}>
              <Select value={model} onChange={(e) => setModel(e.target.value)}>
                {models.map((model) => (
                  <option key={model}>{model}</option>
                ))}
              </Select>

              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty}>{difficulty}</option>
                ))}
              </Select>
            </Flex>
            <Flex justifyContent="space-between" my={4}>
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                {types.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </Select>

              <Select
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
              >
                {numberOfQuestions.map((questions) => (
                  <option key={questions}>{questions}</option>
                ))}
              </Select>
            </Flex>
            <FormControl isInvalid={!!descriptionError} my={4}>
              <FormLabel>Description:</FormLabel>
              <Textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                isInvalid={!!descriptionError}
                errorBorderColor="red.300"
                focusBorderColor="purple.600"
                maxLength={1000}
              />
              {descriptionError && (
                <Text color="red.300" fontSize="sm" fontStyle="italic">
                  {descriptionError}
                </Text>
              )}
            </FormControl>
            <Button
              type="submit"
              width="full"
              colorScheme="purple"
              my={4}
              isLoading={loading}
            >
              Generate
            </Button>
          </form>
        </Box>
      </Flex>

      {/* Overlay */}
      <Modal
        isOpen={isOverlayVisible}
        onClose={() => {}}
        isCentered
        size="xl"
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalBody>
            <Center>
              <Box
                borderWidth="1px"
                borderRadius="lg"
                padding={5}
                display="flex"
                flexDirection="column"
                alignItems="center"
                bg={'white'}
              >
                <Spinner size="xl" />
                <Text mt={3}>Generating a quiz...</Text>
              </Box>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export const getServerSideProps = withPageAuth({ redirectTo: '/signin' });
