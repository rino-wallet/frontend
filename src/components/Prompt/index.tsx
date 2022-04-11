import { usePrompt } from "../../hooks";

interface Props {
  when: boolean;
  title: string;
  message: string;
}

export const Prompt: React.FC<Props> = ({title, message, when}) => {
  usePrompt(title, message, when);
  return null;
}
