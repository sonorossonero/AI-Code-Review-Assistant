// src/components/review/ReviewHistory.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { ClipboardCopyIcon } from "@radix-ui/react-icons";
import { Code2 } from "lucide-react";

const ReviewHistory = ({ history, className }) => {
  // Get theme from document element
  const isDarkMode = document.documentElement.classList.contains("dark");
  const editorTheme = isDarkMode ? "vs-dark" : "light";

  // State to force editor remount
  const [editorKey, setEditorKey] = React.useState(0);

  // Add theme change observer
  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
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

  const handleCopyToClipboard = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => alert("Code copied to clipboard!"))
      .catch(() => alert("Failed to copy code"));
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const totalReviews = history.length;

  return (
    <Card className={`transition-all duration-300 ${className}`}>
      <CardHeader className="bg-primary/10 dark:bg-primary/5">
        <CardTitle className="text-xl sm:text-2xl text-primary">
          Previous Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {history.length === 0 ? (
          <p className="text-muted-foreground">
            No reviews yet. Start analyzing code!
          </p>
        ) : (
          <div className="space-y-8">
            {history.map((review, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border dark:border-gray-800 bg-card"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <h4 className="text-lg sm:text-xl font-semibold text-foreground">
                    Review {totalReviews - index}
                  </h4>
                  <div className="flex items-center gap-2 bg-primary/5 dark:bg-primary/10 px-3 py-1 rounded-full">
                    <Code2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {capitalizeFirstLetter(review.language)}
                    </span>
                  </div>
                </div>

                <div className="relative mb-6">
                  <div className="h-[200px] sm:h-[300px] w-full rounded-lg overflow-hidden">
                    <Editor
                      key={`${editorKey}-${index}`} // Unique key for each editor
                      height="100%"
                      language={review.language}
                      value={review.code}
                      theme={editorTheme}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineHeight: 24,
                        readOnly: true,
                        domReadOnly: true,
                        padding: { top: 15, bottom: 15 },
                      }}
                    />
                  </div>
                  <Button
                    size="sm"
                    className="absolute top-2 right-2 gap-2 hover:opacity-90 transition-opacity"
                    onClick={() => handleCopyToClipboard(review.code)}
                  >
                    <ClipboardCopyIcon className="h-4 w-4" />
                    Copy
                  </Button>
                </div>

                {/* Rest of the component remains the same */}
                <div className="space-y-4">
                  <div className="bg-muted/50 dark:bg-muted/10 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2 text-foreground">
                      Summary
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      {review.feedback.summary}
                    </p>
                  </div>

                  <div className="bg-muted/50 dark:bg-muted/10 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2 text-foreground">
                      Improvements
                    </h5>
                    <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                      {Array.isArray(review.feedback.improvements) ? (
                        review.feedback.improvements.map((improvement, i) => (
                          <li key={i}>{improvement}</li>
                        ))
                      ) : (
                        <li>{review.feedback.improvements}</li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-muted/50 dark:bg-muted/10 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2 text-foreground">
                      Best Practices
                    </h5>
                    <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                      {Array.isArray(review.feedback.best_practices) ? (
                        review.feedback.best_practices.map((practice, i) => (
                          <li key={i}>{practice}</li>
                        ))
                      ) : (
                        <li>{review.feedback.best_practices}</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 text-sm text-muted-foreground">
                  Reviewed on: {new Date(review.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewHistory;
