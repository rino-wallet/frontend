import React, { useCallback, useState } from "react";
import cn from "classnames";
import { useDropzone, FileWithPath } from "react-dropzone";
import { ReactComponent as ArrowSvg } from "./arrow.svg";
import FileSvg from "./file";
import "./styles.css";

interface Props {
  onChange: (files: File[]) => void;
  files: File[];
  fileType: string;
  fileName?: string;
  loading?: boolean;
  id?: string | number;
}

const MAX_SIZE = 2621440; // 2.5 MB

export const UploadFile: React.FC<Props> = ({
  onChange,
  files,
  fileType,
  loading,
  id,
}) => {
  const [error, setError] = useState("");
  const [readyToDrop, setReadyToDrop] = useState(false);
  const onDropAccepted = useCallback(
    (acceptedFiles: any) => {
      setError("");
      setReadyToDrop(false);
      onChange(acceptedFiles);
    },
    [onChange],
  );
  const { getRootProps, getInputProps } = useDropzone({
    noClick: false,
    noKeyboard: true,
    multiple: false,
    maxSize: MAX_SIZE,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
    onDropAccepted,
    onDropRejected: (f) => {
      setError(f[0].errors[0].message);
      setReadyToDrop(false);
    },
    onDragEnter: () => {
      setReadyToDrop(true);
    },
    onDragLeave: () => {
      setReadyToDrop(false);
    },
  });
  const filesPreview = files.map((file: FileWithPath) => (
    <div key={file.path}>{file.path}</div>
  ));
  return (
    <div
      id={`dropzone-${id}`}
      className={cn("border p-7 rounded-md upload-file", {
        "border-dashed": !readyToDrop,
        "border-solid border-orange-700": readyToDrop || loading,
        "border-green-400": files.length > 0,
      })}
    >
      <section>
        <div {...getRootProps({ className: "flex relative cursor-pointer" })}>
          <input {...getInputProps()} />
          {
            readyToDrop && (
              <div className="top-0 left-0 absolute w-full h-full bg-white flex justify-center items-center">
                <ArrowSvg />
              </div>
            )
          }
          <div className="mr-4">
            <FileSvg added={files.length > 0} />
          </div>
          <div>
            {!!fileType && !filesPreview.length && (
              <div className="text-xs mb-2 text-uppercase">
                {fileType}
              </div>
            )}
            {filesPreview.length > 0 && (
              <div className="text-xs mb-2 text-uppercase">
                {filesPreview}
              </div>
            )}
            <div className="text-xs theme-text-secondary">
              Drop file here or
              {" "}
              <span className="theme-text-primary">click to select</span>
              {" "}
              it.
              <br />
              Max size: 2.5MB. jpg, png only.
            </div>
          </div>
        </div>
        <div className="theme-text-error">{error}</div>
      </section>
    </div>
  );
};
