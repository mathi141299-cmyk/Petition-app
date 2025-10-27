import React, { useEffect } from "react";
import JoditEditor from "jodit-react";
import { FormHelperText } from "@mui/material";

type TextAreaEditorProps = {
  value?: any;
  toolbar?: boolean;
  onChange?: (value: any) => void | any;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  name?: string;
  label?: string;
  setValue?: any;
  inputRef: any;
};

const buttons = [
  "undo",
  "redo",
  "|",
  "bold",
  "strikethrough",
  "underline",
  "italic",
  "|",
  "align",
  "|",
  "fontsize",
  "|",
  "font",
  "brush",
  "|",

  "table",
  "|",
  "eraser",
  "|",
  "source",
];

const TextAreaEditor = React.memo(
  ({
    toolbar = true,
    value,
    onChange,
    placeholder,
    helperText,
    error,
    name,
    label,
    setValue,
    inputRef,
  }: TextAreaEditorProps) => {
    const editorConfig: any = {
      readonly: false,
      toolbar: toolbar,
      toolbarInline: false,
      spellcheck: false,
      language: "en",
      toolbarButtonSize: "medium",
      toolbarAdaptive: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      buttons: buttons,
      uploader: {
        insertImageAsBase64URI: true,
      },
      width: "100%",
      minHeight: "200px",
      placeholder: placeholder ? placeholder : "Write something awesome...",
      enter: "br",
      events: {
        keydown: (e: KeyboardEvent) => {
          if (e.key === "Tab") {
            e.preventDefault();

            if (inputRef?.current) {
              var doc = inputRef?.current?.ownerDocument?.defaultView;
              var sel = doc.getSelection();
              var range = sel.getRangeAt(0);

              var tabNode = document.createTextNode(
                "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"
              );
              range.insertNode(tabNode);

              range.setStartAfter(tabNode);
              range.setEndAfter(tabNode);
              sel.removeAllRanges();
              sel.addRange(range);
            }
          }
        },
      },
    };

    useEffect(() => {}, [inputRef]);

    return (
      <>
        <style>{`
        .jodit-add-new-line::after {
          display: none; /* Hide the pseudo-element */
        }

        .jodit-add-new-line {
          display: none !important; /* Hide the element itself */
        }
        .jodit-toolbar__box {
          background-color: white !important; /* Hide the element itself */
        }
        .jodit-container {
          border: 1px solid #EFEFEF  !important;
        }
        .jodit-toolbar__box:not(:empty){
          border-bottom: 0.5px solid #EFEFEF !important;
        }
        .jodit-ui-separator {
          border-right: 1px solid #EFEFEF !important;
        }
       
      `}</style>

        <JoditEditor
          className="jodit-editor customEditor"
          ref={inputRef}
          value={value}
          config={editorConfig}
        />
        <FormHelperText error={error} sx={{ ml: 2, fontSize: "11px" }}>
          {helperText}
        </FormHelperText>
      </>
    );
  }
);

export default TextAreaEditor;
