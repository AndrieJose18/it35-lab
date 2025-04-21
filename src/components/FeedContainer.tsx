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
                      placeholder="What's on your mind?"
                      className="create-post-input"
                    />
                  </div>
                  <div className="post-action-buttons">
                    <IonButton fill="clear" color="dark"><IonIcon icon={camera} slot="start" />Photo</IonButton>
                    <IonButton fill="clear" color="dark"><IonIcon icon={videocam} slot="start" />Live</IonButton>
                    <IonButton fill="clear" color="dark"><IonIcon icon={person} slot="start" />Tag</IonButton>
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
          --ion-background-color:rgb(221, 111, 92);
          --ion-text-color: white;
        }

        .create-post-card {
          background-color:rgb(221, 228, 198);
          border-radius: 10px;
          color:rgb(26, 11, 11);
        }

        .post-card {
          background-color:rgb(185, 180, 110);
          margin-bottom: 15px;
          border-radius: 12px;
        }

        .post-button {
          background-color:rgb(211, 163, 131);
          color: white;
        }

        .comment-text {
          display: block;
          padding-left: 16px;
          margin-top: 8px;
          color: white;
        }

        .create-post-input {
          background-color: white;
          border-radius: 999px;
          padding: 10px 16px;
          font-size: 15px;
          border: 1px solid #ccc;
          color: black;
          flex: 1;
        }

        .post-action-buttons {
          display: flex;
          justify-content: space-around;
          margin-top: 10px;
          border-top: 1px solid #ccc;
          padding-top: 10px;
        }
      `}</style>
    </>
  );
};

export default FeedContainer;
