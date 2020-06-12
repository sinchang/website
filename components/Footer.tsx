import React from 'react';
import { Link, Text, Box, Container, Flex, Divider } from '@modulz/radix';

export const Footer = () => {
  return (
    <Box py={[4, 5]} sx={{ bg: 'black', color: 'white' }}>
      <Container mx={[4, 5, 6]} py={[4, 5]}>
        <Flex sx={{ flexDirection: ['column', 'row'] }}>
          <Text
            as="h3"
            size={2}
            weight="medium"
            mr={[0, 4]}
            mb={[4, 0]}
            sx={{ textTransform: 'uppercase', color: 'gray' }}
          >
            JW
          </Text>

          <Text as="p" size={2} weight="medium" mx={[0, 4]} mb={[1, 0]} color="white">
            <Link
              href="https://github.com/sinchang"
              sx={{
                color: 'white',
              }}
            >
              GitHub
            </Link>
          </Text>

          <Text as="p" size={2} weight="medium" mx={[0, 4]} mb={[1, 0]} color="white">
            <Link
              href="https://twitter.com/sinchangwen"
              sx={{
                color: 'white',
              }}
            >
              Twitter
            </Link>
          </Text>

          <Text as="p" size={2} weight="medium" mx={[0, 4]} mb={[1, 0]}>
            <Link
              href="https://telegram.me/sinchang"
              sx={{
                color: 'white',
              }}
            >
              Telegram
            </Link>
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};
