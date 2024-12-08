// src/components/code-editor/CodeInput.jsx
import React, { useState } from "react";
import CodeEditor from "./CodeEditor";
import LanguageSelector from "./LanguageSelector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FeedbackResult from "../review/FeedbackResult";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import ReviewHistory from "../review/ReviewHistory";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import apiService from "@/services/apiService";

const CodeInput = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError("Please enter some code to review");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.reviewCode(code, language);
      const parsedFeedback =
        typeof response.feedback === "string"
          ? JSON.parse(response.feedback)
          : response.feedback;

      setFeedback(parsedFeedback);

      const reviewEntry = {
        code,
        language,
        feedback: parsedFeedback,
        timestamp: new Date().toISOString(),
      };

      setHistory((prev) => [reviewEntry, ...prev]);
    } catch (err) {
      console.error("Error during code review:", err);
      setError(err.message || "Failed to get code review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full transition-all duration-300">
        <CardHeader className="space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-2xl">Code Input</CardTitle>
            <div className="w-full sm:w-auto">
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
            <CodeEditor code={code} onChange={setCode} language={language} />
          </div>
        </CardContent>

        {error && (
          <div className="px-6 mb-4">
            <Alert variant="destructive" className="dark:bg-red-900/20">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <CardFooter className="px-6 py-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !code.trim()}
            className="w-full sm:w-auto relative hover:opacity-90 transition-opacity"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="small" />
                <span>Analyzing...</span>
              </div>
            ) : (
              "Analyze Code"
            )}
          </Button>
        </CardFooter>
      </Card>

      {feedback && (
        <FeedbackResult
          feedback={feedback}
          className="transition-all duration-300"
        />
      )}

      {history.length > 0 && (
        <ReviewHistory
          history={history}
          className="transition-all duration-300"
        />
      )}
    </div>
  );
};

export default CodeInput;
