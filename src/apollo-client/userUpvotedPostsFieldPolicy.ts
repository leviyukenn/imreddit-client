import { FieldPolicy, Reference } from "@apollo/client";
import { PostsIncoming, PostsReadResult } from "./postsFieldPolicy";

type UserPostsExisting = {
  posts: { [key: string]: Reference };
  hasMore: boolean;
};

export const userUpvotedPostsFieldPolicy: FieldPolicy<
  UserPostsExisting,
  PostsIncoming,
  PostsReadResult
> = {
  keyArgs: ["userName", "upvoteType"],
  merge(existing, incoming, { readField }) {
    const mergedPosts = existing ? { ...existing.posts } : {};

    incoming.posts.forEach((item) => {
      const id = readField("id", item) as string;
      mergedPosts[id] = item;
    });
    return { posts: mergedPosts, hasMore: incoming.hasMore };
  },

  // Return all items stored so far, to avoid ambiguities
  // about the order of the items.
  read(existing, {  readField }) {
    if (!existing) {
      return undefined;
    }
    const posts = Object.values(existing.posts);
    //sort cached posts by create time
    const postsSortedByCreatedTime = posts.sort((a, b) => {
      return (
        parseInt(readField("createdAt", b) as string) -
        parseInt(readField("createdAt", a) as string)
      );
    });

    return {
      posts: postsSortedByCreatedTime,
      hasMore: existing.hasMore,
    };
  },
};
