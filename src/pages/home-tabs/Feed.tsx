import { 
  IonButtons,
  IonContent, 
  IonHeader, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonList, 
  IonItem, 
  IonLabel,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonIcon
} from '@ionic/react';
import { add } from 'ionicons/icons';

const Feed: React.FC = () => {
  const posts = [
    { id: 1, title: "Andrie ", content: "One Piece is the GOAT." },
    { id: 2, title: "Jose ", content: "Naruto is the Goat." }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Feed</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSearchbar placeholder="Search posts" />

        <IonRefresher slot="fixed" onIonRefresh={(event) => {
          setTimeout(() => event.detail.complete(), 1000);
        }}>
          <IonRefresherContent />
        </IonRefresher>

        <IonList>
          {posts.map(post => (
            <IonItem key={post.id}>
              <IonLabel>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Feed;