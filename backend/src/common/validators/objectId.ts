/**
 * ObjectId validator for MongoDB/Prisma IDs (24 hex chars)
 */
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const isValidObjectId = (id: string): boolean => {
  return OBJECT_ID_REGEX.test(id);
};

export const parseObjectId = (id: string): string | null => {
  if (isValidObjectId(id)) return id;
  return null;
};

export default { isValidObjectId, parseObjectId };

