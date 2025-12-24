import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/core/api/axiosInstance";
import { API_ENDPOINTS } from "../../../shared/config/apiConfig";
import { toast } from "react-toastify";

const initialState = {
  posts: [], // For the main feed
  userPosts: {}, // For user-specific profile posts, keyed by userId
  currentPost: null, // For viewing a single post details
  pagination: {
    feed: { page: 1, limit: 10, totalPages: 1, totalResults: 0, hasMore: true },
    // user: { [userId]: { page:1, ... } } // For user-specific pagination
  },
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// --- Posts Thunks ---
export const fetchFeedPosts = createAsyncThunk(
  "posts/fetchFeedPosts",
  async (
    { page = 1, limit = 10, feedType = "public", userId },
    { rejectWithValue }
  ) => {
    try {
      let url = API_ENDPOINTS.POSTS_FEED; // Assuming a new endpoint for generic feed
      const params = { page, limit, feedType };
      if (feedType === "user" && userId) {
        url = API_ENDPOINTS.USER_POSTS(userId); // Or pass userId as param to general feed endpoint
      } else if (feedType === "following") {
        // url = API_ENDPOINTS.FOLLOWING_FEED; // Or pass feedType as param
      }
      const response = await axiosInstance.get(url, { params });
      return { data: response.data, feedType, userId };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch posts");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    // formData should be FormData for file uploads
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.POSTS_BASE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Trade posted successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.POST_BY_ID(postId)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// --- Likes Thunks (can be in their own slice or here if closely related) ---
export const toggleLikeOnPost = createAsyncThunk(
  "posts/toggleLikeOnPost",
  async ({ postId }, { rejectWithValue, getState }) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.POST_LIKE_TOGGLE(postId)
      );
      // response.data = { liked: boolean, likesCount: number }
      return { postId, ...response.data };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle like");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// --- Comments Thunks ---
export const fetchCommentsForPost = createAsyncThunk(
  "posts/fetchCommentsForPost",
  async ({ postId, page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.POST_COMMENTS(postId),
        {
          params: { page, limit },
        }
      );
      // response.data = { results: IComment[], page, limit, totalPages, totalResults }
      return { postId, commentsData: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const addCommentToPost = createAsyncThunk(
  "posts/addCommentToPost",
  async ({ postId, text,parentCommentId=null }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.POST_COMMENTS(postId), { text, parentCommentId });
      toast.success(parentCommentId ? 'Reply posted!' : 'Comment added!');
      return { postId, comment: response.data };// response.data = IComment
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
// NEW Thunks for comments
export const editCommentOnPost = createAsyncThunk(
  "posts/editCommentOnPost",
  async ({ postId, commentId, text }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        API_ENDPOINTS.COMMENT_BY_ID(postId, commentId),
        { text }
      );
      toast.success("Comment updated!");
      return { postId, updatedComment: response.data };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update comment");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteCommentFromPost = createAsyncThunk(
  "posts/deleteCommentFromPost",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        API_ENDPOINTS.COMMENT_BY_ID(postId, commentId)
      );
      toast.success("Comment deleted!");
      return { postId, commentId };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Thunk to fetch replies for a specific comment
export const fetchRepliesForComment = createAsyncThunk(
  "posts/fetchRepliesForComment",
  async (
    { postId, parentCommentId, page = 1, limit = 3 },
    { rejectWithValue }
  ) => {
    try {
      // Assuming backend supports ?parentCommentId=... query param
      const response = await axiosInstance.get(
        API_ENDPOINTS.POST_COMMENTS(postId),
        {
          params: { parentCommentId, page, limit },
        }
      );
      return { postId, parentCommentId, repliesData: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    resetPostStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
    // Real-time updates via sockets
    receiveNewPost: (state, action) => {
      // Add to the beginning of the main feed if relevant
      // This needs logic to determine if it fits current feed filters
      // For simplicity, let's assume it's for a general public feed for now
      state.posts.unshift(action.payload);
      state.pagination.feed.totalResults += 1;
    },
    receiveUpdatedPost: (state, action) => {
      // For like/comment count updates
      const updatedPost = action.payload;
      const postIndex = state.posts.findIndex((p) => p._id === updatedPost._id);
      if (postIndex !== -1) {
        state.posts[postIndex] = { ...state.posts[postIndex], ...updatedPost };
      }
      if (state.currentPost && state.currentPost._id === updatedPost._id) {
        state.currentPost = { ...state.currentPost, ...updatedPost };
      }
    },
    // receiveNewComment: (state, action) => {
    //   const { postId, comment } = action.payload;
    //   const postIndex = state.posts.findIndex((p) => p._id === postId);
    //   if (postIndex !== -1) {
    //     if (!state.posts[postIndex].actualComments)
    //       state.posts[postIndex].actualComments = [];
    //     state.posts[postIndex].actualComments.unshift(comment); // Add to top
    //     state.posts[postIndex].commentsCount =
    //       (state.posts[postIndex].commentsCount || 0) + 1;
    //   }
    //   if (state.currentPost && state.currentPost._id === postId) {
    //     if (!state.currentPost.actualComments)
    //       state.currentPost.actualComments = [];
    //     state.currentPost.actualComments.unshift(comment);
    //     state.currentPost.commentsCount =
    //       (state.currentPost.commentsCount || 0) + 1;
    //   }
    // },

    receiveNewComment: (state, action) => {
      const { postId, comment } = action.payload; // comment should include parentCommentId if it's a reply
      const findAndAddComment = (commentsArray) => {
        if (comment.parentComment) {
          // It's a reply
          const parentIdx = commentsArray.findIndex(
            (c) => c._id === comment.parentComment
          );
          if (parentIdx !== -1) {
            if (!commentsArray[parentIdx].replies)
              commentsArray[parentIdx].replies = [];
            // Avoid duplicates if already added optimistically
            if (
              !commentsArray[parentIdx].replies.find(
                (r) => r._id === comment._id || r.tempId === comment.tempId
              )
            ) {
              commentsArray[parentIdx].replies.unshift(comment);
              commentsArray[parentIdx].repliesCount =
                (commentsArray[parentIdx].repliesCount || 0) + 1;
            }
          }
        } else {
          // Top-level comment
          if (
            !commentsArray.find(
              (c) => c._id === comment._id || c.tempId === comment.tempId
            )
          ) {
            commentsArray.unshift(comment);
          }
        }
      };

      const postIndex = state.posts.findIndex((p) => p._id === postId);
      if (postIndex !== -1) {
        if (!state.posts[postIndex].actualComments)
          state.posts[postIndex].actualComments = [];
        findAndAddComment(state.posts[postIndex].actualComments);
        if (!comment.parentComment) {
          // Only increment post's main comment count for top-level comments
          state.posts[postIndex].commentsCount =
            (state.posts[postIndex].commentsCount || 0) + 1;
        }
      }
      if (state.currentPost && state.currentPost._id === postId) {
        if (!state.currentPost.actualComments)
          state.currentPost.actualComments = [];
        findAndAddComment(state.currentPost.actualComments);
        if (!comment.parentComment) {
          state.currentPost.commentsCount =
            (state.currentPost.commentsCount || 0) + 1;
        }
      }
    },
    // NEW reducers for socket events (can also be handled in extraReducers for thunks)
    commentUpdated: (state, action) => {
      const { postId, updatedComment } = action.payload;
      const findAndUpdateComment = (commentsArray) => {
        if (updatedComment.parentComment) {
          // It's a reply
          const parentIdx = commentsArray.findIndex(
            (c) => c._id === updatedComment.parentComment
          );
          if (parentIdx !== -1 && commentsArray[parentIdx].replies) {
            const replyIdx = commentsArray[parentIdx].replies.findIndex(
              (r) => r._id === updatedComment._id
            );
            if (replyIdx !== -1)
              commentsArray[parentIdx].replies[replyIdx] = updatedComment;
          }
        } else {
          // Top-level comment
          const commentIdx = commentsArray.findIndex(
            (c) => c._id === updatedComment._id
          );
          if (commentIdx !== -1) commentsArray[commentIdx] = updatedComment;
        }
      };
      const postIndex = state.posts.findIndex((p) => p._id === postId);
      if (postIndex !== -1 && state.posts[postIndex].actualComments) {
        findAndUpdateComment(state.posts[postIndex].actualComments);
      }
      if (
        state.currentPost &&
        state.currentPost._id === postId &&
        state.currentPost.actualComments
      ) {
        findAndUpdateComment(state.currentPost.actualComments);
      }
    },
    commentDeleted: (state, action) => {
      const { postId, commentId, parentCommentId } = action.payload; // Need parentCommentId if it's a reply
      const findAndDeleteComment = (commentsArray) => {
        if (parentCommentId) {
          // It's a reply
          const parentIdx = commentsArray.findIndex(
            (c) => c._id === parentCommentId
          );
          if (parentIdx !== -1 && commentsArray[parentIdx].replies) {
            commentsArray[parentIdx].replies = commentsArray[
              parentIdx
            ].replies.filter((r) => r._id !== commentId);
            commentsArray[parentIdx].repliesCount = Math.max(
              0,
              (commentsArray[parentIdx].repliesCount || 1) - 1
            );
          }
        } else {
          // Top-level comment
          const originalLength = commentsArray.length;
          commentsArray = commentsArray.filter((c) => c._id !== commentId);
          // If a top-level comment was deleted, adjust post's comment count
          if (commentsArray.length < originalLength && state.posts[postIndex]) {
            state.posts[postIndex].commentsCount = Math.max(
              0,
              (state.posts[postIndex].commentsCount || 1) - 1
            );
          }
        }
        return commentsArray; // Return the modified array
      };

      const postIndex = state.posts.findIndex((p) => p._id === postId);
      if (postIndex !== -1 && state.posts[postIndex].actualComments) {
        state.posts[postIndex].actualComments = findAndDeleteComment(
          state.posts[postIndex].actualComments
        );
      }
      if (
        state.currentPost &&
        state.currentPost._id === postId &&
        state.currentPost.actualComments
      ) {
        state.currentPost.actualComments = findAndDeleteComment(
          state.currentPost.actualComments
        );
        if (!parentCommentId && state.currentPost.commentsCount) {
          state.currentPost.commentsCount = Math.max(
            0,
            state.currentPost.commentsCount - 1
          );
        }
      }
    },
    // Reducer for adding optimistic comment
    addOptimisticComment: (state, action) => {
      const { postId, comment } = action.payload; // comment now includes a tempId
      // Logic is similar to receiveNewComment but uses tempId for potential rollback
      // This is a simplified version; a robust optimistic update might involve a separate 'pendingComments' array
      const findAndAddOptimisticComment = (commentsArray) => {
        if (comment.parentComment) {
          const parentIdx = commentsArray.findIndex(
            (c) => c._id === comment.parentComment
          );
          if (parentIdx !== -1) {
            if (!commentsArray[parentIdx].replies)
              commentsArray[parentIdx].replies = [];
            commentsArray[parentIdx].replies.unshift(comment); // Add optimistically
          }
        } else {
          commentsArray.unshift(comment);
        }
      };

      const postIndex = state.posts.findIndex((p) => p._id === postId);
      if (postIndex !== -1) {
        if (!state.posts[postIndex].actualComments)
          state.posts[postIndex].actualComments = [];
        findAndAddOptimisticComment(state.posts[postIndex].actualComments);
      }
      if (state.currentPost && state.currentPost._id === postId) {
        if (!state.currentPost.actualComments)
          state.currentPost.actualComments = [];
        findAndAddOptimisticComment(state.currentPost.actualComments);
      }
    },
    confirmOptimisticComment: (state, action) => {
      const { postId, tempId, confirmedComment } = action.payload;
      const findAndConfirm = (commentsArray) => {
        const replaceInReplies = (parent) => {
          if (parent.replies) {
            const replyIdx = parent.replies.findIndex(
              (r) => r.tempId === tempId
            );
            if (replyIdx !== -1) {
              parent.replies[replyIdx] = confirmedComment;
              return true;
            }
          }
          return false;
        };

        if (confirmedComment.parentComment) {
          const parentIdx = commentsArray.findIndex(
            (c) => c._id === confirmedComment.parentComment
          );
          if (parentIdx !== -1) replaceInReplies(commentsArray[parentIdx]);
        } else {
          const commentIdx = commentsArray.findIndex(
            (c) => c.tempId === tempId
          );
          if (commentIdx !== -1) commentsArray[commentIdx] = confirmedComment;
        }
      };
    },
    revertOptimisticComment: (state, action) => {
      const { postId, tempId, parentCommentId } = action.payload;
      // Logic to remove comment with tempId
      // ... (similar to commentDeleted but using tempId)
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Feed Posts
      .addCase(fetchFeedPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFeedPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { data, feedType, userId } = action.payload; // Assuming thunk payload structure
        const targetPostList = (feedType === 'user' && userId) ? (state.userPosts[userId]?.items || []) : state.posts;

        if (data.page === 1) {
          // If it's the first page, always replace the data
          if (feedType === 'user' && userId) {
            if (!state.userPosts[userId]) state.userPosts[userId] = {};
            state.userPosts[userId].items = data.results;
          } else {
            state.posts = data.results;
          }
        } else {
          // --- FIX FOR DUPLICATE KEY WARNING ---
          // When loading more, filter out any duplicates before concatenating.
          const existingIds = new Set(targetPostList.map(p => p._id));
          const newPosts = data.results.filter(p => !existingIds.has(p._id));
          
          if (feedType === 'user' && userId) {
            state.userPosts[userId].items = [...targetPostList, ...newPosts];
          } else {
            state.posts = [...targetPostList, ...newPosts];
          }
        }
        
        // Update pagination for the correct feed
        const paginationTarget = (feedType === 'user' && userId) ? (state.userPosts[userId] || {}) : state;
        paginationTarget.pagination = {
          currentPage: data.page,
          totalPages: data.totalPages,
          totalResults: data.totalResults,
          limit: data.limit,
          hasMore: data.page < data.totalPages,
        };
        state.error = null;
      })
      .addCase(fetchFeedPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Create Post
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload); // Add to top of feed
        state.pagination.feed.totalResults += 1;
        state.status = "succeeded";
      })
      .addCase(createPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch Post By ID
      .addCase(fetchPostById.pending, (state) => {
        state.status = "loading";
        state.currentPost = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Toggle Like
      .addCase(toggleLikeOnPost.fulfilled, (state, action) => {
        const { postId, liked, likesCount } = action.payload;
        const updatePostLikes = (post) => {
          if (post._id === postId) {
            return { ...post, isLikedByCurrentUser: liked, likesCount };
          }
          return post;
        };
        state.posts = state.posts.map(updatePostLikes);
        if (state.currentPost && state.currentPost._id === postId) {
          state.currentPost = updatePostLikes(state.currentPost);
        }
      })
      // Fetch Comments
      .addCase(fetchCommentsForPost.fulfilled, (state, action) => {
        const { postId, commentsData } = action.payload;
        const postIndex = state.posts.findIndex((p) => p._id === postId);
        if (postIndex !== -1) {
          // Simple replacement for now, could implement pagination for comments
          state.posts[postIndex].actualComments = commentsData.results;
          state.posts[postIndex].commentsPagination = {
            page: commentsData.page,
            limit: commentsData.limit,
            totalPages: commentsData.totalPages,
            totalResults: commentsData.totalResults,
            hasMore: commentsData.page < commentsData.totalPages,
          };
        }
        if (state.currentPost && state.currentPost._id === postId) {
          state.currentPost.actualComments = commentsData.results;
          state.currentPost.commentsPagination = {
            /* ... */
          };
        }
      })
      // Add Comment
      .addCase(addCommentToPost.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const postIndex = state.posts.findIndex((p) => p._id === postId);
        if (postIndex !== -1) {
          if (!state.posts[postIndex].actualComments)
            state.posts[postIndex].actualComments = [];
          state.posts[postIndex].actualComments.unshift(comment); // Add to top
          state.posts[postIndex].commentsCount =
            (state.posts[postIndex].commentsCount || 0) + 1;
        }
        if (state.currentPost && state.currentPost._id === postId) {
          if (!state.currentPost.actualComments)
            state.currentPost.actualComments = [];
          state.currentPost.actualComments.unshift(comment);
          state.currentPost.commentsCount =
            (state.currentPost.commentsCount || 0) + 1;
        }
      })
      .addCase(editCommentOnPost.fulfilled, (state, action) => {
        const { postId, updatedComment } = action.payload;
        // Use the 'commentUpdated' reducer logic for consistency
        postsSlice.caseReducers.commentUpdated(state, action);
      })
      .addCase(deleteCommentFromPost.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        // Find parentCommentId if it's a reply for accurate state update
        // This is tricky without knowing parent. For now, assumes top-level if not provided by backend
        let parentCommentId = null;
        const post =
          state.posts.find((p) => p._id === postId) || state.currentPost;
        if (post && post.actualComments) {
          for (const c of post.actualComments) {
            if (c.replies && c.replies.find((r) => r._id === commentId)) {
              parentCommentId = c._id;
              break;
            }
          }
        }
        postsSlice.caseReducers.commentDeleted(state, {
          payload: { postId, commentId, parentCommentId },
        });
      })
      .addCase(fetchRepliesForComment.pending, (state, action) => {
        // Optionally set a loading state for specific comment's replies
      })
      .addCase(fetchRepliesForComment.fulfilled, (state, action) => {
        const { postId, parentCommentId, repliesData } = action.payload;
        const findAndSetReplies = (commentsArray) => {
          const parentIdx = commentsArray.findIndex(
            (c) => c._id === parentCommentId
          );
          if (parentIdx !== -1) {
            if (!commentsArray[parentIdx].replies || repliesData.page === 1) {
              commentsArray[parentIdx].replies = repliesData.results;
            } else {
              // Append replies, avoiding duplicates
              const existingReplyIds = new Set(
                commentsArray[parentIdx].replies.map((r) => r._id)
              );
              repliesData.results.forEach((reply) => {
                if (!existingReplyIds.has(reply._id)) {
                  commentsArray[parentIdx].replies.push(reply);
                }
              });
            }
            commentsArray[parentIdx].repliesPagination = {
              /* ... pagination data ... */ hasMore:
                repliesData.page < repliesData.totalPages,
            };
            commentsArray[parentIdx].areRepliesVisible = true; // Auto-show when loaded
          }
        };
        const postIndex = state.posts.findIndex((p) => p._id === postId);
        if (postIndex !== -1 && state.posts[postIndex].actualComments) {
          findAndSetReplies(state.posts[postIndex].actualComments);
        }
        if (
          state.currentPost &&
          state.currentPost._id === postId &&
          state.currentPost.actualComments
        ) {
          findAndSetReplies(state.currentPost.actualComments);
        }
      });
  },
});

export const {
  resetPostStatus,
  receiveNewPost,
  receiveUpdatedPost,
  receiveNewComment,
  commentUpdated,
  commentDeleted,
  addOptimisticComment,
  confirmOptimisticComment,
  revertOptimisticComment,
  
} = postsSlice.actions;
export default postsSlice.reducer;
