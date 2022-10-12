import { usePrompt } from "../../hooks";

interface Props {
  when: boolean;
  title: string;
  message: string;
  onLeave?: () => void;
}

export const Prompt: React.FC<Props> = ({
  title,
  message,
  when,
  onLeave,
}) => {
  usePrompt(title, message, when, onLeave);
  return null;
};
