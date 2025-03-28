"use client";

import { useQuery } from "@tanstack/react-query";
import Person from "./Person";
import { useRecoilState } from "recoil";
import {
  presenceState,
  selectedUserIdState,
  selectedUserIndexState,
} from "utils/recoil/atoms";
import { getAllUsers } from "actions/chatActions";
import { createBrowserSupabaseClient } from "utils/supabase/client";
import { useEffect } from "react";

export default function ChatPeopleList({ loggedInUser }) {
  const [selectedUserId, setSelectedUserId] =
    useRecoilState(selectedUserIdState);

  const [selectedUserIndex, setSelectedUserIndex] = useRecoilState(
    selectedUserIndexState
  );

  const [presence, setPresence] = useRecoilState(presenceState);

  // getAllUsers
  const getAllUsersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const allUser = await getAllUsers();
      console.log(allUser);
      return allUser.filter((user) => user.id !== loggedInUser.id);
    },
  });

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const channel = supabase.channel("online_users", {
      config: {
        presence: {
          key: loggedInUser.id,
        },
      },
    });

    channel.on("presence", { event: "sync" }, () => {
      const newState = channel.presenceState();
      const newStateObj = JSON.parse(JSON.stringify(newState));
      setPresence(newStateObj);
    });

    channel.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") {
        return;
      }

      const newPresenceStatus = await channel.track({
        onlineAt: new Date().toISOString(),
      });

      console.log(newPresenceStatus);
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="h-screen w-60 flex flex-col bg-gray-50">
      {getAllUsersQuery.data?.map((user, index) => (
        <Person
          key={user.id}
          onClick={() => {
            setSelectedUserId(user.id);
            setSelectedUserIndex(index);
          }}
          index={index}
          name={user.email.split("@")[0]}
          userId={user.id}
          onlineAt={presence?.[user.id]?.[0]?.onlineAt}
          isActive={selectedUserId === user.id}
          onChatScreen={false}
        />
      ))}
      {/* <Person
        onClick={() => setSelectedIndex(0)}
        index={0}
        name={"chanwoo"}
        userId={undefined}
        onlineAt={new Date().toISOString()}
        isActive={selectedIndex === 0}
        onChatScreen={false}
      />
      <Person
        onClick={() => setSelectedIndex(1)}
        index={1}
        name={"1234"}
        userId={undefined}
        onlineAt={new Date().toISOString()}
        isActive={selectedIndex === 1}
        onChatScreen={false}
      /> */}
    </div>
  );
}
