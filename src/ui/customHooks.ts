import { useEffect, useRef } from "react";
import { useQueryClient } from "react-query";
import { Bounce, toast } from "react-toastify";
import { WebSocketEvent } from "./models";
import { useTheme } from "./context/ThemeContext";

function hasData(
  messageData: WebSocketEvent
): messageData is WebSocketEvent & { data: Record<string, unknown> } {
  return messageData.data !== undefined;
}

export const useReactQuerySubscription = () => {
  const darkTheme = useTheme();
  const queryClient = useQueryClient();
  const ws = useRef<WebSocket>();

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.addEventListener("open", () => {
      console.log("Created connection");
    });

    ws.current.addEventListener("message", (event) => {
      try {
        const messageData: WebSocketEvent = JSON.parse(event.data);
        console.log(messageData);

        toast.success(`${messageData.operation} successfully `, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: darkTheme ? "dark" : "light",
          transition: Bounce,
        });

        switch (messageData.operation) {
          case "invalidate":
            queryClient.invalidateQueries(
              [...messageData.entity, messageData.id].filter(Boolean)
            );
            break;

          case "create":
            queryClient.setQueriesData(messageData.entity, (oldData) => {
              if (!Array.isArray(oldData)) return [messageData.data];
              if (!hasData(messageData)) return oldData;

              const newData = [...oldData];
              const index = newData.findIndex(
                (item) => item.id > messageData.data?.id
              );

              if (index === -1) {
                newData.push(messageData.data);
              } else {
                newData.splice(index, 0, messageData.data);
              }

              return newData;
            });
            break;

          case "update":
            queryClient.setQueriesData(messageData.entity, (oldData) => {
              const update = (entity: Record<string, unknown>) =>
                entity.id === messageData.id
                  ? { ...entity, ...messageData.data }
                  : entity;

              return Array.isArray(oldData)
                ? oldData.map(update)
                : update(oldData as Record<string, unknown>);
            });
            break;

          case "delete":
            queryClient.setQueriesData(messageData.entity, (oldData) => {
              if (!Array.isArray(oldData)) return oldData;
              return oldData.filter((item) => item.id !== messageData.id);
            });
            break;
        }
      } catch (e) {
        console.error(e);
      }
    });

    return () => {
      ws.current?.close();
      console.log("Connection closed");
    };
  }, [queryClient]);
};
