// FeedContainer.tsx
import { useState, useEffect } from 'react';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonLabel,
  IonModal,
  IonFooter,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonAlert,
  IonText,
  IonAvatar,
  IonCol,
  IonGrid,
  IonRow,
  IonIcon,
  IonPopover
} from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { ellipsisVertical, camera, videocam, person, chatbox } from 'ionicons/icons';

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  post_created_at: string;
  post_updated_at: string;
}

interface Comment {
  comment_id: string;
  post_id: string;
  user_id: number;
  username: string;
  comment_content: string;
  comment_created_at: string;
}

const FeedContainer = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [visibleComments, setVisibleComments] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [popoverState, setPopoverState] = useState<{ open: boolean; event: Event | null; postId: string | null }>({ open: false, event: null, postId: null });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.email?.endsWith('@nbsc.edu.ph')) {
        setUser(authData.user);
        const { data: userData } = await supabase
          .from('users')
          .select('user_id, username, user_avatar_url')
          .eq('user_email', authData.user.email)
          .single();

        if (userData) {
          setUser({ ...authData.user, id: userData.user_id });
          setUsername(userData.username);
          setUserAvatarUrl(userData.user_avatar_url);
        }
      }
    };

    const fetchPosts = async () => {
      const { data } = await supabase.from('posts').select('*').order('post_created_at', { ascending: false });
      if (data) setPosts(data as Post[]);
    };

    fetchUser();
    fetchPosts();
  }, []);

  const toggleComments = async (postId: string) => {
    const isVisible = visibleComments[postId];
    setVisibleComments({ ...visibleComments, [postId]: !isVisible });

    if (!isVisible && !comments[postId]) {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('comment_created_at', { ascending: true });

      if (data) {
        setComments(prev => ({ ...prev, [postId]: data as Comment[] }));
      }
    }
  };

  const handleCommentChange = (postId: string, value: string) => {
    setCommentInputs({ ...commentInputs, [postId]: value });
  };

  const submitComment = async (postId: string) => {
    const content = commentInputs[postId];
    if (!content || !user || !username) return;

    const { data } = await supabase
      .from('comments')
      .insert([{ post_id: postId, user_id: user.id, username, comment_content: content }])
      .select('*');

    if (data) {
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data[0] as Comment],
      }));
      setCommentInputs({ ...commentInputs, [postId]: '' });
    }
  };

  const createPost = async () => {
    if (!postContent || !user || !username) return;

    const avatarUrl = userAvatarUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg';

    const { data } = await supabase
      .from('posts')
      .insert([{ post_content: postContent, user_id: user.id, username, avatar_url: avatarUrl }])
      .select('*');

    if (data) {
      setPosts([data[0] as Post, ...posts]);
      setPostContent('');
    }
  };

  const deletePost = async (post_id: string) => {
    await supabase.from('posts').delete().match({ post_id });
    setPosts(posts.filter(post => post.post_id !== post_id));
  };

  const startEditingPost = (post: Post) => {
    setEditingPost(post);
    setPostContent(post.post_content);
    setIsModalOpen(true);
  };

  const savePost = async () => {
    if (!postContent || !editingPost) return;

    const { data } = await supabase
      .from('posts')
      .update({ post_content: postContent })
      .match({ post_id: editingPost.post_id })
      .select('*');

    if (data) {
      const updatedPost = data[0] as Post;
      setPosts(posts.map(p => (p.post_id === updatedPost.post_id ? updatedPost : p)));
      setPostContent('');
      setEditingPost(null);
      setIsModalOpen(false);
      setIsAlertOpen(true);
    }
  };

  const renderPost = (post: Post) => (
    <IonCard key={post.post_id} className="post-card">
      <IonCardHeader>
        <IonRow>
          <IonCol size="2">
            <IonAvatar>
              <img src={post.avatar_url} alt={post.username} />
            </IonAvatar>
          </IonCol>
          <IonCol>
            <IonCardTitle>{post.username}</IonCardTitle>
            <IonCardSubtitle>
              {new Intl.DateTimeFormat('default', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(new Date(post.post_created_at))}
            </IonCardSubtitle>
          </IonCol>
          <IonCol size="auto">
            <IonButton fill="clear" onClick={(e) => setPopoverState({ open: true, event: e.nativeEvent, postId: post.post_id })}>
              <IonIcon icon={ellipsisVertical} />
            </IonButton>
          </IonCol>
        </IonRow>
      </IonCardHeader>

      <IonCardContent>
        <IonText><h1>{post.post_content}</h1></IonText>
        <IonButton fill="clear" onClick={() => toggleComments(post.post_id)}>
          <IonIcon icon={chatbox} slot="start" />
          Comments
        </IonButton>

        {visibleComments[post.post_id] && (
          <>
            {comments[post.post_id]?.map(comment => (
              <IonText key={comment.comment_id} className="comment-text">
                <strong>{comment.username}</strong>: {comment.comment_content}
              </IonText>
            ))}
            <IonInput
              value={commentInputs[post.post_id] || ''}
              onIonChange={(e) => handleCommentChange(post.post_id, e.detail.value || '')}
              placeholder="Add a comment..."
              style={{ marginTop: '10px' }}
            />
            <IonButton onClick={() => submitComment(post.post_id)} size="small" style={{ marginTop: '5px' }}>
              Comment
            </IonButton>
          </>
        )}
      </IonCardContent>

      <IonPopover
        isOpen={popoverState.open && popoverState.postId === post.post_id}
        event={popoverState.event}
        onDidDismiss={() => setPopoverState({ open: false, event: null, postId: null })}
      >
        <IonButton fill="clear" onClick={() => { startEditingPost(post); setPopoverState({ open: false, event: null, postId: null }); }}>Update</IonButton>
        <IonButton fill="clear" color="danger" onClick={() => { deletePost(post.post_id); setPopoverState({ open: false, event: null, postId: null }); }}>Remove</IonButton>
      </IonPopover>
    </IonCard>
  );

  return (
    <>
      <IonPage className="one-piece-theme">
  <IonHeader>
    <IonToolbar>
      <IonTitle>Feed</IonTitle>
    </IonToolbar>
  </IonHeader>
  <IonContent className="content-area">
    {user ? (
      <>
        <IonCard className="create-post-card">
          <IonCardHeader>
            <IonCardTitle>Create Wanted Poster</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <IonAvatar>
                <img src={userAvatarUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg'} alt="User Avatar" />
              </IonAvatar>
              <IonInput
                value={postContent}
                onIonChange={e => setPostContent(e.detail.value || '')}
                placeholder="What's on your mind, Captain?"
                className="create-post-input"
              />
            </div>
            <div className="post-action-buttons">
              <IonButton fill="clear" color="dark"><IonIcon icon={camera} slot="start" />Treasure</IonButton>
              <IonButton fill="clear" color="dark"><IonIcon icon={videocam} slot="start" />Adventure</IonButton>
              <IonButton fill="clear" color="dark"><IonIcon icon={person} slot="start" />Crew</IonButton>
            </div>
          </IonCardContent>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem' }}>
            <IonButton onClick={createPost} className="post-button">Post</IonButton>
          </div>
        </IonCard>

        {posts.map(renderPost)}
      </>
    ) : (
      <IonLabel>Loading...</IonLabel>
    )}
  </IonContent>

  <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
    <IonHeader>
      <IonToolbar><IonTitle>Edit Post</IonTitle></IonToolbar>
    </IonHeader>
    <IonContent>
      <IonInput value={postContent} onIonChange={e => setPostContent(e.detail.value || '')} placeholder="Edit your post..." />
    </IonContent>
    <IonFooter>
      <IonButton onClick={savePost}>Save</IonButton>
      <IonButton onClick={() => setIsModalOpen(false)}>Cancel</IonButton>
    </IonFooter>
  </IonModal>

  <IonAlert isOpen={isAlertOpen} onDidDismiss={() => setIsAlertOpen(false)} header="Success" message="Post updated successfully!" buttons={['OK']} />
</IonPage>

<style>{`
  .one-piece-theme {
  --ion-background-color: #f4e1c1; /* Light parchment/scroll color */
  --ion-text-color: #2d1f1d; /* Dark brown for contrast */
  font-family: 'Pirate', sans-serif; /* Example pirate font */
}

.create-post-card {
  background-color: #ffd700; /* Gold to match treasure theme */
  border-radius: 12px;
  color: #2d1f1d;
  border: 3px solid #4e2a06; /* Dark wood border for a rustic look */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  padding: 20px;
}

.post-card {
  background-color: #deb887; /* Light brown similar to parchment */
  margin-bottom: 15px;
  border-radius: 12px;
  padding: 16px;
  color: #2d1f1d;
  border: 2px solid #8b4513; /* Darker wood border */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); /* Subtle shadow for a rugged look */
}

.post-card ion-card-header {
  background-color: #4e2a06; /* Dark wood background for header */
  border-radius: 10px;
}

.post-card ion-card-title {
  font-size: 18px;
  font-weight: bold;
  color: #ffd700; /* Gold text for pirate feel */
}

.post-button {
  background-color: #8b4513; /* Deep brown like old treasure chests */
  color: white;
  font-weight: bold;
}

.create-post-input {
  background-color: #fff;
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 15px;
  border: 1px solid #ccc;
  color: #2d1f1d;
  flex: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comment-text {
  display: block;
  padding-left: 16px;
  margin-top: 8px;
  color: #2d1f1d;
}

.post-action-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  border-top: 1px solid #ccc;
  padding-top: 10px;
}

.post-action-buttons ion-button {
  font-weight: bold;
  color: #4e2a06;
}

.post-action-buttons ion-button:hover {
  background-color: #f8d7a1; /* Light gold for hover */
}

/* Add parchment background to posts */
.post-card ion-card-content {
  background-color: #fdf1c1; /* Light parchment color for content */
  border-radius: 8px;
  padding: 12px;
}

`}</style>

    </>
  );
};

export default FeedContainer;
