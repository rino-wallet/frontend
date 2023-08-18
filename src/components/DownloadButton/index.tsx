import React, { FC } from "react";

import { Button, Props as ButtonProps } from "../Button";
import { ExportFileResponse } from "../../types";

type Props = {
  onDownload: ()=> Promise<ExportFileResponse>;
  filename: string;
} & Omit<ButtonProps, "onClick">;

export const DownloadButton: FC<Props> = ({
  onDownload,
  filename,
  children,
  ...rest
}: Props) => {
  const handleClick = async () => {
    const { data } = await onDownload();
    const url = URL.createObjectURL(data);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (<Button onClick={handleClick} {...rest}>{children}</Button>);
};
