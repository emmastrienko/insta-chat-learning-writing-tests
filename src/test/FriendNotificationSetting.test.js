import { renderHook, act } from "@testing-library/react-hooks";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import useFriendNotifications from "../FriendNotificationSetting";

const mock = new MockAdapter(axios);

it("should be able to fetch notification settings assigned for a friend", async () => {
  const friendId = "friend123";
  const isNotificationMuted = false;

  mock
    .onGet(`http://localhost:3001/notificationSettings/${friendId}`)
    .reply(200, {
      isNotificationMuted,
    });

  const { result, waitForNextUpdate } = renderHook(() =>
    useFriendNotifications(friendId)
  );

  await waitForNextUpdate();

  expect(result.current[0]).toBe(isNotificationMuted);
});

it("Should be able to fetch notification settings assigned for a friend when the props change.", async () => {
  const friendId = "friend123";
  const newFriendId = "friend456";
  const isNotificationMuted = true;

  mock
    .onGet(`http://localhost:3001/notificationSettings/${newFriendId}`)
    .reply(200, {
      isNotificationMuted,
    });

  const { result, rerender, waitForNextUpdate } = renderHook(
    (props) => useFriendNotifications(props),
    {
      initialProps: friendId,
    }
  );

  rerender(newFriendId);

  await waitForNextUpdate();

  expect(result.current[0]).toBe(isNotificationMuted);
});

it("Should be able to trigger the Update Notification settings when the setter of the custom hook is called.", async () => {
  const friendId = "friend123";
  const isNotificationMuted = true;

  mock
    .onPut(`http://localhost:3001/notificationSettings/${friendId}`)
    .reply(200);

  const { result, waitForNextUpdate } = renderHook(() =>
    useFriendNotifications(friendId)
  );

  await waitForNextUpdate();

  act(() => {
    result.current[1];
  });

  expect(result.current[0]).toBe(false);
});
