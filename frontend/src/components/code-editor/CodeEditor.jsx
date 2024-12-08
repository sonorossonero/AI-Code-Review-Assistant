// src/components/code-editor/CodeEditor.jsx
import React, { useContext } from "react";
import Editor from "@monaco-editor/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCopyIcon } from "@radix-ui/react-icons";

const CodeEditor = ({
  code = "",
  onChange = () => {},
  language = "javascript",
  height = "60vh",
  theme: propTheme, // Allow theme to be passed as prop
}) => {
  // Get theme from document element as fallback
  const isDarkMode = document.documentElement.classList.contains("dark");
  const editorTheme = propTheme || (isDarkMode ? "vs-dark" : "light");

  const handleEditorChange = (value) => {
    onChange(value || "");
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      alert("Code copied to clipboard!");
    });
  };

  // Add theme change observer
  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          // Force editor remount by changing key
          setEditorKey((prev) => prev + 1);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // State to force editor remount
  const [editorKey, setEditorKey] = React.useState(0);

  return (
    <Card className="w-full border shadow-sm relative">
      <CardContent className="p-0 overflow-hidden rounded-lg">
        <Editor
          key={editorKey} // Force remount when theme changes
          height={height}
          language={language}
          value={code}
          theme={editorTheme}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 24,
            padding: { top: 15, bottom: 15 },
            automaticLayout: true,
          }}
        />
        <Button
          className="absolute top-2 right-2 hover:opacity-90 transition-opacity"
          onClick={handleCopyToClipboard}
        >
          <ClipboardCopyIcon className="mr-2" />
          Copy Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default CodeEditor;
