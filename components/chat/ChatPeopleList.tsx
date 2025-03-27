"use client";

import Person from "./Person";
import { useRecoilState } from "recoil";
import { selectedIndexState } from "utils/recoil/atoms";

export default function ChatPeopleList() {
  const [selectedIndex, setSelectedIndex] = useRecoilState(selectedIndexState);

  return (
    <div className="h-screen w-60 flex flex-col bg-gray-50">
      <Person
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
      />
    </div>
  );
}
