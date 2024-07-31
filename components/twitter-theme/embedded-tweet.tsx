import { type EnrichedTweet, type TwitterComponents } from "react-tweet";
import {
  TweetContainer,
  TweetHeader,
  TweetInReplyTo,
  TweetBody,
  TweetMedia,
  TweetInfo,
  TweetActions,
  TweetReplies,
  QuotedTweet,
} from "./index";

type ReactNativeTweetProps = {
  tweet: EnrichedTweet;
  components?: TwitterComponents;
};

export const EmbeddedTweet = ({ tweet, components }: ReactNativeTweetProps) => {
  return (
    <TweetContainer>
      <TweetHeader tweet={tweet} />
      {tweet.in_reply_to_status_id_str && <TweetInReplyTo tweet={tweet} />}

      <TweetBody tweet={tweet} />
      {tweet.mediaDetails?.length ? (
        <TweetMedia tweet={tweet} components={components} />
      ) : null}
      {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />}
      <TweetInfo tweet={tweet} />
      <TweetActions tweet={tweet} />
      <TweetReplies tweet={tweet} />
    </TweetContainer>
  );
};
