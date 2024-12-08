// src/components/code-editor/LanguageSelector.jsx
import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Supported languages for the language selector

const supportedLanguages = [
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
  { id: "typescript", name: "TypeScript" },
];
const LanguageSelector = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          {supportedLanguages.find((lang) => lang.id === value)?.name ||
            "Select language"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {supportedLanguages.map((lang) => (
          <SelectItem key={lang.id} value={lang.id}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// Prop validation with PropTypes
LanguageSelector.propTypes = {
  value: PropTypes.string.isRequired, // Expect a string for the selected language
  onChange: PropTypes.func.isRequired, // Expect a function for the onChange handler
};

export default LanguageSelector;
