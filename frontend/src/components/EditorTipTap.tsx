import { Blockquote } from "reactjs-tiptap-editor/blockquote";
import { BaseKit } from "reactjs-tiptap-editor";
import { Bold } from "reactjs-tiptap-editor/bold";
import { FontSize } from "reactjs-tiptap-editor/fontsize";
import { FontFamily } from "reactjs-tiptap-editor/fontfamily";
import { Color } from "reactjs-tiptap-editor/color";
import { Clear } from "reactjs-tiptap-editor/clear";
import { BulletList } from "reactjs-tiptap-editor/bulletlist";
import { Heading } from "reactjs-tiptap-editor/heading";
import { Highlight } from "reactjs-tiptap-editor/highlight";
import { History } from "reactjs-tiptap-editor/history";
import { HorizontalRule } from "reactjs-tiptap-editor/horizontalrule";
import { Indent } from "reactjs-tiptap-editor/indent";
import { Italic } from "reactjs-tiptap-editor/italic";
import { LineHeight } from "reactjs-tiptap-editor/lineheight";
import { Link } from "reactjs-tiptap-editor/link";
import { ColumnActionButton } from "reactjs-tiptap-editor/multicolumn";
import { ListItem } from "reactjs-tiptap-editor/listitem";
import { OrderedList } from "reactjs-tiptap-editor/orderedlist";
import { Selection } from "reactjs-tiptap-editor/selection";
import { Table } from "reactjs-tiptap-editor/table";
import { TextAlign } from "reactjs-tiptap-editor/textalign";
import { TextBubble } from "reactjs-tiptap-editor/textbubble";
import { TextUnderline } from "reactjs-tiptap-editor/textunderline";
import { SearchAndReplace } from "reactjs-tiptap-editor/searchandreplace";
import { Image } from "reactjs-tiptap-editor/image";
import { Iframe } from "reactjs-tiptap-editor/iframe";

import RichTextEditor from "reactjs-tiptap-editor";

import "reactjs-tiptap-editor/style.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function EditorTiptap({ value, onChange }: Props) {
  return (
    <div className="border border-gray-300 rounded">
      <RichTextEditor
        output="html"
        content={value}
        onChangeContent={onChange}
        extensions={[
          // Core/Base functionality
          BaseKit.configure({}),
          History,
          
          // Text formatting
          Bold,
          Italic,
          TextUnderline,
          Color,
          Highlight,
          
          // Typography
          FontSize,
          FontFamily,
          LineHeight,
          Heading,
          
          // Text alignment and layout
          TextAlign.configure({ types: ["heading", "paragraph"] }),
          Indent,
          
          // Lists
          BulletList,
          OrderedList,
          ListItem,
          
          // Content blocks
          Blockquote,
          HorizontalRule,
          
          // Media and embeds
          Image.configure({
            upload: (file: File) => {
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve(URL.createObjectURL(file));
                }, 500);
              });
            },
          }),
          Iframe,
          
          // Tables and columns
          Table,
          ColumnActionButton,
          
          // Links and navigation
          Link,
          
          // Utilities
          Clear,
          Selection,
          TextBubble,
          SearchAndReplace,
        ]}
      />
    </div>
  );
}
