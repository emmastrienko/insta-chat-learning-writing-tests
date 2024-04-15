import { renderHook } from "@testing-library/react-hooks";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import useFriendStatus from "../FriendStatus";

const mock = new MockAdapter(axios);

it("should be able to fetch the friend's online/offline status", async () => {
  const friendId = "friend123";
  const status = "online";

  mock.onGet(`http://localhost:3001/status/${friendId}`).reply(200, {
    status,
  });

  const { result, waitForNextUpdate } = renderHook(() =>
    useFriendStatus(friendId)
  );

  await waitForNextUpdate();

  expect(result.current).toBe(status);
});

it("should be able to fetch the friend's online/offline status when the props change.", async () => {
  const friendId = "friend123";
  const newFriendId = "friend456";
  const status = "offline";

  mock.onGet(`http://localhost:3001/status/${newFriendId}`).reply(200, {
    status,
  });

  const { result, rerender, waitForNextUpdate } = renderHook(
    (props) => useFriendStatus(props),
    {
      initialProps: friendId,
    }
  );

  rerender(newFriendId);

  await waitForNextUpdate();

  expect(result.current).toBe(status);
});
