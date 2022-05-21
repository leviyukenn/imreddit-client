import React, { useState } from "react";
import { useMeQuery } from "../generated/graphql";
import { OrderType } from "../graphql/types/types";
import CreatePostCard from "./post/createPost/CreatePostCard";
import { HomePostsInfiniteScroll } from "./post/PostInfiniteScroll";
import PostOrderTypeTabs from "./post/PostOrderTypeTabs";

interface HomeMainContentProps {}

const HomeMainContent = ({}: HomeMainContentProps) => {
  const { data: meResponse } = useMeQuery();

  const [orderType, setOrderType] = useState<OrderType>(OrderType.NEW);
  return (
    <>
      {meResponse?.me ? <CreatePostCard avatar={meResponse.me.avatar} /> : null}
      <PostOrderTypeTabs orderType={orderType} setOrderType={setOrderType} />
      <HomePostsInfiniteScroll orderType={orderType} />
    </>
  );
};
export default HomeMainContent;
