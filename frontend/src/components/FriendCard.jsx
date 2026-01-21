import { Link } from "react-router";
import { MapPinIcon } from "lucide-react";
import { LANGUAGE_TO_FLAG } from "../constants";
import { capitialize } from "../lib/utils";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-lg transition-all duration-300 border border-base-300 shadow-md">
      <div className="card-body p-5 space-y-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full">
              <img src={friend.profilePic} alt={friend.fullName} />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{friend.fullName}</h3>
            {friend.location && (
              <div className="flex items-center text-xs opacity-70 mt-1">
                <MapPinIcon className="size-3 mr-1" />
                {friend.location}
              </div>
            )}
          </div>
        </div>

        {/* Languages with flags */}
        <div className="flex flex-wrap gap-1.5">
          <span className="badge badge-secondary">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {capitialize(friend.nativeLanguage)}
          </span>
          <span className="badge badge-outline">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {capitialize(friend.learningLanguage)}
          </span>
        </div>

        {/* Bio */}
        {friend.bio && <p className="text-sm opacity-70">{friend.bio}</p>}

        {/* Message Button */}
        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full mt-2">
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
