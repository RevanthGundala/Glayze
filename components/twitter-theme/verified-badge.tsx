import React from "react";
import { View } from "react-native";
import clsx from "clsx";
import type { TweetUser } from "react-tweet/api";
import { Verified, VerifiedBusiness, VerifiedGovernment } from "./icons/index";

type Props = {
  user: TweetUser;
  className?: string;
};

export const VerifiedBadge = ({ user, className }: Props) => {
  const verified = user.verified || user.is_blue_verified || user.verified_type;
  let icon = <Verified />;
  let iconClassName = "text-[#1D9BF0]"; // Assuming this is the --tweet-verified-blue-color

  if (verified) {
    if (!user.is_blue_verified) {
      iconClassName = "text-[#8B98A5]"; // Assuming this is the --tweet-verified-old-color
    }
    switch (user.verified_type) {
      case "Government":
        icon = <VerifiedGovernment />;
        iconClassName = "text-[#829AAB]"; // This is rgb(130, 154, 171) converted to hex
        break;
      case "Business":
        icon = <VerifiedBusiness />;
        iconClassName = null;
        break;
    }
  }

  return verified ? (
    <View className={clsx(className, iconClassName)}>{icon}</View>
  ) : null;
};
