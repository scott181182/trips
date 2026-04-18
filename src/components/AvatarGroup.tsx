import { useDroppable } from "@dnd-kit/react";
import { clsx } from "clsx";

import { type AvatarUser, DraggableProfileIcon, ProfileIcon, SortableProfileIcon } from "./ProfileIcon";

export interface AvatarGroupProps {
  users: AvatarUser[];
  className?: string;
  avatarClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
  draggable?: boolean;
}

export function AvatarGroup({ ref, draggable, users, className, avatarClassName }: Readonly<AvatarGroupProps>) {
  return (
    <div ref={ref} className={clsx("flex gap-1 flex-wrap", className)}>
      {users.map((user) =>
        draggable ? (
          <DraggableProfileIcon key={user.id} user={user} avatarClassName={avatarClassName} />
        ) : (
          <ProfileIcon key={user.id} user={user} avatarClassName={avatarClassName} />
        ),
      )}
    </div>
  );
}

export interface DraggableAvatarGroupProps extends Omit<AvatarGroupProps, "ref" | "draggable"> {
  droppableId: string;
}
export function DraggableAvatarGroup({
  droppableId,
  users,
  className,
  avatarClassName,
}: Readonly<DraggableAvatarGroupProps>) {
  const { ref, isDropTarget } = useDroppable({ id: droppableId, type: "group" });

  return (
    <div ref={ref} className={clsx("flex gap-1 flex-wrap", className, isDropTarget && "bg-blue-100 rounded-md")}>
      {users.map((user, index) => (
        <SortableProfileIcon
          key={user.id}
          user={user}
          avatarClassName={avatarClassName}
          index={index}
          group={droppableId}
        />
      ))}
    </div>
  );
}
