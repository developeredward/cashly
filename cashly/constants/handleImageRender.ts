import { logosPreview } from "./Logos";

export const handleImageRender = (type: string) => {
  const lowerType = type.toLowerCase();

  if (lowerType.includes("netflix")) {
    return { name: "netflix", element: logosPreview.netflix };
  }
  if (lowerType.includes("amazon")) {
    return { name: "amazon", element: logosPreview.amazon };
  }
  if (lowerType.includes("apple")) {
    return { name: "apple", element: logosPreview.apple };
  }
  if (lowerType.includes("google")) {
    return { name: "google", element: logosPreview.google };
  }
  if (lowerType.includes("spotify")) {
    return { name: "spotify", element: logosPreview.spotify };
  }
  if (lowerType.includes("wifi")) {
    return { name: "wifi", element: logosPreview.wifi };
  }
  if (lowerType.includes("bus")) {
    return { name: "bus", element: logosPreview.bus };
  }
  if (lowerType.includes("salary")) {
    return { name: "salary", element: logosPreview.salary };
  }

  return {
    name: lowerType,
    element:
      lowerType === "income"
        ? logosPreview.income
        : lowerType === "expense"
        ? logosPreview.expense
        : null,
  };
};
