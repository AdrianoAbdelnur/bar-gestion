import { ReactNode, useState } from "react";

export default function useModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();
  const [actions, setActions] = useState<ReactNode | undefined>();
  const [content, setContent] = useState<ReactNode | null>(null);

  const show = (config: {
    title?: string;
    message?: string;
    actions?: ReactNode;
    content?: ReactNode | null;
  }) => {
    setTitle(config.title);
    setMessage(config.message);
    setActions(config.actions);
    setContent(config.content ?? null);
    setOpen(true);
  };

  const hide = () => setOpen(false);

  return {
    open,
    title,
    message,
    actions,
    content,
    show,
    hide,
  };
}