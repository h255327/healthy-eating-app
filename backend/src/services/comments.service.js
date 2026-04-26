'use strict';

const CommentModel = require('../models/comment.model');

const VALID_TYPES = new Set(['recipe', 'article']);

function assertValidType(targetType) {
  if (!VALID_TYPES.has(targetType))
    throw { status: 400, message: `Invalid comment target type: ${targetType}` };
}

async function getComments(targetType, targetId) {
  assertValidType(targetType);
  return CommentModel.findByTarget(targetType, targetId);
}

async function addComment(userId, targetType, targetId, content) {
  assertValidType(targetType);
  if (!content?.trim()) throw { status: 400, message: 'Comment text is required.' };
  return CommentModel.create({ userId, targetType, targetId, content: content.trim() });
}

async function remove(commentId, userId, userRole) {
  const comment = await CommentModel.findById(commentId);
  if (!comment) throw { status: 404, message: 'Comment not found.' };
  if (comment.user_id !== userId && userRole !== 'admin')
    throw { status: 403, message: 'Access denied.' };
  await CommentModel.removeById(commentId);
}

module.exports = { getComments, addComment, remove };
