import crypto from "crypto";

export const sluggify = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const generateSlug = (input: string, uniqueId?: string): string => {
  const base = sluggify(input);
  const id = uniqueId || crypto.randomBytes(3).toString("hex");
  return base ? `${base}-${id}` : id;
};
