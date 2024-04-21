import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { fetchCommunities } from '@/lib/actions/community.action';
import { currentUser } from '@clerk/nextjs';
import UserCard from '../cards/UserCard';
import Searchbar from './Searchbar';
import CommunityCard from '../cards/CommunityCard';

async function RightSidebar({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const SuggestedCommunities = await fetchCommunities({
    searchString: searchParams?.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  const SuggestedUsers = await fetchUsers({
    userId: user.id,
    searchString: searchParams?.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>

        <div className="mt-5">
          <Searchbar routeType="communities" />
        </div>

        <div className="mt-14 flex flex-col gap-9">
          {SuggestedCommunities.communities.length === 0 ? (
            <p className="no-result">No Result</p>
          ) : (
            <>
              {SuggestedCommunities.communities.map((community) => (
                <CommunityCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  bio={community.bio}
                  members={community.members}
                />
              ))}
            </>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>

        <div className="mt-5">
          <Searchbar routeType="search" />
        </div>

        <div className="mt-14 flex flex-col gap-9">
          {SuggestedUsers.users.length === 0 ? (
            <p className="no-result">No Result</p>
          ) : (
            <>
              {SuggestedUsers.users.map((person) => (
                <UserCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.image}
                  personType="User"
                />
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default RightSidebar;
