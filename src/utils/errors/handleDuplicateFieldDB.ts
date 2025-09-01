import { IAppError } from "../../middleware/globalErrorHandler.middleware";
import AppError from "../appError";

export const handleDuplicateFieldsDB = (err: IAppError) => {
  let value = "";
  let field = "";

  // First, try to get the duplicate value from the keyValue object (cleanest approach)
  if (err.keyValue) {
    const duplicateField = Object.keys(err.keyValue)[0];
    field = duplicateField;
    value = err.keyValue[duplicateField];
  } else {
    // Fallback: parse the error message for the duplicate value
    // Format: dup key: { fieldName: "value" }
    const dupKeyMatch = err.errmsg?.match(
      /dup key:\s*{\s*([^:]+):\s*"([^"]+)"\s*}/
    );

    if (dupKeyMatch) {
      field = dupKeyMatch[1].trim();
      value = dupKeyMatch[2];
    } else {
      // Final fallback: try to extract any quoted value from the error message
      const quotedMatch = err.errmsg?.match(/"([^"]+)"/);
      if (quotedMatch) {
        value = quotedMatch[1];
      }
    }
  }

  // Create an informative error message
  const fieldInfo = field ? ` for field '${field}'` : "";
  const valueInfo = value ? `: '${value}'` : "";
  const message = `Duplicate field value${fieldInfo}${valueInfo}. Please use another value`;

  return new AppError(message, 400);
};
