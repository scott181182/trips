"use client";

import { useDraggable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { Avatar, type AvatarOwnProps } from "@mui/material";

export interface AvatarUser {
  id: string;
  name: string;
  image?: string | null;
}

interface ProfileIconProps {
  user: AvatarUser;
  avatarClassName?: string;
  avatarProps?: AvatarOwnProps;
  ref?: React.Ref<HTMLDivElement>;
}

export function ProfileIcon({ ref, user, avatarClassName, avatarProps }: Readonly<ProfileIconProps>) {
  if (user.image) {
    return <Avatar ref={ref} alt={user.name} src={user.image} className={avatarClassName} {...avatarProps} />;
  } else {
    const initials = user.name
      .split(/\s+/)
      .filter((n) => n.length > 0)
      .map((n) => n.charAt(0))
      .join("");

    return (
      <Avatar ref={ref} alt={user.name} className={avatarClassName} {...avatarProps}>
        {initials}
      </Avatar>
    );
  }
}

export function DraggableProfileIcon({ user, avatarClassName, avatarProps }: Readonly<ProfileIconProps>) {
  const { ref } = useDraggable({ id: user.id, type: "user" });

  return <ProfileIcon ref={ref} user={user} avatarClassName={avatarClassName} avatarProps={avatarProps} />;
}

export interface SortableProfileIconProps extends ProfileIconProps {
  index: number;
  group?: string;
}
export function SortableProfileIcon({ index, group, ...rest }: Readonly<SortableProfileIconProps>) {
  const { ref } = useSortable({
    id: rest.user.id,
    type: "user",
    index,
    group,
  });

  return <ProfileIcon ref={ref} {...rest} />;
}
