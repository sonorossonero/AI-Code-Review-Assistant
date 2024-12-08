// src/components/review/FeedbackResult.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardCopyIcon } from "@radix-ui/react-icons";

const FeedbackResult = ({ feedback, className }) => {
  if (!feedback) return null;

  const handleCopyFeedback = () => {
    const feedbackText = `
Code Review Summary:
${feedback.summary}

Improvements:
${
  Array.isArray(feedback.improvements)
    ? feedback.improvements.join("\n")
    : feedback.improvements
}

Best Practices:
${
  Array.isArray(feedback.best_practices)
    ? feedback.best_practices.join("\n")
    : feedback.best_practices
}
    `.trim();

    navigator.clipboard
      .writeText(feedbackText)
      .then(() => alert("Feedback copied to clipboard!"))
      .catch(() => alert("Failed to copy feedback"));
  };

  return (
    <Card className={`transition-all duration-300 ${className}`}>
      <CardHeader className="bg-primary/10 dark:bg-primary/5 rounded-t-lg">
        <CardTitle className="text-xl sm:text-2xl text-primary">
          Feedback
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <h4 className="font-semibold text-lg text-foreground">Summary:</h4>
          <div className="bg-muted/50 dark:bg-muted/10 p-4 rounded-lg">
            <p className="text-muted-foreground">{feedback.summary}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-lg text-foreground">
            Improvements:
          </h4>
          <div className="bg-muted/50 dark:bg-muted/10 p-4 rounded-lg">
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              {Array.isArray(feedback.improvements) ? (
                feedback.improvements.map((improvement, i) => (
                  <li key={i}>{improvement}</li>
                ))
              ) : (
                <li>{feedback.improvements}</li>
              )}
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-lg text-foreground">
            Best Practices:
          </h4>
          <div className="bg-muted/50 dark:bg-muted/10 p-4 rounded-lg">
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              {Array.isArray(feedback.best_practices) ? (
                feedback.best_practices.map((practice, i) => (
                  <li key={i}>{practice}</li>
                ))
              ) : (
                <li>{feedback.best_practices}</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 py-4 flex justify-end">
        <Button
          onClick={handleCopyFeedback}
          className="gap-2 hover:opacity-90 transition-opacity"
        >
          <ClipboardCopyIcon className="h-4 w-4" />
          Copy Feedback
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeedbackResult;
