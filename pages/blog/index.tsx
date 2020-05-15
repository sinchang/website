import React from 'react';
import NextLink from 'next/link';
import { Container, Box, Text, Link } from '@peduarte/wallop-system';
import { blogPosts } from '../../utils/blogPosts';
import { FrontMatter } from '../../types';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import { BlogCard } from '../../components/BlogCard';

const Blog = () => {
  return (
    <Box>
      <TitleAndMetaTags description="Blog articles about design systems, jamstack and design–dev collaboration." />

      <Container mx={[4, 5, 6]} py={[4, 5]}>
        <Box mb={[5, 6]}>
          <NextLink href="/" passHref>
            <Link variant="ghost">
              <Text size={2} sx={{ textTransform: 'uppercase' }}>
                Back <Text sx={{ color: 'gray' }}>home</Text>
              </Text>
            </Link>
          </NextLink>
        </Box>

        <Text as="h1" mx="auto" size={5} mb={5} weight="medium">
          Blog
        </Text>

        {blogPosts.map((post: FrontMatter) => (
          <BlogCard key={post.title} frontMatter={post} />
        ))}
      </Container>
    </Box>
  );
};

export default Blog;
