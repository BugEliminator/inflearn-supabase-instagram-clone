"use client";

import { Button } from "@material-tailwind/react";
import Person from "./Person";
import Message from "./Message";
import { useRecoilValue } from "recoil";
import {
  selectedUserIdState,
  selectedUserIndexState,
} from "utils/recoil/atoms";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "actions/chatActions";

export default function ChatScreen({}) {
  const seletedUserId = useRecoilValue(selectedUserIdState);
  const seletedUserIndex = useRecoilValue(selectedUserIndexState);
  const selectedUserQuery = useQuery({
    queryKey: ["user", seletedUserId],
    queryFn: () => getUserById(seletedUserId),
  });

  return selectedUserQuery.data !== null ? (
    <div className="w-full h-screen flex flex-col">
      {/* 액티브 유저 영역 */}
      <Person
        index={seletedUserIndex}
        name={selectedUserQuery?.data?.email?.split("@")?.[0]}
        userId={selectedUserQuery?.data?.id}
        onlineAt={new Date().toISOString()}
        isActive={false}
        onChatScreen={true}
      />
      {/* 채팅 영역 */}
      <div className="w-full flex-1 flex flex-col p-4 gap-3">
        <Message isFromMe={true} message={"안녕하십니까?"} />
        <Message isFromMe={true} message={"안녕하십니까?"} />
        <Message isFromMe={false} message={"안녕하십니까?"} />
        <Message isFromMe={false} message={"안녕하십니까?"} />
        <Message isFromMe={true} message={"안녕하십니까?"} />
        <Message isFromMe={false} message={"안녕하십니까?"} />
      </div>
      {/* 채팅창 영역 */}
      <div className="flex">
        <input
          className="p-3 w-full border-2 border-light-blue-600"
          placeholder="메세지를 입력해주세요."
          type="text"
        />
        <button
          className="min-w-20 p-3 bg-light-blue-700 text-white"
          color="light-blue"
        >
          <span>전송</span>
        </button>
      </div>
    </div>
  ) : (
    <div className="w-full"></div>
  );
}
