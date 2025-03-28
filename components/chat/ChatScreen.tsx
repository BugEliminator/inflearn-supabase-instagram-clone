"use client";

import { Spinner } from "@material-tailwind/react";
import Person from "./Person";
import Message from "./Message";
import { useRecoilValue } from "recoil";
import {
  selectedUserIdState,
  selectedUserIndexState,
} from "utils/recoil/atoms";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllMessages, getUserById, sendMessage } from "actions/chatActions";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function ChatScreen({}) {
  const selectedUserId = useRecoilValue(selectedUserIdState);
  const selectcedUserIndex = useRecoilValue(selectedUserIndexState);
  const [message, setMessage] = useState("");
  const supabase = createBrowserSupabaseClient();

  const selectedUserQuery = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: () => getUserById(selectedUserId),
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      return sendMessage({
        message,
        chatUserId: selectedUserId,
      });
    },
    onSuccess: () => {
      setMessage("");
      getAllMessagesQuery.refetch();
    },
  });

  const getAllMessagesQuery = useQuery({
    queryKey: ["messages", selectedUserId],
    queryFn: () => getAllMessages({ chatUserId: selectedUserId }),
  });

  useEffect(() => {
    const channel = supabase
      .channel("message_postgres_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
        },
        (payload) => {
          if (payload.eventType === "INSERT" && !payload.errors) {
            getAllMessagesQuery.refetch();
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  console.log("💬 messages", getAllMessagesQuery.data);
  console.log("🧪 status", getAllMessagesQuery.status);

  return selectedUserQuery.data !== null ? (
    <div className="w-full h-screen flex flex-col">
      {/* 액티브 유저 영역 */}
      <Person
        index={selectcedUserIndex}
        name={selectedUserQuery?.data?.email?.split("@")?.[0]}
        userId={selectedUserQuery?.data?.id}
        onlineAt={new Date().toISOString()}
        isActive={false}
        onChatScreen={true}
      />
      {/* 채팅 영역 */}
      <div className="w-full overflow-y-scroll flex-1 flex flex-col p-4 gap-3">
        {getAllMessagesQuery.data?.map((message) => (
          <Message
            key={message.id}
            message={message.message}
            isFromMe={message.receiver === selectedUserId}
          />
        ))}
        {/* <Message isFromMe={false} message={"반갑습니다."} /> */}
      </div>
      {/* 채팅창 영역 */}
      <div className="flex">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-3 w-full border-2 border-light-blue-600"
          placeholder="메세지를 입력해주세요."
          type="text"
        />
        <button
          onClick={() => sendMessageMutation.mutate()}
          className="min-w-20 p-3 bg-light-blue-700 text-white"
          color="light-blue"
        >
          {sendMessageMutation.isPending ? (
            <Spinner
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          ) : (
            <span>전송</span>
          )}
        </button>
      </div>
    </div>
  ) : (
    <div className="w-full"></div>
  );
}
