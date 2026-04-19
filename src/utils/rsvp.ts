import type { AvatarUser } from "@/components/ProfileIcon";

export function rsvpToAvatarUser(rsvp: { user: AvatarUser }): AvatarUser {
  return {
    id: rsvp.user.id,
    name: rsvp.user.name,
    image: rsvp.user.image,
  };
}
