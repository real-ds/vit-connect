import { create } from 'zustand';
import { collection, getDocs, query, orderBy, limit, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { User, Post, Community } from '../types';

interface Store {
  currentUser: User | null;
  posts: Post[];
  communities: Community[];
  searchResults: {
    communities: Community[];
    posts: Post[];
    users: User[];
  };
  users: User[];
  loading: boolean;
  error: string | null;
  setCurrentUser: (user: User | null) => void;
  updateUserProfile: (user: User) => Promise<void>;
  fetchPosts: () => Promise<void>;
  addPost: (post: Omit<Post, 'id'>) => Promise<void>;
  fetchCommunities: () => Promise<void>;
  addCommunity: (community: Omit<Community, 'id'>) => Promise<Community>;
  fetchUsers: () => Promise<void>;
  searchContent: (query: string) => void;
  joinCommunity: (communityId: string, userId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  hasMore: boolean;
  loadMorePosts: () => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  currentUser: null,
  posts: [],
  communities: [],
  users: [],
  searchResults: {
    communities: [],
    posts: [],
    users: []
  },
  loading: false,
  error: null,
  hasMore: true,

  setCurrentUser: (user) => set({ currentUser: user }),

  updateUserProfile: async (updatedUser: User) => {
    try {
      // Get reference to the user document
      const userRef = doc(db, 'users', updatedUser.id);

      // Update the document in Firestore
      await updateDoc(userRef, {
        name: updatedUser.name,
        department: updatedUser.department,
        bio: updatedUser.bio,
        socialLinks: updatedUser.socialLinks,
        resumeUrl: updatedUser.resumeUrl,
        updatedAt: new Date().toISOString()
      });

      // Update the store state
      set(state => ({
        ...state,
        currentUser: updatedUser,
        // Also update the user in the users array if it exists
        users: state.users.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        )
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  },

  fetchCommunities: async () => {
    try {
      const communitiesQuery = query(collection(db, 'communities'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(communitiesQuery);
      const communities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Community));
      set({ communities });
    } catch (error) {
      console.error('Error fetching communities:', error);
      throw new Error('Failed to fetch communities');
    }
  },

  addCommunity: async (community) => {
    try {
      const docRef = await addDoc(collection(db, 'communities'), {
        ...community,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      const newCommunity = { ...community, id: docRef.id } as Community;
      set(state => ({ communities: [newCommunity, ...state.communities] }));
      return newCommunity;
    } catch (error) {
      console.error('Error adding community:', error);
      throw new Error('Failed to create community');
    }
  },

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const postsQuery = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const snapshot = await getDocs(postsQuery);
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Post));

      set({ posts, loading: false });
    } catch (error) {
      console.error('Error fetching posts:', error);
      set({ error: 'Failed to fetch posts', loading: false });
    }
  },

  addPost: async (post: Omit<Post, 'id'>) => {
    try {
      // Find the community by ID to get its name
      const community = get().communities.find(c => c.id === post.communityId);

      // Create post data with community name
      const postData = {
        ...post,
        communityName: community?.name || '',
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'posts'), postData);
      const newPost = { ...postData, id: docRef.id } as Post;

      set(state => ({
        posts: [newPost, ...state.posts]
      }));
    } catch (error) {
      console.error('Error adding post:', error);
      set({ error: 'Failed to add post' });
    }
  },

  fetchUsers: async () => {
    try {
      const usersQuery = collection(db, 'users');
      const snapshot = await getDocs(usersQuery);
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
      set({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  searchContent: (query: string) => {
    const { posts, communities, users } = get();
    const filteredResults = {
      communities: communities.filter(community => community.name.toLowerCase().includes(query.toLowerCase())),
      posts: posts.filter(post => post.title.toLowerCase().includes(query.toLowerCase())),
      users: users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()))
    };
    set({ searchResults: filteredResults });
  },

  joinCommunity: async (communityId: string, userId: string) => {
    const { communities } = get();
    const community = communities.find(c => c.id === communityId);
    if (!community) return;

    try {
      const communityRef = doc(db, 'communities', communityId);
      const updatedMembers = [...(community.members || []), userId];

      await updateDoc(communityRef, {
        members: updatedMembers,
        updatedAt: new Date().toISOString()
      });

      set(state => ({
        communities: state.communities.map(c =>
          c.id === communityId ? { ...c, members: updatedMembers } : c
        )
      }));
    } catch (error) {
      console.error('Error joining community:', error);
    }
  },

  likePost: async (postId: string) => {
    const { posts } = get();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      const postRef = doc(db, 'posts', postId);
      const newLikes = (post.likes || 0) + 1;

      await updateDoc(postRef, {
        likes: newLikes
      });

      set(state => ({
        posts: state.posts.map(p =>
          p.id === postId ? { ...p, likes: newLikes } : p
        )
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  },

  loadMorePosts: async () => {
    // For now it does nothing but satisfies type
  }
}));
