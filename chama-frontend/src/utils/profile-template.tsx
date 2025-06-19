import { User } from '../models/user';

const ProfileTemplate = (user: User, h: number, w: number) => {
  // Fix image path - assuming public/images directory exists
  const imagePath =
    user.profilepic && user.profilepic.startsWith('http')
      ? user.profilepic
      : `${process.env.PUBLIC_URL || ''}/images${user.profilepic && user.profilepic.startsWith('/') ? user.profilepic : user.profilepic ? '/' + user.profilepic : ''}`;

  // Use a default image if the path is invalid
  return (
    <img
      src={imagePath}
      //   alt={`${user.name}'s profile`}
      onError={e => {
        (e.target as HTMLImageElement).src =
          'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
      }}
      className={`w-${w} h-${h} rounded-full object-cover border border-gray-300 `}
    />
  );
};

export default ProfileTemplate;
