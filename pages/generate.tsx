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
  Center
} from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { postData } from '@/utils/helpers';
import React, { useState } from 'react';
import { useUser } from 'utils/useUser';

export default function Generate() {
  // Mock data for options
  const models = ['GPT 3.5'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const types = ['True/False'];
  const numberOfQuestions = ['5', '10'];

  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(models[0]);
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [type, setType] = useState(types[0]);
  const [questions, setQuestions] = useState(numberOfQuestions[0]);
  const [descriptionError, setDescriptionError] = useState('');
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { user, isLoading, subscription } = useUser();

  const router = useRouter();

  const toast = useToast();
  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOverlayVisible(true);

    if (description.trim() === '') {
      setDescriptionError('Description is required.');
      return;
    } else {
      setDescriptionError('');
    }

    console.log("triggered")
    

    setLoading(true);

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
      setIsOverlayVisible(false);
    }
  };

  return (
    <Flex
      // height="100vh"
      justifyContent="center"
      // alignItems="center"
    >
      {isOverlayVisible && (
        <Center
          position="fixed"
          w="100%"
          h="100%"
          bg="rgba(0,0,0,0.5)"
          zIndex="modal"
        >
          <Spinner size="xl" color="white" />
          <Text color="white" mt="5">
            Generating Quiz...
          </Text>
        </Center>
      )}

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
  );
}
